'use strict';

// Advance through all five screens; further scrolling continues freely toward the footer.
(() => {
  const scenes = [...document.querySelectorAll('main > .scroll-scene')];
  const lastScene = scenes.length - 1;
  const header = document.querySelector('.site-header');
  const heroBackdrop = document.getElementById('hero-carousel');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let anchors = scenes.map(() => 0);
  let current = 0;
  let animating = false;
  let animationFrame = 0;
  let animationResolve;
  let activeTarget = null;
  let scrollFrame = 0;
  let settleTimer;
  let resizeTimer;
  let navigationVersion = 0;
  let lastWheel = -Infinity;
  let wheelTotal = 0;
  let wheelDirection = 0;
  let gestureUsed = false;
  let touch;
  let lastBackdropOpacity;
  const QUIET_GAP = 220;
  const surfaces = scenes.map((scene,index) => index === 0
    ? [...scene.querySelectorAll('.hero-copy,.hero-bottom')]
    : [...scene.children]);
  surfaces.flat().forEach(surface => surface.dataset.transitionSurface = '');

  function clearTransitionVisuals() {
    document.body.classList.remove('scene-transitioning');
    delete document.body.dataset.sceneTransition;
    heroBackdrop.style.removeProperty('--hero-hold');
    heroBackdrop.style.removeProperty('--hero-fill');
    scenes[1].style.removeProperty('--panel-shadow-opacity');
    scenes.forEach(scene => {
      delete scene.dataset.transitioning;
      scene.style.removeProperty('--scene-shift');
      scene.style.removeProperty('--scene-opacity');
    });
  }

  function transitionVisuals(fromIndex,toIndex,direction,heroPanel,pair) {
    if (fromIndex === toIndex && !pair) return () => {};
    const outgoing = scenes[pair ? pair[direction > 0 ? 0 : 1] : fromIndex];
    const incoming = scenes[pair ? pair[direction > 0 ? 1 : 0] : toIndex];
    const travel = Math.min(110,Math.max(45,innerHeight * .1));
    const announcementHeight = document.querySelector('.announcement').getBoundingClientRect().height;
    if (heroPanel) document.body.dataset.sceneTransition = 'hero-panel';
    outgoing.dataset.transitioning = 'true';
    incoming.dataset.transitioning = 'true';
    return progress => {
      if (pair) {
        // Use absolute scroll progress for every adjacent pair, including mid-flight reversals.
        const [lower,upper] = pair;
        const reveal = Math.max(0,Math.min(1,(scrollY - anchors[lower]) / (anchors[upper] - anchors[lower])));
        scenes[lower].style.setProperty('--scene-shift',`${(-travel * reveal).toFixed(2)}px`);
        scenes[lower].style.setProperty('--scene-opacity',String(1 - .18 * reveal));
        scenes[upper].style.setProperty('--scene-shift',`${(travel * (1 - reveal)).toFixed(2)}px`);
        scenes[upper].style.setProperty('--scene-opacity',String(heroPanel ? 1 : .76 + .24 * reveal));
        if (heroPanel) {
          // Hold and extend the photo as the thin announcement strip scrolls away.
          heroBackdrop.style.setProperty('--hero-hold',`${Math.max(0,scrollY - announcementHeight)}px`);
          heroBackdrop.style.setProperty('--hero-fill',`${Math.min(scrollY,announcementHeight)}px`);
          scenes[1].style.setProperty('--panel-shadow-opacity',(Math.sin(Math.PI * reveal) * .16).toFixed(4));
        }
        return;
      }
      outgoing.style.setProperty('--scene-shift',`${(-direction * travel * progress).toFixed(2)}px`);
      outgoing.style.setProperty('--scene-opacity',String(1 - .18 * progress));
      incoming.style.setProperty('--scene-shift',`${(direction * travel * (1 - progress)).toFixed(2)}px`);
      incoming.style.setProperty('--scene-opacity',String(.76 + .24 * progress));
    };
  }

  function measure() {
    const headerHeight = header.getBoundingClientRect().height;
    anchors = [0,...scenes.slice(1).map(scene => Math.max(0,Math.round(scene.getBoundingClientRect().top + scrollY - headerHeight)))];
  }

  function update() {
    const y = Math.max(0,scrollY);
    const backdropOpacity = (anchors[1] > 0 ? Math.max(0,Math.min(1,1 - y / anchors[1])) : 1).toFixed(4);
    if (backdropOpacity !== lastBackdropOpacity) {
      heroBackdrop.style.setProperty('--hero-backdrop-opacity',backdropOpacity);
      lastBackdropOpacity = backdropOpacity;
    }
    current = 0;
    for (let index = 1;index < anchors.length;index += 1) {
      if (y >= (anchors[index - 1] + anchors[index]) / 2) current = index;
    }
    document.body.dataset.scene = String(current + 1);
    scenes.forEach((scene,index) => scene.dataset.active = String(index === current));
    document.querySelectorAll('.scene-navigation [data-scene-go]').forEach(button => {
      if (Number(button.dataset.sceneGo) === current) button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    });
  }

  function refresh() { measure();update(); }

  function goTo(index,options = {}) {
    index = Math.max(0,Math.min(lastScene,Number(index) || 0));
    navigationVersion += 1;
    measure();
    clearTimeout(settleTimer);
    cancelAnimationFrame(animationFrame);
    if (animationResolve) { animationResolve(false);animationResolve = null; }
    clearTransitionVisuals();
    activeTarget = index;
    const from = scrollY;
    const destination = anchors[index];
    const departure = current;
    const interval = anchors.findIndex((anchor,number) => number > 0 && from > anchors[number - 1] + .5 && from < anchor - .5);
    const pair = interval > 0 && (index === interval || index === interval - 1)
      ? [interval - 1,interval]
      : Math.abs(index - departure) === 1 ? [Math.min(index,departure),Math.max(index,departure)] : null;
    const heroPanel = pair !== null && pair[0] === 0 && pair[1] === 1;
    const duration = motion.matches || options.instant ? 0 : heroPanel ? 1250 : 1100 + Math.max(0,Math.abs(index - departure) - 1) * 100;
    if (!duration || Math.abs(destination - from) < 2) {
      animating = false;
      activeTarget = null;
      window.scrollTo(0,destination);
      update();
      return Promise.resolve(true);
    }
    animating = true;
    document.body.classList.add('scene-transitioning');
    const paint = transitionVisuals(departure,index,Math.sign(destination - from),heroPanel,pair);
    paint(0);
    return new Promise(resolve => {
      animationResolve = resolve;
      const started = performance.now();
      function tick(now) {
        const progress = Math.min(1,(now - started) / duration);
        const eased = .5 - Math.cos(Math.PI * progress) / 2;
        window.scrollTo(0,Math.round(from + (destination - from) * eased));
        paint(eased);
        update();
        if (progress < 1) animationFrame = requestAnimationFrame(tick);
        else {
          window.scrollTo(0,destination);
          animating = false;
          animationResolve = null;
          activeTarget = null;
          clearTransitionVisuals();
          update();
          resolve(true);
        }
      }
      animationFrame = requestAnimationFrame(tick);
    });
  }

  function editable(target) {
    return target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],[role="slider"]');
  }

  function nestedScroller(target) {
    for (let node = target instanceof Element ? target : null;node && node !== document.body;node = node.parentElement) {
      const style = getComputedStyle(node);
      if (/auto|scroll/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2) return true;
    }
    return false;
  }

  function ignore(event) {
    const formControl = editable(event.target) && (event.type !== 'wheel' || !!event.target.closest('textarea,select,input[type="number"],input[type="range"],[contenteditable="true"],[role="slider"]'));
    return !!document.querySelector('dialog[open]') || event.ctrlKey || event.metaKey || formControl || nestedScroller(event.target);
  }

  function onWheel(event) {
    if (ignore(event) || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = event.deltaY * unit;
    const y = Math.max(0,scrollY);
    const now = performance.now();
    const quiet = now - lastWheel > QUIET_GAP;

    if (y > anchors[lastScene] + 4 && !animating) {
      if (delta < 0 && y + delta < anchors[lastScene] - 4) {
        event.preventDefault();gestureUsed = true;lastWheel = now;goTo(lastScene - 1);
      }
      return;
    }
    if (y >= anchors[lastScene] - 4 && delta > 0 && !animating && (quiet || !gestureUsed)) {
      gestureUsed = false;
      return;
    }

    event.preventDefault();
    if (quiet) { gestureUsed = false;wheelTotal = 0;wheelDirection = 0; }
    lastWheel = now;
    if (animating || gestureUsed) return;
    const direction = Math.sign(delta);
    if (direction !== wheelDirection) wheelTotal = 0;
    wheelDirection = direction;
    wheelTotal += delta;
    if (Math.abs(wheelTotal) < 24) return;
    gestureUsed = true;
    wheelTotal = 0;
    goTo(Math.max(0,Math.min(lastScene,current + direction)));
  }

  window.addEventListener('wheel',onWheel,{passive:false});

  window.addEventListener('touchstart',event => {
    if (event.touches.length !== 1 || ignore(event)) { touch = null;return; }
    const point = event.touches[0];
    touch = {x:point.clientX,y:point.clientY,used:false};
  },{passive:true});
  window.addEventListener('touchmove',event => {
    if (!touch || event.touches.length !== 1 || ignore(event)) return;
    const point = event.touches[0];
    const dy = touch.y - point.clientY;
    const dx = touch.x - point.clientX;
    if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 12) return;
    if (scrollY > anchors[lastScene] + 4 && !animating) return;
    if (scrollY >= anchors[lastScene] - 4 && dy > 0 && !animating && !touch.used) return;
    if (event.cancelable) event.preventDefault();
    if (touch.used || animating || Math.abs(dy) < 45) return;
    touch.used = true;
    goTo(current + Math.sign(dy));
  },{passive:false});
  window.addEventListener('touchend',() => { touch = null; },{passive:true});
  window.addEventListener('touchcancel',() => { touch = null; },{passive:true});

  document.addEventListener('keydown',event => {
    if (ignore(event) || event.altKey || event.target.closest('button,[role="button"]')) return;
    const down = event.key === 'PageDown' || event.key === 'ArrowDown' || event.key === ' ' && !event.shiftKey;
    const up = event.key === 'PageUp' || event.key === 'ArrowUp' || event.key === ' ' && event.shiftKey;
    if (event.key === 'Home' && !event.ctrlKey) { event.preventDefault();goTo(0);return; }
    if (!down && !up) return;
    if (scrollY > anchors[lastScene] + 4 || scrollY >= anchors[lastScene] - 4 && down && !animating) return;
    event.preventDefault();
    if (!animating) goTo(current + (down ? 1 : -1));
  });

  document.addEventListener('click',event => {
    const button = event.target.closest('[data-scene-go]');
    if (button) { event.preventDefault();goTo(Number(button.dataset.sceneGo));return; }
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.closest('dialog')) return;
    const target = link.getAttribute('href');
    const index = sceneIndex(target);
    if (index === null) return;
    event.preventDefault();
    goTo(index).then(() => {
      if (link.classList.contains('skip-link')) {
        const heading = document.querySelector('#catalog-title');
        heading.tabIndex = -1;heading.focus({preventScroll:true});
      }
    });
  });

  window.addEventListener('scroll',() => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0;update(); });
    clearTimeout(settleTimer);
    if (!animating && scrollY > 2 && scrollY < anchors[lastScene] - 4 && !document.querySelector('dialog[open]')) {
      settleTimer = setTimeout(() => {
        const closest = anchors.reduce((best,value,index) => Math.abs(value - scrollY) < Math.abs(anchors[best] - scrollY) ? index : best,0);
        goTo(closest);
      },180);
    }
  },{passive:true});
  window.addEventListener('resize',() => {
    const index = activeTarget === null ? current : activeTarget;
    const wasAnimating = activeTarget !== null;
    const version = navigationVersion;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refresh();
      if ((wasAnimating || index < lastScene) && version === navigationVersion) goTo(index,{instant:true});
    },150);
  },{passive:true});
  window.addEventListener('load',refresh,{once:true});
  motion.addEventListener('change',event => {
    if (event.matches && activeTarget !== null) goTo(activeTarget,{instant:true});
  });

  function sceneIndex(target) {
    const targets = [['#home','#scene-1'],['#collections','#scene-2'],['#catalog','#scene-3'],['#scene-4'],['#scene-5']];
    const index = targets.findIndex(group => group.includes(target));
    return index < 0 ? null : index;
  }

  window.storeScenes = {goTo,refresh,get current() {return current;},get anchors() {return [...anchors];},get transitioning() {return animating;}};
  refresh();
  const initialScene = sceneIndex(location.hash);
  if (initialScene !== null) goTo(initialScene,{instant:true});
})();
