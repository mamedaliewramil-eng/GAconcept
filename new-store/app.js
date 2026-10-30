'use strict';

// Original concept catalog. These are illustrative products, not live inventory.
const PRODUCTS = Object.freeze([
  {id:'coastal-rib',name:'Coastal RIB 360',category:'boats',price:3495,position:'0% 0%',tag:'THE WAY OUT',description:'A compact inflatable concept for discovering a little more coastline. Room for your next plan, without making a big production of it.',features:['Compact rigid inflatable concept','Open-deck arrangement','Coastal adventures, your way'],photo:'Concept grey rigid inflatable boat'},
  {id:'horizon-chartplotter',name:'Horizon 9 Chartplotter',category:'electronics',price:1199,position:'50% 0%',tag:'FIND YOUR HEADING',description:'A navigation display concept that puts your next heading in focus. A clean, clear companion for the days you take the long way.',features:['Nine-inch display concept','Simple chart-focused interface','Designed for a marine helm'],photo:'Concept black marine navigation display with a nautical chart'},
  {id:'performance-propeller',name:'Performance 3-Blade Propeller',category:'essentials',price:289,position:'100% 0%',tag:'FINE-TUNED',description:'A polished three-blade propeller concept inspired by clean lines and smooth days on the water. Actual engine compatibility must always be verified.',features:['Three-blade stainless steel concept','Polished metal finish','Illustrative fitment; not model-specific'],photo:'Concept polished stainless steel three-blade marine propeller'},
  {id:'offshore-vest',name:'Offshore Buoyancy Vest',category:'essentials',price:119,position:'0% 100%',tag:'BRING THE GOOD',description:'A bright buoyancy vest concept for a thoughtfully packed day out. This illustration is not a certified safety product or a substitute for approved equipment.',features:['High-visibility orange design concept','Adjustable strap illustration','Use certified, properly fitted safety equipment on the water'],photo:'Concept orange and charcoal marine buoyancy vest'},
  {id:'tidal-speakers',name:'Tidal Marine Speaker Pair',category:'electronics',price:249,position:'50% 100%',tag:'SET THE TONE',description:'A pair of marine speaker concepts for an easy-going soundtrack. Clean white grilles keep the look as simple as the day ahead.',features:['Pair of round speaker concepts','Clean white grille design','Illustrative marine audio collection'],photo:'Concept pair of white round marine speakers'},
  {id:'drift-drybag',name:'Drift 20L Dry Bag',category:'essentials',price:59,position:'100% 100%',tag:'PACK LIGHT',description:'A roll-top dry bag concept for keeping your everyday essentials together. A little colour for wherever your plans take you.',features:['Twenty-litre capacity concept','Orange roll-top design','Lightweight grab-and-go silhouette'],photo:'Concept orange roll-top dry bag'},
  {id:'waypoint-radio',name:'Waypoint Handheld VHF',category:'electronics',price:179,sheet:2,position:'0% 0%',tag:'STAY CONNECTED',description:'A compact handheld marine radio concept inspired by keeping in touch with the crew. This is an illustrative design, not certified communications equipment.',features:['Handheld marine radio concept','Compact black case and antenna','No certified radio specifications are claimed'],photo:'Concept black handheld marine radio with an antenna'},
  {id:'harbour-dockline',name:'Harbour Dockline Set',category:'essentials',price:39,sheet:2,position:'50% 0%',tag:'TIE IT TOGETHER',description:'A neatly coiled dockline concept for the quiet moments between adventures. A useful finishing touch for a well-considered day on the water.',features:['Navy braided rope design concept','Looped end detail','Actual rope size and suitability must be verified'],photo:'Concept coiled navy blue dockline with a loop'},
  {id:'daybreak-cooler',name:'Daybreak 30L Cooler',category:'essentials',price:189,sheet:2,position:'100% 0%',tag:'STAY A LITTLE LONGER',description:'A compact cooler concept that makes room for another hour outside. Clean, simple design for the little things that make the day.',features:['Thirty-litre capacity concept','Light-coloured hard shell design','Carry handle illustration'],photo:'Concept cream hard-sided cooler with a dark carrying handle'},
  {id:'tide-deckboots',name:'Tide Deck Boots',category:'essentials',price:89,sheet:2,position:'0% 100%',tag:'FIND YOUR FOOTING',description:'A pair of ankle deck-boot concepts with a clean charcoal finish. Choose actual footwear based on fit and verified conditions of use.',features:['Ankle-height boot concept','Charcoal finish','No performance or safety certification is claimed'],photo:'Concept pair of charcoal waterproof ankle deck boots'},
  {id:'compact-footpump',name:'Compact Foot Pump',category:'essentials',price:49,sheet:2,position:'50% 100%',tag:'READY TO GO',description:'A compact foot-pump concept for the practical side of getting out there. Light, simple and easy to picture in your kit.',features:['Foot-operated pump concept','Compact bellows design','Check valve and hose compatibility on actual equipment'],photo:'Concept black bellows foot pump with a flexible hose'},
  {id:'coastal-anchor',name:'Coastal Stainless Anchor',category:'essentials',price:149,sheet:2,position:'100% 100%',tag:'STAY FOR A WHILE',description:'A stainless anchor concept for the places that make you want to stay. Actual anchoring equipment must be selected for the vessel and conditions.',features:['Polished stainless anchor concept','Compact fluke design','Boat suitability and holding performance are not specified'],photo:'Concept small polished stainless steel marine anchor'}
]);
const CATEGORIES = {all:'All gear',boats:'Boats & inflatables',electronics:'Marine electronics',essentials:'Parts & essentials'};
const byId = new Map(PRODUCTS.map(product => [product.id,product]));
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
let productObserver;
if ('IntersectionObserver' in window) {
  productObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed');productObserver.unobserve(entry.target); }
  }),{threshold:0.08,rootMargin:'0px 0px -18px 0px'});
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

