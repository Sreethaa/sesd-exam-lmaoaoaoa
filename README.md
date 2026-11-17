# SHOPORA

A responsive, frontend-only storefront built with HTML, CSS, and vanilla JavaScript. It is designed to work by opening `index.html` directly or by publishing this folder with GitHub Pages.

## Features

- Responsive storefront with category browsing and product filters
- Eight product cards with real product photography
- Shopping bag with quantity controls, remove actions, live item count, and subtotal
- Cart saved in the current browser using local storage
- Accessible mobile navigation and slide-out shopping bag
- Demo checkout and newsletter interactions (no payment or signup backend)

Product and lifestyle photography is loaded from Unsplash, and the typography uses Google Fonts. An internet connection is needed to load these assets; the rest of the site runs without a server.

## Run locally

Open `index.html` in a browser. No installation or build step is required.

## Publish with GitHub Pages

From the folder containing `OnlineShopping`, initialize and push the project:

```bash
cd OnlineShopping
git init
git add index.html style.css script.js README.md
git commit -m "Build SHOPORA storefront"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own GitHub repository URL. On GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. GitHub Pages will publish the site at the URL shown in that settings page.
