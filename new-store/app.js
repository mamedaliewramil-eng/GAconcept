'use strict';

// Store catalog and product details.
const PRODUCTS = Object.freeze([
  {id:'coastal-rib',name:'Coastal RIB 360',category:'boats',price:3495,position:'0% 0%',tag:'THE WAY OUT',description:"A compact grey rigid inflatable with an open deck, bench seating and a clean, practical layout for coastal days.",features:["Grey inflatable tubes","Open deck and bench seating","Compact rigid hull layout"],photo:"grey rigid inflatable boat"},
  {id:'horizon-chartplotter',name:'Horizon 9 Chartplotter',category:'electronics',price:1199,position:'50% 0%',tag:'FIND YOUR HEADING',description:"A black chartplotter with a wide display and a clear nautical-chart layout, designed to sit neatly at the helm.",features:["Black display housing","Nautical chart interface","Compact helm mounting profile"],photo:"black marine navigation display with a nautical chart"},
  {id:'performance-propeller',name:'Performance 3-Blade Propeller',category:'essentials',price:289,position:'100% 0%',tag:'FINE-TUNED',description:"A polished three-blade propeller with a simple metal finish. Check the engine and hub fit when choosing your setup.",features:["Three-blade shape","Polished metal finish","Check engine and hub fit"],photo:"polished stainless steel three-blade marine propeller"},
  {id:'offshore-vest',name:'Offshore Buoyancy Vest',category:'essentials',price:119,position:'0% 100%',tag:'BRING THE GOOD',description:"A bright orange and charcoal vest with a front closure and adjustable straps. Choose a comfortable fit for the person wearing it.",features:["Orange and charcoal panels","Adjustable strap arrangement","Front closure"],photo:"orange and charcoal marine buoyancy vest"},
  {id:'tidal-speakers',name:'Tidal Marine Speaker Pair',category:'electronics',price:249,position:'50% 100%',tag:'SET THE TONE',description:"A pair of round white marine speakers with clean grilles and a compact profile for the boat.",features:["Pair of round speaker grilles","Clean white finish","Low-profile design"],photo:"pair of white round marine speakers"},
  {id:'drift-drybag',name:'Drift 20L Dry Bag',category:'essentials',price:59,position:'100% 100%',tag:'PACK LIGHT',description:"An orange roll-top bag with a carry handle and a simple strap arrangement for keeping your kit together.",features:["Orange roll-top closure","Carry handle and strap","Simple soft-sided shape"],photo:"orange roll-top dry bag"},
  {id:'waypoint-radio',name:'Waypoint Handheld VHF',category:'electronics',price:179,sheet:2,position:'0% 0%',tag:'STAY CONNECTED',description:"A compact black handheld VHF radio with an antenna, front display and easy-to-reach controls.",features:["Black handheld housing","Front screen and controls","Top-mounted antenna"],photo:"black handheld marine radio with an antenna"},
  {id:'harbour-dockline',name:'Harbour Dockline Set',category:'essentials',price:39,sheet:2,position:'50% 0%',tag:'TIE IT TOGETHER',description:"A neatly coiled navy dockline with a looped end. Choose the rope size to suit the boat and docking points.",features:["Navy braided rope","Coiled arrangement","Looped end"],photo:"coiled navy blue dockline with a loop"},
  {id:'daybreak-cooler',name:'Daybreak 30L Cooler',category:'essentials',price:189,sheet:2,position:'100% 0%',tag:'STAY A LITTLE LONGER',description:"A cream hard-sided cooler with a dark carry handle and front latches, ready to keep the day’s supplies together.",features:["Light-coloured hard shell","Dark carry handle","Front latch closures"],photo:"cream hard-sided cooler with a dark carrying handle"},
  {id:'tide-deckboots',name:'Tide Deck Boots',category:'essentials',price:89,sheet:2,position:'0% 100%',tag:'FIND YOUR FOOTING',description:"Charcoal ankle boots with a low profile and pull tabs for an easy-to-pack addition to your boat kit.",features:["Ankle-height shape","Charcoal finish","Side pull tabs"],photo:"pair of charcoal ankle deck boots"},
  {id:'compact-footpump',name:'Compact Foot Pump',category:'essentials',price:49,sheet:2,position:'50% 100%',tag:'READY TO GO',description:"A compact black bellows pump with a footplate and a flexible hose. Check the valve connection when matching it to your equipment.",features:["Bellows body","Foot-operated plate","Flexible hose"],photo:"black bellows foot pump with a flexible hose"},
  {id:'coastal-anchor',name:'Coastal Stainless Anchor',category:'essentials',price:149,sheet:2,position:'100% 100%',tag:'STAY FOR A WHILE',description:"A polished anchor with a compact fluke profile. Select the size and type for your boat and anchoring conditions.",features:["Polished metal finish","Compact fluke shape","Choose size for your boat"],photo:"small polished stainless steel marine anchor"},
  {id:'harbour-fender',name:'Harbour Dock Fender',category:'essentials',price:89,sheet:3,position:'0% 0%',tag:'A SOFTER LANDING',description:"A white cylindrical dock fender with navy ends and attachment points. Match the size and placement to the boat.",features:["White cylindrical body","Navy end caps","Attachment points at the ends"],photo:"white cylindrical boat fender with navy ends"},
  {id:'coast-binoculars',name:'Coastline Marine Binoculars',category:'essentials',price:229,sheet:3,position:'50% 0%',tag:'LOOK A LITTLE FURTHER',description:"Navy binoculars with twin eyepieces, a central hinge and a rounded grip for keeping your next destination in view.",features:["Twin eyepiece design","Navy body","Central hinge and grip"],photo:"navy marine binoculars"},
  {id:'deck-led-light',name:'Tidal Deck Light',category:'electronics',price:99,sheet:3,position:'100% 0%',tag:'LIGHT THE WAY',description:"A compact black deck light with a round lens and mounting bracket. Check the electrical connection for your setup.",features:["Black spotlight housing","Round lens","Mounting bracket"],photo:"black marine LED spotlight on a mounting bracket"},
  {id:'battery-isolator',name:'Harbour Battery Switch',category:'essentials',price:59,sheet:3,position:'0% 100%',tag:'A THOUGHTFUL DETAIL',description:"A red rotary battery switch on a black mounting base. Match the connection and electrical ratings to your installation.",features:["Red rotary dial","Black mounting base","Visible mounting holes"],photo:"red rotary battery isolator switch on a black base"},
  {id:'anchor-windlass',name:'Horizon Anchor Windlass',category:'essentials',price:799,sheet:3,position:'50% 100%',tag:'READY TO DROP ANCHOR',description:"A polished anchor windlass with a low-profile housing and dark mounting base. Check the fit with your deck and anchor system.",features:["Polished housing","Dark mounting base","Compact foredeck layout"],photo:"polished stainless anchor windlass on a black base"},
  {id:'dock-cleats',name:'Dockside Cleat Pair',category:'essentials',price:79,sheet:3,position:'100% 100%',tag:'THE FINISHING TOUCH',description:"A pair of polished metal cleats with a low profile and visible mounting holes. Choose the size and mounting method for your boat.",features:["Pair of polished cleats","Low-profile shape","Visible mounting holes"],photo:"pair of polished stainless marine cleats"},
  {id:'folding-grapnel-anchor',name:'Folding Grapnel Anchor',category:'essentials',price:59,sheet:4,position:'0% 0%',tag:'STAY A LITTLE LONGER',description:'A grey metal grapnel anchor with four folding prongs and a compact central shaft. Choose the size and style for your boat and anchoring conditions.',features:['Four-prong shape','Folding arm arrangement','Grey metal finish'],photo:'grey metal four-prong folding grapnel anchor'},
  {id:'coastal-life-jacket',name:'Coastal Foam Life Jacket',category:'essentials',price:99,sheet:4,position:'50% 0%',tag:'BRING THE CREW',description:'A navy and orange foam life jacket with a front closure and adjustable straps. Choose the size and fit for the person wearing it.',features:['Navy and orange panels','Foam-panel shape','Adjustable straps and front closure'],photo:'navy and orange foam life jacket'},
  {id:'deck-cleaning-brush',name:'Harbour Deck Brush',category:'essentials',price:35,sheet:4,position:'100% 0%',tag:'A FRESH START',description:'A blue and white deck brush with a compact rectangular head and a short metal handle for your boat-care kit.',features:['Blue and white brush head','Short metal handle','Rectangular bristle arrangement'],photo:'blue and white deck-cleaning brush with a short metal handle'},
  {id:'boat-wash-kit',name:'Boat Wash Kit',category:'essentials',price:69,sheet:4,position:'0% 100%',tag:'KEEP IT SHIPSHAPE',description:'A boat-care set with a white bucket, blue brush and two bottles, keeping the cleaning essentials together in one place.',features:['White carry bucket','Blue cleaning brush','Two bottles'],photo:'white boat-wash bucket with a blue brush and two bottles'},
  {id:'microfiber-cloth-pack',name:'Deck Care Cloth Pack',category:'essentials',price:24,sheet:4,position:'50% 100%',tag:'THE LITTLE DETAILS',description:'A stack of blue cleaning cloths with matching sponges for the finishing details of your boat-care routine.',features:['Three folded blue cloths','Matching cleaning sponges','Compact storage shape'],photo:'three folded blue cleaning cloths with sponges'},
  {id:'inflatable-repair-kit',name:'Inflatable Repair Kit',category:'essentials',price:39,sheet:4,position:'100% 100%',tag:'KEEP YOUR KIT READY',description:'An orange repair box with patches, adhesive and small tools. Check that the patch and adhesive suit the material of your inflatable.',features:['Orange storage box','Repair patches and adhesive','Small hand tools'],photo:'open orange inflatable-repair box with patches adhesive and small tools'},
  {id:'manual-bilge-pump',name:'Manual Bilge Pump',category:'essentials',price:49,sheet:5,position:'0% 0%',tag:'READY TO LEND A HAND',description:'A black and orange hand pump with a flexible hose and a simple upright handle, ready to organise with the rest of your boat kit.',features:['Black and orange pump body','Manual handle arrangement','Flexible hose'],photo:'black and orange manual bilge pump with a hose'},
  {id:'waterproof-phone-pouch',name:'Shoreline Phone Pouch',category:'essentials',price:19,sheet:5,position:'50% 0%',tag:'KEEP IT CLOSE',description:'A clear phone pouch with a black rim and a navy neck cord, keeping your phone and lanyard together in a compact shape.',features:['Clear front panel','Black rim and closure','Navy neck cord'],photo:'clear phone pouch with a black rim and navy cord'},
  {id:'marine-usb-charger',name:'Marine USB Charging Socket',category:'electronics',price:29,sheet:5,position:'100% 0%',tag:'A USEFUL CONNECTION',description:'A black round dual USB socket with a rubber cover. Match the connection and electrical ratings to your installation.',features:['Round black mounting body','Two USB openings','Rubber cover'],photo:'black round dual USB charging socket with a rubber cover'},
  {id:'mushroom-anchor',name:'Mooring Mushroom Anchor',category:'essentials',price:45,sheet:5,position:'0% 100%',tag:'FIND YOUR PLACE',description:'A black mushroom-style anchor with a rounded base and curved shaft. Choose the weight and style for your boat and mooring conditions.',features:['Rounded mushroom base','Curved central shaft','Black finish'],photo:'black mushroom anchor with a curved shaft'},
  {id:'dry-storage-box',name:'Dry Storage Box',category:'essentials',price:49,sheet:5,position:'50% 100%',tag:'ROOM FOR THE ESSENTIALS',description:'An orange hard-sided storage box with black latches, keeping small pieces of your boating kit together.',features:['Orange hard case','Black latch closures','Compact rectangular shape'],photo:'orange hard storage box with black latches'},
  {id:'fishing-rod-holder',name:'Clamp-Mount Rod Holder',category:'essentials',price:59,sheet:5,position:'100% 100%',tag:'MAKE ROOM FOR THE DAY',description:'A polished metal rod holder with a cylindrical tube and clamp mount. Match the clamp and mounting position to your boat.',features:['Polished tubular holder','Clamp mounting bracket','Adjustable mounting arrangement'],photo:'polished stainless clamp-mount fishing rod holder'},
  {id:'harbour-lifering',name:'Harbour Lifebuoy Ring',category:'essentials',price:79,sheet:6,position:'0% 0%',tag:'LOOK AFTER YOUR CREW',description:'An orange circular lifebuoy with four white bands and a rope around the outside. Choose equipment suited to your vessel and the people aboard.',features:['Orange circular ring','Four white bands','White perimeter rope'],photo:'orange marine lifebuoy ring with white bands and a white rope'},
  {id:'portable-marine-fuel-tank',name:'Portable Marine Fuel Tank',category:'essentials',price:89,sheet:6,position:'50% 0%',tag:'READY FOR THE NEXT LEG',description:'A red portable tank with a moulded carry handle, black screw cap and small connector. Match the tank and connection to your engine setup.',features:['Red moulded body','Integrated carry handle','Black cap and connector'],photo:'red portable marine fuel tank with a carry handle and black cap'}
]);
// Edit this ordered list to choose the fourth-screen showcase. All IDs also live in PRODUCTS.
// The showcase is independent of catalog search, filters, saved-only mode and sorting.
const SHOWCASE_PRODUCT_IDS = Object.freeze([
  'harbour-fender','coast-binoculars','deck-led-light',
  'battery-isolator','anchor-windlass','dock-cleats'
]);
const CATEGORIES = {all:'All gear',boats:'Boats & inflatables',electronics:'Marine electronics',essentials:'Parts & essentials'};
const byId = new Map(PRODUCTS.map(product => [product.id,product]));
const PHOTO_SHEET_CLASSES = Object.freeze({
  2:'product-photo--second',3:'product-photo--third',
  4:'product-photo--fourth',5:'product-photo--fifth',6:'product-photo--sixth'
});
const STORAGE_KEY = 'gaFreshMarineStoreV1';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:2}).format(value);
const arrow = '<svg class="arrow-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 8.7c0 5-8.5 10.6-8.5 10.6S3.5 13.7 3.5 8.7A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.5 2.3Z"/></svg>';
const state = {category:'all',query:'',sort:'featured',maxPrice:null,savedOnly:false};
let cart = [];
let saved = new Set();
let detailProduct = null;
let toastTimer;
let toastFrame = 0;
const productFlights = new Set();
let productObserver;
let revealFrame = 0;
if ('IntersectionObserver' in window) {
  productObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) scheduleCardReveal();
  },{threshold:0.01,rootMargin:'0px 0px 50px 0px'});
}

