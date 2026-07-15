import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { CaseStudies } from './collections/CaseStudies'
import { FAQs } from './collections/FAQs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Reviews } from './collections/Reviews'
import { Users } from './collections/Users'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.VERCEL_ENV === 'production'

// Automatically support the variable names created by Vercel/Neon.
// This removes the need to manually duplicate the Neon connection string.
const databaseURL =
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_PRISMA_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED

// Preview deployments use their own current URL. Production uses the stable
// project URL. PAYLOAD_PUBLIC_SERVER_URL remains an optional override only.
const vercelHost = isProduction
  ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  : process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')

const websiteURL = process.env.PUBLIC_WEBSITE_URL || serverURL
const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (isProduction ? '' : 'digitale-gewinner-preview-only-secret-change-before-production')

if (isProduction && !databaseURL) {
  throw new Error(
    'No Neon/Postgres connection was found. Connect the Neon database to this Vercel project.',
  )
}

if (isProduction && !payloadSecret) {
  throw new Error('PAYLOAD_SECRET is required before the unified Payload deployment can go live.')
}

// For the initial setup, schema syncing is enabled automatically. It can later
// be disabled explicitly with PAYLOAD_DB_PUSH=false when migrations are used.
const pushSchema = process.env.PAYLOAD_DB_PUSH !== 'false'

const database = databaseURL
  ? postgresAdapter({
      pool: {
        connectionString: databaseURL,
      },
      push: pushSchema,
    })
  : sqliteAdapter({
      client: {
        url: 'file:./payload-preview.db',
      },
      push: true,
    })

const allowedOrigins = Array.from(
  new Set(
    [
      serverURL,
      websiteURL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined,
    ].filter((value): value is string => Boolean(value)),
  ),
)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '– Digitale Gewinner CMS',
    },
  },
  collections: [Users, Media, CaseStudies, Reviews, FAQs, Pages],
  globals: [Homepage, SiteSettings],
  editor: lexicalEditor(),
  secret: payloadSecret,
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: database,
  sharp,
})
