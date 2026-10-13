import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import PortalLogin from './PortalLogin'
import PortalLogoutButton from './PortalLogoutButton'

type ManagedPage = { id: string; title: string }

export default async function PortalPage() {
  const payload = await getPayload({ config })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user || (user as { role?: string }).role !== 'customer') {
    return <PortalLogin />
  }

  const managedPages = (
    (user as { managedPages?: Array<string | ManagedPage> }).managedPages || []
  )
    .map((p) => (typeof p === 'string' ? null : p))
    .filter((p): p is ManagedPage => Boolean(p))

  return (
    <main className="cms-home">
      <section className="cms-card">
        <span className="eyebrow">Kundenportal</span>
        <h1>Hallo{(user as { name?: string }).name ? `, ${(user as { name?: string }).name}` : ''}.</h1>
        <p>
          Wähl eine Seite, die du per Chat anpassen möchtest. Deine Änderungen werden als Entwurf
          gespeichert und gehen erst live, wenn Digitale Gewinner sie freigibt.
        </p>
        <div className="portal-page-list">
          {managedPages.length === 0 && (
            <p className="notice">
              Für dich ist aktuell noch keine Seite freigegeben. Sprich uns direkt an, dann richten
              wir das ein.
            </p>
          )}
          {managedPages.map((p) => (
            <Link key={p.id} className="portal-page-link" href={`/portal/${p.id}`}>
              {p.title} →
            </Link>
          ))}
        </div>
        <PortalLogoutButton />
      </section>
    </main>
  )
}
