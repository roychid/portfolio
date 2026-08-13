# Roy Chidhungwana Portfolio

Static HTML/CSS/JS portfolio prepared for GitHub + Cloudflare Pages.

## Structure
- `index.html` — main portfolio
- `projects/` — one page per selected project
  - `poultrysmart.html`
  - `scorexi.html`
  - `yorshield.html`
  - `yoros.html`
- `events/ai4i-2026.html` — full AI for Impact Challenge 2026 page
- `assets/` — event photos, certificate and project media
- `styles.css` — shared responsive styling and dark theme
- `script.js` — theme switching, mobile navigation, reveal effects and event image viewer

## Before publishing
Replace the placeholder contact links in `index.html` with Roy's actual:
- LinkedIn URL
- GitHub URL
- Email `mailto:` link
- CV PDF path

WhatsApp is already wired to `+263 775 881 639`.

## Cloudflare Pages
1. Push this folder to a GitHub repository.
2. In Cloudflare, create a Pages project and connect the repository.
3. Framework preset: None.
4. Build command: leave empty.
5. Build output directory: `/` or repository root depending on the current Cloudflare UI.
6. Production branch: `main`.

No build step is required.