function boundedQuantity(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(1,Math.min(99,Math.floor(number))) : 1;
}

function loadStoredBag() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return;
    if (Array.isArray(raw.saved)) saved = new Set(raw.saved.filter(id => byId.has(id)));
    if (Array.isArray(raw.cart)) {
      const lines = new Map();
      raw.cart.forEach(line => {
        if (!line || !byId.has(line.id)) return;
        lines.set(line.id,{id:line.id,quantity:boundedQuantity(line.quantity)});
      });
      cart = [...lines.values()];
    }
  } catch (_) { /* Browsing remains available when local storage is unavailable. */ }
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify({cart,saved:[...saved]})); }
  catch (_) { showToast('Changes are kept for this visit. Browser storage is unavailable.'); }
}

function thumbnailMarkup(product) {
  return `<span class="product-photo${productPhotoClass(product)}" style="--photo-position:${product.position}" aria-hidden="true"></span>`;
}

function showToast(message,product) {
  const toast = $('#toast');
  clearTimeout(toastTimer);
  cancelAnimationFrame(toastFrame);
  toast.replaceChildren();
  if (product) {
    const thumbnail = document.createElement('span');
    thumbnail.className = 'toast-thumb';
    thumbnail.setAttribute('aria-hidden','true');
    thumbnail.innerHTML = thumbnailMarkup(product);
    toast.append(thumbnail);
  }
  const copy = document.createElement('span');
  copy.className = 'toast-message';
  copy.textContent = message;
  toast.append(copy);
  // A manual popover keeps feedback visible above an open product or bag dialog.
  if (typeof toast.showPopover === 'function') {
    toast.setAttribute('popover','manual');
    if (toast.matches(':popover-open')) toast.hidePopover();
    toast.showPopover();
  }
  toastFrame = requestAnimationFrame(() => {
    toastFrame = 0;
    toast.classList.add('visible');
  });
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    toastTimer = setTimeout(() => {
      if (typeof toast.hidePopover === 'function' && toast.matches(':popover-open')) toast.hidePopover();
    },250);
  },2600);
}

