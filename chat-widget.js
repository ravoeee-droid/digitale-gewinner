(function(){
  var waText = window.CTA_WIDGET_TEXT || 'Hallo Raphael, ich wollte dir kurz zeigen, wo es bei uns gerade hängt.';
  var waNumber = '4971134063951';

  var fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Chat öffnen');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 0 1-8 8H6l-3 2 1-3.5A8 8 0 1 1 21 12Z"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML =
    '<div class="chat-head">' +
      '<img src="/assets/images/brand/raphael-bruno-schreibtisch.webp" alt="">' +
      '<div><b>KI-Assistent von Raphael</b><span>Antwort in wenigen Sekunden</span></div>' +
      '<button class="chat-close" aria-label="Schließen">✕</button>' +
    '</div>' +
    '<div class="chat-messages"></div>' +
    '<form class="chat-form">' +
      '<input type="text" placeholder="Deine Frage ..." maxlength="500" required>' +
      '<button type="submit">→</button>' +
    '</form>' +
    '<div class="chat-footer"><small style="display:block;opacity:.7;margin-bottom:6px">Dieser Chat nutzt KI; deine Nachrichten werden dafür verarbeitet.</small><a href="https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waText) + '" target="_blank" rel="noopener">Lieber direkt mit Raphael auf WhatsApp schreiben →</a></div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var messagesEl = panel.querySelector('.chat-messages');
  var formEl = panel.querySelector('.chat-form');
  var inputEl = panel.querySelector('input');
  var closeEl = panel.querySelector('.chat-close');
  var history = [];
  var opened = false;

  function addBubble(role, text){
    var el = document.createElement('div');
    el.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function addWaHint(){
    var el = document.createElement('div');
    el.className = 'chat-wa-hint';
    el.innerHTML = 'Am schnellsten geht es direkt bei Raphael: <a href="https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waText) + '" target="_blank" rel="noopener">Jetzt auf WhatsApp schreiben →</a>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  fab.addEventListener('click', function(){
    panel.classList.toggle('open');
    if (!opened) {
      opened = true;
      addBubble('bot', 'Hallo, ich bin der KI-Assistent von Raphael. Frag mich kurz, was dich beschäftigt – oder schreib gleich direkt mit Raphael über WhatsApp.');
    }
  });
  closeEl.addEventListener('click', function(){ panel.classList.remove('open'); });

  formEl.addEventListener('submit', function(e){
    e.preventDefault();
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addBubble('user', text);
    history.push({ role: 'user', content: text });

    var typing = addBubble('bot', 'schreibt ...');
    typing.classList.add('typing');

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-20) })
    }).then(function(res){ return res.json().then(function(data){ return { ok: res.ok, data: data }; }); })
      .then(function(result){
        typing.remove();
        if (!result.ok || !result.data.reply) {
          addBubble('bot', 'Sorry, gerade klappt die Antwort nicht.');
          addWaHint();
          return;
        }
        addBubble('bot', result.data.reply);
        history.push({ role: 'assistant', content: result.data.reply });
      })
      .catch(function(){
        typing.remove();
        addBubble('bot', 'Verbindung gerade nicht möglich.');
        addWaHint();
      });
  });
})();

// Besuchsmessung nach E-Mail-Kontakt: nur wenn der Link aus unserer E-Mail eine Kennung (?lt=…) enthält. Keine Cookies, kein Speicher im Browser.
(function(){
  var lt = '';
  try { lt = new URLSearchParams(location.search).get('lt') || ''; } catch (e) {}
  if (!lt) return;
  var API = 'https://app.digitalegewinner.de/api/t/video';
  function send(type, value, label){
    try {
      var body = JSON.stringify({ t: lt, e: type, v: value || 0, p: label || location.pathname });
      if (navigator.sendBeacon) navigator.sendBeacon(API, new Blob([body], { type: 'text/plain' }));
      else fetch(API, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function(){});
    } catch (err) {}
  }
  send('site_view');
  var visible = 0, sentScroll = 0;
  setInterval(function(){ if (document.visibilityState === 'visible') { visible += 1; if (visible === 30 || visible === 120) send('site_dwell', visible); } }, 1000);
  window.addEventListener('scroll', function(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var pct = (window.scrollY / max) * 100;
    [50, 90].forEach(function(step){ if (pct >= step && sentScroll < step) { sentScroll = step; send('site_scroll', step); } });
  }, { passive: true });
  function flush(){ send('site_dwell', visible); }
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') flush(); });
  document.addEventListener('click', function(ev){
    var node = ev.target && ev.target.closest ? ev.target : null;
    if (!node) return;
    if (node.closest('.chat-fab')) send('site_click', 0, 'chat');
    var a = node.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var label = /wa\.me/.test(href) ? 'whatsapp' : /^tel:/.test(href) ? 'telefon' : /^mailto:/.test(href) ? 'mail' : /calendar|termin|buchen/i.test(href + ' ' + a.textContent) ? 'termin' : '';
    if (label) send('site_click', 0, label);
    // Die Kennung wird an interne Links gehängt, damit der Besuch auf Folgeseiten zugeordnet werden kann.
    try {
      var u = new URL(a.href, location.href);
      if (u.origin === location.origin && !u.searchParams.has('lt') && !/^(tel|mailto):/.test(href)) { u.searchParams.set('lt', lt); a.href = u.toString(); }
    } catch (e) {}
  }, true);
})();
