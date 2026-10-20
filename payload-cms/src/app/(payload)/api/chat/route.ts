export const dynamic = 'force-dynamic'

const EXPERIENTIAL_BASE_URL = 'https://api.experientiallabs.ai/v1'
const DEFAULT_MODEL = 'gpt-5.5'
const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000

const SYSTEM_PROMPT = `Du bist der digitale Assistent von Raphael Hermann (Digitale Gewinner) auf digitale-gewinner.de.

Haltung: Persönlich, direkt, warm - keine Agentursprache, keine Buzzwords wie "Vertrauensarchitektur" oder "Conversion-Ökosystem". Du duzt die Besucher.

Zielgruppe: Pflegebetriebe (Pflegedienstleitungen, Einrichtungsleitungen) und Handwerksunternehmen (Elektro, PV, Handwerk), denen Mitarbeiter oder Kundenanfragen fehlen und die keine Zeit für Marketing haben.

Was Digitale Gewinner macht: Website, Recruiting-System, Social Ads, CRM und Automatisierung - alles darauf ausgelegt, dem Kunden Arbeit abzunehmen statt neue zu erzeugen. Bewerbung/Anfrage läuft oft über WhatsApp statt langer Formulare.

Regeln:
- Erfinde niemals Preise, Fallzahlen oder Kundennamen, die du nicht sicher weißt. Bei Preisfragen: sag ehrlich, dass der Preis vom Umfang abhängt und Raphael das im persönlichen Gespräch einschätzt.
- Halte Antworten kurz (2-4 Sätze), keine langen Aufzählungen außer explizit gewünscht.
- Sobald jemand konkretes Interesse zeigt (z.B. "wie geht's weiter", "was kostet das", "ich will das machen") oder eine Frage stellt, die du nicht sicher beantworten kannst: schlage vor, kurz mit Raphael über WhatsApp zu sprechen, und sag, dass dafür ein Button/Link bereitsteht.
- Du bist kein Ersatz für das persönliche Gespräch, sondern hilfst nur bei ersten Fragen und leitest dann weiter.`

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(request: Request) {
  const apiKey = process.env.EXPERIENTIAL_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Chat ist derzeit nicht verfügbar.' }, { status: 503 })
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const messages = Array.isArray(body.messages) ? body.messages : []
  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: 'Ungültige Nachrichtenanzahl.' }, { status: 400 })
  }
  for (const m of messages) {
    if (
      typeof m.content !== 'string' ||
      m.content.length > MAX_MESSAGE_LENGTH ||
      (m.role !== 'user' && m.role !== 'assistant')
    ) {
      return Response.json({ error: 'Ungültige Nachricht.' }, { status: 400 })
    }
  }

  try {
    const upstream = await fetch(`${EXPERIENTIAL_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.EXPERIENTIAL_MODEL || DEFAULT_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 400,
      }),
    })

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '')
      console.error('experientiallabs chat error', upstream.status, errText)
      return Response.json({ error: 'Antwort konnte nicht geladen werden.' }, { status: 502 })
    }

    const data = await upstream.json()
    const reply = data?.choices?.[0]?.message?.content
    if (typeof reply !== 'string') {
      return Response.json({ error: 'Unerwartete Antwort.' }, { status: 502 })
    }

    return Response.json({ reply })
  } catch (error) {
    console.error('experientiallabs chat request failed', error)
    return Response.json({ error: 'Verbindung fehlgeschlagen.' }, { status: 502 })
  }
}
