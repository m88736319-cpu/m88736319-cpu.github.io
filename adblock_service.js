(function () {
  const SELECTORS = [
    '[id*="ad-"]', '[class*="ad-"]', '[class*="ads"]', '[id*="ads"]',
    '[class*="banner"]', '[class*="sponsor"]', '[class*="popup"]',
    '[class*="promoted"]', '[class*="sponsored"]', '[data-ad]', '[data-ad-slot]',
    '[data-testid*="ad"]', '[aria-label*="advert"]', '[aria-label*="Sponsored"]',
    '.cookie-banner', '.newsletter-popup', '.adsbox', 'ins.adsbygoogle', '#google_vignette',
    'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]',
    '[src*="doubleclick"]', '[src*="googlesyndication"]', '[href*="doubleclick"]',
    '[href*="utm_source=taboola"]', '[href*="outbrain"]', '[href*="taboola"]'
  ];

  function isEnabled() {
    return window.AppConfig?.state?.adShield !== false;
  }

  const AdBlock = {
    selectors: SELECTORS,

    runOnPage(root = document) {
      if (!isEnabled()) return;
      try {
        const doc = root?.nodeType === 9 ? root : root?.ownerDocument || document;
        const styleId = 'spr-adblock-style';
        if (doc && !doc.getElementById(styleId)) {
          const style = doc.createElement('style');
          style.id = styleId;
          style.textContent = `${SELECTORS.join(', ')}{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;} body{overflow-x:hidden;}`;
          doc.head?.appendChild(style);
        }
        SELECTORS.forEach((selector) => {
          root.querySelectorAll(selector).forEach((node) => {
            if (!node.closest('.screens-container') && !node.closest('.phone-frame')) {
              node.remove();
            }
          });
        });
      } catch (error) {
        console.warn('AdBlock skipped', error);
      }
    },

    getInjectJS() {
      if (!isEnabled()) return '(() => {})();';
      return `(() => {
        const selectors = ${JSON.stringify(SELECTORS)};
        selectors.forEach((selector) => document.querySelectorAll(selector).forEach((el) => el.remove()));
      })();`;
    }
  };

  window.AdBlock = AdBlock;
})();