function showToast(message) {
  const toast = $('#toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'),2600);
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

function productMarkup(product) {
  const isSaved = saved.has(product.id);
  const name = escapeHTML(product.name);
  return `<article class="product-card" data-product-id="${product.id}">
    <button class="product-media" type="button" data-product="${product.id}" aria-label="View ${name}"><span class="product-photo${product.sheet === 2 ? ' product-photo--second' : ''}" style="--photo-position:${product.position}" role="img" aria-label="${escapeHTML(product.photo)}"></span><span class="product-tag">${product.tag}</span><span class="quick-view">Take a closer look ${arrow}</span></button>
    <button class="save-button" type="button" data-save="${product.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? 'Unsave' : 'Save'} ${name}">${heart}</button>
    <div class="product-meta"><span>${CATEGORIES[product.category]}</span><span>CONCEPT / CAD</span></div>
    <h3><button class="product-name" type="button" data-product="${product.id}">${name}</button></h3>
    <div class="product-bottom"><span class="price">${money(product.price)}<small>CAD</small></span><button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${name} to bag">Add to bag <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>
  </article>`;
}

function renderCatalog(focusSavedId) {
  const visible = filteredProducts();
  productObserver?.disconnect();
  $('#product-grid').innerHTML = visible.slice(0,6).map(productMarkup).join('');
  $('#secondary-grid').innerHTML = visible.slice(6,12).map(productMarkup).join('');
  $('#secondary-collection').hidden = visible.length <= 6;
  $('#mid-banner').hidden = visible.length <= 6;
  $('#product-grid').hidden = !visible.length;
  $('#empty-state').hidden = !!visible.length;
  $('#empty-message').textContent = state.savedOnly ? 'Save a product with the heart to keep your next good find here.' : 'Try a different search or clear your filters.';
  $('#catalog-title').textContent = state.savedOnly ? 'YOUR NEXT GOOD FINDS.' : state.category === 'boats' ? 'YOUR WAY OUT.' : state.category === 'electronics' ? 'FIND YOUR HEADING.' : state.category === 'essentials' ? 'BRING THE GOOD.' : 'GOOD TO GO.';
  $('#result-count').textContent = `${visible.length} ${state.savedOnly ? 'saved ' : ''}${visible.length === 1 ? 'item' : 'items'}`;
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
    if (productObserver && !reducedMotion()) productObserver.observe(card);
    else card.classList.add('is-revealed');
  });
  requestAnimationFrame(updateRailControls);
  if (focusSavedId) {
    const next = $(`[data-save="${focusSavedId}"]`);
    if (next) next.focus({preventScroll:true});
    else $('#wishlist-toggle').focus({preventScroll:true});
  }
}

function reducedMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
function scrollCatalog() { $('#catalog').scrollIntoView({behavior:reducedMotion() ? 'auto' : 'smooth',block:'start'}); }
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

