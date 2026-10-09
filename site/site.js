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
