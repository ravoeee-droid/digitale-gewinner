import type { Payload } from 'payload'
import caseData from './caseData.json'

const reviews = [
  ['Julian Arndt', 'Danke an Raphael für den mega Support! Wir hatten viele Probleme mit anderen Anbietern beim Thema Landingpages. Raphael hat es übernommen und innerhalb von 3 Tagen eine perfekte Website für uns gebaut!'],
  ['Andreas Walkenhorst', 'Großartige Arbeit, das besprochene Projekt sehr zeitnah und in enger Abstimmung umgesetzt. Freue mich auf die weitere Zusammenarbeit.'],
  ['Lider Yilmaz', 'Homepage und Webshop 1A, Support sehr schnell und freundlich. Echtes Know-how mit hilfreichen Tipps.'],
  ['Miriam Braunmüller', 'Ich habe mich sehr gut aufgehoben gefühlt. Meine Wünsche und Ideen wurden einfach super gut umgesetzt.'],
  ['Rainer Deckert', 'Außergewöhnlicher Webdesigner! Raphael baut nicht einfach nur Websites, sondern echte Verkaufssysteme mit Rechner, Chatbot und CRM. Top!'],
  ['KrentzWorks Studio', 'Web-App und Paid-Ads-Kampagne – beides 1A umgesetzt. Schnell, professionell und mit echtem Mehrwert. Raphael weiß, was er tut. Sehr gerne wieder!'],
  ['Annika Fischer', 'Ich bin wirklich rundum begeistert von der Zusammenarbeit mit Raphael!'],
  ['Massoud Weissi', 'Sehr professionelle und zuverlässige Arbeit. Die Erstellung meiner Webseite lief reibungslos und auf meine Wünsche wurde eingegangen.'],
  ['DJ Walli', 'Gutes Angebot und schnell. Die Homepage ist genau nach meinen Angaben gemacht worden. TOP.'],
] as const

const faqs = [
  ['Was bedeutet digitaler Vertrauensaufbau?', 'Digitaler Vertrauensaufbau bedeutet, dass Google-Profil, Website und Social Media die tatsächliche Qualität eines Unternehmens klar, glaubwürdig und konsistent zeigen. Interessenten und Bewerber sollen schnell verstehen, warum das Unternehmen eine sichere und passende Wahl ist.'],
  ['Woran erkenne ich, dass mein Unternehmen online ein Vertrauensproblem hat?', 'Typische Signale sind zu wenige oder stark schwankende Anfragen, viel Preisvergleich, gute Reichweite ohne Abschlüsse, wenige passende Bewerbungen oder Empfehlungen, die nach dem Online-Check nicht zu einer Kontaktaufnahme führen.'],
  ['Warum bringt eine Website Besucher, aber keine Anfragen?', 'Häufig fehlen eine klare Positionierung, sichtbare Beweise, verständliche Leistungen, persönliche Ansprechpartner oder ein sicherer nächster Schritt. Reichweite erzeugt Aufmerksamkeit. Erst Vertrauen macht daraus eine Anfrage.'],
  ['Kann ein schwacher Online-Auftritt auch die Mitarbeitergewinnung bremsen?', 'Ja. Bewerber prüfen Führung, Kultur, Sicherheit, Entwicklung und die Glaubwürdigkeit des Arbeitgebers. Sind diese Punkte online nicht sichtbar, bewerben sich passende Menschen oft gar nicht oder unpassende Bewerbungen überwiegen.'],
  ['Warum müssen Google, Website und Social Media zusammenpassen?', 'Menschen wechseln vor einer Entscheidung zwischen mehreren Kontaktpunkten. Widersprechen sich Bewertungen, Website, Bilder und Social-Media-Auftritt, entsteht Unsicherheit. Ein konsistenter Eindruck reduziert Zweifel und erleichtert die Entscheidung.'],
  ['Was enthält die kostenlose Vertrauensanalyse?', 'Raphael Hermann prüft den ersten Eindruck auf Google, Website und Social Media, identifiziert die drei größten Vertrauenslücken und zeigt, welche Verbesserung zuerst den größten Unterschied machen kann. Die Analyse ist unverbindlich und kein automatisierter Standardreport.'],
  ['Für welche Unternehmen ist Digitale Gewinner geeignet?', 'Das Angebot richtet sich an Unternehmen, Dienstleister, Experten und Arbeitgeber im deutschsprachigen Raum, deren reale Qualität online noch nicht schnell genug verstanden oder geglaubt wird.'],
] as const

