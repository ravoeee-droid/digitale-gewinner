import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import PortalChat from './PortalChat'

type ManagedPage = { id: string; title: string }

export default async function PortalPageEditor({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as { role?: string }).role !== 'customer') {
    redirect('/portal')
  }

  const managedPageIds = (
    (user as { managedPages?: Array<string | ManagedPage> }).managedPages || []
  ).map((p) => (typeof p === 'string' ? p : p.id))
  if (!managedPageIds.includes(id)) {
    redirect('/portal')
  }

  const page = (await payload.findByID({
    collection: 'pages',
    id,
    draft: true,
    depth: 0,
  })) as unknown as ManagedPage

  return (
    <main className="cms-home">
      <section className="cms-card portal-chat-card">
        <span className="eyebrow">Kundenportal</span>
        <h1>{page.title}</h1>
        <p>
          Schreib hier, was sich auf dieser Seite ändern soll — z. B. &bdquo;ändere die
          Überschrift in …&ldquo; oder &bdquo;füg bei den Leistungen XY hinzu&ldquo;. Jede
          Änderung landet erst als Entwurf und geht nach Prüfung durch Digitale Gewinner live.
        </p>
        <PortalChat pageId={page.id} />
        <a className="portal-back" href="/portal">
          ← Zurück zur Übersicht
        </a>
      </section>
    </main>
  )
}
