(function () {
  const STORAGE_KEY = 'spr.config.v4';
  const DEFAULTS = {
    openaiKey: '',
    googleKey: '',
    backendUrl: '',
    defaultLang: 'ar',
    ttsRate: 0.95,
    theme: 'purple',
    ocrScript: 'latin',
    autoTts: false,
    firstRun: true,
    hideOnboarding: false,
    adShield: true,
    aiPrivacyMode: true,
    pageTranslateMode: 'smart',
    stats: { searches: 0, translations: 0, pages: 0 }
  };

  function deepMerge(base, patch) {
    const output = { ...base };
    Object.keys(patch || {}).forEach((key) => {
      if (patch[key] && typeof patch[key] === 'object' && !Array.isArray(patch[key])) {
        output[key] = deepMerge(base[key] || {}, patch[key]);
      } else {
        output[key] = patch[key];
      }
    });
    return output;
  }

  const AppConfig = {
    state: deepMerge(DEFAULTS, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')),

    get openaiKey() { return this.state.openaiKey || ''; },
    get googleKey() { return this.state.googleKey || ''; },
    get backendUrl() { return this.state.backendUrl || ''; },
    get defaultLang() { return this.state.defaultLang || 'ar'; },
    get adShield() { return this.state.adShield !== false; },
    get aiPrivacyMode() { return this.state.aiPrivacyMode !== false; },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('spr:config-changed', { detail: this.state }));
      return this.state;
    },

    set(patch) {
      this.state = deepMerge(this.state, patch || {});
      return this.save();
    },

    markFirstRunDone(hideOnboarding) {
      this.state.firstRun = false;
      if (typeof hideOnboarding === 'boolean') this.state.hideOnboarding = hideOnboarding;
      this.save();
    },

    incrementStat(key, amount = 1) {
      if (!this.state.stats[key]) this.state.stats[key] = 0;
      this.state.stats[key] += amount;
      this.save();
    },

    saveFromUI() {
      const next = {
        openaiKey: document.getElementById('cfgOpenaiKey')?.value.trim() || '',
        googleKey: document.getElementById('cfgGoogleKey')?.value.trim() || '',
        backendUrl: document.getElementById('cfgBackendUrl')?.value.trim() || '',
        defaultLang: document.getElementById('cfgDefaultLang')?.value || 'ar',
        ttsRate: Number(document.getElementById('cfgTtsRate')?.value || 0.95),
        aiPrivacyMode: document.getElementById('cfgAiPrivacy')?.checked ?? this.state.aiPrivacyMode ?? true,
        adShield: document.getElementById('cfgAdShield')?.checked ?? this.state.adShield ?? true,
        ocrScript: localStorage.getItem('spr.ocrScript') || this.state.ocrScript || 'latin'
      };
      this.set(next);
      if (window.TtsService) TtsService.setRate(next.ttsRate);
      if (window.applyI18n) applyI18n(next.defaultLang);
      if (window.showToast) showToast((window.getText?.('settingsSaved')) || 'Saved');
      if (window.updateConfigUI) updateConfigUI();
    }
  };

  window.AppConfig = AppConfig;
})();
