# GA Checkpoint — independent marine storefront

A new HTML/CSS/JavaScript implementation built from scratch, with Attitude as the initial visual direction and GA Checkpoint blue, red, white and graphite branding. The original logo artwork is embedded in the header; the earlier GA layout, catalog data and scripts are not reused.

Extract the downloadable ZIP and open its only HTML file, `index.html`, in a browser. Images, styles, both JavaScript files and the Archivo font are embedded; the demonstration store makes no external requests. The root `index.html`, this directory's `index.html` and `ga-checkpoint-new.html` are identical standalone builds and can each be downloaded separately.

## Four scrolling stages

1. The compact header and full-cover photographic carousel form the first screen. Three images crossfade every 15 seconds, with manual controls and pause.
2. The full second screen is the category chooser, “PICK YOUR PURSUIT.”: boats, electronics and essentials. The three large tiles sit in a row on desktop and compact stacked rows on mobile. Selecting one filters the products and advances to block three.
3. The third screen contains the ticker, search/filter controls, first six products and a shorter full-width photographic banner.
4. The fourth block begins with the second product row and continues into stories and the footer. After arriving at this block, subsequent scrolling is native and unrestricted. Scrolling back above it returns to the section transitions.

The category screen rises as one opaque white panel over the introductory photo in 1.25 seconds, using a sine easing curve and a soft shadow along its leading edge. The photo stays under the fixed header, fills the screen as the announcement scrolls away, and fades behind the incoming categories. Other adjacent blocks transition in 1.1 seconds. Every adjacent pair uses absolute scroll progress so reversing midway preserves the current offsets. Trackpad momentum is consumed until a gesture ends. Finishing, cancelling, resizing or enabling reduced motion clears temporary effects, so scrolling after block four remains unrestricted.

The first screen's photos and dark overlay fade out together as the page moves to the category screen, revealing the normal white page background. Their opacity stays at zero throughout blocks two, three and four and is restored progressively when returning to the first screen. This background state is separate from the temporary foreground slide effects.

Touch swipes, Page Up/Down, arrow keys and section navigation are supported. Form inputs, zoom gestures, horizontal product scrolling and open dialogs retain their own interactions. On extremely short windows, the compact product pane can scroll internally to keep controls reachable. The banner and scene anchors remain stable when filters change.

The fixed header stays at the top throughout the page: 42px high on desktop and 44px on mobile. A separate 16px strip (14px on mobile) scrolls away. The original GA Checkpoint logo retains its blue gear, red accents and tagline. The hero fills all remaining first-screen space with no margins, borders or image padding. Shared variables align screen heights and navigation offsets. Motion preferences disable animated transitions and start the image carousel paused.

## Demo catalog and source

Twelve original concept products support search, category/price filters, sorting, saved products, details, quantity controls and a persistent demonstration bag. Names, specifications, prices and generated photography are illustrative, not live inventory or an offer for sale. Bag review places no order and collects no payment. Saved products and bag contents stay only in this browser.

Editable files: `template.html.in`, `styles.css`, `app.js`, `scenes.js`, and `assets/`. Run `python3 build.py` from this directory to rebuild all standalone HTML entry points and the ZIP in the parent directory. The build rejects any remaining external stylesheet, script, image or CSS asset dependency. Do not edit the generated `index.html` files directly.

Archivo is distributed under the SIL Open Font License; see `FONT-LICENSE.txt`.
