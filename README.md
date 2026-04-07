# Smart Reader PRO AI — Fixed Web Build

## What was fixed

This package repairs the uploaded web app and fills in the missing project files that were referenced by `index.html` but were not included in the upload.

### Main fixes
- Added the missing `css/main.css`
- Added missing JavaScript modules under `js/config`, `js/services`, and `js/screens`
- Built a responsive layout that works on mobile, tablet, and desktop
- Added first-run onboarding modal that explains:
  - what the app does
  - what it does not do
  - how to use each tool clearly
- Improved language switching so the UI updates immediately after changing language
- Fixed Reader behavior so it opens the exact URL or exact image link entered by the user
- Added OCR flow for uploaded images and direct image links using Tesseract.js
- Added text-to-speech playback for extracted text cards and overlays
- Added local settings persistence with `localStorage`
- Added safer browser behavior with fallback when websites block iframe embedding
- Added theme persistence, cache clear, simple stats, and cleaner navigation logic

## Important limitation
Some external websites block loading inside iframes or block cross-origin access. In those cases, the app now explains the limitation clearly and offers external opening instead of showing unrelated content.

## Project structure

```text
index.html
css/
  main.css
js/
  config/
    app_config.js
  services/
    adblock_service.js
    ai_translate_service.js
    ocr_service.js
    tts_service.js
  screens/
    smart_browser_screen.js
```

## Translation behavior
- UI language updates instantly
- OCR text translation uses this order:
  1. backend URL if configured
  2. Google Translate API if configured
  3. public Google translate fallback when available
  4. original text fallback if translation is unavailable

## Running locally
Use any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`

## Notes
- API keys are stored locally in browser storage for this build
- For production, move translation requests to a secure backend proxy
- OCR quality depends on image quality and language script selection


## v6 deep fix
- Replaced broken in-frame Google page translation with smart text-mode page translation in Reader
- Added grouped settings hub and privacy section
- Added private AI space lock for mobile
- Switched quick browser home away from Google to DuckDuckGo to reduce ad-heavy starts
- Expanded ad filtering selectors and made ad shield configurable


## v7 total upgrade
- Added deep diagnostics section for translation, ads, privacy, and mobile readiness
- Added browser clean reader mode for easier mobile reading
- Added one-tap Google key clearing helper
- Added stronger mobile web-app meta tags and action layout polish
