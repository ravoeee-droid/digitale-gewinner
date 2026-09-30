(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

  // Lenis (JS-driven smooth scroll) was removed: it caused two separate
  // production bugs (scroll freezing, a fixed-position widget rendering
  // clipped at the left edge after scrolling) that never reproduced in
  // isolated testing, consistent with a scroll-library/fixed-positioning
  // interaction that's not worth the "buttery scroll" feel. Native
  // scroll-behavior:smooth (already in the page CSS) covers anchor jumps.

  try {
    if (!reduceMotion && fine) {
      var glow = document.createElement('div');
      glow.className = 'fx-cursor-glow';
      document.body.appendChild(glow);
      var gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
      window.addEventListener('mousemove', function(e){ gx = e.clientX; gy = e.clientY; });
      (function loop(){
        cx += (gx - cx) * 0.12;
        cy += (gy - cy) * 0.12;
        glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        requestAnimationFrame(loop);
      })();
    }
  } catch (err) { console.warn('fx: cursor glow disabled', err); }

  try {
    if (!reduceMotion && fine) {
      document.querySelectorAll('.btn-primary').forEach(function(btn){
        btn.addEventListener('mousemove', function(e){
          var r = btn.getBoundingClientRect();
          var mx = e.clientX - r.left - r.width / 2;
          var my = e.clientY - r.top - r.height / 2;
          btn.style.transform = 'translate(' + (mx * 0.22) + 'px,' + (my * 0.32) + 'px)';
        });
        btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
      });
    }
  } catch (err) { console.warn('fx: magnetic buttons disabled', err); }

  try {
    if (!reduceMotion && fine) {
      document.querySelectorAll('.card, .pillar, .review, .step, .tl-step').forEach(function(el){
        el.style.transformStyle = 'preserve-3d';
        el.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
        el.addEventListener('mousemove', function(e){
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(900px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 8) + 'deg) translateZ(6px)';
        });
        el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
      });
    }
  } catch (err) { console.warn('fx: card tilt disabled', err); }

  try {
    var progress = document.createElement('div');
    progress.className = 'fx-progress';
    document.body.appendChild(progress);
    var updateProgress = function(){
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var height = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      progress.style.width = (height > 0 ? Math.min(100, (scrolled / height) * 100) : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  } catch (err) { console.warn('fx: scroll progress disabled', err); }

  try {
    document.querySelectorAll('[data-fx-split]').forEach(function(el){
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function(w, i){
        return '<span class="fx-word" style="transition-delay:' + (i * 0.055) + 's">' + w + '</span>';
      }).join(' ');
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('fx-in'); }); });
    });
  } catch (err) { console.warn('fx: text split disabled', err); }

  try {
    var counters = document.querySelectorAll('[data-fx-count]');
    if (counters.length) {
      var co = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (!entry.isIntersecting) return;
          co.unobserve(entry.target);
          var el = entry.target;
          var target = parseFloat(el.getAttribute('data-fx-count'));
          var suffix = el.getAttribute('data-fx-suffix') || '';
          var decimals = el.getAttribute('data-fx-decimals') ? parseInt(el.getAttribute('data-fx-decimals'), 10) : 0;
          function fmt(n){ return n.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }
          if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
          var dur = 1300, t0 = null;
          function step(ts){
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var val = target * (1 - Math.pow(1 - p, 3));
            el.textContent = fmt(val) + suffix;
            if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target) + suffix;
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      counters.forEach(function(el){ co.observe(el); });
    }
  } catch (err) { console.warn('fx: counters disabled', err); }

  try {
    if (!reduceMotion && window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll('.fx-clip').forEach(function(el){
        el.classList.add('fx-ready');
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
    }
  } catch (err) { console.warn('fx: image reveal disabled', err); }
})();
