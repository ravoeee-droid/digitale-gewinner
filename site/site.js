/* Digitale Gewinner – Interaktionen. Alles optional: ohne GSAP/JS bleibt die Seite voll lesbar. */
(function () {
  'use strict';

  /* ===== Konfiguration ===== */
    var WA = 'https://wa.me/4971134063951';

  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;
  var wide = function () { return window.innerWidth > 1020; };
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  if (reduce) root.classList.add('reduce');
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (!hasGsap) { root.classList.remove('js'); root.classList.add('no-js'); }
  var animate = hasGsap && !reduce;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ===== Tracking-Hook (ohne Drittanbieter) ===== */
  d.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cta]');
    if (!el) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cta_click', cta: el.getAttribute('data-cta') });
  });

  /* ===== Nav ===== */
  var nav = $('.nav'), burger = $('.burger'), mcta = $('.mcta'), hero = $('.hero');
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (mcta && hero) mcta.classList.toggle('show', y > hero.offsetHeight * .6);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var fin = $('#analyse');
  if (fin && mcta && 'IntersectionObserver' in window) new IntersectionObserver(function (en) { mcta.style.visibility = en[0].isIntersecting ? 'hidden' : ''; }, { threshold: .15 }).observe(fin);
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); }
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
  $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ===== Smooth Scroll (nur Desktop/Maus) ===== */
  var lenis = null;
  if (animate && fine && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -70 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  /* ===== Ziel-Auswahl (setzt Formular + Panels) ===== */
  function setGoal(v) {
    var r = $('input[name="goal"][value="' + v + '"]'); if (r) r.checked = true;
  }
  $$('[data-goal]').forEach(function (el) {
    el.addEventListener('click', function () {
      var g = el.getAttribute('data-goal');
      setGoal(g);
      var map = { Mitarbeiter: 'p-mit', Kunden: 'p-kun' };
      if (el.closest('.hero')) { pick(map[g], true); }
    });
  });

  $$('[data-pick]').forEach(function (a) { a.addEventListener('click', function () { pick(a.getAttribute('data-pick'), true); }); });

  /* ===== Panels: Spotlight + Mobile-Toggle ===== */
  var panels = $$('.panel');
  panels.forEach(function (p) {
    p.addEventListener('pointermove', function (e) {
      var r = p.getBoundingClientRect();
      p.style.setProperty('--mx', (e.clientX - r.left) + 'px'); p.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  var picked = false;
  function pick(id, user) {
    picked = !!user;
    panels.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('on', on); p.classList.toggle('is-picked', on && !!id && picked);
    });
    $$('.seg button').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-p') === id)); });
  }
  $$('.seg button').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-p'), true); }); });
  if (panels.length) pick(panels[0].id);

  /* ===== Erklärvideo: Overlay-Button, Tracking ===== */
  var ev = $('#expl'), eb = $('.vid-play');
  if (ev && eb) {
    ev.removeAttribute('controls');
    eb.addEventListener('click', function () {
      eb.hidden = true; ev.setAttribute('controls', ''); ev.play().catch(function () { eb.hidden = false; ev.removeAttribute('controls'); });
      window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'video_play', video: 'websystem-erklaervideo' });
    });
    ev.addEventListener('play', function () { eb.hidden = true; });
    ev.addEventListener('ended', function () { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'video_complete', video: 'websystem-erklaervideo' }); });
  }

  /* ===== Hero-Loop: bei reduzierter Bewegung anhalten ===== */
  $$('.hero-bg').forEach(function (v) {
    if (reduce || window.innerWidth < 700) { v.removeAttribute('autoplay'); v.pause(); }
    v.addEventListener('error', function () { v.style.display = 'none'; }, true);
  });

  /* ===== Hero: Intro ===== */

  /* ===== Hero-Canvas: Signalnetz ===== */
  (function net() {
    var c = $('#net'); if (!c || reduce || window.innerWidth < 900) { if (c) c.style.display = 'none'; return; }
    var cs = getComputedStyle(d.body), AC = cs.getPropertyValue('--ac-rgb').trim() || '241,206,132', AC2 = cs.getPropertyValue('--ac2-rgb').trim() || '216,166,72', SIG = cs.getPropertyValue('--sig-rgb').trim() || '255,226,160';
    var ctx = c.getContext('2d'), W, H, dpr, pts = [], mouse = { x: -999, y: -999 }, run = true, hub;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = c.getBoundingClientRect(); W = r.width; H = r.height;
      c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, Math.max(26, W * H / 20000)));
      hub = { x: W * (W > 900 ? .74 : .5), y: H * (W > 900 ? .46 : .78) };
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, s: Math.random() < .25 ? Math.random() : -1, p: Math.random() });
    }
    function frame() {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      var t = performance.now() / 1000;
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
        var dx = a.x - mouse.x, dy = a.y - mouse.y, dm = Math.sqrt(dx * dx + dy * dy);
        if (dm < 140) { a.x += dx / dm * .8; a.y += dy / dm * .8; }
        for (var j = i + 1; j < pts.length; j++) {
          var b = pts[j], ddx = a.x - b.x, ddy = a.y - b.y, dd = ddx * ddx + ddy * ddy;
          if (dd < 15000) { ctx.strokeStyle = 'rgba(' + AC + ',' + (.16 * (1 - dd / 15000)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = 'rgba(' + AC + ',.55)'; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 6.283); ctx.fill();
        if (a.s >= 0) { /* Signal wandert zum Hub = "passender Mensch → Gespräch" */
          a.p += .0035; if (a.p > 1) { a.p = 0; }
          var px = a.x + (hub.x - a.x) * a.p, py = a.y + (hub.y - a.y) * a.p;
          ctx.strokeStyle = 'rgba(' + AC2 + ',' + (.28 * (1 - a.p)) + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(px, py); ctx.stroke();
          ctx.fillStyle = 'rgba(' + SIG + ',.95)'; ctx.shadowColor = 'rgb(' + AC2 + ')'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      var pulse = 8 + Math.sin(t * 2) * 2;
      var g = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 90);
      g.addColorStop(0, 'rgba(' + AC2 + ',.35)'); g.addColorStop(1, 'rgba(' + AC2 + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hub.x, hub.y, 90, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgb(' + AC + ')'; ctx.beginPath(); ctx.arc(hub.x, hub.y, pulse, 0, 6.283); ctx.fill();
      requestAnimationFrame(frame);
    }
    size(); frame();
    window.addEventListener('resize', size);
    hero && hero.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero && hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { var v = en[0].isIntersecting; if (v && !run) { run = true; frame(); } run = v; }, { threshold: 0 }).observe(c);
  })();

  /* ===== Hero-Cockpit: Kontakte laufen ein ===== */
  (function () {
    var cards = $$('.hv-card'); if (!cards.length) return;
    if (reduce) { cards.forEach(function (c) { c.classList.add('in'); }); return; }
    var i = 0;
    function tick() {
      if (i < cards.length) { cards[i].classList.add('in'); i++; setTimeout(tick, 1300); }
      else setTimeout(function () { cards.forEach(function (c) { c.classList.remove('in'); }); i = 0; setTimeout(tick, 900); }, 5200);
    }
    setTimeout(tick, 1200);
  })();

  /* ===== Kampagnen-Beispiel: Linie zeichnet sich ===== */
  $$('.cp').forEach(function (el) {
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { el.classList.add('in'); o.disconnect(); } }, { threshold: .35 }).observe(el);
  });

  /* ===== Count-up ===== */
  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-dec') | 0), suf = el.getAttribute('data-suf') || '';
    function fmt(v) { return v.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; }
    if (!animate) { el.textContent = fmt(to); return; }
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } }); } });
  }
  $$('[data-count]').forEach(countUp);

  /* ===== Sieben Stufen: Tabs ===== */
  var sg = $('[data-stages]');
  if (sg) {
    var stabs = $$('[role="tab"]', sg), spans = $$('.st-panel', sg), cur = 0;
    var show = function (n, focus) {
      cur = (n + stabs.length) % stabs.length;
      stabs.forEach(function (b, i) { b.setAttribute('aria-selected', String(i === cur)); b.tabIndex = i === cur ? 0 : -1; });
      spans.forEach(function (p, i) { p.hidden = i !== cur; });
      if (focus) stabs[cur].focus();
      stabs[cur].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    };
    stabs.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); });
      b.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowRight') { ev.preventDefault(); show(cur + 1, true); }
        else if (ev.key === 'ArrowLeft') { ev.preventDefault(); show(cur - 1, true); }
      });
    });
    $$('[data-st]', sg).forEach(function (b) { b.addEventListener('click', function () { show(cur + (b.getAttribute('data-st') === 'next' ? 1 : -1)); }); });
  }

  /* ===== 30-Sekunden-Check ===== */
  var qz = $('[data-quiz]');
  if (qz) {
    var res = $('.q-res', qz), txt = $('.q-txt', qz);
    var val = function (n) { var r = $('input[name="' + n + '"]:checked', qz); return r ? r.value : ''; };
    var upd = function () {
      var g = val('q1'), a = val('q2'), b = val('q3'); if (!g || !a || !b) return;
      var first = a === 'c' ? 'Ihnen fehlt vor allem ein klarer Kontaktweg.' : a === 'a' ? 'Der erste Kontakt läuft ohne feste Abfolge – da gehen leicht Anfragen verloren.' : 'Ein Formular ist ein guter Start; entscheidend ist, was danach automatisch passiert.';
      var second = b === 'a' ? 'Ihre schnelle Reaktion ist ein Vorteil, den das System absichern kann.' : 'Bei der Reaktionszeit lässt sich am meisten gewinnen: Bestätigung, Erinnerung und Nachfassen können automatisch laufen.';
      txt.textContent = first + ' ' + second;
      res.hidden = false; setGoal(g);
      window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'check_complete', goal: g });
    };
    $$('input', qz).forEach(function (i) { i.addEventListener('change', upd); });
  }

  initOutbound();
  if (!hasGsap) { finishForm(); return; }

  /* ===== Hero: leichte Maus-Parallaxe für den Anzeigen-Stapel ===== */
  var stack = $('.adstack');
  if (stack && !reduce && window.matchMedia('(min-width:1021px)').matches) {
    var hero = stack.closest('.hero');
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      stack.style.setProperty('--px', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      stack.style.setProperty('--py', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    });
  }

  /* ===== Animationen nur im Sichtbereich ===== */
  if ('IntersectionObserver' in window) {
    var ao = new IntersectionObserver(function (es) { es.forEach(function (e2) { e2.target.classList.toggle('run', e2.isIntersecting); }); }, { rootMargin: '80px' });
    $$('[data-anim]').forEach(function (el) { ao.observe(el); });
  } else { $$('[data-anim]').forEach(function (el) { el.classList.add('run'); }); }

  /* ===== Einwilligung (nur aktiv, wenn eine Tag-Manager-ID gesetzt ist) ===== */
  var GTM_ID = (document.documentElement.getAttribute('data-gtm') || '').trim();
  var cb = $('#consent');
  function loadGTM() {
    if (!GTM_ID || window.__gtmLoaded) return; window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer || []; window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID); document.head.appendChild(s);
  }
  var stored = null; try { stored = localStorage.getItem('dg-consent'); } catch (err) {}
  if (GTM_ID && cb) {
    if (stored === 'yes') loadGTM(); else if (stored !== 'no') cb.hidden = false;
    $$('[data-consent]', cb).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-consent'); try { localStorage.setItem('dg-consent', v); } catch (err) {}
        cb.hidden = true; if (v === 'yes') loadGTM();
      });
    });
  }

  /* ===== Fall: Karten nacheinander einblenden ===== */
  var cf = $('#case-flow');
  if (cf && animate) {
    root.classList.add('js-motion');
    ScrollTrigger.create({ trigger: cf, start: 'top 82%', once: true, onEnter: function () { cf.classList.add('in'); } });
  }

  /* ===== Reveal ===== */
  if (animate) {
    ScrollTrigger.batch('[data-r]:not(.hero [data-r])', {
      start: 'top 90%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .95, ease: 'power3.out', stagger: .09, overwrite: true }); }
    });
    $$('.ln').forEach(function (ln) {
      if (ln.closest('.hero')) return;
      ScrollTrigger.create({ trigger: ln, start: 'top 90%', once: true, onEnter: function () { gsap.to($('span', ln), { yPercent: 0, duration: 1.1, ease: 'power4.out' }); } });
    });
  }

  /* ===== Problem: Wort-für-Wort ===== */
  $$('.statement .big').forEach(function (h) {
    var words = [];
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(' ')); return; }
            var s = d.createElement('span'); s.className = 'w'; s.textContent = t; frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) split(n);
      });
    })(h);
    if (animate) gsap.fromTo(words, { opacity: .16 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: h, start: 'top 80%', end: 'bottom 45%', scrub: .6 } });
  });

  /* ===== USP: Live-Ablauf ===== */
  (function () {
    var fl = $('.flowline'); if (!fl) return;
    var items = $$('.fl', fl), fill = $('.fill', fl);
    if (!animate) { items.forEach(function (i) { i.classList.add('on'); }); if (fill) fill.style.height = '100%'; return; }
    ScrollTrigger.create({
      trigger: fl, start: 'top 75%', end: 'bottom 55%', scrub: true,
      onUpdate: function (s) {
        var p = s.progress; fill.style.height = (p * 100) + '%';
        items.forEach(function (it, i) { it.classList.toggle('on', p >= i / items.length - .02 + .02); });
      }
    });
  })();

  /* ===== Ablauf: horizontal gepinnt (Desktop) ===== */
  (function () {
    var flow = $('.flow'); if (!flow) return;
    var wrap = $('.track-wrap', flow), track = $('.track', flow), steps = $$('.step', flow), fill = $('.rail .fill', flow);
    if (!track) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width:1021px)', function () {
      if (!animate) { steps.forEach(function (s) { s.classList.add('on'); }); return; }
      flow.classList.add('pinned');
      var dist = function () { var pl = parseFloat(getComputedStyle(wrap).paddingLeft) || 0; return Math.max(0, track.scrollWidth - (wrap.clientWidth - 2 * pl)); };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none' });
      ScrollTrigger.create({
        animation: tw, trigger: flow, start: 'top top', end: function () { return '+=' + (dist() + 400); },
        pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) {
          fill.style.width = (s.progress * 100) + '%';
          var idx = Math.min(steps.length - 1, Math.floor(s.progress * steps.length * .999));
          steps.forEach(function (st, i) { st.classList.toggle('on', i <= idx); });
        }
      });
      steps[0].classList.add('on');
      return function () { flow.classList.remove('pinned'); gsap.set(track, { clearProps: 'all' }); };
    });
    mm.add('(max-width:1020px)', function () {
      steps.forEach(function (s) { s.classList.add('on'); });
      steps.forEach(function (s) { if (animate) gsap.from(s, { opacity: 0, y: 30, duration: .8, scrollTrigger: { trigger: s, start: 'top 90%', once: true } }); });
    });
  })();

  /* ===== Automatisierung ===== */
  $$('.strike').forEach(function (s) {
    if (!animate) { s.classList.add('in'); return; }
    ScrollTrigger.create({ trigger: s, start: 'top 80%', once: true, onEnter: function () { s.classList.add('in'); } });
  });
  (function () {
    var list = $('.checks'); if (!list) return;
    var li = $$('li', list);
    if (!animate) { li.forEach(function (x) { x.classList.add('done'); }); return; }
    ScrollTrigger.create({
      trigger: list, start: 'top 75%', end: 'bottom 60%', scrub: true,
      onUpdate: function (s) { li.forEach(function (x, i) { x.classList.toggle('done', s.progress * (li.length + 1) > i + .3); }); }
    });
  })();

  /* ===== Portrait Parallax ===== */
  $$('.portrait img, .pb img').forEach(function (img) {
    if (animate) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ===== FAQ: weiche Höhe ===== */
  $$('.faq details').forEach(function (dt) {
    var sum = $('summary', dt), a = $('.a', dt);
    sum.addEventListener('click', function (e) {
      if (reduce) return;
      e.preventDefault();
      if (dt.open) {
        gsap.to(a, { height: 0, duration: .45, ease: 'power3.inOut', onComplete: function () { dt.open = false; } });
      } else {
        dt.open = true; gsap.fromTo(a, { height: 0 }, { height: 'auto', duration: .5, ease: 'power3.out' });
      }
    });
  });

  /* ===== Magnet-Buttons ===== */
  if (animate && fine) {
    $$('.btn-gold').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { '--bx': (e.clientX - r.left - r.width / 2) * .18 + 'px', '--by': (e.clientY - r.top - r.height / 2) * .3 + 'px', duration: .4, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', function () { gsap.to(b, { '--bx': '0px', '--by': '0px', duration: .6, ease: 'elastic.out(1,.5)' }); });
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  finishForm();

  /* ===== Formular: Ziel → Kontakt → Kalender ===== */
  function finishForm() {
    var form = $('#leadForm'); if (!form) return;
    var s1 = $('.s1', form), s2 = $('.s2', form), bars = $$('.stepbar i', form), err = $('.err', form);
    function show(n) {
      s1.hidden = n !== 1; s2.hidden = n !== 2;
      bars.forEach(function (b, i) { b.classList.toggle('on', i < n); });
      if (n === 2) { var f = $('input[name="name"]', form); f && f.focus({ preventScroll: true }); }
    }
    show(1);
    $('.next-btn', form).addEventListener('click', function () {
      if (!$('input[name="goal"]:checked', form)) { err.textContent = 'Bitte wählen Sie Ihr wichtigstes Ziel.'; return; }
      err.textContent = ''; show(2);
    });
    $('.back-btn', form).addEventListener('click', function () { show(1); });
    // Kampagnen-Parameter mitgeben
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'gclid', 'fbclid', 'd'].forEach(function (k) {
      var i = $('input[name="' + k + '"]', form); if (i && q.get(k)) i.value = q.get(k);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      if (data.get('bot-field')) return;
      var name = String(data.get('name') || '').trim(), contact = String(data.get('contact') || '').trim(), goal = String(data.get('goal') || '');
      var err2 = $('.err2', form);
      if (!name || contact.length < 5) { err2.textContent = 'Bitte Name und Telefon oder E-Mail angeben.'; return; }
      err2.textContent = '';
      var btn = $('button[type=submit]', form); btn.disabled = true;
      var body = new URLSearchParams(); data.forEach(function (v, k) { body.append(k, String(v)); });
      var link = $('.wa-link', form);
      var msg = 'Hallo Raphael, ich möchte die kostenlose 15-Minuten-Analyse.\n\nName: ' + name + '\nKontakt: ' + contact + '\nZiel: ' + goal;
      var wa = WA + '?text=' + encodeURIComponent(msg);
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }).catch(function () { });
      window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'lead_submit', goal: goal });
      form.classList.add('sent');
      link.href = wa;
      $('.done-txt', form).textContent = 'Senden Sie die vorbereitete Nachricht in WhatsApp ab. Oder wählen Sie direkt einen freien Termin im Kalender.';
      window.open(wa, '_blank', 'noopener');
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ===== Outbound-Landingpage: personalisierte Daten ===== */
  function initOutbound() {
    var o = $('#outbound'); if (!o) return;
    var q = new URLSearchParams(location.search), slug = (q.get('d') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
    var notice = $('#ob-notice'), main = $('#ob-main'), body = $('#ob-body');
    function setShown(on) { main.hidden = !on; body.hidden = !on; notice.hidden = on; }
    var nouns = { pflege: 'Pflegekräfte', fach: 'Fachkräfte', kunden: 'Kundenanfragen' };
    function t(id, v) { var e = d.getElementById(id); if (e) e.textContent = v; }
    if (!slug) { setShown(false); return; }
    fetch('/analyse-data/' + slug + '.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      var noun = nouns[j.target] || 'Anfragen';
      d.title = 'Persönliche Analyse für ' + j.company + ' – Digitale Gewinner';
      t('ob-eyebrow', 'Persönliche Analyse für ' + j.company);
      t('ob-h1', 'Zwei konkrete Ideen für mehr ' + noun + ' in ' + j.region + '.');
      var v = $('#ob-video');
      if (j.video && /^https:\/\//.test(j.video)) { v.innerHTML = ''; var f = d.createElement('iframe'); f.src = j.video; f.title = 'Persönliches Video für ' + j.company; f.allow = 'fullscreen; picture-in-picture'; f.loading = 'lazy'; v.appendChild(f); }
      else v.parentNode.hidden = true;
      (j.observations || []).slice(0, 2).forEach(function (ob, i) {
        t('ob-t' + (i + 1), ob.title); t('ob-p' + (i + 1), ob.text); t('ob-n' + (i + 1), ob.proof || '');
        var s = d.getElementById('ob-s' + (i + 1));
        if (ob.image && /^\/?assets\//.test(ob.image)) { s.innerHTML = ''; var im = d.createElement('img'); im.src = ob.image.replace(/^\/?/, '/'); im.alt = 'Beleg: ' + ob.title; im.loading = 'lazy'; s.appendChild(im); }
      });
      t('ob-next', j.next || '');
      $$('[data-company]').forEach(function (e) { e.textContent = j.company; });
      setShown(true);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }).catch(function () { setShown(false); });
  }
})();

/* Video erst auf Klick laden (Datenschutz): Vorschaubild -> Wistia-Player */
(function () {
  document.querySelectorAll('.vid[data-embed]').forEach(function (box) {
    var link = box.querySelector('.vid-open');
    if (!link) return;
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-embed');
      f.title = box.getAttribute('data-title') || 'Video';
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      box.replaceChildren(f);
      f.focus();
    });
  });
})();

