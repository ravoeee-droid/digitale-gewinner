import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 0,
  })
  return docs[0] as any
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <main className="blog-post">
      <style dangerouslySetInnerHTML={{ __html: POST_CSS }} />
      <header className="blog-post-head">
        <Link className="blog-brand" href="/">DIGITALE GEWINNER</Link>
        <Link className="blog-back" href="/blog">← Alle Beiträge</Link>
        <span className="blog-date">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : ''}
        </span>
        <h1>{post.title}</h1>
      </header>
      <article
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <div className="blog-cta">
        <p>Wo hängt es bei euch gerade?</p>
        <a href="https://wa.me/4971134063951" target="_blank" rel="noopener">
          Zeig mir, wo es hängt →
        </a>
      </div>
    </main>
  )
}

const POST_CSS = `
:root{--bg:#090806;--cream:#f7f0e5;--muted:#b6aa9b;--gold:#d8a648;--gold2:#f1ce84;--line:rgba(241,206,132,.18)}
body{margin:0;background:#080705;color:var(--cream);font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.blog-post{max-width:720px;margin:0 auto;padding:60px 24px 100px}
.blog-brand{color:var(--gold2);font-weight:900;letter-spacing:.06em;text-decoration:none;font-size:.85rem;display:block;margin-bottom:24px}
.blog-back{color:var(--muted);text-decoration:none;font-size:.85rem}
.blog-date{display:block;color:var(--gold2);font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;margin-top:24px}
.blog-post-head h1{font-family:Georgia,serif;font-size:clamp(2rem,4.4vw,3rem);line-height:1.1;margin:10px 0 30px}
.blog-content{color:#e6dccd;line-height:1.75;font-size:1.05rem}
.blog-content h2{font-family:Georgia,serif;color:var(--gold2);font-size:1.5rem;margin:36px 0 12px}
.blog-content h3{font-size:1.15rem;margin:24px 0 8px}
.blog-content p{margin:0 0 16px}
.blog-content ul{padding-left:20px}
.blog-content li{margin-bottom:8px}
.blog-cta{margin-top:56px;padding:32px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,rgba(216,166,72,.12),rgba(255,255,255,.02));text-align:center}
.blog-cta p{margin:0 0 14px;font-size:1.1rem}
.blog-cta a{display:inline-block;background:linear-gradient(135deg,#f1ce84,#d8a648);color:#150e05;font-weight:800;padding:14px 24px;border-radius:14px;text-decoration:none}
`
