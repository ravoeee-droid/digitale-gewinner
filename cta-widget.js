(function(){
  var text = window.CTA_WIDGET_TEXT || "Hallo Raphael, ich wollte dir kurz zeigen, wo es bei uns gerade hängt.";
  var el = document.createElement('a');
  el.className = 'cta-widget';
  el.href = 'https://wa.me/4971134063951?text=' + encodeURIComponent(text);
  el.target = '_blank';
  el.rel = 'noopener';
  el.innerHTML = '<img src="/assets/images/brand/raphael-bruno-schreibtisch.webp" alt="" aria-hidden="true"><span>Zeig mir, wo es hängt</span>';
  document.body.appendChild(el);

  var shown = false;
  function onScroll(){
    if (shown) return;
    if (window.scrollY > window.innerHeight * 0.9) {
      el.classList.add('visible');
      shown = true;
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
