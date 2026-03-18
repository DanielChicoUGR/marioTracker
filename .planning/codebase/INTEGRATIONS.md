# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Frontend CDN assets:**

- Google Fonts - Loads UI fonts for rendering text styles
  - SDK/Client: direct stylesheet links in `index.html`
  - Auth: Not applicable
- html2canvas CDN - Client-side DOM-to-image export used by `exportToImage()`
  - SDK/Client: `https://html2canvas.hertzen.com/dist/html2canvas.min.js` in `index.html`
  - Auth: Not applicable

## Data Storage

**Databases:**

- None detected
  - Connection: Not applicable
  - Client: Not applicable

**File Storage:**

- Local browser download only (generated PNG via anchor download in `index.html`)

**Caching:**

- Browser Cache Storage via Service Worker in `sw.js`
  - Static cache: `mario-tracker-static-v2`
  - Runtime cache: `mario-tracker-runtime-v2`

## Authentication & Identity

**Auth Provider:**

- Custom: none detected
  - Implementation: Not applicable

## Monitoring & Observability

**Error Tracking:**

- None detected

**Logs:**

- Browser console logging (`console.error`) for Service Worker registration failure in `index.html`

## CI/CD & Deployment

**Hosting:**

- Not explicitly configured in repository files; architecture matches static-site hosting

**CI Pipeline:**

- None detected (no GitHub Actions workflow files under `.github/workflows/`)

## Environment Configuration

**Required env vars:**

- None detected in runtime code (`index.html`, `sw.js`, `manifest.webmanifest`)

**Secrets location:**

- Not applicable

## Webhooks & Callbacks

**Incoming:**

- None detected

**Outgoing:**

- None detected

---

_Integration audit: 2026-03-18_
