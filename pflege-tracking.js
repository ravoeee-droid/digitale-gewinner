/* Pflege tracking: Einwilligung vor Analyse, keine Secrets im Browser. */
(function(){
  'use strict';
  if(!/^\/pflege\/?$/.test(location.pathname) && !/^\/pflege\.html$/.test(location.pathname))return;
  var consent=null;try{consent=localStorage.getItem('dg-consent')}catch(_){}
  var banner=document.getElementById('consent');
  if(banner && consent!=='yes' && consent!=='no')banner.hidden=false;
  var sid=null,seen={},watch=0,last=0,active=false;
  function id(){if(!sid)sid=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2));return sid}
  function allowed(){try{return localStorage.getItem('dg-consent')==='yes'}catch(_){return false}}
  function emit(kind,details){
    if(!allowed())return;
    var q=new URLSearchParams(location.search),campaign={};
    ['utm_source','utm_medium','utm_campaign','utm_content','gclid','fbclid','d'].forEach(function(k){if(q.has(k))campaign[k]=q.get(k).slice(0,100)});
    var payload={event:kind,session:id(),path:location.pathname,watch_seconds:Math.round(watch),campaign:campaign,details:details||{}};
    window.dataLayer=window.dataLayer||[];window.dataLayer.push(Object.assign({event:'dg_'+kind},payload));
    fetch('/api/dg-track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true})
      .then(function(r){if(r.status===404) return fetch('/.netlify/functions/dg-track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true})})
      .catch(function(){});
  }
  document.addEventListener('click',function(e){
    var choice=e.target.closest('[data-consent]');
    if(choice){try{localStorage.setItem('dg-consent',choice.dataset.consent)}catch(_){};if(banner)banner.hidden=true; if(choice.dataset.consent==='yes')emit('page_view',{type:'consented'});return}
    if(!allowed())return;
    var a=e.target.closest('a,button');
    if(a){var label=a.getAttribute('data-cta')||a.textContent.trim().slice(0,70);if(a.matches('a[href*="calendar.app.google"]'))emit('booking_click',{label:label});else if(a.matches('a[href*="wa.me"]'))emit('whatsapp_click',{label:label});else if(a.dataset.cta)emit('cta_click',{label:label})}
    var opt=e.target.closest('[data-rc] button,[data-rc] [role="button"]');if(opt)emit('funnel_interaction',{label:(opt.textContent||'').trim().slice(0,60)});
  },true);
  var vid=document.getElementById('expl');
  if(vid){
    var videoId='pflege-80s',milestones=[25,50,75,90,100];
    vid.addEventListener('play',function(){active=true;last=vid.currentTime;emit('video_play',{video:videoId})});
    vid.addEventListener('pause',function(){active=false;emit('video_pause',{video:videoId,percent:Math.round(vid.currentTime/(vid.duration||80)*100)})});
    vid.addEventListener('timeupdate',function(){
      var t=vid.currentTime;
      if(active && t>last && t-last<2)watch+=t-last;
      last=t;
      var percent=Math.floor(t/(vid.duration||80)*100);
      milestones.forEach(function(m){if(percent>=m&&!seen[m]){seen[m]=true;emit('video_milestone',{video:videoId,percent:m})}});
    });
    vid.addEventListener('ended',function(){active=false;emit('video_complete',{video:videoId,percent:100})});
  }
  var form=document.getElementById('leadForm');
  if(form){
    var next=form.querySelector('.next-btn');
    if(next)next.addEventListener('click',function(){emit('funnel_step',{step:2,goal:form.querySelector('[name=goal]:checked')?.value||''})});
    form.addEventListener('submit',function(){var d=new FormData(form);if(d.get('name')&&d.get('contact'))emit('lead_intent',{goal:d.get('goal')||'',contact_provided:true})},true);
  }
  var rc=document.querySelector('[data-rc]');
  if(rc && 'MutationObserver' in window){
    var lastStep='';new MutationObserver(function(){
      var progress=rc.querySelector('[aria-valuenow],[data-step],.rc-progress,.rc-step');
      var step=progress ? (progress.getAttribute('aria-valuenow')||progress.getAttribute('data-step')||progress.textContent||'').trim().slice(0,35):'';
      if(step && step!==lastStep){lastStep=step;emit('funnel_progress',{step:step})}
    }).observe(rc,{subtree:true,attributes:true,childList:true});
  }
  var sections=['video','fallstudien','recruiting-check','cockpit','analyse'];
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting&&!seen['section_'+e.target.id]){seen['section_'+e.target.id]=true;emit('section_view',{section:e.target.id})}})},{threshold:0.45});
    sections.forEach(function(s){var el=document.getElementById(s);if(el)io.observe(el)});
  }
  if(allowed())emit('page_view',{type:'returning'});
})();