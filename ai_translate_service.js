(function () {
  const API_LANG_MAP = {
    ar: 'ar', en: 'en', fr: 'fr', tr: 'tr', ja: 'ja', zh: 'zh-CN', es: 'es', de: 'de', it: 'it',
    ru: 'ru', pt: 'pt', hi: 'hi', id: 'id', ko: 'ko', ur: 'ur', fa: 'fa', bn: 'bn', nl: 'nl',
    pl: 'pl', uk: 'uk', vi: 'vi', th: 'th', ms: 'ms'
  };

  const REQUEST_TIMEOUT = 15000;
  const MAX_BATCH = 20;
  const MAX_TEXT_LENGTH = 1400;
  const CACHE_STORAGE_KEY = 'spr.translate.cache.v5';
  const TRANSLATE_CACHE = new Map();
  const LIBRE_INSTANCES = [
    'https://translate.astian.org/translate',
    'https://libretranslate.de/translate',
    'https://translate.argosopentech.com/translate'
  ];

  function normalizeLang(lang) {
    const code = String(lang || AppConfig.defaultLang || 'ar').trim();
    return API_LANG_MAP[code] || code || 'ar';
  }

  function sanitizeTexts(texts) {
    return (texts || []).map((item) => String(item || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  function chunkArray(items, size) {
    const chunks = [];
    for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
    return chunks;
  }

  function splitLongText(text, max = MAX_TEXT_LENGTH) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    if (clean.length <= max) return [clean];
    const pieces = clean.split(/(?<=[\.!?،؛])\s+|\n+/).filter(Boolean);
    const parts = [];
    let current = '';
    pieces.forEach((piece) => {
      if (piece.length > max) {
        if (current.trim()) parts.push(current.trim());
        current = '';
        for (let i = 0; i < piece.length; i += max) parts.push(piece.slice(i, i + max));
        return;
      }
      if ((`${current} ${piece}`).trim().length > max) {
        if (current.trim()) parts.push(current.trim());
        current = piece;
      } else {
        current = `${current} ${piece}`.trim();
      }
    });
    if (current.trim()) parts.push(current.trim());
    return parts.length ? parts : [clean];
  }

  function decodeHtml(value) {
    const text = String(value || '');
    if (!text.includes('&')) return text;
    const area = document.createElement('textarea');
    area.innerHTML = text;
    return area.value;
  }

  function loadPersistentCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(CACHE_STORAGE_KEY) || '[]');
      if (!Array.isArray(raw)) return;
      raw.forEach((entry) => {
        if (!entry || !entry.key || typeof entry.value !== 'string') return;
        TRANSLATE_CACHE.set(entry.key, entry.value);
      });
    } catch (error) {
      console.warn('Translate cache bootstrap skipped');
    }
  }

  function persistCache() {
    try {
      const payload = [...TRANSLATE_CACHE.entries()].slice(-180).map(([key, value]) => ({ key, value }));
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Translate cache persist skipped');
    }
  }

  async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  function normalizeResponseLength(values, originals) {
    return originals.map((text, index) => decodeHtml(values?.[index] || text));
  }

  function translationLooksUseful(originals, translated) {
    if (!Array.isArray(translated) || !translated.length) return false;
    const pairs = originals.map((text, index) => [String(text || '').trim(), String(translated[index] || '').trim()]);
    const changed = pairs.filter(([source, target]) => target && target !== source).length;
    const nonEmpty = pairs.filter(([, target]) => target).length;
    return nonEmpty > 0 && (changed > 0 || pairs.every(([source]) => source.length < 4));
  }

  function buildCacheKey(text, lang) {
    return `${normalizeLang(lang)}::${String(text || '').trim()}`;
  }

  function getCached(text, lang) {
    const key = buildCacheKey(text, lang);
    return TRANSLATE_CACHE.get(key) || '';
  }

  function setCached(text, lang, value) {
    const key = buildCacheKey(text, lang);
    TRANSLATE_CACHE.set(key, String(value || '').trim() || String(text || '').trim());
    if (TRANSLATE_CACHE.size > 220) {
      const first = TRANSLATE_CACHE.keys().next().value;
      if (first) TRANSLATE_CACHE.delete(first);
    }
    persistCache();
  }

  async function callBackend(texts, lang) {
    const url = AppConfig.backendUrl?.trim();
    if (!url) return null;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, targetLang: normalizeLang(lang) })
    });
    if (!response.ok) throw new Error('backend_failed');
    const data = await response.json();
    return data.translatedTexts || data.translations || null;
  }

  async function callOpenAI(texts, lang) {
    const key = AppConfig.openaiKey?.trim();
    if (!key) return null;
    const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a translation engine. Translate each input item into the requested target language. Return only strict JSON in this exact schema: {"translations":["...","..."]}. Preserve item order. Do not add explanations.'
          },
          {
            role: 'user',
            content: JSON.stringify({ target_language: normalizeLang(lang), items: texts })
          }
        ],
        response_format: { type: 'json_object' }
      })
    }, 25000);
    if (!response.ok) throw new Error('openai_failed');
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.translations) ? parsed.translations : null;
  }

  async function callGoogleApi(texts, lang) {
    const key = AppConfig.googleKey?.trim();
    if (!key) return null;
    const response = await fetchWithTimeout(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: texts, target: normalizeLang(lang), format: 'text' })
    });
    if (!response.ok) throw new Error('google_api_failed');
    const data = await response.json();
    return (data.data?.translations || []).map((item) => item.translatedText || '');
  }

  async function callLibreTranslate(texts, lang) {
    const translated = [];
    for (const text of texts) {
      let success = false;
      for (const endpoint of LIBRE_INSTANCES) {
        try {
          const response = await fetchWithTimeout(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: 'auto', target: normalizeLang(lang), format: 'text' })
          }, 12000);
          if (!response.ok) continue;
          const data = await response.json();
          const value = data.translatedText || data.translation || '';
          if (value) {
            translated.push(value);
            success = true;
            break;
          }
        } catch (error) {
          // try next instance
        }
      }
      if (!success) throw new Error('libre_translate_failed');
    }
    return translated;
  }

  async function callGooglePublic(texts, lang) {
    const translated = [];
    for (const text of texts) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(normalizeLang(lang))}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetchWithTimeout(url, {}, REQUEST_TIMEOUT);
      if (!response.ok) throw new Error('public_translate_failed');
      const data = await response.json();
      translated.push((data[0] || []).map((part) => part[0]).join(''));
    }
    return translated;
  }

  async function callMyMemory(texts, lang) {
    const translated = await Promise.all(texts.map(async (text) => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${encodeURIComponent(normalizeLang(lang))}`;
      const response = await fetchWithTimeout(url, {}, REQUEST_TIMEOUT);
      if (!response.ok) throw new Error('mymemory_failed');
      const data = await response.json();
      return data.responseData?.translatedText || text;
    }));
    return translated;
  }

  async function runChunked(strategy, texts, lang) {
    const chunks = chunkArray(texts, MAX_BATCH);
    const results = [];
    for (const chunk of chunks) {
      const translated = await strategy(chunk, lang);
      results.push(...normalizeResponseLength(translated, chunk));
    }
    return results;
  }

  const STRATEGIES = [
    callBackend,
    callOpenAI,
    callGoogleApi,
    callLibreTranslate,
    callGooglePublic,
    callMyMemory
  ];

  async function translateUniqueShortTexts(uniqueTexts, lang) {
    if (!uniqueTexts.length) return new Map();
    for (const strategy of STRATEGIES) {
      try {
        const translated = await runChunked(strategy, uniqueTexts, lang);
        if (translationLooksUseful(uniqueTexts, translated)) {
          const out = new Map();
          normalizeResponseLength(translated, uniqueTexts).forEach((value, index) => {
            out.set(uniqueTexts[index], value);
            setCached(uniqueTexts[index], lang, value);
          });
          return out;
        }
      } catch (error) {
        console.warn(`Translate fallback skipped: ${error?.message || 'unknown'}`);
      }
    }
    const fallback = new Map();
    uniqueTexts.forEach((text) => fallback.set(text, text));
    return fallback;
  }

  const AiTranslate = {
    async translateBatch(texts, lang = AppConfig.defaultLang) {
      const cleanTexts = sanitizeTexts(texts);
      if (!cleanTexts.length) return [];
      if (lang === 'auto') return cleanTexts;

      const unique = [...new Set(cleanTexts)];
      const resolved = new Map();
      const shortPending = [];
      const longPending = [];

      unique.forEach((text) => {
        const cached = getCached(text, lang);
        if (cached) {
          resolved.set(text, cached);
          return;
        }
        if (text.length > MAX_TEXT_LENGTH) longPending.push(text);
        else shortPending.push(text);
      });

      if (shortPending.length) {
        const shortMap = await translateUniqueShortTexts(shortPending, lang);
        shortMap.forEach((value, key) => resolved.set(key, value));
      }

      for (const text of longPending) {
        const parts = splitLongText(text);
        const translatedParts = await this.translateBatch(parts, lang);
        const combined = translatedParts.join(' ').replace(/\s+/g, ' ').trim() || text;
        resolved.set(text, combined);
        setCached(text, lang, combined);
      }

      return cleanTexts.map((text) => resolved.get(text) || text);
    },

    async translateOne(text, lang = AppConfig.defaultLang) {
      const clean = String(text || '').replace(/\s+/g, ' ').trim();
      if (!clean) return '';
      const cached = getCached(clean, lang);
      if (cached) return cached;
      const result = await this.translateBatch([clean], lang);
      return result[0] || clean;
    },

    clearCache() {
      TRANSLATE_CACHE.clear();
      try {
        localStorage.removeItem(CACHE_STORAGE_KEY);
      } catch (error) {
        console.warn('Translate cache clear skipped');
      }
    }
  };

  loadPersistentCache();
  window.AiTranslate = AiTranslate;
})();
