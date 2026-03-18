# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**

- HTML5 (no version pinned) - Main application document and embedded UI logic in `index.html`
- JavaScript (ES6+ in browser) - Business logic, state management, and PWA bootstrap in `index.html` and `sw.js`
- CSS3 - Styling and responsive layout in `index.html`

**Secondary:**

- JSON - Web app manifest metadata in `manifest.webmanifest`
- SVG - Application icons in `icons/icon-192.svg` and `icons/icon-512.svg`

## Runtime

**Environment:**

- Browser runtime (modern Service Worker-capable browsers) executing scripts from `index.html` and `sw.js`

**Package Manager:**

- Not detected (no `package.json`, `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock` in repository root)
- Lockfile: missing

## Frameworks

**Core:**

- No frontend framework detected (vanilla DOM + inline script architecture in `index.html`)
- Progressive Web App platform APIs (Service Worker + Web App Manifest) via `sw.js` and `manifest.webmanifest`

**Testing:**

- Not detected

**Build/Dev:**

- Not detected (no bundler/transpiler config files found)

## Key Dependencies

**Critical:**

- `html2canvas` (CDN script) - Tournament export to PNG via `html2canvas(...)` in `index.html`
- Google Fonts (`Fredoka One`, `Nunito`) - UI typography loaded in `index.html`

**Infrastructure:**

- Service Worker Cache API - Offline app shell and runtime caching strategy in `sw.js`
- Web Storage API (`localStorage`) - Persistent tournament state in `index.html`

## Configuration

**Environment:**

- No environment-variable system detected (no `.env` usage in application code)
- Manifest-based app metadata configured in `manifest.webmanifest` (`name`, `start_url`, `display`, theme colors, icons)

**Build:**

- No build pipeline config detected; app assets are served directly (`index.html`, `sw.js`, `manifest.webmanifest`, `icons/*`)

## Platform Requirements

**Development:**

- Static file hosting or local HTTP server to serve root files (`index.html`, `sw.js`, `manifest.webmanifest`)
- Browser with support for `navigator.serviceWorker`, Cache API, and PWA install events used in `index.html` and `sw.js`

**Production:**

- Static hosting with HTTPS recommended for Service Worker/PWA behavior
- Root path deployment expected by relative URLs (`./`) in `index.html`, `manifest.webmanifest`, and `sw.js`

---

_Stack analysis: 2026-03-18_
