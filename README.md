# ToolBox Free

A responsive, static, multi-page website with six fully functional client-side tools. Pure HTML, CSS and JavaScript — no build step, no frameworks, no paid APIs, and no server-side code.

## What's inside

```
toolbox-free/
├── index.html                     Homepage
├── tools/
│   ├── image-compressor.html      Canvas-based JPG/PNG/WebP compressor
│   ├── word-counter.html          Word / character / sentence / reading-time counter
│   ├── percentage-calculator.html Basic %, "X is what % of Y", and % increase/decrease
│   ├── password-generator.html    crypto.getRandomValues()-based password generator
│   ├── case-converter.html        UPPER / lower / Title / Sentence / camelCase / aLtErNaTiNg
│   └── qr-code-generator.html     Offline QR code encoder with PNG/SVG download
├── css/style.css                  Shared design system (single stylesheet)
├── js/main.js                     Shared nav toggle, toast, clipboard helper
├── js/tools/*.js                  One script per tool
├── js/vendor/qrcode.js            Vendored offline QR encoder (MIT, see credit below)
├── assets/favicon.svg
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Running it locally

No build tools or dependencies are required. From this folder, run any static file server, for example:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in your browser. Opening `index.html` directly by double-clicking will also work for most tools, though some browsers restrict `fetch`/module features on the `file://` protocol — a local server is recommended.

## Deploying

Upload the contents of this folder as-is to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, or a plain web server). There is nothing to build or install.

Before going live:
- Replace `https://www.toolboxfree.example` in `index.html`, every file in `tools/`, `sitemap.xml` and `robots.txt` with your real domain (search and replace across the project).
- If you deploy into a subdirectory instead of a domain root, change the root-relative asset paths (`/css/style.css`, `/js/...`, `/tools/...`) to match.

## Privacy and architecture notes

Every tool processes input entirely in the browser:
- **Image Compressor** uses the Canvas API (`drawImage` + `toBlob`) to re-encode images locally.
- **Password Generator** uses `crypto.getRandomValues()`, the Web Crypto API's cryptographically secure random source.
- **QR Code Generator** uses a vendored, offline JavaScript QR encoder — no request is ever made to a third-party QR API.

No file, password or piece of text you enter is ever uploaded or transmitted to a server. The site makes zero network requests to external APIs at runtime.

## Third-party code credit

`js/vendor/qrcode.js` bundles the QR Code Generator for JavaScript library by Kazuhiko Arase, MIT licensed. It runs fully offline in the browser; it is not a hosted API or external service.
