import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog – Digitale Gewinner',
  description: 'Impulse für Pflegebetriebe und Handwerksunternehmen: Recruiting, digitale Entlastung, Bewerbergewinnung.',
}

export default async function BlogIndexPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 0,
  })

  return (
    <main className="blog-page">
      <style dangerouslySetInnerHTML={{ __html: BLOG_CSS }} />
      <header className="blog-head">
        <Link className="blog-brand" href="/">DIGITALE GEWINNER</Link>
        <h1>Blog</h1>
        <p>Impulse für Pflegebetriebe und Handwerksunternehmen – Recruiting, digitale Entlastung, Alltag.</p>
      </header>
      <div className="blog-grid">
        {docs.length === 0 && <p className="blog-empty">Noch keine Beiträge veröffentlicht.</p>}
        {docs.map((post: any) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
            <span className="blog-date">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : ''}
            </span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <span className="blog-more">Weiterlesen →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}

const BLOG_CSS = `
:root{--bg:#090806;--cream:#f7f0e5;--muted:#b6aa9b;--gold:#d8a648;--gold2:#f1ce84;--line:rgba(241,206,132,.18)}
body{margin:0;background:#080705;color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.blog-page{max-width:900px;margin:0 auto;padding:60px 24px 100px}
.blog-brand{color:var(--gold2);font-weight:900;letter-spacing:.06em;text-decoration:none;font-size:.85rem}
.blog-head h1{font-family:Georgia,serif;font-size:clamp(2.4rem,5vw,3.6rem);margin:16px 0 10px}
.blog-head p{color:var(--muted);max-width:560px}
.blog-grid{display:grid;gap:16px;margin-top:40px}
.blog-card{display:block;border:1px solid var(--line);border-radius:20px;padding:26px;background:rgba(255,255,255,.03);text-decoration:none;color:inherit;transition:.2s}
.blog-card:hover{border-color:rgba(241,206,132,.4);transform:translateY(-2px)}
.blog-date{color:var(--gold2);font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}
.blog-card h2{font-family:Georgia,serif;font-size:1.5rem;margin:8px 0}
.blog-card p{color:var(--muted);margin:0 0 10px}
.blog-more{color:var(--gold2);font-weight:700;font-size:.85rem}
.blog-empty{color:var(--muted)}
`