function toggleSaved(id) {
  const product = byId.get(id);
  if (!product) return;
  if (saved.has(id)) { saved.delete(id);showToast(`${product.name} removed from saved gear.`); }
  else { saved.add(id);showToast(`${product.name} saved for later.`); }
  persist();
  renderCatalog(id);
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
  $('#detail-photo').style.setProperty('--photo-position',product.position);
  $('#detail-photo').classList.toggle('product-photo--second',product.sheet === 2);
  $('#detail-photo').setAttribute('aria-label',product.photo);
  $('#detail-name').textContent = product.name;
  $('#detail-price').textContent = `${money(product.price)} CAD`;
  $('#detail-category').textContent = CATEGORIES[product.category];
  $('#detail-description').textContent = product.description;
  $('#detail-features').innerHTML = product.features.map(feature => `<li>${escapeHTML(feature)}</li>`).join('');
  $('#detail-quantity').value = '1';
  openDialog($('#product-dialog'));
}

function addToBag(id,quantity = 1) {
  const product = byId.get(id);
  if (!product) return;
  const current = cart.find(line => line.id === id);
  if (current?.quantity === 99) { showToast('This item is already at the 99-item limit.');return; }
  if (current) current.quantity = boundedQuantity(current.quantity + boundedQuantity(quantity));
  else cart.push({id,quantity:boundedQuantity(quantity)});
  persist();
  updateHeader();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function bagTotal() { return cart.reduce((total,line) => total + byId.get(line.id).price * line.quantity,0); }

function cartLineMarkup(line) {
  const product = byId.get(line.id);
  const name = escapeHTML(product.name);
  return `<article class="cart-line" data-cart-line="${line.id}"><div class="cart-line-photo"><div class="product-photo${product.sheet === 2 ? ' product-photo--second' : ''}" style="--photo-position:${product.position}" role="img" aria-label="${escapeHTML(product.photo)}"></div></div><div class="cart-line-info"><p>${CATEGORIES[product.category]}</p><h3>${name}</h3><strong class="cart-line-price">${money(product.price * line.quantity)}</strong><div class="cart-line-controls"><div class="quantity-control" role="group" aria-label="Quantity for ${name}"><button type="button" data-cart-step="-1" data-id="${line.id}" aria-label="Decrease quantity of ${name}"${line.quantity === 1 ? ' disabled' : ''}>−</button><span aria-live="polite">${line.quantity}</span><button type="button" data-cart-step="1" data-id="${line.id}" aria-label="Increase quantity of ${name}"${line.quantity === 99 ? ' disabled' : ''}>+</button></div><button class="remove-button" type="button" data-cart-remove="${line.id}" aria-label="Remove ${name} from bag">Remove</button></div></div></article>`;
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

function updateRailControls() {
  $$('[data-rail]').forEach(button => {
    const rail = document.getElementById(button.dataset.rail);
    const maximum = rail.scrollWidth - rail.clientWidth;
    button.disabled = Number(button.dataset.direction) < 0 ? rail.scrollLeft <= 2 : maximum < 2 || rail.scrollLeft >= maximum - 2;
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
  rail.scrollBy({left:Math.max(240,rail.clientWidth * .8) * Number(button.dataset.direction),behavior:reducedMotion() ? 'auto' : 'smooth'});
}));
$$('.product-rail').forEach(rail => rail.addEventListener('scroll',updateRailControls,{passive:true}));
window.addEventListener('resize',updateRailControls,{passive:true});

document.addEventListener('click',event => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) { goCategory(categoryButton.dataset.category);return; }
  const closeButton = event.target.closest('[data-close]');
  if (closeButton) { closeButton.closest('dialog')?.close();return; }
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) { toggleSaved(saveButton.dataset.save);return; }
  const addButton = event.target.closest('[data-add]');
  if (addButton) { addToBag(addButton.dataset.add);return; }
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
$('#concept-info').addEventListener('click',() => openDialog($('#info-dialog')));
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
  addToBag(detailProduct.id,boundedQuantity(input.value));
  $('#product-dialog').close();
  openDialog($('#cart-dialog'));
});
$('#checkout-button').addEventListener('click',() => {
  if (!cart.length) return;
  $('#checkout-summary').innerHTML = cart.map(line => `<div class="checkout-line"><span>${escapeHTML(byId.get(line.id).name)} × ${line.quantity}</span><strong>${money(byId.get(line.id).price * line.quantity)}</strong></div>`).join('') + `<div class="checkout-line"><strong>Sample total · CAD</strong><strong>${money(bagTotal())}</strong></div>`;
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
