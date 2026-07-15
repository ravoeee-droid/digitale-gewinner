import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="cms-home">
      <section className="cms-card">
        <span className="eyebrow">Digitale Gewinner</span>
        <h1>Content, Case Studies und SEO zentral verwalten.</h1>
        <p>
          Im Admin-Bereich können Startseite, Case Studies, Bewertungen, FAQs,
          Bilder und SEO-Inhalte gepflegt werden.
        </p>
        <div className="actions">
          <Link className="primary" href="/admin">
            Zum Admin-Login →
          </Link>
          <a href="https://digitale-gewinner.de" target="_blank" rel="noreferrer">
            Website öffnen ↗
          </a>
        </div>
        <div className="notice">
          Beim ersten Aufruf von <strong>/admin</strong> wird der erste
          Administrator angelegt.
        </div>
      </section>
    </main>
  )
}