const trustProblems = [
  ['Zu wenig Kundenanfragen', 'Die Leistung ist gut, aber Interessenten erkennen online nicht schnell genug, warum sie gerade diesem Unternehmen vertrauen sollten.'],
  ['Schwankende Kundenanfragen', 'Empfehlungen und Werbung funktionieren punktuell, aber der Online-Auftritt erzeugt keine verlässlich starke Entscheidungssicherheit.'],
  ['Zu viele unpassende Anfragen', 'Positionierung, Anspruch und Arbeitsweise sind nicht klar genug. Dadurch melden sich Menschen, die nicht zum Angebot passen.'],
  ['Zu wenig Bewerber', 'Stelle und Gehalt allein überzeugen nicht. Passende Fachkräfte sehen online zu wenig von Kultur, Führung, Sicherheit und Zukunft.'],
  ['Zu viele schlechte Bewerber', 'Wenn Arbeitgeberwert und Erwartungen nicht sichtbar sind, fehlt die natürliche Vorqualifizierung und die Bewerbungsqualität sinkt.'],
  ['Ständiger Preisvergleich', 'Wird der Unterschied zur Konkurrenz nicht verstanden, bleibt der Preis als einziges klares Kriterium.'],
  ['Werbung bringt Klicks, aber keine Abschlüsse', 'Ads kaufen Aufmerksamkeit. Trifft diese auf einen unsicheren Auftritt, gehen Budget und Nachfragewirkung verloren.'],
  ['Empfehlungen versanden nach dem Online-Check', 'Fast jede Empfehlung wird gegoogelt. Bestätigt der digitale Eindruck das gute Gefühl nicht, entsteht Zweifel statt Kontakt.'],
] as const

