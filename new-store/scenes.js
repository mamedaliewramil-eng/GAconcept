'use strict';

// Advance through five screens; the final screen includes the footer.
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
  let nativeScrollLock = null;
  let returningHome = false;
  let homePositioned = false;
  let directTarget = 0;
  const QUIET_GAP = 220;
  const surfaces = scenes.map((scene,index) => index === 0
    ? [...scene.querySelectorAll('.hero-copy,.hero-bottom')]
    : [...scene.children]);
  surfaces.flat().forEach(surface => surface.dataset.transitionSurface = '');

  function lockNativeScroll() {
    if (nativeScrollLock) return;
    const root = document.documentElement;
    nativeScrollLock = {overflowY:root.style.overflowY,gutter:root.style.scrollbarGutter};
    // Preserve the scrollbar's space while stopping its already queued native momentum.
    root.style.scrollbarGutter = 'stable';
    root.style.overflowY = 'hidden';
  }

  function releaseNativeScroll() {
    if (!nativeScrollLock) return;
    document.documentElement.style.overflowY = nativeScrollLock.overflowY;
    document.documentElement.style.scrollbarGutter = nativeScrollLock.gutter;
    nativeScrollLock = null;
  }

  function clearTransitionVisuals() {
    releaseNativeScroll();
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
    if (returningHome && !options.homeReturn) return Promise.resolve(false);
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
    if (index === lastScene && departure !== lastScene) {
      scenes[lastScene].querySelector('.final-scene-panel')?.scrollTo({top:0,left:0,behavior:'instant'});
    }
    const interval = anchors.findIndex((anchor,number) => number > 0 && from > anchors[number - 1] + .5 && from < anchor - .5);
    const pair = interval > 0 && (index === interval || index === interval - 1)
      ? [interval - 1,interval]
      : Math.abs(index - departure) === 1 ? [Math.min(index,departure),Math.max(index,departure)] : null;
    const heroPanel = pair !== null && pair[0] === 0 && pair[1] === 1;
    const duration = motion.matches || options.instant ? 0
      : heroPanel ? 1250 : 1100 + Math.max(0,Math.abs(index - departure) - 1) * 100;
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
        const progress = Math.max(0,Math.min(1,(now - started) / duration));
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

  async function directScene(index) {
    if (returningHome) return;
    index = Math.max(0,Math.min(lastScene,Number(index) || 0));
    measure();
    const finalPanel = index === lastScene ? scenes[lastScene].querySelector('.final-scene-panel') : null;
    const downward = anchors[index] > scrollY;
    directTarget = index;
    if (motion.matches || index === current && Math.abs(scrollY - anchors[index]) < 2 && !finalPanel?.scrollTop) {
      finalPanel?.scrollTo({top:0,left:0,behavior:'instant'});
      await goTo(index,{instant:true});
      gestureUsed = true;
      wheelTotal = 0;
      lastWheel = performance.now();
      touch = null;
      return;
    }
    // Capture only the departing and requested screens, without scrolling past intervening stages.
    clearTimeout(settleTimer);
    cancelAnimationFrame(animationFrame);
    if (animationResolve) { animationResolve(false);animationResolve = null; }
    animating = false;
    activeTarget = null;
    clearTransitionVisuals();
    returningHome = true;
    homePositioned = false;
    document.documentElement.classList.add('returning-home');
    document.documentElement.dataset.sceneJumpDirection = downward ? 'down' : 'up';
    lockNativeScroll();
    let cover;
    let sceneArrival;
    const positionTarget = async () => {
      finalPanel?.scrollTo({top:0,left:0,behavior:'instant'});
      await goTo(index,{instant:true,homeReturn:true});
      homePositioned = true;
      lockNativeScroll();
    };
    try {
      if (typeof document.startViewTransition === 'function') {
        const transition = document.startViewTransition(positionTarget);
        await transition.finished;
      } else {
        cover = document.createElement('div');
        cover.className = 'home-return-cover';
        cover.setAttribute('aria-hidden','true');
        cover.inert = true;
        if (downward) cover.style.zIndex = '1';
        const capturedScroll = [];
        const viewportTop = header.getBoundingClientRect().bottom;
        const visiblePanels = [...scenes,document.querySelector('.announcement')];
        visiblePanels.filter(Boolean).forEach(panel => {
          const bounds = panel.getBoundingClientRect();
          if (bounds.bottom <= viewportTop || bounds.top >= innerHeight) return;
          const copy = panel.cloneNode(true);
          const originals = [panel,...panel.querySelectorAll('*')];
          const copies = [copy,...copy.querySelectorAll('*')];
          // Freeze the visible appearance before removing duplicate IDs and their dependent selectors.
          copies.forEach((node,index) => {
            const original = originals[index];
            const computed = getComputedStyle(original);
            node.style.cssText = [...computed].map(property => `${property}:${computed.getPropertyValue(property)}`).join(';');
            node.removeAttribute('id');
            if (original.scrollTop || original.scrollLeft) capturedScroll.push({node,top:original.scrollTop,left:original.scrollLeft});
          });
          Object.assign(copy.style,{position:'absolute',top:`${bounds.top - viewportTop}px`,left:`${bounds.left}px`,right:'auto',bottom:'auto',width:`${bounds.width}px`,height:`${bounds.height}px`,margin:'0'});
          cover.append(copy);
        });
        document.body.append(cover);
        capturedScroll.forEach(({node,top,left}) => { node.scrollTop = top;node.scrollLeft = left; });
        await positionTarget();
        if (typeof cover.animate === 'function') {
          const timing = {duration:1250,easing:'cubic-bezier(.37,0,.63,1)',fill:'forwards'};
          sceneArrival = scenes[index].animate(downward
            ? [{transform:'translateY(100%)'},{transform:'translateY(0)'}]
            : [{opacity:0},{opacity:1}],timing);
          const departure = downward
            ? [{opacity:1},{opacity:0}]
            : [{transform:'translateY(0)'},{transform:'translateY(100%)'}];
          await Promise.all([cover.animate(departure,timing).finished,sceneArrival.finished]);
        }
      }
    } catch (_) {
      // A skipped snapshot or interrupted browser animation must still complete navigation.
      await positionTarget();
    } finally {
      cover?.remove();
      sceneArrival?.cancel();
      document.documentElement.classList.remove('returning-home');
      delete document.documentElement.dataset.sceneJumpDirection;
      releaseNativeScroll();
      returningHome = false;
      homePositioned = false;
      gestureUsed = true;
      wheelTotal = 0;
      lastWheel = performance.now();
      touch = null;
      refresh();
      window.scrollTo(0,anchors[index]);
      update();
    }
  }

  function editable(target) {
    return target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],[role="slider"]');
  }

  function canScrollInDirection(node,direction) {
    if (direction < 0) return node.scrollTop > 1;
    if (direction > 0) return node.scrollTop < node.scrollHeight - node.clientHeight - 1;
    return false;
  }

  function nestedScroller(target,direction) {
    for (let node = target instanceof Element ? target : null;node && node !== document.body;node = node.parentElement) {
      const style = getComputedStyle(node);
      if (/auto|scroll/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2) {
        // The last screen may scroll inside on small windows; its top still leads back to screen four.
        if (node.matches('#scene-5 > .final-scene-panel')) return canScrollInDirection(node,direction);
        return true;
      }
    }
    return false;
  }

  function ignore(event,direction = 0) {
    const formControl = editable(event.target) && (event.type !== 'wheel' || !!event.target.closest('textarea,select,input[type="number"],input[type="range"],[contenteditable="true"],[role="slider"]'));
    return !!document.querySelector('dialog[open]') || event.ctrlKey || event.metaKey || formControl || nestedScroller(event.target,direction);
  }

  function onWheel(event) {
    if (returningHome) {
      if (!event.ctrlKey && !event.metaKey) event.preventDefault();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    const now = performance.now();
    const quiet = now - lastWheel > QUIET_GAP;
    const finalPanel = event.target instanceof Element && event.target.closest('#scene-5 > .final-scene-panel');
    const finalContent = finalPanel && !ignore(event);
    // The gesture that brings in screen five must finish before its inner content can scroll.
    if (finalContent && (animating || gestureUsed && !quiet)) {
      event.preventDefault();
      lastWheel = now;gestureUsed = true;wheelTotal = 0;
      return;
    }
    if (ignore(event,event.deltaY)) {
      if (finalContent) { lastWheel = now;gestureUsed = false;wheelTotal = 0; }
      return;
    }
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = event.deltaY * unit;

    event.preventDefault();
    if (animating) { lastWheel = now;gestureUsed = true;wheelTotal = 0;return; }
    if (quiet) { gestureUsed = false;wheelTotal = 0;wheelDirection = 0; }
    lastWheel = now;
    if (gestureUsed) return;
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
    if (returningHome) { touch = null;return; }
    if (event.touches.length !== 1 || ignore(event)) { touch = null;return; }
    const point = event.touches[0];
    touch = {x:point.clientX,y:point.clientY,used:animating};
  },{passive:true});
  window.addEventListener('touchmove',event => {
    if (returningHome) { if (event.cancelable) event.preventDefault();return; }
    if (!touch || event.touches.length !== 1) return;
    const point = event.touches[0];
    const dy = touch.y - point.clientY;
    const dx = touch.x - point.clientX;
    if (touch.used || animating) {
      if (event.cancelable && !ignore(event)) event.preventDefault();
      return;
    }
    if (ignore(event,dy)) return;
    if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 12) return;
    if (event.cancelable) event.preventDefault();
    if (touch.used || animating || Math.abs(dy) < 45) return;
    touch.used = true;
    goTo(current + Math.sign(dy));
  },{passive:false});
  window.addEventListener('touchend',() => { touch = null; },{passive:true});
  window.addEventListener('touchcancel',() => { touch = null; },{passive:true});

  document.addEventListener('keydown',event => {
    if (returningHome) {
      if (['Home','End','PageUp','PageDown','ArrowUp','ArrowDown',' '].includes(event.key) && !event.ctrlKey && !event.metaKey) event.preventDefault();
      return;
    }
    if (ignore(event) || event.altKey || event.target.closest('button,[role="button"]')) return;
    const down = event.key === 'PageDown' || event.key === 'ArrowDown' || event.key === ' ' && !event.shiftKey;
    const up = event.key === 'PageUp' || event.key === 'ArrowUp' || event.key === ' ' && event.shiftKey;
    if (event.key === 'Home' && !event.ctrlKey) { event.preventDefault();goTo(0);return; }
    if (event.key === 'End' && !event.ctrlKey) { event.preventDefault();goTo(lastScene);return; }
    if (!down && !up) return;
    event.preventDefault();
    const finalPanel = current === lastScene ? scenes[lastScene].querySelector('.final-scene-panel') : null;
    const direction = down ? 1 : -1;
    if (!animating && finalPanel && canScrollInDirection(finalPanel,direction)) {
      const step = event.key.startsWith('Arrow') ? 40 : finalPanel.clientHeight * .85;
      finalPanel.scrollBy({top:direction * step,behavior:motion.matches ? 'auto' : 'smooth'});
      return;
    }
    if (!animating) goTo(current + (down ? 1 : -1));
  });

  document.addEventListener('click',event => {
    const button = event.target.closest('[data-scene-go]');
    if (button) {
      event.preventDefault();
      if (button.closest('.scene-navigation')) directScene(Number(button.dataset.sceneGo));
      else goTo(Number(button.dataset.sceneGo));
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.closest('dialog')) return;
    if (link.classList.contains('back-top')) { event.preventDefault();directScene(0);return; }
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
    if (returningHome) {
      if (homePositioned && scrollY !== anchors[directTarget]) window.scrollTo(0,anchors[directTarget]);
      return;
    }
    if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0;update(); });
    clearTimeout(settleTimer);
    if (!animating && scrollY > 2 && scrollY < anchors[lastScene] - 4 && !document.querySelector('dialog[open]')) {
      const version = navigationVersion;
      settleTimer = setTimeout(() => {
        if (animating || version !== navigationVersion) return;
        const closest = anchors.reduce((best,value,index) => Math.abs(value - scrollY) < Math.abs(anchors[best] - scrollY) ? index : best,0);
        goTo(closest);
      },180);
    }
  },{passive:true});
  window.addEventListener('resize',() => {
    const index = activeTarget === null ? current : activeTarget;
    const version = navigationVersion;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refresh();
      if (version === navigationVersion) goTo(index,{instant:true});
    },150);
  },{passive:true});
  window.addEventListener('load',refresh,{once:true});
  motion.addEventListener('change',event => {
    if (event.matches && activeTarget !== null) goTo(activeTarget,{instant:true});
  });

  function sceneIndex(target) {
    const targets = [['#home','#scene-1'],['#collections','#scene-2'],['#catalog','#scene-3'],['#scene-4','#secondary-collection','#mid-banner'],['#scene-5']];
    const index = targets.findIndex(group => group.includes(target));
    return index < 0 ? null : index;
  }

  window.storeScenes = {goTo,refresh,get current() {return current;},get anchors() {return [...anchors];},get transitioning() {return animating;},get returningHome() {return returningHome;}};
  refresh();
  const initialScene = sceneIndex(location.hash);
  if (initialScene !== null) goTo(initialScene,{instant:true});
})();
