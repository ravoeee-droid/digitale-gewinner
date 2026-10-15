import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type Pool = { query: (sql: string, values?: unknown[]) => Promise<unknown> }

const FIELDS = [
  'name',
  'contact',
  'goal',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'gclid',
  'fbclid',
  'd',
  'page',
] as const

const clean = (value: unknown, max = 300) =>
  typeof value === 'string' ? value.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max) : ''

async function notify(lead: Record<string, string>) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!key || !to) return
  const from = process.env.LEAD_FROM_EMAIL || 'Digitale Gewinner <onboarding@resend.dev>'
  const lines = [
    `Name: ${lead.name}`,
    `Kontakt: ${lead.contact}`,
    `Ziel: ${lead.goal}`,
    `Seite: ${lead.page || '/'}`,
    lead.utm_source ? `Quelle: ${lead.utm_source} / ${lead.utm_medium} / ${lead.utm_campaign}` : '',
  ].filter(Boolean)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((item) => item.trim()),
      subject: `Neue Anfrage: ${lead.name}`,
      text: lines.join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}`)
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  // Honeypot: Bots füllen das Feld, Menschen sehen es nicht.
  if (clean(body['bot-field'])) return Response.json({ ok: true })

  const lead: Record<string, string> = {}
  for (const field of FIELDS) lead[field] = clean(body[field])
  if (!lead.name || lead.contact.length < 5) {
    return Response.json({ ok: false, error: 'missing' }, { status: 422 })
  }

  let stored = false
  try {
    const payload = await getPayload({ config })
    const pool = (payload.db as unknown as { pool?: Pool }).pool
    if (pool) {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS website_leads (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          name TEXT, contact TEXT, goal TEXT, page TEXT,
          utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT,
          gclid TEXT, fbclid TEXT, outbound TEXT
        )`,
      )
      await pool.query(
        `INSERT INTO website_leads
          (name, contact, goal, page, utm_source, utm_medium, utm_campaign, utm_content, gclid, fbclid, outbound)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          lead.name,
          lead.contact,
          lead.goal,
          lead.page,
          lead.utm_source,
          lead.utm_medium,
          lead.utm_campaign,
          lead.utm_content,
          lead.gclid,
          lead.fbclid,
          lead.d,
        ],
      )
      stored = true
    }
  } catch (error) {
    console.error('Lead konnte nicht gespeichert werden', error)
  }

  let mailed = false
  try {
    await notify(lead)
    mailed = Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL)
  } catch (error) {
    console.error('Lead-Mail fehlgeschlagen', error)
  }

  // Erfolg nur melden, wenn die Anfrage wirklich irgendwo gelandet ist.
  if (!stored && !mailed) {
    console.error('Lead verloren, weder Datenbank noch Mail verfügbar', lead.name)
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503 })
  }
  return Response.json({ ok: true, stored, mailed })
}