const pages = [
  {
    slug: 'vertrauensaufbau-online',
    title: 'Digitalen Vertrauensaufbau verstehen',
    headline: 'Digitaler Vertrauensaufbau: Warum gute Unternehmen online trotzdem verlieren',
    intro: 'Menschen entscheiden selten nur nach Leistung. Sie entscheiden danach, welche Leistung sie schnell verstehen, glaubwürdig einschätzen und als sichere Wahl empfinden können.',
    sections: [
      ['Vertrauen ist der Filter vor jeder Anfrage', 'Bevor ein Interessent Kontakt aufnimmt, prüft er unbewusst Klarheit, Kompetenz, Beweise, Persönlichkeit und Risiko.'],
      ['Google schafft den ersten Eindruck', 'Bewertungen, Bilder, Antworten und Aktualität beeinflussen, ob ein Unternehmen seriös, erreichbar und relevant wirkt.'],
      ['Die Website übersetzt Qualität in eine Entscheidung', 'Eine vertrauensstarke Website erklärt Zielgruppe, Problem, Lösung, Beweise und den nächsten sicheren Schritt.'],
      ['Social Media macht Kompetenz menschlich', 'Echte Gesichter, Einblicke, Haltung und fachliche Inhalte reduzieren Distanz.'],
    ],
  },
  {
    slug: 'website-keine-anfragen',
    title: 'Website bringt keine Anfragen?',
    headline: 'Ihre Website bringt Besucher, aber keine Anfragen?',
    intro: 'Mehr Traffic löst nicht automatisch das Problem. Häufig fehlt nicht Aufmerksamkeit, sondern die Sicherheit, dass Angebot, Anbieter und nächster Schritt wirklich passen.',
    sections: [
      ['Die Zielgruppe erkennt sich nicht sofort', 'Eine starke Startseite benennt das konkrete Problem, die gewünschte Veränderung und die relevante Zielgruppe.'],
      ['Der Wert bleibt abstrakt', 'Leistungen werden häufig beschrieben, ohne zu zeigen, was sie praktisch verändern.'],
      ['Beweise fehlen am richtigen Ort', 'Bewertungen, Case Studies, echte Projekte und persönliche Erfahrung müssen dort erscheinen, wo Zweifel entstehen.'],
      ['Der nächste Schritt wirkt zu groß', 'Eine gute Conversion-Strecke erklärt, was nach dem Klick passiert und welchen direkten Nutzen die Anfrage liefert.'],
    ],
  },
  {
    slug: 'zu-wenig-bewerber',
    title: 'Zu wenig oder schlechte Bewerber?',
    headline: 'Zu wenig Bewerber oder zu viele unpassende Bewerbungen?',
    intro: 'Passende Fachkräfte prüfen mehr als eine Stellenanzeige. Sie suchen Belege für Führung, Kultur, Sicherheit, Entwicklung und die Glaubwürdigkeit des Arbeitgebers.',
    sections: [
      ['Eine Stellenanzeige allein baut kaum Vertrauen auf', 'Bewerber prüfen zusätzlich Website, Google, Social Media, Führung und echte Einblicke.'],
      ['Arbeitgeberqualität muss sichtbar werden', 'Kultur, Entwicklung, Sicherheit und Erwartungen brauchen konkrete Belege statt austauschbarer Aussagen.'],
      ['Klare Positionierung verbessert die Vorqualifizierung', 'Je klarer Anspruch und Zusammenarbeit beschrieben sind, desto eher bewerben sich passende Menschen.'],
      ['Konsistenz entscheidet', 'Stellenanzeige, Karriereseite, Google und Social Media müssen dieselbe glaubwürdige Geschichte erzählen.'],
    ],
  },
]

