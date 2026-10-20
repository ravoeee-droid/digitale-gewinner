// Kuratierte Themenrotation für den täglichen Blog-Generator.
// Bewusst kein KI-generiertes Themen-Brainstorming: die Themen sind fest
// vorgegeben, damit sie echte Suchintention der Zielgruppe (Pflege &
// Handwerk, Recruiting/Digitalisierung) treffen statt generischer KI-Ideen.
// Die KI schreibt nur den Beitrag zum jeweiligen Thema, nicht das Thema selbst.

export const BLOG_TOPICS: string[] = [
  'Warum gute Pflegekräfte kündigen – und wie ihr es früh erkennt',
  '5 Fehler in Stellenanzeigen für Pflegefachkräfte',
  'WhatsApp-Recruiting in der Pflege: So funktioniert die Bewerbung in 60 Sekunden',
  'Warum Handwerksbetriebe trotz voller Auftragsbücher keine Leute finden',
  'Elektriker-Fachkräftemangel: 3 realistische Wege gegenzusteuern',
  'Was Bewerber wirklich auf eurer Karriereseite sehen wollen',
  'Warum eine veraltete Website Bewerbungen kostet, nicht nur Kunden',
  'Dienstplan-Chaos: Wie digitale Prozesse Pflegeteams entlasten',
  'Employer Branding für Handwerksbetriebe: mehr als ein Logo',
  'Warum Empfehlungsmarketing im Handwerk allein nicht mehr reicht',
  'Die 3 größten Zeitfresser für Pflegedienstleitungen – und was dagegen hilft',
  'Wie ein CRM verhindert, dass Bewerbungen im Postfach untergehen',
  'Google-Bewertungen für Pflegeeinrichtungen: warum sie über Bewerber entscheiden',
  'Social-Media-Recruiting für Handwerksbetriebe: was wirklich funktioniert',
  'Warum PV- und Elektrobetriebe jetzt in Sichtbarkeit investieren sollten',
  'Die Candidate Journey in der Pflege: vom ersten Klick bis zur Zusage',
  'Was eine gute Stellenanzeige für Anlagenmechaniker ausmacht',
  'Wie viel Zeit kostet schlechtes Recruiting einen Handwerksbetrieb wirklich',
  'Warum Vertrauen online genauso wichtig ist wie Erfahrung vor Ort',
  'Digitale Entlastung: was ein System für Pflegebetriebe konkret übernimmt',
]

export function pickTopicForDate(date: Date, usedTopics: Set<string>): string {
  const dayIndex = Math.floor(date.getTime() / (24 * 60 * 60 * 1000))
  for (let offset = 0; offset < BLOG_TOPICS.length; offset++) {
    const candidate = BLOG_TOPICS[(dayIndex + offset) % BLOG_TOPICS.length]
    if (!usedTopics.has(candidate)) return candidate
  }
  // Alle Themen schon verwendet: älteste Wiederverwendung zulassen statt zu blockieren.
  return BLOG_TOPICS[dayIndex % BLOG_TOPICS.length]
}
