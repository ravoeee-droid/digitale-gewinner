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
      '<div><b>Frag kurz</b><span>Antwort in ein paar Sekunden</span></div>' +
      '<button class="chat-close" aria-label="Schließen">✕</button>' +
    '</div>' +
    '<div class="chat-messages"></div>' +
    '<form class="chat-form">' +
      '<input type="text" placeholder="Deine Frage ..." maxlength="500" required>' +
      '<button type="submit">→</button>' +
    '</form>' +
    '<div class="chat-footer"><a href="https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waText) + '" target="_blank" rel="noopener">Lieber direkt mit Raphael auf WhatsApp schreiben →</a></div>';

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
      addBubble('bot', 'Hi, ich bin der Assistent von Digitale Gewinner. Frag mich kurz, was dich beschäftigt – oder schreib gleich direkt mit Raphael über WhatsApp.');
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
