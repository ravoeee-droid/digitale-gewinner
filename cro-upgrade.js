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
    addGoogleProof();
    enhanceForm();
    bindClickTracking();
    thankYou();
    track('page_view_enhanced',{page_type:document.body.classList.contains('dg-thankyou')?'thank_you':'homepage'});
  });
})();
