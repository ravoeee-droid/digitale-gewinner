(() => {
  'use strict';
  const menuButton = document.querySelector('.mobile-menu');
  const mobileMenu = document.getElementById('mobile-nav');
  if (menuButton && mobileMenu) {
    const close = () => { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Menü öffnen'); };
    menuButton.addEventListener('click', () => {
      const nextOpen = mobileMenu.hidden;
      mobileMenu.hidden = !nextOpen;
      menuButton.setAttribute('aria-expanded', String(nextOpen));
      menuButton.setAttribute('aria-label', nextOpen ? 'Menü schließen' : 'Menü öffnen');
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const threads = [
    { node: document.querySelector('.filament-back'), factor: 0.11 },
    { node: document.querySelector('.filament-near'), factor: 0.19 },
    { node: document.querySelector('.filament-glow'), factor: 0.19 }
  ].filter(item => item.node);
  let current = window.scrollY || 0;
  let target = current;
  let animationFrame = 0;
  const draw = () => {
    current += (target - current) * .105;
    const mobileScale = window.innerWidth < 820 ? .38 : 1;
    for (const thread of threads) {
      const distance = Math.min(520, Math.max(0, current)) * thread.factor * mobileScale;
      thread.node.style.transform = `translate3d(0, ${distance.toFixed(2)}px, 0)`;
    }
    if (Math.abs(target - current) > .15) animationFrame = requestAnimationFrame(draw);
    else animationFrame = 0;
  };
  const update = () => {
    if (reduceMotion.matches) return;
    target = window.scrollY || 0;
    if (!animationFrame) animationFrame = requestAnimationFrame(draw);
  };
  const motionChange = () => {
    if (reduceMotion.matches) {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      for (const t of threads) t.node.style.transform = '';
    } else { update(); }
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', motionChange);
})();