(function () {
  const VOICE_LANG_MAP = {
    ar: ['ar-SA', 'ar-EG', 'ar'], en: ['en-US', 'en-GB', 'en'], fr: ['fr-FR', 'fr-CA', 'fr'],
    tr: ['tr-TR', 'tr'], ja: ['ja-JP', 'ja'], zh: ['zh-CN', 'zh-TW', 'zh'], es: ['es-ES', 'es-MX', 'es'],
    de: ['de-DE', 'de'], it: ['it-IT', 'it'], ru: ['ru-RU', 'ru'], pt: ['pt-BR', 'pt-PT', 'pt'],
    hi: ['hi-IN', 'hi'], id: ['id-ID', 'id'], ko: ['ko-KR', 'ko'], ur: ['ur-PK', 'ur'], fa: ['fa-IR', 'fa'],
    bn: ['bn-BD', 'bn'], nl: ['nl-NL', 'nl'], pl: ['pl-PL', 'pl'], uk: ['uk-UA', 'uk'],
    vi: ['vi-VN', 'vi'], th: ['th-TH', 'th'], ms: ['ms-MY', 'ms']
  };

  function chunkText(text, max = 220) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    if (clean.length <= max) return [clean];
    const parts = [];
    let current = '';
    clean.split(/(?<=[\.!?،؛])\s+/).forEach((piece) => {
      if (!piece) return;
      if ((current + ' ' + piece).trim().length > max) {
        if (current.trim()) parts.push(current.trim());
        current = piece;
      } else {
        current = `${current} ${piece}`.trim();
      }
    });
    if (current.trim()) parts.push(current.trim());
    return parts.length ? parts : [clean];
  }

  const TtsService = {
    langCode: 'ar',
    rate: 0.95,
    utterance: null,

    setLanguage(code) {
      this.langCode = String(code || 'ar').trim() || 'ar';
      this.prime();
    },

    setRate(rate) {
      this.rate = Math.max(0.3, Math.min(2, Number(rate || 1)));
    },

    getLangTag() {
      return (VOICE_LANG_MAP[this.langCode] || [this.langCode || 'en-US'])[0];
    },

    prime() {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.resume();
      } catch (error) {
        console.warn('TTS prime skipped');
      }
    },

    _pickVoice() {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      const hints = VOICE_LANG_MAP[this.langCode] || [this.langCode];
      return voices.find((voice) => hints.some((hint) => `${voice.lang} ${voice.name}`.toLowerCase().includes(hint.toLowerCase())))
        || voices.find((voice) => hints.some((hint) => voice.lang.toLowerCase().startsWith(hint.slice(0, 2).toLowerCase())))
        || voices[0]
        || null;
    },

    _ttsEnabled() {
      const toggle = document.getElementById('proTts');
      return !toggle || !!toggle.checked;
    },

    _createUtterance(text) {
      const utterance = new SpeechSynthesisUtterance(String(text || '').trim());
      utterance.lang = this.getLangTag();
      utterance.rate = this.rate;
      const voice = this._pickVoice();
      if (voice) utterance.voice = voice;
      return utterance;
    },

    async _speakQueue(queue) {
      this.stop();
      for (const [index, text] of queue.entries()) {
        await new Promise((resolve) => {
          const utterance = this._createUtterance(text);
          utterance.onstart = () => {
            window.showTtsIndicator?.(text);
            window.updateTtsIndicatorProgress?.(`${index + 1}/${queue.length}`);
          };
          utterance.onend = resolve;
          utterance.onerror = resolve;
          this.utterance = utterance;
          try {
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          } catch (error) {
            resolve();
          }
        });
      }
      window.hideTtsIndicator?.();
    },

    speak(text) {
      if (!('speechSynthesis' in window) || !text || !this._ttsEnabled()) return false;
      const queue = chunkText(text);
      this._speakQueue(queue);
      return true;
    },

    async speakAll(texts) {
      if (!('speechSynthesis' in window) || !this._ttsEnabled()) return;
      const queue = (texts || []).flatMap((text) => chunkText(text)).filter(Boolean);
      if (!queue.length) return;
      await this._speakQueue(queue);
    },

    stop() {
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          window.speechSynthesis.resume();
        } catch (error) {
          console.warn('TTS stop failed');
        }
      }
      this.utterance = null;
      window.hideTtsIndicator?.();
    }
  };

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => TtsService.prime();
    ['click', 'touchend', 'keydown'].forEach((eventName) => {
      window.addEventListener(eventName, () => TtsService.prime(), { passive: true });
    });
  }

  window.addEventListener('beforeunload', () => TtsService.stop());
  window.TtsService = TtsService;
})();