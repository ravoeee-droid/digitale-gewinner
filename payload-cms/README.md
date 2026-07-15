# Digitale Gewinner – Payload CMS

This is a separate Payload 3 admin application inside the existing website repository. Keeping it in `payload-cms/` prevents the static production website from being replaced or broken by the Next.js/Payload runtime.

## What can be managed

- Homepage positioning, hero and trust-problem signals
- Featured homepage case studies and their order
- All case studies: problem, implementation, impact and result label
- Google reviews
- FAQs
- SEO content pages and metadata
- Global brand, proof and AI/GEO facts
- Media metadata and alt text

## Deploy on Vercel

Create a **new Vercel project** from the same GitHub repository and set the project Root Directory to:

```text
payload-cms
```

Do not change the root directory of the existing website deployment.

Add these environment variables in the new Payload project:

```text
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=<long-random-secret>
PAYLOAD_PUBLIC_SERVER_URL=https://cms.digitale-gewinner.de
PUBLIC_WEBSITE_URL=https://digitale-gewinner.de
PAYLOAD_DB_PUSH=true
```

For the first deployment, `PAYLOAD_DB_PUSH=true` allows Payload/Drizzle to create the initial Postgres schema. After the database has been initialized, set it to `false` and use migrations for later schema changes.

## First admin login

After the deployment is live, open:

```text
https://YOUR-PAYLOAD-DOMAIN/admin
```

The first visit shows the Payload form for creating the first administrator. The password is not stored in the repository.

## Database

Use managed Postgres such as Neon, Supabase or Vercel Postgres. Payload requires a compatible database and a secret before the admin can run.

## Media on serverless hosting

The Media collection is configured, but Vercel's local filesystem is not permanent. Before using the CMS as the final image library, connect a supported persistent storage adapter such as S3 or Vercel Blob. Text, cases, FAQs, reviews and SEO data are stored in Postgres.

## Local development

```bash
cd payload-cms
cp .env.example .env
pnpm install
pnpm dev
```

Then open `http://localhost:3000/admin`.
