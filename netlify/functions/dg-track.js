// Netlify-Fallback zur Pflege-Tracking-API (Bot-Zugang nur als Umgebungsvariablen).
const events=new Set(['page_view','cta_click','booking_click','whatsapp_click','video_play','video_pause','video_milestone','video_complete','funnel_step','funnel_progress','funnel_interaction','section_view','lead_intent'])
const clean=(v,n=100)=>String(v??'').replace(/[<>\r\n]/g,' ').slice(0,n)
exports.handler=async function({httpMethod,headers,body}){
  if(httpMethod!=='POST')return {statusCode:405,body:'Method Not Allowed'}
  const origin=headers.origin||''
  if(!/^https:\/\/(?:www\.)?digitalegewinner\.de$/.test(origin))return {statusCode:403,body:'Forbidden'}
  if((body||'').length>5000)return {statusCode:413,body:'Too large'}
  let p;try{p=JSON.parse(body||'{}')}catch{return {statusCode:400,body:'Bad request'}}
  if(!events.has(p.event)||!/^\/pflege(?:\.html|\/)?$/.test(p.path||''))return {statusCode:400,body:'Invalid event'}
  let d=p.details||{},percent=Number(d.percent)||0;
  let important=['booking_click','whatsapp_click','lead_intent','video_complete'].includes(p.event)||(p.event==='video_milestone'&&[50,90].includes(percent))||(p.event==='funnel_progress'&&/[6-8]|100%/.test(String(d.step||'')));
  if(!important)return {statusCode:200,body:'{"ok":true}'}
  const token=process.env.TELEGRAM_BOT_TOKEN,chat=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chat)return {statusCode:503,body:'{"ok":false,"reason":"telegram_not_configured"}'}
  const message=['🔔 Digitale Gewinner · Pflege','Ereignis: '+clean(p.event),'Video: '+percent+' % · '+Math.max(0,Math.round(Number(p.watch_seconds)||0))+' s','Schritt/CTA: '+clean(d.step||d.label||d.goal||'-'),'Quelle: '+clean(p.campaign?.utm_source||'Direkt')+' · '+clean(p.campaign?.utm_campaign||'-'),'Session: '+clean(p.session,50)].join('\n');
  try{const r=await fetch('https://api.telegram.org/bot'+token+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chat,text:message}),signal:AbortSignal.timeout(4500)});return {statusCode:r.ok?200:502,body:JSON.stringify({ok:r.ok})}}
  catch{return {statusCode:502,body:'{"ok":false}'}}
}
