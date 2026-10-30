# GA Checkpoint — completely new storefront

This is a new HTML/CSS/JavaScript implementation built from scratch, with Attitude as a visual direction. It does not reuse the earlier GA HTML, catalog data, scripts, layout, or local-storage keys.

Open `ga-checkpoint-new.html` from the downloadable ZIP in a browser. Images, styles, JavaScript and the Archivo font are embedded; the page requires no external services to render or use the demonstration catalog.

The concept collection contains twelve original sample products. Names, specifications, prices and generated product photography are illustrative and do not represent live GA Checkpoint inventory or an offer for sale. The bag review explicitly places no order and collects no payment. Saved products and the demonstration bag are stored only in this browser.

Layout: an edge-to-edge hero with three full-cover images, smooth crossfades every 15 seconds, manual slide controls and pause; a nearly edge-to-edge six-product row; a shorter full-width photographic banner; and a second six-product row. The hero stays behind the page as the next section rises over its bottom edge. Cards move up and fade in progressively with downward scrolling, with a slight stagger. Smaller screens keep the product rows horizontally scrollable. Reduced motion disables the pinning and card motion. The carousel pauses when the page is hidden and starts paused for reduced-motion preferences.

Features: responsive navigation, category browsing, full-text search, price/category filtering, sorting, saved products, product detail dialogs, quantity controls, a persistent demonstration bag and a clearly labeled bag review. Dialogs support Escape and keyboard navigation. Reduced motion preferences are respected.

Editable source is in this directory: `index.html`, `styles.css`, `app.js`, and `assets/`. Run `python3 build.py` here to regenerate the standalone HTML and ZIP in the parent directory.

Archivo is distributed under the SIL Open Font License; see `FONT-LICENSE.txt`.
