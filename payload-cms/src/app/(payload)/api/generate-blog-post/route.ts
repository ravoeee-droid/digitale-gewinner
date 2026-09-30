import config from '@payload-config'
import { getPayload } from 'payload'
import { BLOG_TOPICS, pickTopicForDate } from '@/lib/blogTopics'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const EXPERIENTIAL_BASE_URL = 'https://api.experientiallabs.ai/v1'
const DEFAULT_MODEL = 'gpt-5.5'

const SYSTEM_PROMPT = `Du schreibst Blogbeiträge für digitale-gewinner.de, eine Marke für digitale Entlastung von Pflegebetrieben und Handwerksunternehmen (Website, Recruiting, CRM, Automatisierung).

Ton: persönlich, direkt, warm, keine Agentursprache, keine erfundenen Buzzwords. Kein "Wir" als anonyme Firma - schreib wie ein Mensch, der die Probleme der Leser wirklich versteht.

Regeln:
- Erfinde niemals konkrete Statistiken, Studien, Kundennamen oder Zahlen, die du nicht mit Sicherheit weißt. Formulierungen wie "viele Pflegedienste berichten" oder "in der Praxis zeigt sich" sind ok, konkrete erfundene Prozentzahlen NICHT.
- Keine falschen medizinischen, rechtlichen oder tariflichen Aussagen (Pflege/Arbeitsrecht ist sensibel).
- 500-800 Wörter, gut gegliedert mit <h2>- und <h3>-Zwischenüberschriften, konkrete Handlungstipps.
- Am Ende ein kurzer, natürlicher Absatz, der zu einem unverbindlichen Gespräch mit Raphael einlädt (kein hartes Verkaufs-CTA).
- Antworte AUSSCHLIESSLICH als JSON-Objekt mit den Feldern: title (string), excerpt (1-2 Sätze), contentHtml (HTML-String mit <h2>/<h3>/<p>/<ul> Tags, kein <html>/<body>), metaDescription (max 160 Zeichen). Kein Markdown-Codeblock, nur das rohe JSON-Objekt.`

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const apiKey = process.env.EXPERIENTIAL_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'EXPERIENTIAL_API_KEY nicht gesetzt.' }, { status: 503 })
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'blog-posts',
    limit: BLOG_TOPICS.length,
    depth: 0,
    select: { topic: true },
  })
  const usedTopics = new Set(existing.docs.map((d) => d.topic as string))
  const topic = pickTopicForDate(new Date(), usedTopics)

  let generated: { title: string; excerpt: string; contentHtml: string; metaDescription: string }
  try {
    const upstream = await fetch(`${EXPERIENTIAL_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.EXPERIENTIAL_MODEL || DEFAULT_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Schreib den Blogbeitrag zum Thema: "${topic}"` },
        ],
        temperature: 0.7,
        max_tokens: 1800,
      }),
    })
    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '')
      return Response.json({ error: 'Generierung fehlgeschlagen', detail: errText }, { status: 502 })
    }
    const data = await upstream.json()
    const raw = data?.choices?.[0]?.message?.content
    if (typeof raw !== 'string') {
      return Response.json({ error: 'Unerwartete Antwort vom Modell' }, { status: 502 })
    }
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    generated = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
  } catch (error) {
    return Response.json({ error: 'Generierung fehlgeschlagen', detail: String(error) }, { status: 502 })
  }

  if (!generated?.title || !generated?.contentHtml) {
    return Response.json({ error: 'Unvollständige Generierung' }, { status: 502 })
  }

  let slug = slugify(generated.title)
  const slugClash = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1 })
  if (slugClash.docs.length > 0) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const created = await payload.create({
    collection: 'blog-posts',
    data: {
      title: generated.title,
      slug,
      topic,
      excerpt: generated.excerpt || '',
      contentHtml: generated.contentHtml,
      status: 'published',
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: generated.title.slice(0, 65),
        metaDescription: (generated.metaDescription || generated.excerpt || '').slice(0, 170),
      },
    },
  })

  return Response.json({ ok: true, slug: created.slug, topic })
}
