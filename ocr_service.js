(function () {
  const CACHE = new Map();
  const TTL = 30 * 60 * 1000;
  const SCRIPT_MAP = {
    latin: 'eng',
    japanese: 'jpn',
    chinese: 'chi_sim',
    korean: 'kor',
    arabic: 'ara'
  };

  async function ensureTesseract() {
    if (window.Tesseract) return window.Tesseract;
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return window.Tesseract;
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function loadImageMeta(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ src, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      img.onerror = () => reject(new Error('image_load_failed'));
      img.src = src;
    });
  }

  function buildKey(source, lang, script) {
    if (typeof source === 'string') return `${source}::${lang}::${script}`;
    return `${source.name || 'file'}::${source.size || 0}::${source.lastModified || 0}::${lang}::${script}`;
  }

  const OcrService = {
    async process(source, options = {}) {
      const lang = options.lang || AppConfig.defaultLang || 'ar';
      const script = options.script || localStorage.getItem('spr.ocrScript') || AppConfig.state.ocrScript || 'latin';
      const bubbleOnly = options.bubbleOnly ?? !!document.getElementById('proBubble')?.checked;
      const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
      onProgress?.({ percent: 6, status: 'preparing_image' });
      const cacheKey = buildKey(source, lang, script);
      const cached = CACHE.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < TTL) return cached.value;

      const src = typeof source === 'string' ? source : await fileToDataUrl(source);
      onProgress?.({ percent: 12, status: 'loading_image' });
      const meta = await loadImageMeta(src);
      onProgress?.({ percent: 18, status: 'initializing_ocr' });
      const Tesseract = await ensureTesseract();
      const rec = await Tesseract.recognize(src, SCRIPT_MAP[script] || 'eng', {
        logger: (message) => {
          if (!onProgress) return;
          const raw = Number(message?.progress || 0);
          const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
          onProgress({ percent: Math.round(18 + (bounded * 68)), status: message?.status || 'recognizing_text' });
        }
      });
      const lines = (rec.data?.lines || [])
        .map((line) => ({
          text: String(line.text || '').trim(),
          bbox: line.bbox || line.words?.[0]?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
        }))
        .filter((line) => line.text);

      const filtered = bubbleOnly ? lines.filter((line) => this.isSpeechBubble(line.text)) : lines;
      const sourceTexts = filtered.map((item) => item.text);
      onProgress?.({ percent: 90, status: 'translating_text' });
      const translatedTexts = sourceTexts.length ? await AiTranslate.translateBatch(sourceTexts, lang) : [];

      const items = filtered.map((item, index) => ({
        source: item.text,
        translated: translatedTexts[index] || item.text,
        bbox: item.bbox
      }));

      const value = {
        imageSrc: meta.src,
        width: meta.width,
        height: meta.height,
        rawText: sourceTexts.join('\n'),
        items
      };

      CACHE.set(cacheKey, { timestamp: Date.now(), value });
      onProgress?.({ percent: 100, status: 'completed' });
      document.getElementById('psCacheSize') && (document.getElementById('psCacheSize').textContent = String(CACHE.size));
      if (items.length) AppConfig.incrementStat('translations', items.length);
      return value;
    },

    clearCache() {
      CACHE.clear();
      document.getElementById('psCacheSize') && (document.getElementById('psCacheSize').textContent = '0');
      window.showToast?.(window.getText?.('cacheCleared') || 'Cache cleared');
    },

    isSpeechBubble(text) {
      const clean = String(text || '').replace(/\s+/g, ' ').trim();
      if (clean.length < 2 || clean.length > 180) return false;
      if (/^[\W_]+$/.test(clean)) return false;
      const alpha = (clean.match(/[\p{L}\p{N}]/gu) || []).length;
      return alpha / clean.length > 0.35;
    }
  };

  window.OcrService = OcrService;
})();
