import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const EXPERIENTIAL_BASE_URL = 'https://api.experientiallabs.ai/v1'
const DEFAULT_MODEL = 'gpt-5.5'
const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 2000

const SYSTEM_PROMPT = `Du hilfst einem Kunden von Digitale Gewinner, den Inhalt seiner eigenen Website-Seite per Chat zu pflegen.

Du bekommst den aktuellen Seiteninhalt als JSON und die Nachricht des Kunden. Deine Aufgabe: verstehe, was geändert werden soll, und antworte AUSSCHLIESSLICH mit einem rohen JSON-Objekt (kein Markdown-Codeblock) mit genau diesen Feldern:
{
  "summary": "Kurze, für den Kunden verständliche Zusammenfassung, was du geändert hast (1-2 Sätze)",
  "reply": "Kurze, freundliche Chat-Antwort an den Kunden (2-3 Sätze), die bestätigt was passiert und erwähnt dass die Änderung erst nach Freigabe durch Digitale Gewinner live geht",
  "changes": { ...nur die Felder aus dem aktuellen Seiteninhalt, die sich ändern sollen, mit ihrem NEUEN vollständigen Wert }
}

Regeln:
- Ändere nur Felder, die der Kunde erkennbar gemeint hat. Lass alles andere weg (nicht im "changes"-Objekt auflisten).
- "sections" ist ein Array; wenn du einen Abschnitt änderst, gib das GESAMTE Array mit allen Abschnitten zurück (auch unveränderte), in der gewünschten Reihenfolge.
- Erfinde niemals Fakten, Zahlen, Namen oder Leistungen, die dir der Kunde nicht genannt hat oder die nicht schon im aktuellen Inhalt stehen.
- Wenn die Anfrage unklar ist oder keine Textänderung ist (z.B. Bilder, Design, technische Wünsche), setze "changes" auf ein leeres Objekt {} und erkläre in "reply" freundlich, dass du dafür Digitale Gewinner direkt informierst.
- Schreib in der Sprache des Kunden, im Ton der bestehenden Inhalte (persönlich, direkt, keine Marketing-Floskeln).`

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(request: Request) {
  const apiKey = process.env.EXPERIENTIAL_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Chat ist derzeit nicht verfügbar.' }, { status: 503 })
  }

  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user || (user as { role?: string }).role !== 'customer') {
    return Response.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  let body: { pageId?: string; messages?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const pageId = body.pageId
  const messages = Array.isArray(body.messages) ? body.messages : []
  if (!pageId || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
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

  const managedPageIds = (
    (user as { managedPages?: Array<string | { id: string }> }).managedPages || []
  ).map((p) => (typeof p === 'string' ? p : p.id))
  if (!managedPageIds.includes(pageId)) {
    return Response.json({ error: 'Diese Seite ist für dich nicht freigegeben.' }, { status: 403 })
  }

  const page = await payload.findByID({
    collection: 'pages',
    id: pageId,
    draft: true,
    depth: 0,
  })
  if (!page) {
    return Response.json({ error: 'Seite nicht gefunden.' }, { status: 404 })
  }

  const currentContent = {
    eyebrow: page.eyebrow ?? '',
    headline: page.headline,
    intro: page.intro,
    sections: (page.sections || []).map((s) => ({ heading: s.heading, text: s.text })),
  }

  let parsed: { summary?: string; reply?: string; changes?: Record<string, unknown> }
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
          {
            role: 'system',
            content: `${SYSTEM_PROMPT}\n\nAktueller Seiteninhalt (JSON):\n${JSON.stringify(currentContent)}`,
          },
          ...messages,
        ],
        max_tokens: 1200,
      }),
    })
    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '')
      console.error('experientiallabs portal-chat error', upstream.status, errText)
      return Response.json({ error: 'Antwort konnte nicht geladen werden.' }, { status: 502 })
    }
    const data = await upstream.json()
    const raw = data?.choices?.[0]?.message?.content
    if (typeof raw !== 'string') {
      return Response.json({ error: 'Unerwartete Antwort.' }, { status: 502 })
    }
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
  } catch (error) {
    console.error('portal-chat request failed', error)
    return Response.json({ error: 'Verbindung fehlgeschlagen.' }, { status: 502 })
  }

  const changes = parsed.changes && typeof parsed.changes === 'object' ? parsed.changes : {}
  let draftSaved = false

  if (Object.keys(changes).length > 0) {
    await payload.update({
      collection: 'pages',
      id: pageId,
      draft: true,
      data: changes,
    })
    draftSaved = true
  }

  return Response.json({
    reply: parsed.reply || parsed.summary || 'Erledigt.',
    summary: parsed.summary || null,
    draftSaved,
  })
}