function animateProductThumbnail(product,source,target) {
  if (reducedMotion() || !source || !target || typeof source.animate !== 'function') return;
  const photo = source.closest('.product-card')?.querySelector('.product-photo');
  if (!photo) return;
  const start = photo.getBoundingClientRect();
  const end = target.getBoundingClientRect();
  if (start.bottom <= 0 || start.top >= innerHeight || start.right <= 0 || start.left >= innerWidth) return;
  const flight = document.createElement('div');
  flight.className = 'product-flight';
  flight.setAttribute('aria-hidden','true');
  flight.innerHTML = thumbnailMarkup(product);
  const x = start.left + start.width / 2;
  const y = start.top + start.height / 2;
  flight.style.left = `${x - 28}px`;
  flight.style.top = `${y - 28}px`;
  document.body.append(flight);
  if (typeof flight.showPopover === 'function') {
    flight.setAttribute('popover','manual');
    flight.showPopover();
  }
  const animation = flight.animate([
    {transform:'translate(0,0) scale(1)',opacity:1},
    {transform:`translate(${end.left + end.width / 2 - x}px,${end.top + end.height / 2 - y}px) scale(.35)`,opacity:0}
  ],{duration:680,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});
  const cleanup = () => { animation.cancel();flight.remove();productFlights.delete(cleanup); };
  productFlights.add(cleanup);
  animation.finished.then(cleanup,cleanup);
  // Bound transient overlays when several products are added quickly.
  if (productFlights.size > 3) [...productFlights][0]();
}

