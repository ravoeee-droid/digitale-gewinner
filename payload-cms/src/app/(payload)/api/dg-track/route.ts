export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const permitted = new Set(['page_view','cta_click','booking_click','whatsapp_click','video_play','video_pause','video_milestone','video_complete','funnel_step','funnel_progress','funnel_interaction','section_view','lead_intent'])
const noteworthy = new Set(['booking_click','whatsapp_click','video_complete','lead_intent'])
function clean(x: unknown, size=110){ return String(x ?? '').replace(/[<>\r\n]/g,' ').slice(0,size) }
function validOrigin(request: Request){
  const origin=request.headers.get('origin')
  if(!origin)return false
  try{
    const u=new URL(origin)
    return u.protocol==='https:' && (u.hostname==='digitalegewinner.de'||u.hostname==='www.digitalegewinner.de'||u.hostname.endsWith('.vercel.app')||u.hostname.endsWith('.netlify.app'))
  }catch{return false}
}
export async function POST(request: Request){
  if(!validOrigin(request)) return Response.json({ok:false},{status:403})
  if(Number(request.headers.get('content-length')||0)>5000)return Response.json({ok:false},{status:413})
  let body:Record<string,any>
  try{body=await request.json()}catch{return Response.json({ok:false},{status:400})}
  if(!body || !permitted.has(body.event) || !/^\/pflege(?:\.html|\/)?$/.test(body.path||''))return Response.json({ok:false},{status:400})
  const event=clean(body.event),detail=body.details||{},percent=Number(detail.percent)||0
  const notify=noteworthy.has(event)||(event==='video_milestone'&&(percent===50||percent===90))||(event==='funnel_progress'&&/[6-8]|100%/.test(String(detail.step||'')))
  if(!notify)return Response.json({ok:true})
  const token=process.env.TELEGRAM_BOT_TOKEN,chat=process.env.TELEGRAM_CHAT_ID
  if(!token||!chat)return Response.json({ok:false,reason:'notifications_not_configured'},{status:503})
  const src=clean(body.campaign?.utm_source||'Direkt'),camp=clean(body.campaign?.utm_campaign||'-')
  const line=[`🔔 Digitale Gewinner · Pflege`,`Ereignis: ${event}`,`Video: ${percent?percent+' %':'-'} · ${Math.max(0,Math.round(Number(body.watch_seconds)||0))} s angesehen`,`Schritt/CTA: ${clean(detail.step||detail.label||detail.goal||'-')}`,`Quelle: ${src} · ${camp}`,`Session: ${clean(body.session,50)}`].join('\n')
  try{
    const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chat,text:line,disable_web_page_preview:true}),signal:AbortSignal.timeout(4500)})
    return Response.json({ok:r.ok},{status:r.ok?200:502})
  }catch{return Response.json({ok:false},{status:502})}
}
