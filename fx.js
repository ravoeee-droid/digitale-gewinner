(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

  try {
    if (!reduceMotion && window.Lenis) {
      var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      if (window.gsap) {
        gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
        if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
      } else {
        requestAnimationFrame(function raf(time){ lenis.raf(time); requestAnimationFrame(raf); });
      }
    }
  } catch (err) { console.warn('fx: smooth scroll disabled', err); }

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
