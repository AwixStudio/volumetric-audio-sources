# Volumetric Audio Sources website

An English product and support website for Awix Studio, built for GitHub Pages.

Support: **contact@awixstudio.com**

## Hosting

The site is plain HTML, CSS and JavaScript. It has no build step, dependencies,
analytics or contact-form service. Keep all files together in the repository root.

In GitHub, open **Settings > Pages**, choose **Deploy from a branch**, then
select **main** and **/(root)**. Save and wait for the Pages deployment.

Expected project URL for the AwixStudio repository:
https://awixstudio.github.io/volumetric-audio-sources/

GitHub reference:
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Local preview

Run `python -m http.server 8765 --bind 127.0.0.1` from this folder, then open
http://127.0.0.1:8765/. You can also open index.html directly for a basic preview.

## Editing

- index.html: product text, setup instructions, contact and links.
- style.css: typography, colors and responsive layout.
- site.js: navigation, backend selection and the schematic closest-point demo.
- hero.png: title-only promotional artwork.
- *-inspector.png: real component screenshots from the English guide.
- user-guide.pdf: current 10-page English documentation.

The paid Unity package and its implementation source are intentionally not part
of this public website repository. Update the guide and screenshots when the asset
changes. No Asset Store listing URL is configured until a real listing is available.

The 2D interactive diagram is illustrative and plays no audio. It does not
measure runtime performance. Wwise validation limitations are stated on the page.
