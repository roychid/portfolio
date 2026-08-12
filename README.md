# Roy Chidhungwana — Personal Portfolio

Static HTML/CSS/JS portfolio prepared for GitHub Pages.

## Before publishing

Open `index.html` and replace the four placeholder contact links in the Contact section:

- LinkedIn
- GitHub
- Email (`mailto:...`)
- CV file/path

If you add a CV, place it in `assets/` (for example `assets/Roy-Chidhungwana-CV.pdf`) and update the Download CV link.

## GitHub Pages deployment

1. Create a GitHub repository, e.g. `roychidhungwana.github.io` or `portfolio`.
2. Upload all files in this folder to the repository root.
3. If the repository is named `<username>.github.io`, GitHub Pages can serve it directly from the main branch.
4. Otherwise go to **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/root`.
5. Your site will then be available at your GitHub Pages URL.

## Custom domain later

When you buy a domain:

1. In GitHub repository **Settings → Pages**, add the custom domain.
2. Configure the DNS records with your domain provider as GitHub instructs.
3. Enable HTTPS once GitHub validates the DNS.

No redesign or migration is required — the same static site can remain hosted on GitHub Pages with the custom domain pointing to it.

## Structure

- `index.html` — content and page structure
- `styles.css` — visual design and responsive layout
- `script.js` — mobile menu, reveal animations and header behaviour
- `assets/` — future CV, images, screenshots, favicon, etc.
