(function () {
  const LANGUAGES = {
    ar: { flag: '🇸🇦', native: 'العربية', english: 'Arabic', locale: 'ar-SA', rtl: true },
    en: { flag: '🇺🇸', native: 'English', english: 'English', locale: 'en-US', rtl: false },
    fr: { flag: '🇫🇷', native: 'Français', english: 'French', locale: 'fr-FR', rtl: false },
    tr: { flag: '🇹🇷', native: 'Türkçe', english: 'Turkish', locale: 'tr-TR', rtl: false },
    ja: { flag: '🇯🇵', native: '日本語', english: 'Japanese', locale: 'ja-JP', rtl: false },
    zh: { flag: '🇨🇳', native: '中文', english: 'Chinese', locale: 'zh-CN', rtl: false },
    es: { flag: '🇪🇸', native: 'Español', english: 'Spanish', locale: 'es-ES', rtl: false },
    de: { flag: '🇩🇪', native: 'Deutsch', english: 'German', locale: 'de-DE', rtl: false },
    it: { flag: '🇮🇹', native: 'Italiano', english: 'Italian', locale: 'it-IT', rtl: false },
    ru: { flag: '🇷🇺', native: 'Русский', english: 'Russian', locale: 'ru-RU', rtl: false },
    pt: { flag: '🇵🇹', native: 'Português', english: 'Portuguese', locale: 'pt-BR', rtl: false },
    hi: { flag: '🇮🇳', native: 'हिन्दी', english: 'Hindi', locale: 'hi-IN', rtl: false },
    id: { flag: '🇮🇩', native: 'Bahasa Indonesia', english: 'Indonesian', locale: 'id-ID', rtl: false },
    ko: { flag: '🇰🇷', native: '한국어', english: 'Korean', locale: 'ko-KR', rtl: false },
    ur: { flag: '🇵🇰', native: 'اردو', english: 'Urdu', locale: 'ur-PK', rtl: true },
    fa: { flag: '🇮🇷', native: 'فارسی', english: 'Persian', locale: 'fa-IR', rtl: true },
    bn: { flag: '🇧🇩', native: 'বাংলা', english: 'Bengali', locale: 'bn-BD', rtl: false },
    nl: { flag: '🇳🇱', native: 'Nederlands', english: 'Dutch', locale: 'nl-NL', rtl: false },
    pl: { flag: '🇵🇱', native: 'Polski', english: 'Polish', locale: 'pl-PL', rtl: false },
    uk: { flag: '🇺🇦', native: 'Українська', english: 'Ukrainian', locale: 'uk-UA', rtl: false },
    vi: { flag: '🇻🇳', native: 'Tiếng Việt', english: 'Vietnamese', locale: 'vi-VN', rtl: false },
    th: { flag: '🇹🇭', native: 'ไทย', english: 'Thai', locale: 'th-TH', rtl: false },
    ms: { flag: '🇲🇾', native: 'Bahasa Melayu', english: 'Malay', locale: 'ms-MY', rtl: false }
  };

  const LANGUAGE_CODES = Object.keys(LANGUAGES);
  const SEARCH_PROVIDERS = {
    duckduckgo: { name: 'DuckDuckGo', makeUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
    google: { name: 'Google', makeUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    bing: { name: 'Bing', makeUrl: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
    youtube: { name: 'YouTube', makeUrl: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` },
    wikipedia: { name: 'Wikipedia', makeUrl: (q) => `https://www.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}` }
  };

  const TEXTS = {
    ar: {
      appSubtitle: 'PRO AI Edition',
      homePlaceholder: 'ابحث أو أدخل رابطاً…',
      searchPlaceholder: 'ابحث عن أي شيء…',
      searchEmpty: 'ابدأ البحث للحصول على نتائج ذكية',
      readerTitle: 'Smart Reader',
      readerPlaceholder: 'أدخل رابط الموقع أو الصورة…',
      readerIntro: 'القارئ الآن يفتح نفس الرابط أو نفس الصورة مباشرة، مع دعم أفضل للجوال والكمبيوتر.',
      browserPlaceholder: 'ابحث أو اكتب رابط…',
      browserStart: 'ابحث أو أدخل رابطاً للبدء',
      browserError: 'بعض المواقع تمنع الفتح داخل التطبيق. استخدم فتح خارجياً.',
      browserErrorTitle: 'تعذر تحميل الصفحة',
      browserRetry: 'إعادة المحاولة',
      browserRecent: 'آخر ما فتحته',
      browserSearchResults: 'خيارات البحث السريعة',
      browserOpenSearch: 'فتح نتيجة البحث',
      ocrDropPrefix: 'اسحب صورة هنا أو ',
      ocrChooseFile: 'اختر ملف',
      ocrSpeakAll: 'قراءة الكل',
      cacheClear: 'مسح الكاش',
      settingsTitle: 'الإعدادات',
      searchTitle: 'البحث الذكي',
      browserTitle: 'المتصفح',
      navHome: 'الرئيسية',
      navSearch: 'بحث',
      navBrowser: 'متصفح',
      navReader: 'القارئ',
      navSettings: 'الإعدادات',
      onboardingTitle: 'أهلاً بك في Smart Reader PRO AI',
      onboardingBody: 'رتّبت لك الواجهة لتكون أعرض، أوضح، وأثبت على الجوال والكمبيوتر مع تحسين اللغات والترجمة والصوت.',
      doesTitle: 'التطبيق يعمل في',
      doesList: ['فتح الروابط داخل المتصفح أو القارئ', 'قراءة الصور نفسها من الرابط أو الملف', 'OCR للصورة ثم ترجمة النص المستخرج', 'قراءة صوتية للنصوص الظاهرة', 'تبديل لغة الواجهة فوراً'],
      doesntTitle: 'التطبيق لا يعمل في',
      doesntList: ['تجاوز المواقع التي تمنع iframe أو CORS', 'ترجمة كل مواقع الويب تلقائياً بدون OCR أو Backend', 'الدخول الإجباري إلى الصفحات المحمية أو الخاصة', 'استبدال الرابط بصورة أو صفحة ثانية'],
      useTitle: 'طريقة الاستخدام',
      useList: ['اختر لغة الواجهة أو الترجمة من القائمة', 'لو عندك رابط صفحة افتحه في Browser أو Reader', 'لو عندك رابط صورة أو ملف صورة استخدم Reader أو OCR', 'لو احتجت ترجمة أقوى أضف Google Translate API أو Backend', 'اضغط على أي بطاقة نص لسماعها صوتياً'],
      modalNote: 'لو موقع خارجي منع الفتح داخل التطبيق، ده سلوك من الموقع نفسه وليس خطأ في التطبيق.',
      startNow: 'ابدأ الآن',
      noShow: 'عدم إظهار الشرح مرة أخرى',
      homeGuideTitle: 'ملخص سريع',
      homeGuide: ['Reader يفتح نفس الرابط أو نفس الصورة فقط.', 'OCR يعالج الصورة المرفوعة ويعرض الترجمة فوقها.', 'تغيير اللغة ينعكس مباشرة على الواجهة.', 'المواقع المقفولة داخل iframe يتم فتحها خارجياً.'],
      settingsSaved: 'تم حفظ الإعدادات',
      cacheCleared: 'تم مسح الكاش',
      copied: 'تم النسخ',
      invalidUrl: 'اكتب رابطاً صحيحاً أو عبارة بحث.',
      loading: 'جارٍ التحميل...',
      readerLoading: 'جارٍ فتح الرابط نفسه…',
      imageLoading: 'جارٍ تحليل الصورة نفسها…',
      exactMode: 'وضع الرابط الدقيق',
      extractedText: 'النص المستخرج',
      translatedText: 'الترجمة',
      assistantHello: 'مرحباً! أقدر أساعدك في شرح الأدوات واستخدام التطبيق.',
      assistantHelp: 'استخدم Browser لفتح الصفحات، Reader لفتح نفس الصفحة أو الصورة، وOCR لمعالجة الصور وترجمتها.',
      apiNote: 'الترجمة الآن تحاول عبر Backend ثم OpenAI عند إضافة المفتاح ثم Google API ثم LibreTranslate ثم Google العام ثم MyMemory، مع كاش وتحسين للنصوص الطويلة والمتكررة.',
      saveBtn: 'حفظ الإعدادات',
      tryPro: 'تجربة ميزات PRO الآن',
      searchWeb: 'بحث ويب',
      openBrowser: 'فتح في المتصفح',
      openReader: 'فتح في القارئ',
      openImageReader: 'فتح الصورة في القارئ',
      openExternal: 'فتح خارجياً',
      copyLink: 'نسخ الرابط',
      resultHint: 'اختر الطريقة المناسبة لفتح النتيجة.',
      helpChip: 'مساعدة',
      ocrChip: 'OCR صورة',
      apiChip: 'API Key',
      welcomeBubble: 'مرحباً! أنا Smart Reader PRO AI 🤖',
      welcomeList: ['Reader يفتح نفس الرابط أو الصورة', 'OCR + ترجمة للنص المستخرج', 'قراءة صوتية للنصوص', 'واجهة متجاوبة وتبديل لغة فوري'],
      configured: 'مُهيأ',
      notConfigured: 'غير مُهيأ',
      browserBlocked: 'الموقع ربما يمنع العرض داخل التطبيق. استخدم فتح خارجياً.',
      translatedTo: 'اللغة الحالية',
      imageExact: 'تم فتح الصورة من نفس الرابط',
      pageExact: 'تم فتح الصفحة من نفس الرابط',
      noTextFound: 'لم يتم العثور على نص واضح في الصورة.',
      languageChanged: 'تم تغيير اللغة',
      searchDesc: 'نتائج سريعة ومباشرة لمحركات البحث والروابط.',
      ttsOn: 'تم تفعيل القراءة الصوتية',
      ttsOff: 'تم إيقاف القراءة الصوتية',
      voiceUnsupported: 'البحث الصوتي غير مدعوم في هذا المتصفح',
      translateCurrent: 'ترجمة الحالي',
      translateImage: 'ترجمة الصورة',
      translatePage: 'ترجمة الصفحة',
      noActivePage: 'افتح صفحة أو صورة أولاً',
      noImageToTranslate: 'الرابط الحالي ليس صورة مباشرة',
      translatingPage: 'جارٍ تجهيز ترجمة الصفحة…',
      translatingImage: 'جارٍ ترجمة الصورة…',
      taskPreparing: 'جارٍ التجهيز…',
      taskDone: 'اكتمل',
      adShieldOn: 'مانع الإعلانات مفعل',
      browserReady: 'جاهز'
    },
    en: {
      appSubtitle: 'PRO AI Edition',
      homePlaceholder: 'Search or enter a URL…',
      searchPlaceholder: 'Search for anything…',
      searchEmpty: 'Start searching to get smart results',
      readerTitle: 'Smart Reader',
      readerPlaceholder: 'Enter a page or image URL…',
      readerIntro: 'Reader now opens the exact page or image with a wider responsive layout for phone and desktop.',
      browserPlaceholder: 'Search or type a URL…',
      browserStart: 'Search or enter a URL to begin',
      browserError: 'Some websites block iframe embedding. Use open externally.',
      browserErrorTitle: 'Unable to load page',
      browserRetry: 'Retry',
      browserRecent: 'Recent items',
      browserSearchResults: 'Quick search options',
      browserOpenSearch: 'Open search result',
      ocrDropPrefix: 'Drop an image here or ',
      ocrChooseFile: 'choose a file',
      ocrSpeakAll: 'Read all',
      cacheClear: 'Clear cache',
      settingsTitle: 'Settings',
      searchTitle: 'Smart Search',
      browserTitle: 'Browser',
      navHome: 'Home',
      navSearch: 'Search',
      navBrowser: 'Browser',
      navReader: 'Reader',
      navSettings: 'Settings',
      onboardingTitle: 'Welcome to Smart Reader PRO AI',
      onboardingBody: 'The UI has been widened and stabilized for phone and desktop, with better language, translation, and voice support.',
      doesTitle: 'What it does',
      doesList: ['Open links inside Browser or Reader', 'Read the exact same image from URL or file', 'Run OCR on images then translate extracted text', 'Speak visible text aloud', 'Switch UI language instantly'],
      doesntTitle: 'What it does not do',
      doesntList: ['Bypass sites that block iframe or CORS', 'Translate every website automatically without OCR or backend', 'Force access to protected/private pages', 'Replace your URL with a different image or page'],
      useTitle: 'How to use it',
      useList: ['Choose the interface or translation language from the list', 'Open page links in Browser or Reader', 'Use Reader or OCR for direct image links or image files', 'Add Google Translate API or a backend for stronger translation', 'Tap any text card to hear it aloud'],
      modalNote: 'If an external site blocks loading inside the app, that is the site behavior, not an app bug.',
      startNow: 'Start now',
      noShow: 'Do not show this again',
      homeGuideTitle: 'Quick summary',
      homeGuide: ['Reader opens the exact same URL or image only.', 'OCR processes the uploaded image and overlays translated text.', 'Changing language updates the UI immediately.', 'Sites blocked in iframe can be opened externally.'],
      settingsSaved: 'Settings saved',
      cacheCleared: 'Cache cleared',
      copied: 'Copied',
      invalidUrl: 'Enter a valid URL or search phrase.',
      loading: 'Loading...',
      readerLoading: 'Opening the exact URL…',
      imageLoading: 'Analyzing the exact image…',
      exactMode: 'Exact-link mode',
      extractedText: 'Extracted text',
      translatedText: 'Translation',
      assistantHello: 'Hi! I can explain the tools and how to use the app.',
      assistantHelp: 'Use Browser to open pages, Reader to open the same page or image, and OCR to process and translate images.',
      apiNote: 'Translation now tries Backend, then OpenAI when a key is added, then Google API, LibreTranslate, public Google, and MyMemory with cache and long-text handling.',
      saveBtn: 'Save settings',
      tryPro: 'Try PRO features now',
      searchWeb: 'Web search',
      openBrowser: 'Open in browser',
      openReader: 'Open in reader',
      openImageReader: 'Open image in reader',
      openExternal: 'Open externally',
      copyLink: 'Copy link',
      resultHint: 'Choose how you want to open the result.',
      helpChip: 'Help',
      ocrChip: 'Image OCR',
      apiChip: 'API Key',
      welcomeBubble: 'Hello! I am Smart Reader PRO AI 🤖',
      welcomeList: ['Reader opens the same link or image', 'OCR + translation for extracted text', 'Text-to-speech playback', 'Responsive UI and instant language switching'],
      configured: 'Configured',
      notConfigured: 'Not configured',
      browserBlocked: 'This site may block in-app embedding. Use open externally.',
      translatedTo: 'Current language',
      imageExact: 'Opened the image from the exact link',
      pageExact: 'Opened the page from the exact link',
      noTextFound: 'No clear text was found in the image.',
      languageChanged: 'Language updated',
      searchDesc: 'Quick and direct options for search engines and links.',
      ttsOn: 'Text-to-speech enabled',
      ttsOff: 'Text-to-speech disabled',
      voiceUnsupported: 'Voice search is not supported in this browser',
      translateCurrent: 'Translate current',
      translateImage: 'Translate image',
      translatePage: 'Translate page',
      noActivePage: 'Open a page or image first',
      noImageToTranslate: 'The current URL is not a direct image',
      translatingPage: 'Preparing page translation…',
      translatingImage: 'Translating image…',
      taskPreparing: 'Preparing…',
      taskDone: 'Done',
      adShieldOn: 'Ad shield enabled',
      browserReady: 'Ready'
    }
  };

  const RECENTS_KEY = 'spr.browser.recents.v2';
  const state = {
    currentScreen: 'screenHome',
    currentLang: sanitizeLang(AppConfig.defaultLang || 'ar'),
    currentReaderSource: null,
    currentReaderMode: 'empty',
    currentOcrData: null,
    browser: { history: [], index: -1, currentUrl: '', timer: null },
    taskProgressTimer: null,
    browserProgressValue: 0,
    activeFilter: 'all',
    lastFocusedInput: null,
    chatPrivateLocked: AppConfig.state.aiPrivacyMode !== false,
    autoTts: !!AppConfig.state.autoTts,
    recordTab: 'all',
    trashOpen: false,
    lastDeletedRecordId: '',
    undoTimer: null
  };

  function sanitizeLang(code) {
    const lang = String(code || '').trim();
    return LANGUAGES[lang] ? lang : 'en';
  }

  function getDictionary(lang) {
    return TEXTS[sanitizeLang(lang)] || TEXTS.en;
  }

  function getLanguageMeta(code) {
    return LANGUAGES[sanitizeLang(code)] || LANGUAGES.en;
  }

  function getText(key, lang = state.currentLang) {
    return getDictionary(lang)[key] || TEXTS.en[key] || key;
  }
  window.getText = getText;

  function qs(selector) {
    return document.querySelector(selector);
  }

  function setText(selector, value) {
    const el = qs(selector);
    if (el && value != null) el.textContent = value;
  }

  function setPlaceholder(selector, value) {
    const el = qs(selector);
    if (el && value != null) el.placeholder = value;
  }

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function isLikelyUrl(value) {
    const v = String(value || '').trim();
    return /^https?:\/\//i.test(v) || /^data:image\//i.test(v) || /^blob:/i.test(v) || /^www\./i.test(v) || /\.[a-z]{2,}(\/|$|\?)/i.test(v);
  }

  function normalizeUrl(value, searchFallback = true, provider = 'duckduckgo') {
    const v = String(value || '').trim();
    if (!v) return '';
    if (/^data:image\//i.test(v) || /^blob:/i.test(v)) return v;
    if (/^https?:\/\//i.test(v)) return v;
    if (/^www\./i.test(v)) return `https://${v}`;
    if (!searchFallback && !isLikelyUrl(v)) return '';
    if (isLikelyUrl(v)) return `https://${v.replace(/^\/+/, '')}`;
    const engine = SEARCH_PROVIDERS[provider] || SEARCH_PROVIDERS.duckduckgo;
    return engine.makeUrl(v);
  }

  function looksLikeImageUrl(url) {
    return /^data:image\//i.test(url) || /\.(png|jpe?g|webp|gif|bmp|svg)(\?|#|$)/i.test(url);
  }

  function showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  window.showToast = showToast;

  function showTtsIndicator(text) {
    const box = document.getElementById('ttsIndicator');
    const lbl = document.getElementById('ttsIndicatorText');
    const progress = document.getElementById('ttsProgressText');
    if (!box || !lbl) return;
    lbl.textContent = String(text || '').slice(0, 80);
    if (progress) progress.textContent = '…';
    box.classList.add('show');
  }
  function hideTtsIndicator() {
    document.getElementById('ttsIndicator')?.classList.remove('show');
  }
  function updateTtsIndicatorProgress(value) {
    const progress = document.getElementById('ttsProgressText');
    if (progress) progress.textContent = String(value || '');
  }
  function showTaskProgress(title, percent = 0, status = '') {
    const box = document.getElementById('taskProgress');
    const bar = document.getElementById('taskProgressBar');
    const titleEl = document.getElementById('taskProgressTitle');
    const percentEl = document.getElementById('taskProgressPercent');
    const statusEl = document.getElementById('taskProgressStatus');
    if (!box || !bar || !titleEl || !percentEl || !statusEl) return;
    clearTimeout(state.taskProgressTimer);
    const pct = Math.max(0, Math.min(100, Number(percent || 0)));
    titleEl.textContent = title || getText('loading');
    percentEl.textContent = `${Math.round(pct)}%`;
    statusEl.textContent = status || getText('taskPreparing');
    bar.style.width = `${pct}%`;
    box.classList.add('show');
  }
  function updateTaskProgress(percent = 0, status = '', title = '') {
    showTaskProgress(title || document.getElementById('taskProgressTitle')?.textContent || getText('loading'), percent, status || document.getElementById('taskProgressStatus')?.textContent || getText('taskPreparing'));
  }
  function hideTaskProgress(delay = 420) {
    clearTimeout(state.taskProgressTimer);
    state.taskProgressTimer = setTimeout(() => document.getElementById('taskProgress')?.classList.remove('show'), delay);
  }
  function humanizeOcrStatus(status) {
    const key = String(status || '').toLowerCase();
    const map = {
      preparing_image: state.currentLang === 'ar' ? 'تهيئة الصورة' : 'Preparing image',
      loading_image: state.currentLang === 'ar' ? 'تحميل الصورة' : 'Loading image',
      initializing_ocr: state.currentLang === 'ar' ? 'تهيئة OCR' : 'Initializing OCR',
      loading_tesseract_core: state.currentLang === 'ar' ? 'تحميل محرك OCR' : 'Loading OCR core',
      initializing_tesseract: state.currentLang === 'ar' ? 'تجهيز المحرك' : 'Initializing engine',
      recognizing_text: state.currentLang === 'ar' ? 'استخراج النص' : 'Recognizing text',
      translating_text: state.currentLang === 'ar' ? 'ترجمة النص' : 'Translating text',
      completed: getText('taskDone')
    };
    return map[key.replace(/\s+/g, '_')] || String(status || getText('taskPreparing'));
  }
  window.showTtsIndicator = showTtsIndicator;
  window.hideTtsIndicator = hideTtsIndicator;
  window.updateTtsIndicatorProgress = updateTtsIndicatorProgress;
  window.showTaskProgress = showTaskProgress;
  window.updateTaskProgress = updateTaskProgress;
  window.hideTaskProgress = hideTaskProgress;

  function updateStats() {
    const stats = AppConfig.state.stats || {};
    setText('#stat_searches', String(stats.searches || 0));
    setText('#stat_translations', String(stats.translations || 0));
    setText('#stat_pages', String(stats.pages || 0));
  }

  function updateStatusClock() {
    const locale = getLanguageMeta(state.currentLang).locale || 'en-US';
    setText('#statusTime', new Date().toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }));
  }

  function renderHomeGuide() {
    let box = document.getElementById('homeGuide');
    if (!box) {
      box = document.createElement('div');
      box.id = 'homeGuide';
      box.className = 'home-guide glass-card';
      qs('#screenHome .home-bg')?.appendChild(box);
    }
    const items = getText('homeGuide');
    box.innerHTML = `<h3>${getText('homeGuideTitle')}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><p>${escapeHtml(getText('apiNote'))}</p>`;
  }

  function updateCfgStatus() {
    const ok = !!(AppConfig.state.googleKey || AppConfig.state.backendUrl || AppConfig.state.openaiKey);
    const box = document.getElementById('cfgStatus');
    if (!box) return;
    box.innerHTML = `<span class="dot ${ok ? 'green' : 'red'}"></span> ${ok ? getText('configured') : getText('notConfigured')}`;
  }

  function buildLanguageControls() {
    const popup = document.getElementById('langPopup');
    const select = document.getElementById('cfgDefaultLang');
    if (popup) {
      popup.innerHTML = LANGUAGE_CODES.map((code) => {
        const meta = getLanguageMeta(code);
        return `<button class="lang-opt" data-lang="${code}" onclick="setReaderLang('${code}')"><span>${meta.flag} ${escapeHtml(meta.native)}</span><small class="lang-meta">${escapeHtml(code.toUpperCase())}</small></button>`;
      }).join('');
    }
    if (select) {
      select.innerHTML = LANGUAGE_CODES.map((code) => {
        const meta = getLanguageMeta(code);
        return `<option value="${code}">${meta.flag} ${code} — ${escapeHtml(meta.native)}</option>`;
      }).join('');
    }
  }

  function updateLanguageControls() {
    document.querySelectorAll('.lang-opt').forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === state.currentLang));
    const select = document.getElementById('cfgDefaultLang');
    if (select) select.value = state.currentLang;
  }

  function updateConfigUI() {
    const s = AppConfig.state;
    const openai = document.getElementById('cfgOpenaiKey');
    const google = document.getElementById('cfgGoogleKey');
    const backend = document.getElementById('cfgBackendUrl');
    const lang = document.getElementById('cfgDefaultLang');
    const rate = document.getElementById('cfgTtsRate');
    const rateVal = document.getElementById('cfgTtsRateVal');
    if (openai) openai.value = s.openaiKey || '';
    if (google) google.value = s.googleKey || '';
    if (backend) backend.value = s.backendUrl || '';
    if (lang) lang.value = sanitizeLang(s.defaultLang || 'ar');
    if (rate) rate.value = Number(s.ttsRate || 0.95);
    if (rateVal) rateVal.textContent = `${Number(s.ttsRate || 0.95).toFixed(2)}x`;
    const aiPrivacy = document.getElementById('cfgAiPrivacy');
    const adShield = document.getElementById('cfgAdShield');
    if (aiPrivacy) aiPrivacy.checked = s.aiPrivacyMode !== false;
    if (adShield) adShield.checked = s.adShield !== false;
    const proAds = document.getElementById('proAds');
    if (proAds) proAds.checked = s.adShield !== false;
    document.body.dataset.theme = s.theme || 'purple';
    document.querySelectorAll('.theme-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.theme === (s.theme || 'purple')));
    document.querySelectorAll('.script-pill').forEach((btn) => btn.classList.toggle('active', btn.dataset.script === (localStorage.getItem('spr.ocrScript') || s.ocrScript || 'latin')));
    state.autoTts = !!s.autoTts;
    document.getElementById('ttsToggleBtn')?.classList.toggle('active', state.autoTts);
    updateLanguageControls();
    updateCfgStatus();
    updateStats();
    updateAiPrivateUI();
    renderDiagnosticsPanel();
  }
  window.updateConfigUI = updateConfigUI;

  function applyI18n(lang) {
    state.currentLang = sanitizeLang(lang || 'ar');
    const meta = getLanguageMeta(state.currentLang);
    document.documentElement.lang = state.currentLang;
    document.documentElement.dir = meta.rtl ? 'rtl' : 'ltr';
    TtsService.setLanguage(state.currentLang);

    setPlaceholder('#searchInput', getText('homePlaceholder'));
    setPlaceholder('#searchInput2', getText('searchPlaceholder'));
    setPlaceholder('#readerUrlInput', getText('readerPlaceholder'));
    setPlaceholder('#browserAddressBar', getText('browserPlaceholder'));
    setPlaceholder('#chatInput', state.currentLang === 'ar' ? 'اكتب رسالتك…' : 'Type your message…');

    setText('#screenSearch .screen-header h2', getText('searchTitle'));
    setText('#screenReader .screen-header h2 .title-text', getText('readerTitle'));
    setText('#screenSettings .screen-header h2', getText('settingsTitle'));
    setText('#screenBrowser .startpage-logo + h2', getText('browserTitle'));
    setText('#screenBrowser .browser-startpage p', getText('browserStart'));
    setText('#browserErrorTitle', getText('browserErrorTitle'));
    setText('#browserErrorMsg', getText('browserError'));
    setText('#browserRetryLabel', getText('browserRetry'));
    setText('#browserExternalLabel', getText('openExternal'));
    setText('#browserRecentTitle', getText('browserRecent'));
    setText('#screenChat .bubble-text', getText('welcomeBubble'));
    setText('#privateAiHeading', uiText('المساعد الخاص', 'Private AI'));
    setText('#privateAiStatus', uiText('● مساحة خاصة', '● Private space'));
    setText('#privateAiTitle', uiText('ركن الذكاء الخاص', 'Private AI space'));
    setText('#privateAiDesc', uiText('المحادثات هنا في مساحة مستقلة، وتقدر تقفل المحتوى على طول قبل ما أحد يشوفه.', 'This chat stays in a separate space, and you can lock it instantly before anyone sees it.'));
    setText('#chatPrivacyMaskTitle', uiText('المحتوى مقفول', 'Content locked'));
    setText('#chatPrivacyMaskDesc', uiText('اضغط فتح عشان تظهر مساحة الذكاء، أو اتركها مقفولة لو في أحد حولك.', 'Tap unlock to reveal the AI space, or keep it locked when someone is near you.'));
    setText('#chatPrivacyMaskBtn', uiText('فتح المساحة', 'Unlock space'));
    setText('#privateAiToggleLabel', state.chatPrivateLocked ? uiText('فتح المحادثة', 'Unlock chat') : uiText('قفل المحادثة', 'Lock chat'));
    setText('#aiVaultLabel', uiText('الذكاء الخاص', 'AI Vault'));
    setText('#settingsHubDesc', uiText('رتّبت لك الإعدادات حسب الاستخدام: ترجمة، خصوصية، OCR، صوت، ملفات، ثم المظهر.', 'Settings are grouped by use: translation, privacy, OCR, audio, files, then appearance.'));
    setText('#hubTranslateLabel', uiText('الترجمة', 'Translation'));
    setText('#hubPrivacyLabel', uiText('الخصوصية', 'Privacy'));
    setText('#hubOcrLabel', 'OCR');
    setText('#hubTtsLabel', uiText('الصوت', 'Audio'));
    setText('#hubFilesLabel', uiText('الملفات', 'Files'));
    setText('#hubThemeLabel', uiText('المظهر', 'Theme'));
    setText('#clearGoogleKeyLabel', uiText('تفريغ مفتاح Google', 'Clear Google key'));
    setText('#runDeepCheckLabel', uiText('تحديث الفحص', 'Refresh check'));
    setText('#nav-home span', getText('navHome'));
    setText('#nav-search span', getText('navSearch'));
    setText('#nav-browser span', getText('navBrowser'));
    setText('#nav-reader span', getText('navReader'));
    setText('#nav-settings span', getText('navSettings'));
    setText('#ocrSpeakAllBtn .btn-label', getText('ocrSpeakAll'));
    setText('#readerTranslateCurrentLabel', getText('translateCurrent'));
    setText('#readerTranslateImageLabel', getText('translateImage'));
    setText('#readerTranslatePageLabel', getText('translatePage'));
    setText('#screenSettings .save-btn .btn-label', getText('saveBtn'));
    setText('#screenSettings .btn-danger .btn-label', getText('tryPro'));
    setText('#resultsArea .empty-search p', getText('searchEmpty'));
    setText('#ocrDropZone .drop-main-text', getText('ocrDropPrefix'));
    setText('#ocrDropZone .dz-browse', getText('ocrChooseFile'));

    const welcomeList = qs('#chatMessages .help-list');
    if (welcomeList) welcomeList.innerHTML = getText('welcomeList').map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    const chips = document.querySelectorAll('.suggestion-chip');
    if (chips[0]) chips[0].innerHTML = `<i class="fas fa-circle-info"></i> ${getText('helpChip')}`;
    if (chips[1]) chips[1].innerHTML = `<i class="fas fa-image"></i> ${getText('ocrChip')}`;
    if (chips[2]) chips[2].innerHTML = `<i class="fas fa-key"></i> ${getText('apiChip')}`;

    const browserTranslateBtn = document.getElementById('browserTranslateBtn');
    if (browserTranslateBtn) browserTranslateBtn.title = getText('translateCurrent');
    const readerTranslateBtn = document.getElementById('readerTranslateBtn');
    if (readerTranslateBtn) readerTranslateBtn.title = getText('translateCurrent');
    renderHomeGuide();
    renderVisualGuideCards();
    renderRecords();
    renderBrowserSuggestions();
    updateLanguageControls();
    updateCfgStatus();
    updateStatusClock();
    updateAiPrivateUI();
    renderDiagnosticsPanel();
  }
  window.applyI18n = applyI18n;

  function navigateTo(screenId) {
    state.currentScreen = screenId;
    if (screenId === 'screenChat' && AppConfig.state.aiPrivacyMode !== false) state.chatPrivateLocked = true;
    document.querySelectorAll('.screen').forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
    const map = { screenHome: 'nav-home', screenSearch: 'nav-search', screenBrowser: 'nav-browser', screenReader: 'nav-reader', screenSettings: 'nav-settings' };
    Object.entries(map).forEach(([screen, navId]) => document.getElementById(navId)?.classList.toggle('active', screen === screenId));
    document.querySelector('.bottom-nav')?.classList.toggle('hidden', screenId === 'screenBrowser');
    if (screenId === 'screenBrowser') renderBrowserSuggestions();
    updateAiPrivateUI();
  }
  window.navigateTo = navigateTo;
  window.setActiveNav = (btn) => {
    document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
    btn?.classList.add('active');
  };

  function loadRecentItems() {
    try {
      const items = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
      return Array.isArray(items) ? items.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function saveRecentItem(value) {
    const clean = String(value || '').trim();
    if (!clean) return;
    const next = [clean, ...loadRecentItems().filter((item) => item !== clean)].slice(0, 8);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  }

  function renderBrowserSuggestions() {
    const box = document.getElementById('browserSuggestions');
    if (!box) return;
    const items = loadRecentItems();
    if (!items.length) {
      box.innerHTML = '';
      return;
    }
    box.innerHTML = `
      <div class="recent-title" id="browserRecentTitle">${escapeHtml(getText('browserRecent'))}</div>
      <div class="recent-list">${items.map((item) => `<button class="recent-chip" onclick="browserLoad('${escapeHtml(item).replace(/'/g, '&#39;')}')">${escapeHtml(item)}</button>`).join('')}</div>`;
  }

  function buildSearchCards(query) {
    const safeQuery = escapeHtml(query);
    const encodedQuery = encodeURIComponent(query);
    return Object.entries(SEARCH_PROVIDERS).map(([key, provider]) => {
      const url = provider.makeUrl(query);
      const encodedUrl = encodeURIComponent(url);
      return `
        <div class="result-card">
          <div>
            <strong>${escapeHtml(provider.name)}</strong>
            <p>${safeQuery}</p>
          </div>
          <div class="result-actions">
            <button class="action-chip" data-url="${encodedUrl}" onclick="browserLoad(decodeURIComponent(this.dataset.url))">${getText('browserOpenSearch')}</button>
            <button class="action-chip" data-url="${encodedUrl}" onclick="copyText(decodeURIComponent(this.dataset.url))">${getText('copyLink')}</button>
            <button class="action-chip" data-url="${encodedUrl}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')">${getText('openExternal')}</button>
          </div>
          <p>${escapeHtml(url)}</p>
        </div>`;
    }).join('');
  }

  function renderSearchResults(rawQuery) {
    const query = String(rawQuery || '').trim();
    const area = document.getElementById('resultsArea');
    if (!area) return;
    if (!query) {
      area.innerHTML = `<div class="empty-search"><div class="ei"><i class="fas fa-magnifying-glass-plus"></i></div><p>${getText('searchEmpty')}</p></div>`;
      return;
    }

    AppConfig.incrementStat('searches', 1);
    saveRecentItem(query);
    saveToolRecord('search', {
      title: query,
      summary: uiText('تم حفظ عملية بحث جديدة في ملف أداة البحث.', 'A new search was saved in the search tool file.'),
      content: query,
      link: isLikelyUrl(query) ? normalizeUrl(query, false) : normalizeUrl(query, true, 'duckduckgo')
    });

    if (isLikelyUrl(query)) {
      const url = normalizeUrl(query, false);
      const encodedUrl = encodeURIComponent(url);
      area.innerHTML = `
        <div class="result-card">
          <div>
            <strong>${escapeHtml(query)}</strong>
            <p>${escapeHtml(getText('searchDesc'))}</p>
          </div>
          <div class="result-actions">
            <button class="action-chip" data-url="${encodedUrl}" onclick="browserLoad(decodeURIComponent(this.dataset.url))">${getText('openBrowser')}</button>
            <button class="action-chip" data-url="${encodedUrl}" onclick="readerLoad(decodeURIComponent(this.dataset.url))">${looksLikeImageUrl(url) ? getText('openImageReader') : getText('openReader')}</button>
            <button class="action-chip" data-url="${encodedUrl}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')">${getText('openExternal')}</button>
            <button class="action-chip" data-url="${encodedUrl}" onclick="copyText(decodeURIComponent(this.dataset.url))">${getText('copyLink')}</button>
          </div>
          <p>${escapeHtml(url)}</p>
        </div>`;
      return;
    }

    area.innerHTML = buildSearchCards(query);
  }

  function doSearch() {
    renderSearchResults(document.getElementById('searchInput')?.value);
    navigateTo('screenSearch');
  }
  function doSearch2() {
    renderSearchResults(document.getElementById('searchInput2')?.value);
  }
  function handleSearchKey(event) { if (event.key === 'Enter') doSearch(); }
  function handleSearchKey2(event) { if (event.key === 'Enter') doSearch2(); }
  function setFilter(button, filter) {
    state.activeFilter = filter;
    document.querySelectorAll('.filter-tab').forEach((el) => el.classList.remove('active'));
    button?.classList.add('active');
  }
  window.doSearch = doSearch;
  window.doSearch2 = doSearch2;
  window.handleSearchKey = handleSearchKey;
  window.handleSearchKey2 = handleSearchKey2;
  window.setFilter = setFilter;

  function copyText(text) {
    navigator.clipboard?.writeText(text).then(() => showToast(getText('copied')));
  }
  window.copyText = copyText;
  function updateAiPrivateUI() {
    const enabled = AppConfig.state.aiPrivacyMode !== false;
    const mask = document.getElementById('chatPrivacyMask');
    const btn = document.getElementById('privateAiToggleBtn');
    const label = document.getElementById('privateAiToggleLabel');
    if (mask) mask.classList.toggle('hidden', !(enabled && state.chatPrivateLocked && state.currentScreen === 'screenChat'));
    if (btn) btn.classList.toggle('hidden', !enabled);
    if (label) label.textContent = state.chatPrivateLocked ? uiText('فتح المحادثة', 'Unlock chat') : uiText('قفل المحادثة', 'Lock chat');
  }

  function toggleAiPrivacyMask(forceState) {
    if (AppConfig.state.aiPrivacyMode === false) return;
    if (typeof forceState === 'boolean') state.chatPrivateLocked = forceState;
    else state.chatPrivateLocked = !state.chatPrivateLocked;
    updateAiPrivateUI();
  }
  window.toggleAiPrivacyMask = toggleAiPrivacyMask;

  function scrollToSettingsGroup(id) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.scrollToSettingsGroup = scrollToSettingsGroup;

  function clearGoogleKey() {
    const input = document.getElementById('cfgGoogleKey');
    if (input) input.value = '';
    AppConfig.set({ googleKey: '' });
    updateConfigUI();
    showToast(uiText('تم تفريغ مفتاح Google من هذه النسخة.', 'Google key cleared from this build.'));
  }
  window.clearGoogleKey = clearGoogleKey;

  function renderDiagnosticsPanel() {
    const host = document.getElementById('diagnosticGrid');
    if (!host) return;
    const hasGoogle = !!AppConfig.state.googleKey;
    const hasBackend = !!AppConfig.state.backendUrl;
    const hasOpenAI = !!AppConfig.state.openaiKey;
    const translateRoute = hasBackend ? uiText('Backend خاص', 'Private backend') : hasOpenAI ? 'OpenAI' : hasGoogle ? 'Google API' : uiText('مسارات احتياطية عامة', 'Public fallback routes');
    const cards = [
      {
        title: uiText('ترجمة الصفحات', 'Page translation'),
        badge: uiText('جاهزة', 'Ready'),
        tone: 'good',
        text: uiText('الترجمة الكاملة صارت داخلية بنمط قارئ ذكي بدل صفحة Google Translate المكسورة داخل الإطار.', 'Full-page translation now uses an internal smart reader mode instead of the broken in-frame Google Translate page.')
      },
      {
        title: uiText('ترجمة النصوص', 'Text translation'),
        badge: translateRoute,
        tone: hasBackend || hasOpenAI || hasGoogle ? 'good' : 'warn',
        text: uiText(`المسار الحالي: ${translateRoute}. لو ما فيه مفاتيح، التطبيق يرجع لمسارات عامة احتياطية.`, `Current route: ${translateRoute}. If no keys are configured, the app falls back to public routes.`)
      },
      {
        title: uiText('مانع الإعلانات', 'Ad shield'),
        badge: AppConfig.state.adShield === false ? uiText('موقوف', 'Off') : uiText('مفعل', 'On'),
        tone: AppConfig.state.adShield === false ? 'warn' : 'good',
        text: uiText('يوسّع فلترة العناصر الإعلانية والمزعجة داخل الواجهة والمحتوى المسموح عرضه.', 'Expands filtering for ad-like and intrusive elements inside the UI and embeddable content.')
      },
      {
        title: uiText('خصوصية الذكاء', 'AI privacy'),
        badge: AppConfig.state.aiPrivacyMode === false ? uiText('يدوي', 'Manual') : uiText('محمي', 'Protected'),
        tone: AppConfig.state.aiPrivacyMode === false ? 'info' : 'good',
        text: uiText('مساحة الذكاء لها قفل سريع على الجوال حتى ما تظهر المحادثة مباشرة.', 'The AI area has a quick lock on mobile so the conversation does not appear immediately.')
      },
      {
        title: uiText('وضع الجوال', 'Mobile mode'),
        badge: uiText('محسن', 'Optimized'),
        tone: 'good',
        text: uiText('أزرار أكبر، دعم safe area، وترتيب أوضح للأقسام والإجراءات في الشاشات الأساسية.', 'Larger controls, safe-area support, and clearer grouping for key screens and actions.')
      },
      {
        title: uiText('مفتاح Google', 'Google key'),
        badge: hasGoogle ? uiText('مفيد للنصوص', 'Useful for text') : uiText('اختياري', 'Optional'),
        tone: hasGoogle ? 'info' : 'warn',
        text: uiText('له فايدة في ترجمة النصوص وOCR، لكنه ليس سبب مشكلة ترجمة الصفحة الكاملة داخل الإطار.', 'It helps with text and OCR translation, but it is not the cause of the full-page translation issue inside the frame.')
      }
    ];
    host.innerHTML = cards.map((card) => `
      <div class="diagnostic-card">
        <div class="diagnostic-head">
          <div class="diagnostic-title">${escapeHtml(card.title)}</div>
          <span class="diagnostic-badge ${card.tone}">${escapeHtml(card.badge)}</span>
        </div>
        <div class="diagnostic-copy">${escapeHtml(card.text)}</div>
      </div>`).join('');
  }
  window.renderDiagnosticsPanel = renderDiagnosticsPanel;


  function uiText(ar, en) {
    return state.currentLang === 'ar' ? ar : en;
  }

  function formatToolName(tool) {
    const map = {
      all: uiText('الكل', 'All'),
      search: uiText('البحث', 'Search'),
      browser: uiText('المتصفح', 'Browser'),
      reader: uiText('القارئ', 'Reader'),
      ocr: 'OCR',
      chat: uiText('الذكاء', 'AI Chat')
    };
    return map[tool] || tool;
  }

  function formatDateLabel(value) {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleString(getLanguageMeta(state.currentLang).locale || 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  }

  function saveToolRecord(tool, payload) {
    try {
      return window.AppRecords?.save(tool, payload);
    } catch (error) {
      console.warn('Record save skipped', error);
      return null;
    }
  }

  function truncateText(text, length = 180) {
    const value = String(text || '').trim();
    if (value.length <= length) return value;
    return `${value.slice(0, Math.max(0, length - 1))}…`;
  }


  function getRecordSpeechText(item) {
    return [item?.title, item?.summary, item?.content].filter(Boolean).join('. ').trim();
  }

  function downloadJsonFile(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `smart-reader-file-${Date.now()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function showUndoBanner(message) {
    let box = document.getElementById('undoBanner');
    if (!box) {
      box = document.createElement('div');
      box.id = 'undoBanner';
      box.className = 'undo-banner';
      document.body.appendChild(box);
    }
    box.innerHTML = `<span>${escapeHtml(message)}</span><div class="undo-banner-actions"><button class="action-chip" type="button" onclick="undoLastDelete()"><i class="fas fa-rotate-left"></i> ${escapeHtml(uiText('تراجع', 'Undo'))}</button><button class="action-chip" type="button" onclick="hideUndoBanner()"><i class="fas fa-xmark"></i></button></div>`;
    box.classList.add('show');
    clearTimeout(state.undoTimer);
    state.undoTimer = setTimeout(() => hideUndoBanner(), 5200);
  }

  function hideUndoBanner() {
    document.getElementById('undoBanner')?.classList.remove('show');
  }

  function renderVisualGuideCards() {
    const host = document.getElementById('visualGuideCards');
    if (!host) return;
    const cards = [
      {
        title: uiText('مساحة الذكاء الخاصة', 'Private AI space'),
        text: uiText('فتحت للذكاء مكان مستقل مع قفل سريع يحجب المحادثة فوراً على الجوال.', 'AI now has a dedicated area with a quick lock to hide the conversation on mobile.'),
        mock: `<div class="guide-mock"><div class="guide-mock-grid"><div class="guide-mock-btn"><i class="fas fa-brain"></i><br/>AI</div><div class="guide-mock-btn"><i class="fas fa-user-shield"></i><br/>${escapeHtml(uiText('قفل', 'Lock'))}</div></div></div>`
      },
      {
        title: uiText('القارئ الذكي', 'Smart Reader'),
        text: uiText('يفتح الرابط نفسه أو الصورة نفسها، وبعدها يترجم ويشغّل الصوت فوق المحتوى.', 'Opens the exact link or image, then translates and reads it aloud.'),
        mock: `<div class="guide-mock"><div class="guide-mock-bar"><i class="fas fa-link"></i><span>${escapeHtml(uiText('رابط أو صورة', 'Page or image'))}</span><i class="fas fa-play"></i></div></div>`
      },
      {
        title: uiText('OCR والترجمة', 'OCR & Translation'),
        text: uiText('ارفع صورة، وسيطلع لك النص والترجمة داخل بطاقات وطبقات فوق الصورة.', 'Upload an image and get extracted text plus translated overlays.'),
        mock: `<div class="guide-mock"><div class="guide-mock-grid"><div class="guide-mock-btn"><i class="fas fa-image"></i><br/>OCR</div><div class="guide-mock-btn"><i class="fas fa-language"></i><br/>${escapeHtml(uiText('ترجمة', 'Translate'))}</div></div></div>`
      },
      {
        title: uiText('المتصفح والبحث', 'Browser & Search'),
        text: uiText('اكتب كلمة أو رابط، وافتحه داخل التطبيق أو خارجه أو انقله للقارئ مباشرة.', 'Search a term or URL, then open it inside the app, outside, or in Reader.'),
        mock: `<div class="guide-mock"><div class="guide-mock-bar"><i class="fas fa-magnifying-glass"></i><span>${escapeHtml(uiText('بحث سريع', 'Quick search'))}</span><i class="fas fa-globe"></i></div></div>`
      },
      {
        title: uiText('الملفات والاسترجاع', 'Files & Restore'),
        text: uiText('كل عنصر محفوظ صار له ملف JSON مستقل، ومعه سلة محذوفات وتراجع سريع واسترجاع مستقل.', 'Each saved item now has its own JSON file, plus quick undo and a separate restore bin.'),
        mock: `<div class="guide-mock"><div class="guide-mock-grid"><div class="guide-mock-btn"><i class="fas fa-folder"></i><br/>${escapeHtml(uiText('ملف', 'File'))}</div><div class="guide-mock-btn"><i class="fas fa-trash-can-arrow-up"></i><br/>${escapeHtml(uiText('استرجاع', 'Restore'))}</div></div></div>`
      }
    ];
    host.innerHTML = cards.map((card) => `<div class="visual-guide-card"><div class="guide-card-title">${escapeHtml(card.title)}</div>${card.mock}<div class="guide-card-text">${escapeHtml(card.text)}</div></div>`).join('');
  }

  function renderRecordsSummary() {
    const host = document.getElementById('recordsSummaryGrid');
    if (!host || !window.AppRecords) return;
    const counts = AppRecords.getCounts();
    const cards = [
      { key: 'all', label: uiText('كل الملفات', 'All files') },
      { key: 'search', label: uiText('ملفات البحث', 'Search files') },
      { key: 'browser', label: uiText('ملفات المتصفح', 'Browser files') },
      { key: 'reader', label: uiText('ملفات القارئ', 'Reader files') },
      { key: 'ocr', label: 'OCR' },
      { key: 'chat', label: uiText('ملفات الذكاء', 'AI files') },
      { key: 'trash', label: uiText('المحذوفات', 'Trash') }
    ];
    host.innerHTML = cards.map((card) => `
      <button class="record-summary-card" type="button" onclick="${card.key === 'trash' ? `toggleTrashBin()` : `setRecordTab('${card.key}', false)`}">
        <span class="record-summary-value">${escapeHtml(String(counts[card.key] || 0))}</span>
        <span class="record-summary-label">${escapeHtml(card.label)}</span>
      </button>`).join('');
  }

  function renderRecords() {
    const listHost = document.getElementById('toolRecordsList');
    const trashHost = document.getElementById('trashRecordsList');
    if (!listHost || !trashHost || !window.AppRecords) return;
    const items = AppRecords.list(state.recordTab);
    const trash = AppRecords.listTrash(state.recordTab);
    renderRecordsSummary();
    document.querySelectorAll('#recordTabs .record-tab').forEach((btn) => {
      const mapping = {
        'الكل': 'all',
        'All': 'all',
        'البحث': 'search',
        'Search': 'search',
        'المتصفح': 'browser',
        'Browser': 'browser',
        'القارئ': 'reader',
        'Reader': 'reader',
        'OCR': 'ocr',
        'الذكاء': 'chat',
        'AI Chat': 'chat'
      };
      btn.classList.toggle('active', mapping[btn.textContent.trim()] === state.recordTab);
    });
    const renderItem = (item, trashMode = false) => {
      const speechText = encodeURIComponent(getRecordSpeechText(item));
      return `
      <div class="record-item">
        <div class="record-head">
          <div class="record-title-wrap">
            <span class="record-tool-badge"><i class="fas fa-folder-open"></i> ${escapeHtml(formatToolName(item.tool))}</span>
            <div class="record-title">${escapeHtml(item.title || uiText('بدون عنوان', 'Untitled'))}</div>
            <div class="record-meta"><span class="record-time">${escapeHtml(formatDateLabel(item.updatedAt || item.createdAt))}</span></div>
            <div class="record-file-line"><i class="fas fa-file-lines"></i> ${escapeHtml(item.fileName || 'record.json')}</div>
          </div>
          <div class="record-actions">
            ${item.link ? `<button class="action-chip" onclick="window.open('${encodeURI(item.link)}','_blank')"><i class="fas fa-arrow-up-right-from-square"></i> ${escapeHtml(uiText('فتح', 'Open'))}</button>` : ''}
            <button class="action-chip" onclick="exportSingleRecord('${item.id}','${trashMode ? 'trash' : 'active'}')"><i class="fas fa-file-arrow-down"></i> ${escapeHtml(uiText('ملف', 'File'))}</button>
            ${getRecordSpeechText(item) ? `<button class="action-chip" data-text="${speechText}" onclick="TtsService.speak(decodeURIComponent(this.dataset.text))"><i class="fas fa-volume-high"></i> ${escapeHtml(uiText('صوت', 'Speak'))}</button>` : ''}
            ${!trashMode ? `<button class="action-chip" onclick="trashRecordItem('${item.id}')"><i class="fas fa-trash-can"></i> ${escapeHtml(uiText('حذف', 'Delete'))}</button>` : `<button class="action-chip" onclick="restoreRecordItem('${item.id}')"><i class="fas fa-rotate-left"></i> ${escapeHtml(uiText('استرجاع', 'Restore'))}</button><button class="action-chip" onclick="deleteRecordForever('${item.id}')"><i class="fas fa-trash"></i> ${escapeHtml(uiText('نهائي', 'Forever'))}</button>`}
          </div>
        </div>
        ${item.summary ? `<div class="record-summary">${escapeHtml(item.summary)}</div>` : ''}
        ${item.content ? `<div class="record-content">${escapeHtml(item.content)}</div>` : ''}
      </div>`;
    };

    listHost.innerHTML = items.length ? items.map((item) => renderItem(item, false)).join('') : `<div class="record-empty">${escapeHtml(uiText('ما فيه عناصر محفوظة لهذه الأداة حالياً.', 'No saved items for this tool yet.'))}</div>`;
    trashHost.innerHTML = trash.length ? trash.map((item) => renderItem(item, true)).join('') : `<div class="record-empty">${escapeHtml(uiText('سلة المحذوفات فاضية.', 'Trash is empty.'))}</div>`;
    document.getElementById('trashPanel')?.classList.toggle('hidden', !state.trashOpen);
  }

  function setRecordTab(tool = 'all', keepTrash = false) {
    state.recordTab = tool;
    if (!keepTrash) state.trashOpen = false;
    renderRecords();
  }

  function toggleTrashBin() {
    state.trashOpen = !state.trashOpen;
    renderRecords();
  }

  function trashRecordItem(id) {
    const ok = AppRecords?.trash(id);
    if (!ok) return;
    state.lastDeletedRecordId = id;
    showUndoBanner(uiText('تم نقل العنصر إلى سلة المحذوفات', 'Item moved to trash'));
    showToast(uiText('يمكنك التراجع خلال ثوانٍ', 'You can undo this for a few seconds'));
  }

  function undoLastDelete() {
    if (!state.lastDeletedRecordId) return;
    const ok = AppRecords?.restore(state.lastDeletedRecordId);
    if (ok) showToast(uiText('تم التراجع عن الحذف', 'Delete undone'));
    state.lastDeletedRecordId = '';
    hideUndoBanner();
  }

  function restoreRecordItem(id) {
    AppRecords?.restore(id);
    showToast(uiText('تم استرجاع العنصر', 'Item restored'));
  }

  function deleteRecordForever(id) {
    AppRecords?.removeForever(id);
    showToast(uiText('تم حذف العنصر نهائياً', 'Item deleted forever'));
  }

  function clearTrashForever() {
    AppRecords?.clearTrash();
    state.lastDeletedRecordId = '';
    hideUndoBanner();
    showToast(uiText('تم تنظيف سلة المحذوفات', 'Trash cleared'));
  }

  function exportSingleRecord(id, scope = 'active') {
    if (!window.AppRecords) return;
    const payload = AppRecords.exportRecord(id, scope);
    if (!payload) return showToast(uiText('تعذر تصدير الملف', 'Unable to export file'));
    downloadJsonFile(payload, payload.record.fileName || `record-${Date.now()}.json`);
    showToast(uiText('تم تصدير ملف العنصر', 'Item file exported'));
  }

  function exportRecordsFile() {
    if (!window.AppRecords) return;
    downloadJsonFile(AppRecords.exportAll(), `smart-reader-records-${Date.now()}.json`);
    showToast(uiText('تم تصدير ملف السجل', 'Records file exported'));
  }

  function handleRecordsImportInput(input) {
    const file = input?.files?.[0];
    if (!file || !window.AppRecords) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'));
        const imported = AppRecords.importData(data, 'merge');
        showToast(uiText(`تم استيراد ${imported.activeCount} ملف محفوظ`, `Imported ${imported.activeCount} saved files`));
        renderRecords();
      } catch (error) {
        showToast(uiText('ملف النسخة الاحتياطية غير صالح', 'Backup file is invalid'));
      } finally {
        input.value = '';
      }
    };
    reader.onerror = () => {
      input.value = '';
      showToast(uiText('تعذر قراءة ملف النسخة الاحتياطية', 'Unable to read backup file'));
    };
    reader.readAsText(file);
  }

  function openGuideCenter() {
    const wrap = document.createElement('div');
    wrap.className = 'app-modal-backdrop';
    wrap.innerHTML = `
      <div class="app-modal">
        <h2>${escapeHtml(uiText('الدليل التفاعلي للتطبيق', 'Interactive app guide'))}</h2>
        <p>${escapeHtml(uiText('أضفت لك شرح بصري احترافي يوضح وظيفة الأزرار الأساسية وكيفية استخدامها بشكل صحيح.', 'A polished visual guide now explains the main buttons and how to use them correctly.'))}</p>
        <div class="guide-center-grid">
          <div class="guide-demo-card">
            <div class="guide-demo-visual">
              <div class="guide-demo-top"><span class="guide-demo-dot"></span><span class="guide-demo-pill"></span></div>
              <div class="guide-demo-wide">${escapeHtml(uiText('شريط الرابط أو البحث', 'URL / search bar'))}</div>
              <div class="guide-demo-buttons"><div class="guide-demo-button">${escapeHtml(uiText('بحث', 'Search'))}</div><div class="guide-demo-button">${escapeHtml(uiText('فتح', 'Open'))}</div></div>
            </div>
            <strong>${escapeHtml(uiText('1) البحث أو إدخال الرابط', '1) Search or enter a URL'))}</strong>
            <div class="guide-card-text">${escapeHtml(uiText('المربع الطويل يستخدم للبحث أو للصق الرابط. بعدها تقدر تختار فتحه في المتصفح أو القارئ.', 'Use the long field for search or for pasting a URL, then open it in Browser or Reader.'))}</div>
          </div>
          <div class="guide-demo-card">
            <div class="guide-demo-visual">
              <div class="guide-demo-top"><span class="guide-demo-dot"></span><span class="guide-demo-pill"></span></div>
              <div class="guide-demo-buttons"><div class="guide-demo-button">OCR</div><div class="guide-demo-button">${escapeHtml(uiText('ترجمة', 'Translate'))}</div></div>
              <div class="guide-demo-wide">${escapeHtml(uiText('قراءة صوتية', 'Text to speech'))}</div>
            </div>
            <strong>${escapeHtml(uiText('2) الصورة والترجمة والصوت', '2) Image, translation, and voice'))}</strong>
            <div class="guide-card-text">${escapeHtml(uiText('عند رفع صورة، التطبيق يستخرج النص ويترجمه ويخلّي كل بطاقة قابلة للتشغيل الصوتي.', 'When you upload an image, the app extracts the text, translates it, and makes each card speakable.'))}</div>
          </div>
          <div class="guide-demo-card">
            <div class="guide-demo-visual">
              <div class="guide-demo-top"><span class="guide-demo-dot"></span><span class="guide-demo-pill"></span></div>
              <div class="guide-demo-buttons"><div class="guide-demo-button">${escapeHtml(uiText('ملفات الأدوات', 'Tool files'))}</div><div class="guide-demo-button">${escapeHtml(uiText('سلة المحذوفات', 'Trash bin'))}</div></div>
              <div class="guide-demo-wide">${escapeHtml(uiText('استرجاع أي عنصر محذوف', 'Restore deleted items'))}</div>
            </div>
            <strong>${escapeHtml(uiText('3) الحفظ والاسترجاع', '3) Save and restore'))}</strong>
            <div class="guide-card-text">${escapeHtml(uiText('كل عنصر محفوظ يتسجل كملف مستقل تقدر تصدره وحده، وأي حذف يصير تقدر تتراجع عنه أو تسترجعه من السلة.', 'Each saved item is stored as its own file that you can export separately, and every delete can be undone or restored from trash.'))}</div>
          </div>
        </div>
        <div class="modal-actions"><button class="save-btn" type="button" onclick="this.closest('.app-modal-backdrop').remove()">${escapeHtml(uiText('إغلاق', 'Close'))}</button></div>
      </div>`;
    document.body.appendChild(wrap);
  }

  window.setRecordTab = setRecordTab;
  window.toggleTrashBin = toggleTrashBin;
  window.trashRecordItem = trashRecordItem;
  window.restoreRecordItem = restoreRecordItem;
  window.deleteRecordForever = deleteRecordForever;
  window.clearTrashForever = clearTrashForever;
  window.undoLastDelete = undoLastDelete;
  window.hideUndoBanner = hideUndoBanner;
  window.exportSingleRecord = exportSingleRecord;
  window.exportRecordsFile = exportRecordsFile;
  window.handleRecordsImportInput = handleRecordsImportInput;
  window.openGuideCenter = openGuideCenter;

  function renderOverlayItems(items, width, height) {
    return items.map((item) => {
      const left = (item.bbox.x0 / width) * 100;
      const top = (item.bbox.y0 / height) * 100;
      const w = ((item.bbox.x1 - item.bbox.x0) / width) * 100;
      const h = ((item.bbox.y1 - item.bbox.y0) / height) * 100;
      const encodedText = encodeURIComponent(item.translated);
      return `<button class="ocr-overlay-item" data-text="${encodedText}" style="left:${left}%;top:${top}%;width:${Math.max(w, 10)}%;min-height:${Math.max(h, 5)}%;" onclick="TtsService.speak(decodeURIComponent(this.dataset.text))">${escapeHtml(item.translated)}</button>`;
    }).join('');
  }

  function makeTranslatePageUrl(url) {
    return `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(state.currentLang)}&u=${encodeURIComponent(url)}`;
  }

  async function fetchPageHtmlWithFallback(url) {
    const candidates = [
      { label: 'direct', url },
      { label: 'allorigins', url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` }
    ];
    for (const candidate of candidates) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 18000);
        const response = await fetch(candidate.url, { signal: controller.signal });
        clearTimeout(timer);
        if (!response.ok) continue;
        const html = await response.text();
        if (html && html.length > 300) return { html, via: candidate.label };
      } catch (error) {
        // try next source
      }
    }
    throw new Error(uiText('تعذر قراءة الصفحة من داخل التطبيق. تقدر تفتح النسخة الخارجية لو الموقع مانع القراءة.', 'Unable to read the page inside the app. You can open the external translated version if the site blocks reading.'));
  }

  function extractReadableBlocksFromHtml(html, sourceUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style,noscript,iframe,svg,canvas,header,footer,nav,form,aside,button,input,textarea,select,figure,img,video,audio,source').forEach((node) => node.remove());
    const title = (doc.querySelector('title')?.textContent || '').replace(/\s+/g, ' ').trim() || (() => { try { return new URL(sourceUrl).hostname; } catch (error) { return sourceUrl; } })();
    const roots = [...doc.querySelectorAll('main,article,[role="main"],.post,.article,.content,.entry-content')];
    const pool = roots.length ? roots : [doc.body].filter(Boolean);
    const candidates = [];
    pool.forEach((root) => {
      root.querySelectorAll('h1,h2,h3,p,li,blockquote').forEach((node) => {
        const text = String(node.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length >= 40) candidates.push(text);
      });
    });
    const normalized = [];
    const seen = new Set();
    const noise = /(cookie|privacy|subscribe|newsletter|advert|sponsored|login|sign up)/i;
    candidates.forEach((text) => {
      if (noise.test(text)) return;
      const key = text.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      normalized.push(text);
    });
    if (!normalized.length && doc.body) {
      String(doc.body.innerText || '').split(/\n+/).map((line) => line.replace(/\s+/g, ' ').trim()).filter((line) => line.length >= 50).slice(0, 18).forEach((line) => {
        const key = line.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          normalized.push(line);
        }
      });
    }
    return {
      title,
      blocks: normalized.slice(0, 24),
      totalChars: normalized.slice(0, 24).reduce((sum, item) => sum + item.length, 0)
    };
  }

  function renderPageTranslateFallback(targetId, source, message) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const encodedSource = encodeURIComponent(source);
    const encodedTranslated = encodeURIComponent(makeTranslatePageUrl(source));
    target.innerHTML = `
      <div class="page-translate-empty">
        <div>
          <div class="rv-empty-icon"><i class="fas fa-language"></i></div>
          <h3>${escapeHtml(uiText('تعذر بناء ترجمة داخلية للصفحة', 'Could not build an in-app translation'))}</h3>
          <p>${escapeHtml(message)}</p>
          <div class="guide-actions-row">
            <button class="save-btn" data-url="${encodedTranslated}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')"><i class="fas fa-arrow-up-right-from-square"></i> ${escapeHtml(uiText('فتح النسخة المترجمة خارجياً', 'Open translated version externally'))}</button>
            <button class="ocr-ctrl-btn" data-url="${encodedSource}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')"><i class="fas fa-globe"></i> ${escapeHtml(getText('openExternal'))}</button>
          </div>
        </div>
      </div>`;
  }

  function renderCleanReaderResult(targetId, payload) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const encodedSource = encodeURIComponent(payload.source);
    target.innerHTML = `
      <div class="clean-reader-view">
        <div class="clean-reader-head glass-card">
          <span class="pro-badge"><i class="fas fa-align-left"></i> ${escapeHtml(uiText('وضع القراءة النظيف', 'Clean reader mode'))}</span>
          <h3>${escapeHtml(payload.title)}</h3>
          <p>${escapeHtml(uiText('هذا العرض ينظف الصفحة ويستخرج النص الأساسي فقط عشان القراءة تكون أسهل على الجوال.', 'This view cleans the page and extracts only the main text so reading is easier on mobile.'))}</p>
          <div class="guide-actions-row">
            <button class="save-btn" data-url="${encodedSource}" onclick="readerLoad(decodeURIComponent(this.dataset.url))"><i class="fas fa-book-open-reader"></i> ${escapeHtml(uiText('فتح الأصل', 'Open original'))}</button>
            <button class="ocr-ctrl-btn" data-url="${encodedSource}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')"><i class="fas fa-arrow-up-right-from-square"></i> ${escapeHtml(getText('openExternal'))}</button>
          </div>
        </div>
        <div class="clean-reader-blocks">${payload.items.map((item) => `<div class="clean-reader-card">${escapeHtml(item)}</div>`).join('')}</div>
      </div>`;
  }

  async function browserOpenCleanReader() {
    const source = state.browser.currentUrl || document.getElementById('browserAddressBar')?.value || '';
    if (!source) return showToast(getText('noActivePage'));
    navigateTo('screenReader');
    document.getElementById('readerUrlInput').value = source;
    showTaskProgress(uiText('وضع القراءة النظيف', 'Clean reader mode'), 8, uiText('جارٍ تنظيف الصفحة', 'Cleaning page'));
    try {
      const page = await fetchPageHtmlWithFallback(source);
      updateTaskProgress(42, uiText('تم جلب الصفحة', 'Page fetched'), uiText('وضع القراءة النظيف', 'Clean reader mode'));
      const extracted = extractReadableBlocksFromHtml(page.html, source);
      if (!extracted.blocks.length) throw new Error(uiText('ما لقيت نصاً مناسباً للقراءة النظيفة.', 'No suitable readable text was found.'));
      renderCleanReaderResult('readerWebview', { source, title: extracted.title, items: extracted.blocks });
      saveToolRecord('reader', {
        title: `${extracted.title} — ${uiText('وضع نظيف', 'Clean mode')}`,
        summary: truncateText(extracted.blocks.join(' • '), 180),
        content: truncateText(extracted.blocks.join('\n\n'), 1800),
        link: source
      });
      state.currentReaderMode = 'clean-reader';
      state.currentReaderSource = source;
      updateTaskProgress(100, getText('taskDone'), uiText('وضع القراءة النظيف', 'Clean reader mode'));
      hideTaskProgress();
    } catch (error) {
      hideTaskProgress(0);
      renderPageTranslateFallback('readerWebview', source, error?.message || uiText('تعذر فتح الوضع النظيف.', 'Could not open clean mode.'));
      showToast(error?.message || getText('browserError'));
    }
  }
  window.browserOpenCleanReader = browserOpenCleanReader;

  function renderTranslatedPageResult(targetId, payload) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const encodedSource = encodeURIComponent(payload.source);
    const encodedTranslated = encodeURIComponent(makeTranslatePageUrl(payload.source));
    const cards = payload.items.map((item) => `
      <div class="page-translate-card">
        <div class="page-translate-translated">${escapeHtml(item.translated)}</div>
        <div class="page-translate-original">${escapeHtml(item.source)}</div>
      </div>`).join('');
    target.innerHTML = `
      <div class="page-translate-view">
        <div class="page-translate-hero glass-card">
          <div class="page-translate-head">
            <div>
              <span class="pro-badge"><i class="fas fa-language"></i> ${escapeHtml(uiText('ترجمة صفحة ذكية', 'Smart page translation'))}</span>
              <h3>${escapeHtml(payload.title)}</h3>
              <p>${escapeHtml(uiText('بدل صفحة Google Translate المكسورة داخل التطبيق، صارت الترجمة تعرض النص الأساسي مباشرة داخل القارئ بشكل نظيف ومقروء.', 'Instead of the broken Google Translate page inside the app, the translation now shows the core page text directly in a clean reader view.'))}</p>
            </div>
            <div class="page-translate-action-stack">
              <button class="save-btn" data-url="${encodedSource}" onclick="readerLoad(decodeURIComponent(this.dataset.url))"><i class="fas fa-book-open-reader"></i> ${escapeHtml(uiText('عرض الأصل', 'View original'))}</button>
              <button class="ocr-ctrl-btn" data-url="${encodedTranslated}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')"><i class="fas fa-arrow-up-right-from-square"></i> ${escapeHtml(uiText('فتح ترجمة Google خارجياً', 'Open Google translation externally'))}</button>
              <button class="ocr-ctrl-btn" data-url="${encodedSource}" onclick="window.open(decodeURIComponent(this.dataset.url), '_blank')"><i class="fas fa-globe"></i> ${escapeHtml(getText('openExternal'))}</button>
            </div>
          </div>
          <div class="ocr-meta">
            <span class="meta-pill">${escapeHtml(uiText('الفقرات', 'Blocks'))}: ${escapeHtml(String(payload.items.length))}</span>
            <span class="meta-pill">${escapeHtml(uiText('اللغة', 'Language'))}: ${escapeHtml(state.currentLang.toUpperCase())}</span>
            <span class="meta-pill">${escapeHtml(uiText('الوضع', 'Mode'))}: ${escapeHtml(payload.via)}</span>
          </div>
        </div>
        <div class="page-translate-grid">${cards}</div>
      </div>`;
  }

  async function translatePageIntoReader(source, targetId = 'readerWebview') {
    showTaskProgress(getText('translatePage'), 6, uiText('جارٍ قراءة الصفحة', 'Reading page'));
    try {
      const page = await fetchPageHtmlWithFallback(source);
      updateTaskProgress(32, uiText('تم جلب المحتوى', 'Content fetched'), getText('translatePage'));
      const extracted = extractReadableBlocksFromHtml(page.html, source);
      if (!extracted.blocks.length) throw new Error(uiText('ما قدرت أستخرج نصاً واضحاً من الصفحة الحالية.', 'Could not extract readable text from the current page.'));
      updateTaskProgress(54, uiText('جارٍ تجهيز النصوص', 'Preparing text'), getText('translatePage'));
      const translated = await AiTranslate.translateBatch(extracted.blocks, state.currentLang);
      const items = extracted.blocks.map((block, index) => ({ source: block, translated: translated[index] || block }));
      renderTranslatedPageResult(targetId, { source, title: extracted.title, via: page.via === 'allorigins' ? 'Smart proxy' : 'Direct read', items });
      saveToolRecord('reader', {
        title: extracted.title || source,
        summary: truncateText(items.map((item) => item.translated).join(' • '), 180),
        content: truncateText(items.map((item) => `${item.translated}\n${item.source}`).join('\n\n'), 1800),
        link: source
      });
      AppConfig.incrementStat('translations', 1);
      state.currentReaderMode = 'page-translation';
      state.currentReaderSource = source;
      updateTaskProgress(100, getText('taskDone'), getText('translatePage'));
      hideTaskProgress();
      if (state.autoTts && items.length) TtsService.speakAll(items.slice(0, 4).map((item) => item.translated));
    } catch (error) {
      hideTaskProgress(0);
      renderPageTranslateFallback(targetId, source, error?.message || uiText('تعذر ترجمة الصفحة حالياً.', 'Unable to translate this page right now.'));
      showToast(error?.message || getText('browserError'));
    }
  }

  function clearFrameShield(iframe) {
    if (iframe?._sprShieldTimer) {
      clearInterval(iframe._sprShieldTimer);
      iframe._sprShieldTimer = null;
    }
  }

  function installFrameShield(iframe) {
    if (!iframe) return;
    clearFrameShield(iframe);
    const sweep = () => {
      try {
        AdBlock.runOnPage(iframe.contentDocument);
      } catch (error) {
        clearFrameShield(iframe);
      }
    };
    setTimeout(sweep, 250);
    iframe._sprShieldTimer = setInterval(sweep, 1500);
  }

  function renderReaderPage(url, sourceUrl = url) {
    const host = document.getElementById('readerWebview');
    if (!host) return;
    state.currentReaderMode = 'page';
    state.currentReaderSource = sourceUrl;
    saveToolRecord('reader', {
      title: sourceUrl,
      summary: uiText('تم حفظ صفحة في ملف القارئ.', 'A page was saved in the Reader file.'),
      content: sourceUrl,
      link: sourceUrl
    });
    host.innerHTML = `
      <div class="reader-iframe-wrap">
        <iframe id="readerFrame" class="reader-frame" referrerpolicy="no-referrer" sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation-by-user-activation" src="${url}"></iframe>
      </div>
      <div class="browser-info-card reader-floating-info">
        <strong>${escapeHtml(getText('pageExact'))}</strong>
        <p>${escapeHtml(getText('browserBlocked'))}</p>
        <div class="reader-floating-actions">
          <button class="action-chip" onclick="readerTranslatePage()">${escapeHtml(getText('translatePage'))}</button>
          <button class="action-chip" onclick="openExternal()">${escapeHtml(getText('openExternal'))}</button>
        </div>
      </div>`;
    const frame = document.getElementById('readerFrame');
    if (frame) {
      frame.addEventListener('load', () => installFrameShield(frame), { passive: true });
      frame.addEventListener('error', () => showToast(getText('browserError')), { passive: true });
    }
  }

  function translateReaderCurrent() {
    if (!state.currentReaderSource) return showToast(getText('noActivePage'));
    return looksLikeImageUrl(state.currentReaderSource) ? readerTranslateImage() : readerTranslatePage();
  }

  async function readerTranslateImage() {
    const source = state.currentReaderSource || document.getElementById('readerUrlInput')?.value || '';
    if (!source) return showToast(getText('noActivePage'));
    if (!looksLikeImageUrl(source)) return showToast(getText('noImageToTranslate'));
    showTaskProgress(getText('translateImage'), 6, getText('taskPreparing'));
    try {
      const data = await OcrService.process(source, {
        lang: state.currentLang,
        onProgress: ({ percent, status }) => updateTaskProgress(percent, humanizeOcrStatus(status), getText('translateImage'))
      });
      await renderImageResult('readerWebview', data, getText('imageExact'));
      saveToolRecord('reader', {
        title: uiText('ترجمة صورة داخل القارئ', 'Reader image translation'),
        summary: truncateText(data.items.map((item) => item.translated).join(' • '), 180),
        content: truncateText(data.rawText || data.items.map((item) => item.source).join('\n\n'), 1200),
        link: source
      });
      updateTaskProgress(100, getText('taskDone'), getText('translateImage'));
      hideTaskProgress();
      if (state.autoTts && data.items.length) TtsService.speakAll(data.items.slice(0, 6).map((item) => item.translated));
    } catch (error) {
      hideTaskProgress(0);
      showToast(error?.message || getText('browserError'));
    }
  }

  async function readerTranslatePage() {
    const source = state.currentReaderSource || document.getElementById('readerUrlInput')?.value || '';
    if (!source) return showToast(getText('noActivePage'));
    if (looksLikeImageUrl(source)) return readerTranslateImage();
    showToast(getText('translatingPage'));
    await translatePageIntoReader(source, 'readerWebview');
  }

  async function browserTranslateCurrent() {
    const source = state.browser.currentUrl || document.getElementById('browserAddressBar')?.value || '';
    if (!source) return showToast(getText('noActivePage'));
    if (looksLikeImageUrl(source)) return readerLoad(source);
    showToast(getText('translatingPage'));
    navigateTo('screenReader');
    document.getElementById('readerUrlInput').value = source;
    await translatePageIntoReader(source, 'readerWebview');
  }

  async function renderImageResult(targetId, data, modeLabel) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const listHtml = data.items.length
      ? data.items.map((item) => `
          <button class="ocr-text-card" data-text="${encodeURIComponent(item.translated)}" onclick="TtsService.speak(decodeURIComponent(this.dataset.text))">
            <strong>${escapeHtml(item.translated)}</strong>
            <span>${escapeHtml(item.source)}</span>
          </button>`).join('')
      : `<div class="help-card">${escapeHtml(getText('noTextFound'))}</div>`;

    target.innerHTML = `
      <div class="reader-image-stage dual-pane-stage">
        <div class="reader-image-shell">
          <img src="${data.imageSrc}" alt="OCR image" />
          ${renderOverlayItems(data.items, data.width, data.height)}
        </div>
        <div class="reader-side-panel">
          <div class="browser-info-card">
            <div class="ocr-meta">
              <span class="meta-pill">${escapeHtml(getText('exactMode'))}</span>
              <span class="meta-pill">${escapeHtml(modeLabel)}</span>
              <span class="meta-pill">${escapeHtml(getText('translatedTo'))}: ${escapeHtml(state.currentLang.toUpperCase())}</span>
            </div>
            <p>${escapeHtml(getText('readerIntro'))}</p>
          </div>
          ${listHtml}
        </div>
      </div>`;
  }

  async function readerLoad(inputUrl) {
    navigateTo('screenReader');
    const raw = inputUrl || document.getElementById('readerUrlInput')?.value || '';
    if (!raw.trim()) return showToast(getText('invalidUrl'));
    const normalized = normalizeUrl(raw, false);
    if (!normalized) return showToast(getText('invalidUrl'));
    document.getElementById('readerUrlInput').value = normalized;
    state.currentReaderSource = normalized;
    const host = document.getElementById('readerWebview');
    host.innerHTML = `<div class="rv-empty"><div class="rv-empty-icon"><i class="fas fa-spinner fa-spin"></i></div><h3>${escapeHtml(getText(looksLikeImageUrl(normalized) ? 'imageLoading' : 'readerLoading'))}</h3></div>`;
    AppConfig.incrementStat('pages', 1);
    saveRecentItem(normalized);

    if (looksLikeImageUrl(normalized)) {
      state.currentReaderMode = 'image';
      try {
        showTaskProgress(getText('translateImage'), 6, getText('taskPreparing'));
        const data = await OcrService.process(normalized, { lang: state.currentLang, onProgress: ({ percent, status }) => updateTaskProgress(percent, humanizeOcrStatus(status), getText('translateImage')) });
        await renderImageResult('readerWebview', data, getText('imageExact'));
        saveToolRecord('reader', {
          title: uiText('صورة مفتوحة في القارئ', 'Image opened in Reader'),
          summary: truncateText(data.items.map((item) => item.translated).join(' • '), 180),
          content: truncateText(data.rawText || data.items.map((item) => item.source).join('\n\n'), 1200),
          link: normalized
        });
        updateTaskProgress(100, getText('taskDone'), getText('translateImage'));
        hideTaskProgress();
        if (state.autoTts && data.items.length) TtsService.speakAll(data.items.slice(0, 6).map((item) => item.translated));
      } catch (error) {
        hideTaskProgress(0);
        host.innerHTML = `<div class="rv-empty"><div class="rv-empty-icon"><i class="fas fa-triangle-exclamation"></i></div><h3>${escapeHtml(getText('browserError'))}</h3><p>${escapeHtml(error.message || '')}</p></div>`;
      }
      return;
    }

    renderReaderPage(normalized);
  }
  window.readerLoad = readerLoad;
  window.translateReaderCurrent = translateReaderCurrent;
  window.readerTranslateImage = readerTranslateImage;
  window.readerTranslatePage = readerTranslatePage;
  window.browserTranslateCurrent = browserTranslateCurrent;

  function openLangMenu() {
    document.getElementById('langPopup')?.classList.toggle('open');
  }

  function setLanguage(lang, persist = true) {
    const code = sanitizeLang(lang);
    applyI18n(code);
    if (persist) AppConfig.set({ defaultLang: code });
    showToast(`${getText('languageChanged')}: ${code.toUpperCase()}`);
    if (state.currentReaderMode === 'image' && state.currentReaderSource) readerLoad(state.currentReaderSource);
    if (state.currentOcrData?.source) processOcrSource(state.currentOcrData.source);
  }

  function setReaderLang(code) {
    document.getElementById('langPopup')?.classList.remove('open');
    setLanguage(code, true);
  }
  window.openLangMenu = openLangMenu;
  window.setReaderLang = setReaderLang;

  async function processOcrSource(source) {
    const preview = document.getElementById('ocrPreview');
    if (!preview) return;
    preview.innerHTML = `<div class="rv-empty"><div class="rv-empty-icon"><i class="fas fa-spinner fa-spin"></i></div><h3>${escapeHtml(getText('imageLoading'))}</h3></div>`;
    try {
      showTaskProgress(getText('translateImage'), 6, getText('taskPreparing'));
      const data = await OcrService.process(source, { lang: state.currentLang, onProgress: ({ percent, status }) => updateTaskProgress(percent, humanizeOcrStatus(status), getText('translateImage')) });
      state.currentOcrData = { source, data };
      preview.innerHTML = `
        <div class="ocr-image-stage dual-pane-stage">
          <div class="ocr-image-shell"><img src="${data.imageSrc}" alt="OCR" />${renderOverlayItems(data.items, data.width, data.height)}</div>
          <div class="ocr-side-panel">${data.items.length ? data.items.map((item) => `<button class="ocr-text-card" data-text="${encodeURIComponent(item.translated)}" onclick="TtsService.speak(decodeURIComponent(this.dataset.text))"><strong>${escapeHtml(item.translated)}</strong><span>${escapeHtml(item.source)}</span></button>`).join('') : `<div class="help-card">${escapeHtml(getText('noTextFound'))}</div>`}</div>
        </div>`;
      document.getElementById('ocrSpeakAllBtn').style.display = data.items.length ? 'inline-flex' : 'none';
      saveToolRecord('ocr', {
        title: uiText('نتيجة OCR جديدة', 'New OCR result'),
        summary: truncateText(data.items.map((item) => item.translated).join(' • '), 180),
        content: truncateText(data.rawText || data.items.map((item) => item.source).join('\n\n'), 1200)
      });
      updateTaskProgress(100, getText('taskDone'), getText('translateImage'));
      hideTaskProgress();
      if (state.autoTts && data.items.length) TtsService.speakAll(data.items.slice(0, 8).map((item) => item.translated));
    } catch (error) {
      hideTaskProgress(0);
      preview.innerHTML = `<div class="rv-empty"><div class="rv-empty-icon"><i class="fas fa-triangle-exclamation"></i></div><h3>${escapeHtml(getText('browserError'))}</h3><p>${escapeHtml(error.message || '')}</p></div>`;
    }
  }

  function handleOcrFileInput(input) {
    if (input.files?.[0]) processOcrSource(input.files[0]);
  }

  function handleOcrDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag');
    if (event.dataTransfer.files?.[0]) processOcrSource(event.dataTransfer.files[0]);
  }

  function ocrSpeakAll() {
    const texts = state.currentOcrData?.data?.items?.map((item) => item.translated) || [];
    TtsService.speakAll(texts);
  }
  window.handleOcrFileInput = handleOcrFileInput;
  window.handleOcrDrop = handleOcrDrop;
  window.ocrSpeakAll = ocrSpeakAll;

  function setScript(button) {
    const script = button?.dataset.script || 'latin';
    localStorage.setItem('spr.ocrScript', script);
    AppConfig.set({ ocrScript: script });
    document.querySelectorAll('.script-pill').forEach((el) => el.classList.toggle('active', el.dataset.script === script));
    if (state.currentOcrData?.source) processOcrSource(state.currentOcrData.source);
  }
  window.setScript = setScript;

  function toggleAutoTTS() {
    state.autoTts = !state.autoTts;
    AppConfig.set({ autoTts: state.autoTts });
    document.getElementById('ttsToggleBtn')?.classList.toggle('active', state.autoTts);
    showToast(getText(state.autoTts ? 'ttsOn' : 'ttsOff'));
  }
  window.toggleAutoTTS = toggleAutoTTS;
  window.stopTTS = () => TtsService.stop();

  function appendChat(role, text) {
    const box = document.getElementById('chatMessages');
    if (!box) return;
    const user = role === 'user';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = `<div class="bubble-avatar"><i class="fas ${user ? 'fa-user' : 'fa-brain'}"></i></div><div class="bubble-content glass-card"><p class="bubble-text">${escapeHtml(text)}</p><div class="bubble-actions"><button class="action-chip" data-text="${encodeURIComponent(text)}" onclick="TtsService.speak(decodeURIComponent(this.dataset.text))"><i class="fas fa-volume-high"></i> ${escapeHtml(uiText('صوت', 'Speak'))}</button></div></div>`;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
  }

  function getAssistantReply(message) {
    const msg = String(message || '').toLowerCase();
    if (msg.includes('api') || msg.includes('مفتاح')) return getText('apiNote');
    if (msg.includes('ocr') || msg.includes('صورة') || msg.includes('مانجا')) {
      return state.currentLang === 'ar'
        ? 'ارفع الصورة من شاشة OCR أو الصق رابط الصورة في Reader. التطبيق سيحلل نفس الصورة ويعرض النص المستخرج والترجمة فوقها.'
        : 'Upload the image in OCR or paste the direct image URL into Reader. The app will analyze that same image and overlay extracted text.';
    }
    if (msg.includes('reader') || msg.includes('القارئ') || msg.includes('browser') || msg.includes('متصفح')) return getText('assistantHelp');
    if (msg.includes('حفظ') || msg.includes('استرجاع') || msg.includes('restore') || msg.includes('backup')) {
      return state.currentLang === 'ar'
        ? 'من الإعدادات تقدر تلاقي ملف مستقل لكل عنصر محفوظ، وتصدره لوحده أو تعمل نسخة احتياطية كاملة، وكمان عندك سلة محذوفات مع تراجع سريع واسترجاع.'
        : 'In Settings, you can export each saved item as its own file, back up everything, import it again, and restore or undo deleted items.';
    }
    if (msg.includes('ترجمة') || msg.includes('translation')) {
      return state.currentLang === 'ar'
        ? 'الترجمة حالياً فيها أكثر من مسار بديل: Backend ثم OpenAI عند إضافة المفتاح ثم Google API ثم LibreTranslate ثم Google public ثم MyMemory، مع كاش وتحسين للنصوص الطويلة والمتكررة.'
        : 'Translation now uses multiple fallbacks: Backend, Google API, LibreTranslate, Google public, and MyMemory for better reliability.';
    }
    if (msg.includes('لغة') || msg.includes('language')) {
      return state.currentLang === 'ar'
        ? 'غيّر اللغة من الإعدادات أو من زر اللغة داخل Reader، وستتغير الواجهة والترجمة والصوت على حسب اللغة المختارة.'
        : 'Change the language from Settings or from the Reader language button, and the UI, translation, and voice will follow the selected language.';
    }
    return getText('assistantHello');
  }

  function sendMessage() {
    const input = document.getElementById('chatInput');
    const value = input?.value.trim();
    if (!value) return;
    appendChat('user', value);
    input.value = '';
    const reply = getAssistantReply(value);
    saveToolRecord('chat', {
      title: truncateText(value, 70),
      summary: truncateText(reply, 180),
      content: `${uiText('سؤال', 'Question')}: ${value}\n\n${uiText('رد', 'Reply')}: ${reply}`
    });
    setTimeout(() => appendChat('ai', reply), 250);
  }

  function handleChatKey(event) { if (event.key === 'Enter') sendMessage(); }
  function sendQuick(text) { document.getElementById('chatInput').value = text; sendMessage(); }
  function clearChat() {
    const box = document.getElementById('chatMessages');
    if (!box) return;
    box.innerHTML = `<div class="chat-bubble ai-bubble"><div class="bubble-avatar"><i class="fas fa-brain"></i></div><div class="bubble-content glass-card"><p class="bubble-text">${escapeHtml(getText('welcomeBubble'))}</p><ul class="help-list">${getText('welcomeList').map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="bubble-actions"><button class="action-chip" data-text="${encodeURIComponent(getText('assistantHello'))}" onclick="TtsService.speak(decodeURIComponent(this.dataset.text))"><i class="fas fa-volume-high"></i> ${escapeHtml(uiText('صوت', 'Speak'))}</button></div></div></div>`;
  }
  window.sendMessage = sendMessage;
  window.handleChatKey = handleChatKey;
  window.sendQuick = sendQuick;
  window.clearChat = clearChat;

  function updateBrowserButtons() {
    document.getElementById('btnBack').disabled = state.browser.index <= 0;
    document.getElementById('btnFwd').disabled = state.browser.index >= state.browser.history.length - 1;
  }

  function setBrowserError(show, message) {
    const page = document.getElementById('browserErrorPage');
    if (!page) return;
    page.style.display = show ? 'grid' : 'none';
    setText('#browserErrorMsg', message || getText('browserError'));
  }

  function setBrowserProgress(active) {
    const bar = document.getElementById('browserProgressBar');
    const label = document.getElementById('browserProgressLabel');
    if (!bar) return;
    clearInterval(state.browser.timer);
    if (!active) {
      state.browserProgressValue = 100;
      bar.style.width = '100%';
      if (label) label.textContent = '100%';
      setTimeout(() => {
        bar.style.width = '0%';
        if (label) label.textContent = '0%';
      }, 420);
      return;
    }
    let width = 4;
    state.browserProgressValue = width;
    bar.style.width = '4%';
    if (label) label.textContent = '4%';
    state.browser.timer = setInterval(() => {
      width = Math.min(width + Math.random() * 18, 92);
      state.browserProgressValue = width;
      bar.style.width = `${width}%`;
      if (label) label.textContent = `${Math.round(width)}%`;
    }, 160);
  }

  function updateBrowserFavicon(url) {
    const box = document.getElementById('browserFavicon');
    if (!box) return;
    try {
      const host = new URL(url).hostname;
      box.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64" alt="icon" style="width:18px;height:18px;border-radius:999px" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\'fas fa-globe\'></i>'" />`;
    } catch (error) {
      box.innerHTML = '<i class="fas fa-globe"></i>';
    }
  }

  function renderBrowserImageOverlay(url) {
    const box = document.getElementById('browserImageOverlay');
    if (!box) return;
    if (!url || !looksLikeImageUrl(url)) {
      box.innerHTML = '';
      return;
    }
    box.innerHTML = `<button class="browser-image-chip" onclick="readerLoad('${encodeURI(url)}')"><i class="fas fa-image"></i> ${escapeHtml(getText('translateImage'))}</button>`;
  }

  function browserLoad(rawUrl, fromHistory = false) {
    const inputValue = String(rawUrl || document.getElementById('browserAddressBar')?.value || '').trim();
    const url = normalizeUrl(inputValue, true, 'duckduckgo');
    if (!url) return showToast(getText('invalidUrl'));
    state.browser.currentUrl = url;
    const input = document.getElementById('browserAddressBar');
    if (input) input.value = url;
    document.getElementById('browserStartPage').style.display = 'none';
    setBrowserError(false);
    setBrowserProgress(true);
    updateBrowserFavicon(url);
    const iframe = document.getElementById('browserIframe');
    iframe.src = url;
    if (!fromHistory) {
      state.browser.history = state.browser.history.slice(0, state.browser.index + 1);
      state.browser.history.push(url);
      state.browser.index = state.browser.history.length - 1;
    }
    updateBrowserButtons();
    AppConfig.incrementStat('pages', 1);
    saveRecentItem(inputValue || url);
    saveToolRecord('browser', {
      title: inputValue || url,
      summary: uiText('تم حفظ صفحة في ملف المتصفح.', 'A page was saved in the Browser file.'),
      content: url,
      link: url
    });
    renderBrowserSuggestions();
    renderBrowserImageOverlay(url);
    onAddressBarInput();
  }

  function browserSearch() { browserLoad(document.getElementById('browserAddressBar')?.value || ''); }
  function browserReload() { if (state.browser.currentUrl) browserLoad(state.browser.currentUrl, true); }
  function browserGoBack() { if (state.browser.index > 0) { state.browser.index -= 1; browserLoad(state.browser.history[state.browser.index], true); } }
  function browserGoForward() { if (state.browser.index < state.browser.history.length - 1) { state.browser.index += 1; browserLoad(state.browser.history[state.browser.index], true); } }
  function browserHome() {
    document.getElementById('browserIframe').src = 'about:blank';
    document.getElementById('browserStartPage').style.display = 'grid';
    setBrowserError(false);
    state.browser.currentUrl = '';
    document.getElementById('browserAddressBar').value = '';
    updateBrowserFavicon('');
    onAddressBarInput();
    renderBrowserSuggestions();
    renderBrowserImageOverlay('');
  }
  function openExternal() { if (state.browser.currentUrl || state.currentReaderSource) window.open(state.browser.currentUrl || state.currentReaderSource, '_blank'); }
  function browserOpenInReader() { if (state.browser.currentUrl) readerLoad(state.browser.currentUrl); }
  function handleBrowserKey(event) { if (event.key === 'Enter') browserSearch(); }
  function onAddressBarInput() { document.getElementById('browserClearBtn').style.display = document.getElementById('browserAddressBar').value ? 'inline-flex' : 'none'; }
  function onAddressBarFocus() { state.lastFocusedInput = document.getElementById('browserAddressBar'); }
  function onAddressBarBlur() {}
  function clearAddressBar() { const input = document.getElementById('browserAddressBar'); input.value = ''; onAddressBarInput(); }
  window.browserLoad = browserLoad;
  window.browserSearch = browserSearch;
  window.browserReload = browserReload;
  window.browserGoBack = browserGoBack;
  window.browserGoForward = browserGoForward;
  window.browserHome = browserHome;
  window.openExternal = openExternal;
  window.browserOpenInReader = browserOpenInReader;
  window.browserOpenCleanReader = browserOpenCleanReader;
  window.handleBrowserKey = handleBrowserKey;
  window.onAddressBarInput = onAddressBarInput;
  window.onAddressBarFocus = onAddressBarFocus;
  window.onAddressBarBlur = onAddressBarBlur;
  window.clearAddressBar = clearAddressBar;

  function toggleKeyVis(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    input.style.webkitTextSecurity = input.type === 'text' ? 'none' : 'disc';
  }

  function changeTtsRate(value) {
    setText('#cfgTtsRateVal', `${Number(value).toFixed(2)}x`);
    TtsService.setRate(value);
  }

  document.getElementById('cfgAiPrivacy')?.addEventListener('change', (event) => { AppConfig.set({ aiPrivacyMode: event.target.checked }); state.chatPrivateLocked = event.target.checked; updateAiPrivateUI(); });
  document.getElementById('cfgAdShield')?.addEventListener('change', (event) => { AppConfig.set({ adShield: event.target.checked }); const proAds = document.getElementById('proAds'); if (proAds) proAds.checked = event.target.checked; showToast(event.target.checked ? uiText('تم تفعيل مانع الإعلانات', 'Ad shield enabled') : uiText('تم إيقاف مانع الإعلانات', 'Ad shield disabled')); });

  function setTheme(theme) {
    AppConfig.set({ theme });
    updateConfigUI();
  }
  window.toggleKeyVis = toggleKeyVis;
  window.changeTtsRate = changeTtsRate;
  window.setTheme = setTheme;

  function startVoiceSearch(event) {
    event?.preventDefault?.();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return showToast(getText('voiceUnsupported'));
    const rec = new SpeechRecognition();
    rec.lang = getLanguageMeta(state.currentLang).locale || 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript || '';
      const input = state.lastFocusedInput || document.getElementById('searchInput');
      if (input) input.value = text;
      showToast(text);
    };
    rec.start();
  }
  window.startVoiceSearch = startVoiceSearch;

  function showOnboarding() {
    if (!AppConfig.state.firstRun) return;
    const t = getDictionary(state.currentLang);
    const wrap = document.createElement('div');
    wrap.className = 'app-modal-backdrop';
    wrap.id = 'onboardingModal';
    wrap.innerHTML = `
      <div class="app-modal">
        <h2>${escapeHtml(t.onboardingTitle)}</h2>
        <p>${escapeHtml(t.onboardingBody)}</p>
        <div class="modal-grid">
          <div class="modal-card"><h3>${escapeHtml(t.doesTitle)}</h3><ul>${t.doesList.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
          <div class="modal-card"><h3>${escapeHtml(t.doesntTitle)}</h3><ul>${t.doesntList.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
          <div class="modal-card"><h3>${escapeHtml(t.useTitle)}</h3><ul>${t.useList.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        </div>
        <div class="guide-center-grid" style="margin-top:16px">
          <div class="guide-demo-card">
            <div class="guide-demo-visual">
              <div class="guide-demo-top"><span class="guide-demo-dot"></span><span class="guide-demo-pill"></span></div>
              <div class="guide-demo-wide">${escapeHtml(uiText('شريط البحث والرابط', 'Search and URL bar'))}</div>
              <div class="guide-demo-buttons"><div class="guide-demo-button">${escapeHtml(uiText('بحث', 'Search'))}</div><div class="guide-demo-button">${escapeHtml(uiText('فتح', 'Open'))}</div></div>
            </div>
            <div class="guide-card-text">${escapeHtml(uiText('هذا الشكل يشرح للمستخدم مكان الكتابة ومكان الفتح السريع.', 'This visual explains where to type and how to open content quickly.'))}</div>
          </div>
          <div class="guide-demo-card">
            <div class="guide-demo-visual">
              <div class="guide-demo-top"><span class="guide-demo-dot"></span><span class="guide-demo-pill"></span></div>
              <div class="guide-demo-buttons"><div class="guide-demo-button">OCR</div><div class="guide-demo-button">${escapeHtml(uiText('ترجمة', 'Translate'))}</div></div>
              <div class="guide-demo-wide">${escapeHtml(uiText('صوت + حفظ + استرجاع', 'Voice + save + restore'))}</div>
            </div>
            <div class="guide-card-text">${escapeHtml(uiText('أضفت شرح بصري للصورة والترجمة والصوت والحفظ والاسترجاع.', 'A visual explainer was added for image OCR, translation, voice, saving, and restoring.'))}</div>
          </div>
        </div>
        <div class="modal-note"><i class="fas fa-circle-info"></i><div>${escapeHtml(t.modalNote)}</div></div>
        <div class="modal-actions">
          <label style="display:flex;align-items:center;gap:8px;margin-inline-end:auto;color:var(--tx2)"><input type="checkbox" id="hideOnboardingChk" /> ${escapeHtml(t.noShow)}</label>
          <button class="ocr-ctrl-btn" type="button" onclick="openGuideCenter()">${escapeHtml(uiText('فتح الدليل الكامل', 'Open full guide'))}</button>
          <button class="save-btn" id="startAppBtn">${escapeHtml(t.startNow)}</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    document.getElementById('startAppBtn').onclick = () => {
      AppConfig.markFirstRunDone(document.getElementById('hideOnboardingChk').checked);
      wrap.remove();
    };
  }

  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [];

    function resize() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      dots = Array.from({ length: 34 }, () => ({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2 + 1, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4 }));
    }

    function draw() {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      dots.forEach((d) => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0 || d.x > width) d.dx *= -1;
        if (d.y < 0 || d.y > height) d.dy *= -1;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(34,211,238,.55)';
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }

  function initIframeHandlers() {
    const iframe = document.getElementById('browserIframe');
    if (!iframe) return;
    iframe.addEventListener('load', () => {
      setBrowserProgress(false);
      updateBrowserButtons();
      installFrameShield(iframe);
    });
    iframe.addEventListener('error', () => {
      setBrowserProgress(false);
      setBrowserError(true, getText('browserError'));
    });
  }

  function bindInputs() {
    document.querySelectorAll('input, textarea').forEach((input) => input.addEventListener('focus', () => { state.lastFocusedInput = input; }));
    const dz = document.getElementById('ocrDropZone');
    if (dz) {
      dz.addEventListener('dragenter', () => dz.classList.add('drag'));
      dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
    }
    document.addEventListener('click', (event) => {
      if (!event.target.closest('#langPopup') && !event.target.closest('[onclick*="openLangMenu"]')) document.getElementById('langPopup')?.classList.remove('open');
    });
    window.addEventListener('spr:config-changed', () => {
      updateConfigUI();
      applyI18n(AppConfig.defaultLang || 'ar');
    });
    window.addEventListener('spr:records-changed', () => renderRecords());
  }

  function initBrowserMarkup() {
    const errorPage = document.getElementById('browserErrorPage');
    if (errorPage && !document.getElementById('browserErrorTitle')) {
      errorPage.innerHTML = `
        <i class="fas fa-triangle-exclamation"></i>
        <h3 id="browserErrorTitle">تعذر تحميل الصفحة</h3>
        <p id="browserErrorMsg">تحقق من الرابط أو اتصالك بالإنترنت</p>
        <button class="ocr-ctrl-btn" onclick="browserReload()">
          <i class="fas fa-rotate-right"></i> <span id="browserRetryLabel">إعادة المحاولة</span>
        </button>
        <button class="ocr-ctrl-btn" style="margin-top:6px" onclick="openExternal()">
          <i class="fas fa-external-link-alt"></i> <span id="browserExternalLabel">${state.currentLang === 'ar' ? 'فتح خارجياً' : 'Open externally'}</span>
        </button>`;
    }
    const suggestionBox = document.getElementById('browserSuggestions');
    if (suggestionBox && !document.getElementById('browserRecentTitle')) {
      suggestionBox.innerHTML = `<div class="recent-title" id="browserRecentTitle"></div><div class="recent-list"></div>`;
    }
  }

  function init() {
    buildLanguageControls();
    initBrowserMarkup();
    TtsService.setLanguage(AppConfig.defaultLang || 'ar');
    TtsService.setRate(AppConfig.state.ttsRate || 0.95);
    applyI18n(AppConfig.defaultLang || 'ar');
    updateConfigUI();
    updateStatusClock();
    setInterval(updateStatusClock, 30000);
    clearChat();
    renderVisualGuideCards();
    renderRecords();
    navigateTo('screenHome');
    initParticles();
    initIframeHandlers();
    bindInputs();
    renderBrowserSuggestions();
    showOnboarding();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
