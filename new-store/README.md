# GA Checkpoint — independent marine storefront

A standalone HTML/CSS/JavaScript storefront for GA Checkpoint, with five full-screen sections, a searchable product catalog, a handpicked showcase and a persistent shopping bag.

Extract the downloadable ZIP and open its only HTML file, `index.html`, in a browser. Images, styles, both JavaScript files and the Archivo font are embedded; the storefront makes no external requests. The root `index.html`, this directory's `index.html` and `ga-checkpoint-new.html` are identical standalone builds and can each be downloaded separately.

## Five scrolling stages

1. The compact header and full-cover photographic carousel form the first screen. Three images crossfade every 15 seconds, with manual controls and pause.
2. The full second screen is the category chooser, “PICK YOUR PURSUIT.”: boats, electronics and essentials. The three large tiles sit in a row on desktop and compact stacked rows on mobile. Selecting one filters the products and advances to block three.
3. The third screen contains the ticker, search/filter controls and all 30 catalog products. A horizontally scrolling grid has two rows, with six visible cards per row on wide screens and fewer columns on smaller screens. Each group fills the top row from left to right before the bottom row; five Electronics results therefore occupy the first five top-row cells on desktop. Search, filtering and sorting restart the rail at its first result. Square framed arrow controls (32×31px) sit on the right and move the grid left or right. The photographic banner has moved out of this screen.
4. The fourth screen is a separate “YOU MIGHT LIKE THESE.” showcase of six handpicked new products. Every showcase product also exists in the full catalog; this selection is independent of catalog search, category/price filters, sorting and saved-only mode. The “TAKE THE LONG WAY.” photographic banner moved here from screen three, replacing the removed “GOOD GEAR. GREAT DAYS.” banner.
5. The “READY WHEN YOU ARE.” field notes start 12px below the fixed header, with the advice aligned toward the top. They form a complete fifth screen, reached by the same smooth section transition. Further scrolling below this screen is native and unrestricted toward the footer. Scrolling back above it returns to the section transitions.

The category screen rises as one opaque white panel over the introductory photo in 1.25 seconds, using a sine easing curve and a soft shadow along its leading edge. The photo stays under the fixed header, fills the screen as the announcement scrolls away, and fades behind the incoming categories. Other adjacent blocks, including four to five, transition in 1.1 seconds. Every adjacent pair uses absolute scroll progress so reversing midway preserves the current offsets. Trackpad momentum is consumed until a gesture ends. Finishing, cancelling, resizing or enabling reduced motion clears temporary effects, so scrolling after block five remains unrestricted.

The first screen's photos and dark overlay fade out together as the page moves to the category screen, revealing the normal white page background. Their opacity stays at zero throughout blocks two through five and is restored progressively when returning to the first screen. This background state is separate from the temporary foreground slide effects.

Touch swipes, Page Up/Down, arrow keys and section navigation are supported. Form inputs, zoom gestures, horizontal product scrolling and open dialogs retain their own interactions. On extremely short windows, the compact product pane can scroll internally to keep controls reachable. The banner and scene anchors remain stable when filters change.

The fixed header stays at the top throughout the page: 42px high on desktop and 44px on mobile. A separate 16px strip (14px on mobile) scrolls away. The original GA Checkpoint logo retains its blue gear, red accents and tagline. The hero fills all remaining first-screen space with no margins, borders or image padding. Shared variables align screen heights and navigation offsets. Motion preferences disable animated transitions and start the image carousel paused.

The desktop category navigation is centered relative to the whole header, with its original small 11px Arial lettering and normal capitalization: Shop all, Boats, Electronics, Essentials. Each label has the reference-style eight-point nautical compass rose, two rings and N/E/S/W letters on a transparent background. The rose is 26px in the header and 30px in the mobile drawer; its image is embedded in the offline HTML.

Hovered and selected header categories underline only the text; the compass is outside the underline.

## Catalog and source

Thirty products support search, category/price filters, sorting, saved products, details, quantity controls and a persistent bag. Six handpicked products form the default showcase and also appear in the full catalog. Saved products and bag contents stay in this browser. The bag review opens an item summary; order submission and payment integration can be added independently. A product has the same saved status and bag quantity whether opened from the catalog or the showcase.

Photo badges retain their original labels with contrasting 10px text, white backgrounds and wrapping. Saving a product updates existing card controls in place, preserving card reveal state and scroll positions; the card heart appearance is unchanged. Saved-only removals preserve surviving card nodes and the independent showcase. Adding a saved item or bag item gives a brief product-thumbnail confirmation; reduced motion uses a static thumbnail. Feedback remains visible above product and bag dialogs.

Upward native scrolling below the fifth screen decelerates to a stop at the start of screen five. Remaining momentum from the same gesture is consumed there. A separate subsequent wheel gesture, a new key press after release or a new touch swipe advances to screen four. Queued native momentum is stopped during the brake, and stale snap timers cannot compete with it.

The footer's Back to top link returns directly to the introductory photo with the same downward panel reveal as the second-to-first scene transition, taking 1.25 seconds. The current panel slides down over the stationary opening photo; the header stays in place and no intermediate sections appear. A sliding cover provides the direct return when the View Transitions API is unavailable. Reduced motion returns instantly.

Choose the fourth-screen products and their display order by editing `SHOWCASE_PRODUCT_IDS` in `app.js`:

```js
const SHOWCASE_PRODUCT_IDS = Object.freeze([
  'harbour-fender', 'coast-binoculars', 'deck-led-light',
  'battery-isolator', 'anchor-windlass', 'dock-cleats'
]);
```

Each ID must refer to a product in `PRODUCTS`. Adding an item to `PRODUCTS` makes it available throughout the catalog; adding its ID to this ordered list also places it in the showcase. Search, filters and sorting never infer or replace this selection. Rebuild the standalone HTML after changing either list.

Editable files: `template.html.in`, `styles.css`, `app.js`, `scenes.js`, and `assets/`. Run `python3 build.py` from this directory to rebuild all standalone HTML entry points and the ZIP in the parent directory. The build rejects any remaining external stylesheet, script, image or CSS asset dependency. Do not edit the generated `index.html` files directly.

Archivo is distributed under the SIL Open Font License; see `FONT-LICENSE.txt`.