export async function seedDefaultContent(payload: Payload): Promise<void> {
  const existingCases = await payload.find({ collection: 'case-studies', limit: 100, depth: 0, overrideAccess: true })
  const caseBySlug = new Map(existingCases.docs.map((doc) => [String(doc.slug), doc]))

  for (const [index, item] of caseData.entries()) {
    if (!caseBySlug.has(item.id)) {
      const created = await payload.create({
        collection: 'case-studies',
        overrideAccess: true,
        data: {
          title: item.name,
          slug: item.id,
          sector: item.sector,
          order: index + 1,
          featured: ['jj-media', 'defi-intelligence', 'neuromind'].includes(item.id),
          summary: item.summary,
          problem: item.problem,
          solution: item.solution,
          impact: item.impact,
          resultLabel: item.result,
          websiteUrl: item.url.startsWith('http') ? item.url : item.url.includes('.') ? `https://${item.url}` : '',
          imagePath: item.img,
          accentColor: item.accent,
          _status: 'published',
        } as never,
      })
      caseBySlug.set(item.id, created)
    }
  }

  const existingReviews = await payload.find({ collection: 'reviews', limit: 100, depth: 0, overrideAccess: true })
  const reviewByName = new Map(existingReviews.docs.map((doc) => [String(doc.name), doc]))
  for (const [name, text] of reviews) {
    if (!reviewByName.has(name)) {
      const created = await payload.create({ collection: 'reviews', overrideAccess: true, data: { name, text, rating: 5, published: true } })
      reviewByName.set(name, created)
    }
  }

  const existingFaqs = await payload.find({ collection: 'faqs', limit: 100, depth: 0, overrideAccess: true })
  const faqByQuestion = new Map(existingFaqs.docs.map((doc) => [String(doc.question), doc]))
  for (const [index, [question, answer]] of faqs.entries()) {
    if (!faqByQuestion.has(question)) {
      const created = await payload.create({ collection: 'faqs', overrideAccess: true, data: { question, answer, order: index + 1, published: true } })
      faqByQuestion.set(question, created)
    }
  }

  const existingPages = await payload.find({ collection: 'pages', limit: 100, depth: 0, overrideAccess: true })
  const pageSlugs = new Set(existingPages.docs.map((doc) => String(doc.slug)))
  for (const item of pages) {
    if (!pageSlugs.has(item.slug)) {
      await payload.create({
        collection: 'pages',
        overrideAccess: true,
        data: {
          title: item.title,
          slug: item.slug,
          eyebrow: 'Ratgeber für digitalen Vertrauensaufbau',
          headline: item.headline,
          intro: item.intro,
          sections: item.sections.map(([heading, text]) => ({ heading, text })),
          seo: {
            metaTitle: `${item.title} | Digitale Gewinner`,
            metaDescription: item.intro.slice(0, 165),
            canonicalUrl: `https://digitale-gewinner.de/${item.slug}.html`,
            noIndex: false,
          },
          _status: 'published',
        } as never,
      })
    }
  }

  const homepage = await payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: true })
  const currentFeatured = Array.isArray(homepage.featuredCaseStudies) ? homepage.featuredCaseStudies : []
  if (currentFeatured.length === 0) {
    const featuredCaseIDs = ['jj-media', 'defi-intelligence', 'neuromind'].map((slug) => caseBySlug.get(slug)?.id).filter(Boolean)
    const reviewIDs = reviews.map(([name]) => reviewByName.get(name)?.id).filter(Boolean)
    const faqIDs = faqs.map(([question]) => faqByQuestion.get(question)?.id).filter(Boolean)

    await payload.updateGlobal({
      slug: 'homepage',
      overrideAccess: true,
      data: {
        hero: {
          eyebrow: 'Spezialist für digitalen Vertrauensaufbau',
          headline: 'Ich mache Vertrauen',
          headlineHighlight: 'online sichtbar.',
          subline: 'Über Google, Website und Social Media – damit potenzielle Kunden und Mitarbeiter innerhalb weniger Sekunden erkennen, warum Ihr Unternehmen die richtige Wahl ist.',
          heroImagePath: '/assets/images/raphael/raphael-hermann-hero.webp',
          primaryCtaLabel: 'Meine Vertrauenslücken prüfen lassen',
          secondaryCtaLabel: 'Case Studies ansehen',
        },
        trustProblems: trustProblems.map(([title, description]) => ({ title, description })),
        featuredCaseStudies: featuredCaseIDs,
        featuredReviews: reviewIDs,
        faqs: faqIDs,
        _status: 'published',
      } as never,
    })
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
  if (!settings.aiSummary) {
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      data: {
        brandName: 'Digitale Gewinner',
        expertName: 'Raphael Hermann',
        phone: '+49 711 34063951',
        positioning: 'Digitale Gewinner macht Vertrauen online sichtbar – über Google, Website und Social Media – damit Unternehmen mehr passende Kundenanfragen und bessere Bewerbungen gewinnen.',
        proof: { yearsExperience: 8, managedAdBudget: 200000, googleRating: 5, googleReviewCount: 9 },
        defaultSeo: {
          metaTitle: 'Mehr Kundenanfragen & bessere Bewerber | Digitale Gewinner',
          metaDescription: 'Raphael Hermann macht Vertrauen über Google, Website und Social Media sichtbar – für mehr qualifizierte Kundenanfragen, bessere Bewerber und weniger Preisvergleich.',
          canonicalBaseUrl: 'https://digitale-gewinner.de',
        },
        aiSummary: 'Raphael Hermann ist seit acht Jahren im digitalen Marketing tätig und hat mehr als 200.000 Euro Werbebudget verwaltet. Digitale Gewinner verbindet Google, Website und Social Media, um die reale Qualität von Unternehmen für potenzielle Kunden und Bewerber verständlich und glaubwürdig sichtbar zu machen.',
      },
    })
  }

  payload.logger.info('Digitale Gewinner CMS: Standardinhalte sind vorhanden.')
}
