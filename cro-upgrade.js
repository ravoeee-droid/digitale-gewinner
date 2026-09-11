(()=>{
  'use strict';

  const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORAGE_KEY='dg_attribution_v1';
  const LEAD_KEY='dg_last_lead_v1';
  const GOOGLE_REVIEWS_URL='https://www.google.com/search?q=Digitale+Gewinner+%231+Raphael+Hermann+Rezensionen';

  function sessionId(){
    let id=sessionStorage.getItem('dg_session_id');
    const randomUUID=window.crypto&&typeof window.crypto.randomUUID==='function'?window.crypto.randomUUID.bind(window.crypto):null;
    if(!id){id=randomUUID?randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`;sessionStorage.setItem('dg_session_id',id)}
    return id;
  }

  function attribution(){
    const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
    const params=new URLSearchParams(location.search);
    let saved={};
    try{saved=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'{}')}catch(_){saved={}}
    keys.forEach(k=>{if(params.get(k))saved[k]=params.get(k)});
    if(!saved.landing_page)saved.landing_page=location.pathname+location.search;
    if(!saved.referrer&&document.referrer)saved.referrer=document.referrer;
    sessionStorage.setItem(STORAGE_KEY,JSON.stringify(saved));
    return saved;
  }

  const attr=attribution();

  function track(eventName,details={}){
    const payload={event:eventName,dg_event:eventName,page_path:location.pathname,page_title:document.title,session_id:sessionId(),...attr,...details};
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push(payload);
    if(typeof window.gtag==='function')window.gtag('event',eventName,{...details,page_path:location.pathname});
    if(typeof window.fbq==='function'){
      if(eventName==='lead_submit')window.fbq('track','Lead',details);
      else window.fbq('trackCustom',eventName,details);
    }
    document.dispatchEvent(new CustomEvent('dg:track',{detail:payload}));
  }
  window.DGTrack=track;

  function addHeroOffer(){
    const btns=qs('.hero .btns');
    if(!btns||qs('.cro-offer'))return;
    btns.insertAdjacentHTML('afterend',`<div class="cro-offer" aria-label="Inhalt der kostenlosen Vertrauensanalyse"><strong>Das erhalten Sie kostenlos</strong><div class="cro-offer-grid"><div class="cro-offer-item"><i>01</i><span>Prüfung von Google, Website und Social Media</span></div><div class="cro-offer-item"><i>02</i><span>Ihre drei größten Vertrauenslücken</span></div><div class="cro-offer-item"><i>03</i><span>Klare Empfehlung, was zuerst verbessert werden sollte</span></div></div><div class="cro-offer-note"><span>persönlich durch Raphael</span><span>kein automatisierter Standardreport</span><span>unverbindlich</span></div></div>`);
    const primary=qs('.hero .btn-primary');
    if(primary)primary.textContent='Meine 3 Vertrauenslücken prüfen lassen →';
  }

  function addWebsiteWeek(){
    if(qs('#website-der-woche'))return;
    const anchor=qs('#cases')||qs('#analyse');
    if(!anchor)return;

    if(!qs('#website-week-styles')){
      const style=document.createElement('style');
      style.id='website-week-styles';
      style.textContent=`
        #website-der-woche{padding:112px 0;position:relative;overflow:hidden}
        #website-der-woche:before{content:"";position:absolute;width:620px;height:620px;border-radius:50%;right:-270px;top:-210px;background:radial-gradient(circle,rgba(241,206,132,.14),transparent 68%);pointer-events:none}
        .www-shell{position:relative;border:1px solid rgba(241,206,132,.24);border-radius:34px;padding:54px;background:linear-gradient(135deg,rgba(216,166,72,.12),rgba(255,255,255,.028) 48%,rgba(8,7,5,.78));box-shadow:0 32px 100px rgba(0,0,0,.42);overflow:hidden}
        .www-grid{display:grid;grid-template-columns:1fr .9fr;gap:54px;align-items:start}
        .www-kicker{display:inline-flex;align-items:center;gap:9px;padding:8px 12px;border-radius:999px;border:1px solid rgba(241,206,132,.28);background:rgba(241,206,132,.07);color:#f1ce84;font-size:.72rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
        .www-kicker:before{content:"";width:7px;height:7px;border-radius:50%;background:#f1ce84;box-shadow:0 0 18px rgba(241,206,132,.8)}
        .www-copy h2{margin:18px 0 18px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.8rem,5vw,5.2rem);line-height:1.02;font-weight:400;letter-spacing:-.05em}
        .www-copy h2 em{color:#f1ce84;font-style:italic}
        .www-copy>.www-lead{max-width:650px;color:#d4c9bb;font-size:clamp(1.04rem,1.6vw,1.23rem)}
        .www-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:28px 0}
        .www-metric{padding:16px;border:1px solid rgba(241,206,132,.16);border-radius:16px;background:rgba(8,7,5,.35)}
        .www-metric b{display:block;color:#f1ce84;font-size:1.1rem}
        .www-metric span{display:block;color:#a99e90;font-size:.76rem;margin-top:3px}
        .www-how{display:grid;gap:11px;margin-top:28px}
        .www-step{display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:start;color:#d5cabc}
        .www-step i{width:34px;height:34px;border:1px solid rgba(241,206,132,.22);border-radius:11px;display:grid;place-items:center;color:#f1ce84;font-style:normal;font-size:.75rem;font-weight:900;background:rgba(241,206,132,.05)}
        .www-step b{display:block;color:#fff;margin-bottom:2px}.www-step span{font-size:.86rem;color:#a99f92}
        .www-card{border:1px solid rgba(241,206,132,.2);border-radius:26px;padding:26px;background:rgba(7,6,4,.72);backdrop-filter:blur(18px);box-shadow:0 22px 70px rgba(0,0,0,.28)}
        .www-card h3{margin:0 0 6px;font-size:1.45rem}.www-card>p{margin:0 0 20px;color:#a99f92;font-size:.9rem}
        .www-form{display:grid;grid-template-columns:1fr 1fr;gap:11px}.www-field{display:grid;gap:6px}.www-field.full{grid-column:1/-1}
        .www-field label{font-size:.76rem;color:#b8ad9f}.www-field input,.www-field select,.www-field textarea{width:100%;border:1px solid rgba(241,206,132,.18);background:rgba(8,7,5,.7);color:#fff;border-radius:13px;padding:13px 14px;outline:none}
        .www-field input:focus,.www-field select:focus,.www-field textarea:focus{border-color:rgba(241,206,132,.55);box-shadow:0 0 0 3px rgba(216,166,72,.08)}
        .www-field textarea{min-height:88px;resize:vertical}.www-field select option{background:#100d09;color:#fff}
        .www-submit{grid-column:1/-1;min-height:56px;border:0;border-radius:14px;background:linear-gradient(135deg,#f1ce84,#d8a648);color:#150e05;font-weight:900;cursor:pointer;transition:.25s;box-shadow:0 16px 42px rgba(216,166,72,.18)}
        .www-submit:hover{transform:translateY(-2px);box-shadow:0 20px 52px rgba(216,166,72,.26)}
        .www-note{grid-column:1/-1;margin:0;color:#82786e;font-size:.72rem;line-height:1.45}.www-note strong{color:#c7b8a4}
        @media(max-width:980px){.www-grid{grid-template-columns:1fr}.www-shell{padding:38px}.www-metrics{grid-template-columns:1fr 1fr 1fr}}
        @media(max-width:640px){#website-der-woche{padding:76px 0}.www-shell{padding:24px;border-radius:26px}.www-grid{gap:34px}.www-metrics{grid-template-columns:1fr}.www-form{grid-template-columns:1fr}.www-field.full,.www-submit,.www-note{grid-column:auto}.www-copy h2{font-size:clamp(2.55rem,12vw,4rem)}}
      `;
      document.head.append(style);
    }

    const section=document.createElement('section');
    section.id='website-der-woche';
    section.innerHTML=`<div class="container"><div class="www-shell reveal"><div class="www-grid"><div class="www-copy"><span class="www-kicker">Website der Woche</span><h2>Jede Woche bauen wir <em>eine Website für 0 €.</em></h2><p class="www-lead">Für ein Unternehmen, bei dem wir online richtig etwas bewegen können. Pflege, Handwerk, PV/Energie, lokale Betriebe und Dienstleister können sich in weniger als 30 Sekunden bewerben.</p><div class="www-metrics"><div class="www-metric"><b>0 €</b><span>für die Erstellung</span></div><div class="www-metric"><b>1× pro Woche</b><span>wählen wir ein Unternehmen</span></div><div class="www-metric"><b>ab 79 €</b><span>monatliche Betreuung</span></div></div><div class="www-how"><div class="www-step"><i>01</i><div><b>Kurz bewerben</b><span>Unternehmen, Branche, Website und Kontakt eintragen.</span></div></div><div class="www-step"><i>02</i><div><b>Freitags wählen wir aus</b><span>Wir suchen den Betrieb mit dem stärksten Vorher-/Nachher-Potenzial.</span></div></div><div class="www-step"><i>03</i><div><b>Wir bauen die neue Website</b><span>Konzept, Design, Texte und Umsetzung übernehmen wir.</span></div></div></div></div><div class="www-card"><h3>Für diese Woche bewerben</h3><p>Keine lange Anfrage. Wir brauchen nur die wichtigsten Infos.</p><form class="www-form" id="websiteWeekForm"><div class="www-field"><label for="www-name">Name</label><input id="www-name" name="name" autocomplete="name" required placeholder="Max Mustermann"></div><div class="www-field"><label for="www-company">Unternehmen</label><input id="www-company" name="company" autocomplete="organization" required placeholder="Muster GmbH"></div><div class="www-field"><label for="www-sector">Branche</label><select id="www-sector" name="sector" required><option value="" selected disabled>Bitte wählen</option><option>Pflege</option><option>Handwerk</option><option>PV / Energie</option><option>Gastronomie</option><option>Gesundheit</option><option>Dienstleistung</option><option>Andere</option></select></div><div class="www-field"><label for="www-contact">WhatsApp / Telefon</label><input id="www-contact" name="contact" autocomplete="tel" required placeholder="+49 ..."></div><div class="www-field full"><label for="www-site">Aktuelle Website</label><input id="www-site" name="website" inputmode="url" placeholder="https://..."></div><div class="www-field full"><label for="www-goal">Was soll die neue Website besser machen?</label><textarea id="www-goal" name="goal" placeholder="Mehr Bewerber, mehr Anfragen, moderner wirken ..."></textarea></div><button class="www-submit" type="submit">Jetzt für diese Woche bewerben →</button><p class="www-note"><strong>Transparent:</strong> Die Erstellung kostet beim ausgewählten Unternehmen 0 €. Bei Annahme der Website fällt nur die laufende Betreuung ab 79 € / Monat an. Mit dem Absenden entsteht noch keine Verpflichtung.</p></form></div></div></div></div>`;
    anchor.insertAdjacentElement('beforebegin',section);
    requestAnimationFrame(()=>section.querySelector('.reveal')?.classList.add('visible'));

    const nav=qs('.nav-links');
    if(nav&&!qs('a[href="#website-der-woche"]',nav)){
      const link=document.createElement('a');
      link.href='#website-der-woche';
      link.textContent='Website gewinnen';
      link.dataset.track='website_week_nav_click';
      nav.insertBefore(link,nav.firstChild);
    }

    const form=qs('#websiteWeekForm');
    if(!form)return;
    let started=false;
    qsa('input,select,textarea',form).forEach(field=>field.addEventListener('focus',()=>{if(!started){started=true;track('website_week_form_start',{form_name:'website-der-woche'})}},{once:true}));
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const data=new FormData(form);
      const message=[
        'Hallo Raphael, ich möchte mich für die Website der Woche bewerben.',
        '',
        `Name: ${data.get('name')||''}`,
        `Unternehmen: ${data.get('company')||''}`,
        `Branche: ${data.get('sector')||''}`,
        `WhatsApp / Telefon: ${data.get('contact')||''}`,
        `Aktuelle Website: ${data.get('website')||'keine / nicht angegeben'}`,
        `Ziel: ${data.get('goal')||'nicht angegeben'}`
      ].join('\n');
      track('website_week_submit',{form_name:'website-der-woche',sector:String(data.get('sector')||'')});
      window.open(`https://wa.me/4971134063951?text=${encodeURIComponent(message)}`,'_blank','noopener');
    });
  }

  function addGoogleProof(){
    const score=qs('#bewertungen .score');
    if(!score||qs('.cro-google-link'))return;
    const link=document.createElement('a');
    link.className='cro-google-link';
    link.href=GOOGLE_REVIEWS_URL;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.dataset.track='google_reviews_click';
    link.textContent='Rezensionen bei Google prüfen ↗';
    score.insertAdjacentElement('afterend',link);
  }

  function enhanceForm(){
    const form=qs('#trustForm');
    if(!form)return;

    const submit=qs('button[type="submit"]',form);
    if(submit)submit.textContent='Analyse anfragen und WhatsApp öffnen →';

    const trackingFields={...attr,session_id:sessionId()};
    Object.entries(trackingFields).forEach(([name,value])=>{
      const field=form.elements.namedItem(name);
      if(field)field.value=String(value||'');
    });

    if(!qs('.cro-form-intro',form)){
      form.insertAdjacentHTML('afterbegin','<div class="cro-form-intro"><b>Nach dem Absenden passiert Folgendes:</b>Ihre Angaben werden sicher als Anfrage gespeichert. Danach öffnet sich WhatsApp mit einer vorbereiteten Nachricht, die Sie nur noch absenden müssen.</div>');
    }

    if(!qs('.cro-followup')){
      const audit=qs('#analyse .audit-grid>div:first-child');
      if(audit)audit.insertAdjacentHTML('beforeend','<div class="cro-followup"><article><b>1. Prüfung</b><span>Raphael prüft den ersten Eindruck und die wichtigsten Vertrauenssignale.</span></article><article><b>2. Priorität</b><span>Sie erfahren, welche drei Punkte den größten Unterschied machen.</span></article><article><b>3. Nächster Schritt</b><span>Nur wenn es sinnvoll ist, besprechen wir eine mögliche Umsetzung.</span></article></div>');
    }

    let status=qs('.cro-form-status',form);
    if(!status){status=document.createElement('div');status.className='cro-form-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.append(status)}

    let started=false;
    qsa('input,select,textarea',form).forEach(field=>field.addEventListener('focus',()=>{if(!started){started=true;track('lead_form_start',{form_name:'trust-analysis'})}},{once:true}));

    form.addEventListener('submit',async(e)=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      if(submit&&submit.dataset.waUrl){window.open(submit.dataset.waUrl,'_blank','noopener');track('whatsapp_reopen',{form_name:'trust-analysis'});return}
      if(!form.reportValidity()){track('lead_form_validation_error',{form_name:'trust-analysis'});return}

      const data=new FormData(form);
      if(data.get('bot-field'))return;
      form.classList.add('is-submitting');
      if(submit)submit.disabled=true;
      status.className='cro-form-status is-visible is-working';
      status.innerHTML='<b>Anfrage wird vorbereitet …</b>Ihre Angaben werden gespeichert und WhatsApp wird anschließend geöffnet.';

      const values=Object.fromEntries(data.entries());
      const lead={name:String(values.name||''),company:String(values.company||''),website:String(values.website||''),priority:String(values.priority||''),goal:String(values.goal||''),created_at:new Date().toISOString(),attribution:attr};

      const source=[attr.utm_source,attr.utm_campaign].filter(Boolean).join(' / ');
      const message=[
        'Hallo Raphael, ich möchte eine kostenlose Vertrauensanalyse anfragen.',
        '',
        `Name: ${lead.name}`,
        `Unternehmen: ${lead.company}`,
        `Website / Google-Profil: ${lead.website||'nicht angegeben'}`,
        `Aktuelle Priorität: ${lead.priority||'nicht angegeben'}`,
        `Ziel / Herausforderung: ${lead.goal||'nicht angegeben'}`,
        source?`Quelle: ${source}`:''
      ].filter(Boolean).join('\n');
      const waUrl=`https://wa.me/4971134063951?text=${encodeURIComponent(message)}`;
      lead.wa_url=waUrl;
      localStorage.setItem(LEAD_KEY,JSON.stringify(lead));

      const encoded=new URLSearchParams();
      data.forEach((value,key)=>encoded.append(key,String(value)));
      encoded.set('form-name','trust-analysis');
      encoded.set('session_id',sessionId());
      Object.entries(attr).forEach(([key,value])=>encoded.set(key,String(value)));

      let stored=false;
      try{
        const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encoded.toString()});
        stored=response.ok;
      }catch(_){stored=false}

      track('lead_submit',{form_name:'trust-analysis',lead_priority:lead.priority,netlify_stored:stored});
      const popup=window.open(waUrl,'_blank','noopener');
      status.className='cro-form-status is-visible is-success';
      status.innerHTML=`<b>Ihre Anfrage ist vorbereitet.</b>${stored?'Die Angaben wurden gespeichert. ':''}Bitte senden Sie die vorbereitete Nachricht jetzt in WhatsApp ab. <a href="${waUrl}" target="_blank" rel="noopener">WhatsApp erneut öffnen</a>.`;
      if(submit){submit.disabled=false;submit.textContent='WhatsApp erneut öffnen →';submit.dataset.waUrl=waUrl}
      form.classList.remove('is-submitting');
      if(!popup)track('whatsapp_popup_blocked',{form_name:'trust-analysis'});
      setTimeout(()=>{location.href='/danke.html'},1800);
    },true);
  }

  function bindClickTracking(){
    qsa('a,button').forEach(el=>{
      if(el.dataset.dgBound)return;
      const href=el.getAttribute('href')||'';
      let event=el.dataset.track||'';
      if(!event&&href.includes('#analyse'))event='analysis_cta_click';
      if(!event&&href.includes('case-studies'))event='case_study_click';
      if(!event&&href.includes('wa.me'))event='whatsapp_click';
      if(!event)return;
      el.dataset.dgBound='1';
      el.addEventListener('click',()=>track(event,{link_text:(el.textContent||'').trim().slice(0,120),link_url:href,position:el.closest('.hero')?'hero':el.closest('footer')?'footer':'content'}));
    });
  }

  function thankYou(){
    if(!document.body.classList.contains('dg-thankyou'))return;
    track('thank_you_view',{lead_type:'trust-analysis'});
    let lead={};
    try{lead=JSON.parse(localStorage.getItem(LEAD_KEY)||'{}')}catch(_){lead={}}
    const name=qs('[data-lead-name]');
    if(name&&lead.name)name.textContent=`, ${lead.name.split(' ')[0]}`;
    const waLink=qs('[data-track="whatsapp_thankyou_click"]');
    if(waLink&&lead.wa_url)waLink.href=lead.wa_url;
  }

  ready(()=>{
    if(document.body.classList.contains('dg-case-page'))return;
    addHeroOffer();
    addWebsiteWeek();
    addGoogleProof();
    enhanceForm();
    bindClickTracking();
    thankYou();
    track('page_view_enhanced',{page_type:document.body.classList.contains('dg-thankyou')?'thank_you':'homepage'});
  });
})();