/* ===== Recruiting-Check: Bewerber-Weg mit 8 Stationen (Spiel) ===== */
(function () {
  var root = document.querySelector('[data-rc]');
  if (!root) return;
  var kind = root.getAttribute('data-kind') === 'handwerk' ? 'handwerk' : 'pflege';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/4971134063951';
  var CAL = 'https://calendar.app.google/jZqwYfHqfjufkFmx5';
  var P = kind === 'handwerk' ? { name: 'Jonas', job: 'Elektroniker', noun: 'Fachkräfte', pron: 'er' } : { name: 'Anna', job: 'Pflegefachkraft', noun: 'Pflegekräfte', pron: 'sie' };
  var Q = [
    { st: 'Gefunden werden', q: 'Wie finden ' + P.noun + ' aus Ihrer Region Ihren Betrieb?',
      o: [['Gezielte Werbung online und ein klarer Google-Auftritt', 2], ['Nur über Jobportale', 1], ['Vor allem über Mundpropaganda', 0]],
      good: 'Sie sind dort sichtbar, wo gesucht wird.', tip: 'Machen Sie Ihr Angebot dort sichtbar, wo ' + P.noun + ' aus Ihrer Region ohnehin unterwegs sind, etwa mit gezielter Werbung in sozialen Netzwerken und einem klaren Google-Auftritt.' },
    { st: 'Stellenanzeige', q: 'Was sagt Ihre Stellenanzeige zuerst?',
      o: [['Was Bewerber bei uns bekommen', 2], ['Aufgaben und Anforderungen gemischt', 1], ['Nur Anforderungen', 0]],
      good: 'Ihre Anzeige beginnt mit dem Nutzen.', tip: 'Beginnen Sie mit dem, was Bewerber bekommen: Arbeitsklima, Team, Rahmenbedingungen. Anforderungen kommen danach und kurz.' },
    { st: 'Team-Eindruck', q: 'Was sieht ' + P.name + ' von Ihrem Team, bevor ' + P.pron + ' sich meldet?',
      o: [['Echte Fotos oder ein Video vom Team', 2], ['Nur Logo und Text', 1], ['Praktisch nichts', 0]],
      good: 'Echte Gesichter schaffen Vertrauen.', tip: 'Zeigen Sie echte Menschen aus Ihrem Team in Foto oder Video. Das schafft Vertrauen, bevor sich jemand meldet.' },
    { st: 'Bewerbung', q: 'Wie bewirbt man sich bei Ihnen?',
      o: [['Kurz am Handy, ohne Lebenslauf', 2], ['Über ein Formular mit Lebenslauf', 1], ['Nur per Post oder E-Mail', 0]],
      good: 'Der erste Schritt ist leicht.', tip: 'Ermöglichen Sie eine Kurzbewerbung am Handy. Name und Telefonnummer genügen für den ersten Schritt.' },
    { st: 'Erste Antwort', q: 'Wie schnell antworten Sie auf eine Bewerbung?',
      o: [['Am selben Tag', 2], ['Nach zwei bis drei Tagen', 1], ['Später oder unregelmäßig', 0]],
      good: 'Schnelle Antwort, starkes Signal.', tip: 'Antworten Sie am selben Tag, mindestens mit einer Bestätigung und einem Terminvorschlag.' },
    { st: 'Zuständigkeit', q: 'Wer meldet sich bei Bewerbern zurück?',
      o: [['Eine feste Person mit festem Ablauf', 2], ['Mal der, mal die andere', 1], ['Das ist nicht festgelegt', 0]],
      good: 'Klare Zuständigkeit.', tip: 'Legen Sie eine feste Person und einen festen Ablauf fest: wer ruft wann zurück.' },
    { st: 'Nachfassen', q: 'Was passiert, wenn ein Bewerber nicht zurückruft?',
      o: [['Erinnerung und Nachfassen laufen automatisch', 2], ['Wir melden uns, wenn Zeit ist', 1], ['Nichts', 0]],
      good: 'Niemand bleibt liegen.', tip: 'Richten Sie Erinnerung und Nachfassen ein, damit kein Interessent liegen bleibt.' },
    { st: 'Zahlen', q: 'Wissen Sie, was eine Bewerbung und eine Einstellung Sie kosten?',
      o: [['Ja, genau', 2], ['Grob', 1], ['Nein', 0]],
      good: 'Sie steuern mit Zahlen.', tip: 'Erfassen Sie Kosten pro Bewerbung und pro Einstellung. So sehen Sie, was funktioniert und was nicht.' }
  ];
  var N = Q.length;
  var RANKS = [
    { min: 0, name: 'Starter', txt: 'Hier liegt viel ungenutztes Potenzial. Schon zwei, drei Änderungen machen den Weg für Bewerber spürbar leichter.' },
    { min: 35, name: 'Aufsteiger', txt: 'Die Basis steht. An einigen Stationen verlieren Sie noch Interessenten, die Sie leicht halten könnten.' },
    { min: 60, name: 'Profi', txt: 'Ihr Weg ist stark. Mit den Hebeln unten holen Sie die letzten Prozentpunkte heraus.' },
    { min: 85, name: 'Bewerber-Magnet', txt: 'Sehr stark. Ihr Betrieb macht Bewerbern den Weg fast überall leicht.' }
  ];
  var ans = [], streak = 0, best = 0, cur = 0;
  var el = {};

  function h(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rankFor(score) { var r = RANKS[0]; RANKS.forEach(function (x) { if (score >= x.min) r = x; }); return r; }
  function total() { return ans.reduce(function (a, b) { return a + b; }, 0); }
  function score() { return Math.round(total() / (N * 2) * 100); }
  function buzz(ms) { if (!reduce && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { } } }
  function push(ev, d) { window.dataLayer = window.dataLayer || []; var o = { event: ev }; for (var k in d) o[k] = d[k]; window.dataLayer.push(o); }

  function build() {
    root.innerHTML = '';
    var stage = h('div', 'rc-stage');
    var hud = h('div', 'rc-hud', '<span class="rc-rank" data-rank>Starter</span><div class="rc-xp" aria-hidden="true"><i></i></div><span class="rc-xpn"><b data-xp>0</b> XP</span>');
    var track = h('div', 'rc-trackwrap');
    var ol = h('ol', 'rc-track');
    ol.setAttribute('aria-label', 'Stationen des Bewerber-Wegs');
    ol.innerHTML = Q.map(function (q, i) { return '<li class="rc-node" data-i="' + i + '"><span class="rc-dot"><b>' + (i + 1) + '</b></span><span class="rc-nl">' + esc(q.st) + '</span></li>'; }).join('');
    var line = h('div', 'rc-line', '<i></i>');
    var cand = h('div', 'rc-cand', '<span>' + P.name[0] + '</span>');
    cand.setAttribute('aria-hidden', 'true');
    track.appendChild(line); track.appendChild(ol); track.appendChild(cand);
    var body = h('div', 'rc-body');
    var fx = h('canvas', 'rc-fx'); fx.setAttribute('aria-hidden', 'true');
    stage.appendChild(hud); stage.appendChild(track); stage.appendChild(body); stage.appendChild(fx);
    root.appendChild(stage);
    el = { stage: stage, body: body, track: track, ol: ol, cand: cand, line: line.firstChild, rank: hud.querySelector('[data-rank]'), xp: hud.querySelector('[data-xp]'), xpbar: hud.querySelector('.rc-xp i'), fx: fx };
    moveTo(0, true);
    intro();
  }

  function moveTo(f, instant) {
    var frac = N > 1 ? Math.min(f, N - 1) / (N - 1) : 0;
    el.cand.style.transition = (reduce || instant) ? 'none' : '';
    el.cand.style.setProperty('--f', frac);
    el.line.style.transform = 'scaleX(' + frac + ')';
    Array.prototype.forEach.call(el.ol.children, function (li, i) { li.classList.toggle('now', i === f); });
  }
  function swap(node, focusSel) {
    var old = el.body.firstChild;
    function put() {
      el.body.innerHTML = ''; el.body.appendChild(node);
      node.classList.add('rc-in');
      var t = node.querySelector(focusSel || '[tabindex="-1"]'); if (t) t.focus({ preventScroll: true });
    }
    if (old && !reduce) { old.classList.add('rc-out'); setTimeout(put, 240); } else put();
  }
  function updateHud() {
    var xp = total() * 50;
    el.xp.textContent = xp;
    el.xpbar.style.transform = 'scaleX(' + (ans.length / N) + ')';
    el.rank.textContent = ans.length ? rankFor(score()).name : 'Starter';
  }

  function intro() {
    var v = h('div', 'rc-view rc-intro');
    v.innerHTML = '<h3 tabindex="-1">Hier kommt ' + esc(P.name) + ', ' + esc(P.job) + '.</h3>' +
      '<p>' + esc(P.name) + ' hat Ihre Stelle gesehen. Auf dem Weg zum Gespräch warten acht Stationen. Beantworten Sie ehrlich, wie es bei Ihnen läuft, und sehen Sie, wie weit ' + esc(P.pron) + ' kommt.</p>' +
      '<button class="btn btn-gold rc-go" type="button">Los geht’s <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>' +
      '<p class="rc-hint">8 Fragen · ca. 2 Minuten · ohne Anmeldung</p>';
    v.querySelector('.rc-go').addEventListener('click', function () { push('check_start', { kind: kind }); cur = 0; question(); });
    el.body.innerHTML = ''; el.body.appendChild(v); v.classList.add('rc-in');
  }

  function question() {
    var q = Q[cur];
    moveTo(cur);
    var v = h('div', 'rc-view rc-q');
    var opts = q.o.map(function (o, i) {
      return '<label class="rc-opt"><input type="radio" name="rcq' + cur + '" value="' + i + '"><span class="rc-k">' + (i + 1) + '</span><span class="rc-ot">' + esc(o[0]) + '</span></label>';
    }).join('');
    v.innerHTML = '<p class="rc-meta">Station ' + (cur + 1) + ' von ' + N + ' · ' + esc(q.st) + '</p>' +
      '<fieldset class="rc-fs"><legend tabindex="-1">' + esc(q.q) + '</legend><div class="rc-opts">' + opts + '</div></fieldset>' +
      '<p class="rc-fb" role="status" aria-live="polite"></p>' +
      (cur > 0 ? '<button class="rc-back" type="button">← Zurück</button>' : '');
    var locked = false;
    function choose(i) {
      if (locked) return; locked = true;
      var pts = q.o[i][1];
      ans[cur] = pts;
      streak = pts === 2 ? streak + 1 : 0; best = Math.max(best, streak);
      Array.prototype.forEach.call(v.querySelectorAll('.rc-opt'), function (l, k) { l.classList.toggle('on', k === i); l.querySelector('input').disabled = true; });
      var node = el.ol.children[cur];
      node.classList.add('p' + pts, 'done');
      var fb = v.querySelector('.rc-fb');
      fb.className = 'rc-fb s' + pts;
      fb.textContent = pts === 2 ? (streak >= 3 ? 'Serie ×' + streak + '! ' : '') + q.good : (pts === 1 ? 'Da geht noch mehr.' : 'Hier springt ' + P.name + ' leicht ab.');
      floatXP(v, pts * 50);
      if (pts === 2) burst(node); buzz(pts === 2 ? 18 : 8);
      updateHud();
      push('check_answer', { station: q.st, points: pts });
      setTimeout(function () {
        cur++;
        if (cur >= N) { moveTo(N - 1); result(); } else question();
      }, reduce ? 200 : 1000);
    }
    Array.prototype.forEach.call(v.querySelectorAll('input'), function (inp, i) { inp.addEventListener('change', function () { choose(i); }); });
    var back = v.querySelector('.rc-back');
    if (back) back.addEventListener('click', function () { if (locked) return; cur--; ans.length = cur; var n = el.ol.children[cur]; n.classList.remove('p0', 'p1', 'p2', 'done'); streak = 0; updateHud(); question(); });
    v.addEventListener('keydown', function (e) {
      if (e.key >= '1' && e.key <= '3') { var inp = v.querySelectorAll('input')[+e.key - 1]; if (inp && !locked) { inp.checked = true; choose(+e.key - 1); } }
    });
    swap(v, 'legend');
  }

  function floatXP(v, n) {
    if (reduce || !n) return;
    var f = h('span', 'rc-float', '+' + n + ' XP');
    v.appendChild(f); setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 1100);
  }

  /* Konfetti-Funke an einer Station */
  var parts = [], raf = 0;
  function burst(node) {
    if (reduce) return;
    var c = el.fx, st = el.stage.getBoundingClientRect(), r = node.querySelector('.rc-dot').getBoundingClientRect();
    c.width = st.width; c.height = st.height;
    var x = r.left - st.left + r.width / 2, y = r.top - st.top + r.height / 2;
    for (var i = 0; i < 22; i++) { var a = Math.random() * Math.PI * 2, s = 1.4 + Math.random() * 2.6; parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, hue: Math.random() < .5 ? 'a' : 'b' }); }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    var c = el.fx, g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    var st = getComputedStyle(el.stage), ca = st.getPropertyValue('--rc-a').trim() || '#7ee0cc', cb = '#ffffff';
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .06; p.life -= .022; g.globalAlpha = Math.max(p.life, 0); g.fillStyle = p.hue === 'a' ? ca : cb; g.beginPath(); g.arc(p.x, p.y, 2.4, 0, 6.283); g.fill(); });
    g.globalAlpha = 1;
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) g.clearRect(0, 0, c.width, c.height);
  }

  function countUp(node, to, ms) {
    if (reduce) { node.textContent = to; return; }
    var t0 = null;
    function f(t) { if (!t0) t0 = t; var k = Math.min((t - t0) / ms, 1), e = 1 - Math.pow(1 - k, 3); node.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }

  function result() {
    var sc = score(), rk = rankFor(sc);
    var gaps = Q.map(function (q, i) { return { i: i, q: q, p: ans[i] }; }).filter(function (x) { return x.p < 2; }).sort(function (a, b) { return a.p - b.p || a.i - b.i; }).slice(0, 3);
    var strong = Q.map(function (q, i) { return { q: q, p: ans[i] }; }).filter(function (x) { return x.p === 2; });
    var C = 2 * Math.PI * 54;
    var v = h('div', 'rc-view rc-res');
    v.innerHTML = '<div class="rc-print">' +
      '<p class="rc-printhead">Recruiting-Check · digitalegewinner.de · ' + new Date().toLocaleDateString('de-DE') + '</p>' +
      '<div class="rc-top"><div class="rc-gauge"><svg viewBox="0 0 128 128" aria-hidden="true"><circle class="bg" cx="64" cy="64" r="54"/><circle class="fg" cx="64" cy="64" r="54" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg><div class="rc-gv"><b data-sc>0</b><small>von 100</small></div></div>' +
      '<div class="rc-rk"><span class="rc-badge"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 16.6 6.1 19.8l1.3-6.5L2.5 8.8 9.1 8z" fill="currentColor"/></svg> Rang: ' + esc(rk.name) + '</span>' +
      '<h3 tabindex="-1">Ihr Recruiting-Score: ' + sc + ' von 100</h3><p>' + esc(rk.txt) + '</p>' +
      (best >= 3 ? '<p class="rc-streak">Serie ×' + best + ' · ' + best + ' Stationen in Folge voll gemeistert</p>' : '') + '</div></div>' +
      (gaps.length ? '<h4 class="rc-h4">Ihre ' + (gaps.length === 1 ? 'größte Chance' : gaps.length + ' größten Hebel') + '</h4><ol class="rc-gaps">' + gaps.map(function (g, k) { return '<li style="--d:' + (k * 120) + 'ms"><span class="rc-gn">' + (k + 1) + '</span><div><b>' + esc(g.q.st) + '</b><p>' + esc(g.q.tip) + '</p></div></li>'; }).join('') + '</ol>'
        : '<p class="rc-all">Alle 8 Stationen voll gemeistert. Stark.</p>') +
      (strong.length ? '<p class="rc-strong"><b>Das machen Sie schon richtig:</b> ' + strong.slice(0, 4).map(function (x) { return esc(x.q.st); }).join(' · ') + '</p>' : '') +
      '<p class="rc-printnote">Erste Orientierung auf Basis Ihrer Selbsteinschätzung. Kostenlose 15-Minuten-Analyse: digitalegewinner.de</p></div>' +
      '<div class="rc-cta"><a class="btn btn-gold" href="' + CAL + '" target="_blank" rel="noopener" data-cta="check-termin">Ergebnis in 15 Minuten besprechen <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>' +
      '<button class="btn rc-pdf" type="button">Auswertung als PDF speichern</button></div>' +
      '<form class="rc-form" novalidate><p class="rc-ft">Ergebnis direkt an Raphael senden</p>' +
      '<div class="rc-ff"><label for="rc-n">Name</label><input id="rc-n" name="name" autocomplete="name"></div>' +
      '<div class="rc-ff"><label for="rc-c">Telefon oder E-Mail</label><input id="rc-c" name="contact" autocomplete="tel" required></div>' +
      '<p class="rc-err" role="alert"></p>' +
      '<button class="btn btn-gold" type="submit">Ergebnis senden <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>' +
      '<p class="rc-fine2">Es öffnet sich WhatsApp mit einer vorbereiteten Nachricht. Mehr dazu in der <a href="/datenschutz.html">Datenschutzerklärung</a>.</p></form>' +
      '<button class="rc-again" type="button">Noch einmal spielen</button>';
    swap(v, 'h3');
    setTimeout(function () {
      var fg = v.querySelector('.rc-gauge .fg'); if (fg) { fg.style.transition = reduce ? 'none' : ''; fg.style.strokeDashoffset = (C * (1 - sc / 100)).toFixed(1); }
      countUp(v.querySelector('[data-sc]'), sc, 1500);
      if (sc >= 60) Array.prototype.forEach.call(el.ol.children, function (n, i) { setTimeout(function () { burst(n); }, i * 90); });
    }, reduce ? 0 : 350);
    el.rank.textContent = rk.name;
    push('check_complete', { score: sc, rank: rk.name, kind: kind });
    v.querySelector('.rc-pdf').addEventListener('click', function () { push('check_pdf', { score: sc }); window.print(); });
    v.querySelector('.rc-again').addEventListener('click', function () {
      ans = []; streak = 0; best = 0; cur = 0;
      Array.prototype.forEach.call(el.ol.children, function (n) { n.classList.remove('p0', 'p1', 'p2', 'done'); });
      updateHud(); moveTo(0); intro();
    });
    var form = v.querySelector('.rc-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), contact = form.contact.value.trim();
      var err = form.querySelector('.rc-err');
      if (contact.length < 5) { err.textContent = 'Bitte Telefon oder E-Mail angeben.'; return; }
      err.textContent = '';
      var lines = gaps.map(function (g) { return '- ' + g.q.st; }).join('\n');
      var msg = 'Hallo Raphael, ich habe den Recruiting-Check gemacht.\n\nScore: ' + sc + ' von 100 (' + rk.name + ')\nGrößte Hebel:\n' + (lines || '- keine') + '\n\nName: ' + (name || '-') + '\nKontakt: ' + contact;
      var body = new URLSearchParams({ 'form-name': 'recruiting-check', name: name, contact: contact, score: String(sc), rank: rk.name, kind: kind, answers: ans.join('') });
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }).catch(function () { });
      push('check_lead', { score: sc, kind: kind });
      form.innerHTML = '<p class="rc-thx"><b>Danke.</b> WhatsApp öffnet sich mit Ihrem Ergebnis. Senden Sie die Nachricht dort einfach ab.</p><a class="btn btn-gold" href="' + WA + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">Nachricht in WhatsApp öffnen</a>';
      window.open(WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  build();
})();
