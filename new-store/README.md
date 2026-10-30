# GA Checkpoint — independent marine storefront

A new HTML/CSS/JavaScript implementation built from scratch, with Attitude as the initial visual direction and GA Checkpoint-inspired blue, red, white and graphite branding. The earlier GA HTML, catalog data and scripts are not reused.

Open `ga-checkpoint-new.html` from the downloadable ZIP in a browser. Images, styles, both JavaScript files and the Archivo font are embedded; the demonstration store makes no external requests.

## Three scrolling stages

1. The compact header and full-cover photographic carousel form the first screen. Three images crossfade every 15 seconds, with manual controls and pause.
2. A complete second screen contains the ticker, search/filter controls, first six products and a shorter full-width photographic banner. A vertical wheel gesture advances to this screen as a whole. The next gesture advances to stage three. Trackpad momentum is consumed until the gesture ends, preventing an accidental double advance.
3. The second product row and all remaining collections, stories and footer use normal, unrestricted page scrolling. Scrolling back to the top of this area returns to the section transitions.

Touch swipes, Page Up/Down, arrow keys and section navigation are supported. Form inputs, zoom gestures, horizontal product scrolling and open dialogs retain their own interactions. On extremely short windows, the compact product pane can scroll internally to keep controls reachable. The banner and scene anchors remain stable when filters change.

The header is 56px high with a 20px top strip on desktop, and 54px with an 18px strip on mobile. Shared variables align screen heights and navigation offsets. Motion preferences disable animated transitions and start the image carousel paused.

## Demo catalog and source

Twelve original concept products support search, category/price filters, sorting, saved products, details, quantity controls and a persistent demonstration bag. Names, specifications, prices and generated photography are illustrative, not live inventory or an offer for sale. Bag review places no order and collects no payment. Saved products and bag contents stay only in this browser.

Editable files: `index.html`, `styles.css`, `app.js`, `scenes.js`, and `assets/`. Run `python3 build.py` from this directory to rebuild the standalone HTML and ZIP in the parent directory.

Archivo is distributed under the SIL Open Font License; see `FONT-LICENSE.txt`.