function updateHeader() {
  const count = cart.reduce((sum,line) => sum + line.quantity,0);
  $('#bag-count').textContent = String(count);
  $('#cart-toggle').setAttribute('aria-label',`Open shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  $('#saved-count').textContent = String(saved.size);
  $('#saved-count').hidden = !saved.size;
  $('#wishlist-toggle').setAttribute('aria-pressed',String(state.savedOnly));
  $('#wishlist-toggle').setAttribute('aria-label',state.savedOnly ? 'Show all products' : `Show saved products, ${saved.size} saved`);
}

function filteredProducts() {
  const query = state.query.trim().toLocaleLowerCase();
  const result = PRODUCTS.filter(product =>
    (state.category === 'all' || state.category === product.category) &&
    (!state.savedOnly || saved.has(product.id)) &&
    (state.maxPrice === null || product.price <= state.maxPrice) &&
    (!query || `${product.name} ${CATEGORIES[product.category]} ${product.description}`.toLocaleLowerCase().includes(query))
  );
  if (state.sort === 'price-asc') result.sort((a,b) => a.price - b.price);
  if (state.sort === 'price-desc') result.sort((a,b) => b.price - a.price);
  if (state.sort === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
  return result;
}

function showcaseProducts() {
  return [...new Set(SHOWCASE_PRODUCT_IDS)].map(id => byId.get(id)).filter(Boolean);
}

function productPhotoClass(product) {
  const className = PHOTO_SHEET_CLASSES[product.sheet];
  return className ? ` ${className}` : '';
}

function productMarkup(product) {
  const isSaved = saved.has(product.id);
  const name = escapeHTML(product.name);
  return `<article class="product-card" data-product-id="${product.id}">
    <button class="product-media" type="button" data-product="${product.id}" aria-label="View ${name}"><span class="product-photo${productPhotoClass(product)}" style="--photo-position:${product.position}" role="img" aria-label="${escapeHTML(product.photo)}"></span><span class="product-tag">${product.tag}</span><span class="quick-view">Take a closer look ${arrow}</span></button>
    <button class="save-button" type="button" data-save="${product.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? 'Unsave' : 'Save'} ${name}">${heart}</button>
    <div class="product-meta"><span>${CATEGORIES[product.category]}</span><span>CAD</span></div>
    <h3><button class="product-name" type="button" data-product="${product.id}">${name}</button></h3>
    <div class="product-bottom"><span class="price">${money(product.price)}<small>CAD</small></span><button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${name} to bag">Add to bag <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>
  </article>`;
}

function renderCatalog(focusSavedId,focusRailId) {
  const visible = filteredProducts();
  const showcase = showcaseProducts();
  productObserver?.disconnect();
  $('#product-grid').innerHTML = visible.map(productMarkup).join('');
  $('#secondary-grid').innerHTML = showcase.map(productMarkup).join('');
  $('#secondary-collection').hidden = !showcase.length;
  $('#secondary-empty').hidden = !!showcase.length;
  $('#mid-banner').hidden = false;
  $('#product-grid').hidden = !visible.length;
  $('#empty-state').hidden = !!visible.length;
  layoutCatalogRows({reset:true});
  $('#empty-message').textContent = state.savedOnly ? 'Save a product with the heart to keep your next good find here.' : 'Try a different search or clear your filters.';
  $('#catalog-title').textContent = state.savedOnly ? 'YOUR NEXT GOOD FINDS.' : state.category === 'boats' ? 'YOUR WAY OUT.' : state.category === 'electronics' ? 'FIND YOUR HEADING.' : state.category === 'essentials' ? 'BRING THE GOOD.' : 'GOOD TO GO.';
  $('#result-count').textContent = `${visible.length} ${state.savedOnly ? 'saved ' : ''}${visible.length === 1 ? 'item' : 'items'}`;
  const allGearCount = $('.category-tabs [data-category="all"] > span');
  if (allGearCount) allGearCount.textContent = String(PRODUCTS.length);
  const filterCount = Number(state.category !== 'all') + Number(state.maxPrice !== null);
  $('#filter-count').hidden = !filterCount;
  $('#filter-count').textContent = String(filterCount);
  $('#clear-filters').hidden = !(filterCount || state.query || state.savedOnly);
  $$('.category-tabs [data-category]').forEach(button => {
    const active = button.dataset.category === state.category;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  $$('.desktop-nav [data-category]').forEach(button => {
    if (button.dataset.category === state.category && !state.savedOnly) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
  updateHeader();
  $$('.product-card').forEach((card,index) => {
    card.style.setProperty('--reveal-delay',`${(index % 6) * 65}ms`);
    card.dataset.revealIndex = String(index % 6);
    if (productObserver && !reducedMotion()) productObserver.observe(card);
    else { card.classList.add('is-revealed');card.style.setProperty('--reveal-opacity','1');card.style.setProperty('--reveal-shift','0px'); }
  });
  requestAnimationFrame(() => { updateRailControls();scheduleCardReveal();window.storeScenes?.refresh(); });
  if (focusSavedId) {
    const selector = `[data-save="${focusSavedId}"]`;
    const next = document.getElementById(focusRailId)?.querySelector(selector) || $(selector);
    if (next) next.focus({preventScroll:true});
    else $('#wishlist-toggle').focus({preventScroll:true});
  }
}

function reducedMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
function scrollCatalog() {
  if (window.storeScenes) window.storeScenes.goTo(2);
  else $('#catalog').scrollIntoView({behavior:reducedMotion() ? 'auto' : 'smooth',block:'start'});
}
function syncOverlay() { document.body.classList.toggle('overlay-open',!!$('dialog[open]')); }
function closeDialogs() { $$('dialog[open]').forEach(dialog => dialog.close()); }
function openDialog(dialog) {
  closeDialogs();
  dialog.showModal();
  syncOverlay();
}

function goCategory(category) {
  state.category = Object.hasOwn(CATEGORIES,category) ? category : 'all';
  state.query = '';
  state.savedOnly = false;
  state.maxPrice = null;
  $('#catalog-search').value = '';
  closeDialogs();
  renderCatalog();
  scrollCatalog();
}

function clearFilters() {
  Object.assign(state,{category:'all',query:'',maxPrice:null,savedOnly:false,sort:'featured'});
  $('#catalog-search').value = '';
  $('#sort-by').value = 'featured';
  renderCatalog();
}

function toggleSaved(id,source = document.activeElement) {
  const product = byId.get(id);
  if (!product) return;
  const added = !saved.has(id);
  if (added) saved.add(id);
  else saved.delete(id);
  // Keep the existing cards and their reveal state, focus and rail positions intact.
  $$(`[data-save="${id}"]`).forEach(button => {
    button.setAttribute('aria-pressed',String(added));
    button.setAttribute('aria-label',`${added ? 'Unsave' : 'Save'} ${product.name}`);
  });
  if (state.savedOnly) reconcileSavedCatalog();
  persist();
  updateHeader();
  showToast(`${product.name} ${added ? 'saved for later' : 'removed from saved gear'}.`,product);
  if (added) animateProductThumbnail(product,source,$('#wishlist-toggle'));
}

function reconcileSavedCatalog() {
  const rail = $('#product-grid');
  const focused = document.activeElement;
  const focusedCard = focused?.closest('#product-grid .product-card');
  const cards = new Map([...rail.children].map(card => [card.dataset.productId,card]));
  const visible = filteredProducts();
  const remaining = new Set(visible.map(product => product.id));
  cards.forEach((card,id) => {
    if (!remaining.has(id)) { productObserver?.unobserve(card);card.remove(); }
  });
  visible.forEach((product,index) => {
    let card = cards.get(product.id);
    if (!card) {
      const fragment = document.createElement('template');
      fragment.innerHTML = productMarkup(product);
      card = fragment.content.firstElementChild;
      card.classList.add('is-revealed');
      card.style.setProperty('--reveal-opacity','1');
      card.style.setProperty('--reveal-shift','0px');
      card.dataset.revealProgress = '1';
    }
    if (rail.children[index] !== card) rail.insertBefore(card,rail.children[index] || null);
  });
  rail.hidden = !visible.length;
  $('#empty-state').hidden = !!visible.length;
  $('#result-count').textContent = `${visible.length} saved ${visible.length === 1 ? 'item' : 'items'}`;
  layoutCatalogRows();
  updateRailControls();
  if (focusedCard && !focused.isConnected) {
    (rail.querySelector('[data-save]') || $('#wishlist-toggle')).focus({preventScroll:true});
  }
}

function showSaved(toggle) {
  const next = toggle ? !state.savedOnly : true;
  Object.assign(state,{savedOnly:next,category:'all',query:'',maxPrice:null});
  $('#catalog-search').value = '';
  renderCatalog();
  scrollCatalog();
}

function openProduct(id) {
  const product = byId.get(id);
  if (!product) return;
  detailProduct = product;
  const photo = $('#detail-photo');
  photo.style.setProperty('--photo-position',product.position);
  Object.entries(PHOTO_SHEET_CLASSES).forEach(([sheet,className]) => photo.classList.toggle(className,product.sheet === Number(sheet)));
  photo.setAttribute('aria-label',product.photo);
  $('#detail-name').textContent = product.name;
  $('#detail-price').textContent = `${money(product.price)} CAD`;
  $('#detail-category').textContent = CATEGORIES[product.category];
  $('#detail-description').textContent = product.description;
  $('#detail-features').innerHTML = product.features.map(feature => `<li>${escapeHTML(feature)}</li>`).join('');
  $('#detail-quantity').value = '1';
  openDialog($('#product-dialog'));
}

function addToBag(id,quantity = 1,source = document.activeElement,feedback = true) {
  const product = byId.get(id);
  if (!product) return;
  const current = cart.find(line => line.id === id);
  if (current?.quantity === 99) { showToast('This item is already at the 99-item limit.');return; }
  if (current) current.quantity = boundedQuantity(current.quantity + boundedQuantity(quantity));
  else cart.push({id,quantity:boundedQuantity(quantity)});
  persist();
  updateHeader();
  renderCart();
  if (feedback) {
    showToast(`${product.name} added to your bag.`,product);
    animateProductThumbnail(product,source,$('#cart-toggle'));
  }
  return true;
}

function bagTotal() { return cart.reduce((total,line) => total + byId.get(line.id).price * line.quantity,0); }

function cartLineMarkup(line) {
  const product = byId.get(line.id);
  const name = escapeHTML(product.name);
  return `<article class="cart-line" data-cart-line="${line.id}"><div class="cart-line-photo"><div class="product-photo${productPhotoClass(product)}" style="--photo-position:${product.position}" role="img" aria-label="${escapeHTML(product.photo)}"></div></div><div class="cart-line-info"><p>${CATEGORIES[product.category]}</p><h3>${name}</h3><strong class="cart-line-price">${money(product.price * line.quantity)}</strong><div class="cart-line-controls"><div class="quantity-control" role="group" aria-label="Quantity for ${name}"><button type="button" data-cart-step="-1" data-id="${line.id}" aria-label="Decrease quantity of ${name}"${line.quantity === 1 ? ' disabled' : ''}>−</button><span aria-live="polite">${line.quantity}</span><button type="button" data-cart-step="1" data-id="${line.id}" aria-label="Increase quantity of ${name}"${line.quantity === 99 ? ' disabled' : ''}>+</button></div><button class="remove-button" type="button" data-cart-remove="${line.id}" aria-label="Remove ${name} from bag">Remove</button></div></div></article>`;
}

function renderCart() {
  $('#cart-lines').innerHTML = cart.map(cartLineMarkup).join('');
  $('#cart-empty').hidden = !!cart.length;
  $('#cart-lines').hidden = !cart.length;
  $('#cart-summary').hidden = !cart.length;
  $('#cart-total').textContent = money(bagTotal());
  $('#checkout-button').disabled = !cart.length;
}

function changeBagQuantity(id,step) {
  const line = cart.find(line => line.id === id);
  if (!line) return;
  line.quantity = boundedQuantity(line.quantity + step);
  persist();updateHeader();renderCart();
  const focusTarget = $(`[data-cart-step="${step}"][data-id="${id}"]:not(:disabled)`) || $(`[data-cart-step][data-id="${id}"]:not(:disabled)`);
  focusTarget?.focus({preventScroll:true});
}

function removeBagLine(id) {
  const product = byId.get(id);
  cart = cart.filter(line => line.id !== id);
  persist();updateHeader();renderCart();
  const focusTarget = $('#cart-lines [data-cart-remove]') || $('#cart-dialog [data-close]');
  focusTarget?.focus({preventScroll:true});
  showToast(`${product?.name || 'Product'} removed from your bag.`);
}

function catalogPageMetrics() {
  const rail = $('#product-grid');
  const style = getComputedStyle(rail);
  const columns = Math.max(1,parseInt(style.getPropertyValue('--catalog-columns'),10) || 6);
  return {columns,pages:Math.max(1,Math.ceil(rail.children.length / (columns * 2))),stride:rail.clientWidth + (parseFloat(style.columnGap) || 0)};
}

function layoutCatalogRows({reset = false} = {}) {
  const rail = $('#product-grid');
  const {columns,pages,stride} = catalogPageMetrics();
  const oldColumns = Number(rail.dataset.catalogColumns) || columns;
  const oldStride = Number(rail.dataset.catalogStride) || stride;
  const oldPage = oldStride ? Math.round(rail.scrollLeft / oldStride) : 0;
  const page = reset ? 0 : Math.min(pages - 1,Math.floor(oldPage * oldColumns / columns));
  // Reserve complete pages so only the final page can have unfilled cells.
  rail.style.setProperty('--catalog-total-columns',String(pages * columns));
  rail.dataset.catalogColumns = String(columns);
  rail.dataset.catalogStride = String(stride);
  // Fill each horizontal page across its first row, then across its second row.
  [...rail.children].forEach((card,index) => {
    const page = Math.floor(index / (columns * 2));
    const slot = index % (columns * 2);
    card.style.gridRowStart = String(Math.floor(slot / columns) + 1);
    card.style.gridColumnStart = String(page * columns + slot % columns + 1);
    card.classList.toggle('catalog-page-start',slot === 0);
  });
  rail.scrollTo({left:page * stride,behavior:'instant'});
}

function scrollCatalogPage(direction) {
  const rail = $('#product-grid');
  const {pages,stride} = catalogPageMetrics();
  const currentPage = stride ? Math.round(rail.scrollLeft / stride) : 0;
  const nextPage = Math.max(0,Math.min(pages - 1,currentPage + direction));
  rail.scrollTo({left:nextPage * stride,behavior:reducedMotion() ? 'instant' : 'smooth'});
}

function updateRailControls() {
  $$('[data-rail]').forEach(button => {
    const rail = document.getElementById(button.dataset.rail);
    const maximum = rail.scrollWidth - rail.clientWidth;
    button.disabled = Number(button.dataset.direction) < 0 ? rail.scrollLeft <= 2 : maximum < 2 || rail.scrollLeft >= maximum - 2;
  });
}

function scheduleCardReveal() {
  if (!revealFrame) revealFrame = requestAnimationFrame(updateCardReveal);
}
function updateCardReveal() {
  revealFrame = 0;
  const viewport = window.innerHeight;
  $$('[data-scroll-reveal]').forEach(group => {
    if (group.classList.contains('is-revealed') || group.closest('[hidden]')) return;
    const top = group.getBoundingClientRect().top;
    const next = reducedMotion() ? 1 : Math.max(0,Math.min(1,(viewport - 18 - top) / Math.max(180,viewport * .22)));
    const progress = Math.max(Number(group.dataset.revealProgress || 0),next);
    group.dataset.revealProgress = String(progress);
    group.style.setProperty('--section-reveal-opacity',String(progress));
    group.style.setProperty('--section-reveal-shift',`${Math.round((1 - progress) * 65)}px`);
    if (progress >= .995) {
      group.classList.add('is-revealed');
      group.style.setProperty('--section-reveal-opacity','1');
      group.style.setProperty('--section-reveal-shift','0px');
    }
  });
  $$('.product-rail').forEach(rail => {
    if (rail.closest('[hidden]')) return;
    const rect = rail.getBoundingClientRect();
    const travel = Math.max(150,viewport * .27);
    const railProgress = Math.max(0,Math.min(1,(viewport + 35 - rect.top) / travel));
    rail.querySelectorAll('.product-card').forEach(card => {
      if (card.classList.contains('is-revealed')) return;
      const stagger = Math.min(.2,Number(card.dataset.revealIndex || 0) * .035);
      const next = reducedMotion() ? 1 : Math.max(0,Math.min(1,(railProgress - stagger) / (1 - stagger)));
      const progress = Math.max(Number(card.dataset.revealProgress || 0),next);
      card.dataset.revealProgress = String(progress);
      card.style.setProperty('--reveal-opacity',String(progress));
      card.style.setProperty('--reveal-shift',`${Math.round((1 - progress) * 110)}px`);
      if (progress >= .995) {
        card.style.setProperty('--reveal-opacity','1');
        card.style.setProperty('--reveal-shift','0px');
        card.classList.add('is-revealed');
        productObserver?.unobserve(card);
      }
    });
  });
}

// The full-bleed carousel changes images every fifteen seconds while playing.
const heroSlides = $$('#hero-slides .hero-slide');
let activeHeroSlide = 0;
let heroPaused = reducedMotion();
let heroTimer;
function setHeroSlide(index) {
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide,i) => {
    const active = i === activeHeroSlide;
    slide.classList.toggle('is-active',active);
    slide.dataset.active = String(active);
    slide.setAttribute('aria-hidden',String(!active));
  });
  $$('[data-slide]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.slide) === activeHeroSlide)));
}
function syncHeroRotation() {
  clearInterval(heroTimer);
  const playing = !heroPaused && !document.hidden;
  $('#hero-carousel').dataset.playing = String(playing);
  $('#hero-pause').setAttribute('aria-pressed',String(heroPaused));
  $('#hero-pause').setAttribute('aria-label',heroPaused ? 'Resume automatic image rotation' : 'Pause automatic image rotation');
  if (playing) heroTimer = setInterval(() => setHeroSlide(activeHeroSlide + 1),15000);
}

$$('[data-slide]').forEach(button => button.addEventListener('click',() => {
  setHeroSlide(Number(button.dataset.slide));
  syncHeroRotation();
}));
$('#hero-pause').addEventListener('click',() => { heroPaused = !heroPaused;syncHeroRotation(); });
document.addEventListener('visibilitychange',syncHeroRotation);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event => {
  if (event.matches) { heroPaused = true;syncHeroRotation(); }
});
$$('[data-copy-image]').forEach(image => {
  const source = document.getElementById(image.dataset.copyImage);
  if (source) image.src = source.src;
});
$$('[data-rail]').forEach(button => button.addEventListener('click',() => {
  const rail = document.getElementById(button.dataset.rail);
  const direction = Number(button.dataset.direction);
  if (rail.id === 'product-grid') scrollCatalogPage(direction);
  else rail.scrollBy({left:Math.max(240,rail.clientWidth * .8) * direction,behavior:reducedMotion() ? 'auto' : 'smooth'});
}));
$$('.product-rail').forEach(rail => rail.addEventListener('scroll',() => { updateRailControls();scheduleCardReveal(); },{passive:true}));
window.addEventListener('resize',() => { layoutCatalogRows();updateRailControls(); },{passive:true});
window.addEventListener('scroll',scheduleCardReveal,{passive:true});
window.addEventListener('resize',scheduleCardReveal,{passive:true});

document.addEventListener('click',event => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) { goCategory(categoryButton.dataset.category);return; }
  const closeButton = event.target.closest('[data-close]');
  if (closeButton) { closeButton.closest('dialog')?.close();return; }
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) { toggleSaved(saveButton.dataset.save,saveButton);return; }
  const addButton = event.target.closest('[data-add]');
  if (addButton) { addToBag(addButton.dataset.add,1,addButton);return; }
  const productButton = event.target.closest('[data-product]');
  if (productButton) { openProduct(productButton.dataset.product);return; }
  const stepButton = event.target.closest('[data-cart-step]');
  if (stepButton) { changeBagQuantity(stepButton.dataset.id,Number(stepButton.dataset.cartStep));return; }
  const removeButton = event.target.closest('[data-cart-remove]');
  if (removeButton) removeBagLine(removeButton.dataset.cartRemove);
});

$('#catalog-search').addEventListener('input',event => { state.query = event.target.value;renderCatalog(); });
$('#sort-by').addEventListener('change',event => { state.sort = event.target.value;renderCatalog(); });
$('#clear-filters').addEventListener('click',clearFilters);
$('#empty-reset').addEventListener('click',clearFilters);
$('#search-toggle').addEventListener('click',() => { scrollCatalog();$('#catalog-search').focus({preventScroll:true}); });
$('#wishlist-toggle').addEventListener('click',() => showSaved(true));
$('#footer-saved').addEventListener('click',() => showSaved(false));
$('#menu-toggle').addEventListener('click',() => openDialog($('#menu-dialog')));
$('#store-info').addEventListener('click',() => openDialog($('#info-dialog')));
$('#cart-toggle').addEventListener('click',() => { renderCart();openDialog($('#cart-dialog')); });
$('#filter-toggle').addEventListener('click',() => {
  $('#filter-category').value = state.category;
  $('#filter-price').value = state.maxPrice === null ? '' : String(state.maxPrice);
  openDialog($('#filter-dialog'));
});
$('#filter-form').addEventListener('submit',event => {
  event.preventDefault();
  const category = $('#filter-category').value;
  state.category = Object.hasOwn(CATEGORIES,category) ? category : 'all';
  const price = $('#filter-price').value.trim();
  state.maxPrice = price === '' ? null : Math.max(0,Math.min(100000,Number(price)));
  $('#filter-dialog').close();renderCatalog();scrollCatalog();
});
$('#filter-reset').addEventListener('click',() => { $('#filter-category').value='all';$('#filter-price').value='';clearFilters(); });
$('#detail-add').addEventListener('click',() => {
  if (!detailProduct) return;
  const input = $('#detail-quantity');
  if (!input.reportValidity()) return;
  const product = detailProduct;
  const added = addToBag(product.id,boundedQuantity(input.value),null,false);
  if (!added) return;
  $('#product-dialog').close();
  openDialog($('#cart-dialog'));
  showToast(`${product.name} added to your bag.`,product);
});
$('#checkout-button').addEventListener('click',() => {
  if (!cart.length) return;
  $('#checkout-summary').innerHTML = cart.map(line => `<div class="checkout-line"><span>${escapeHTML(byId.get(line.id).name)} × ${line.quantity}</span><strong>${money(byId.get(line.id).price * line.quantity)}</strong></div>`).join('') + `<div class="checkout-line"><strong>Total · CAD</strong><strong>${money(bagTotal())}</strong></div>`;
  openDialog($('#checkout-dialog'));
});
$$('dialog').forEach(dialog => {
  dialog.addEventListener('close',syncOverlay);
  dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});

loadStoredBag();
renderCatalog();
renderCart();
setHeroSlide(0);
syncHeroRotation();
