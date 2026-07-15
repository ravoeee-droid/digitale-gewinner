import { pushDevSchema } from '@payloadcms/drizzle'
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

// Prefer Neon's direct/unpooled URL for schema initialization and Payload's
// node-postgres adapter. Fall back to every variable name used by Vercel/Neon.
const databaseURL =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_PRISMA_URL

// Always derive the active Vercel address automatically. This prevents stale
// manually entered server URLs from breaking the Payload admin in previews or
// on the stable project domain.
const vercelHost = isProduction
  ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  : process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL

const serverURL = vercelHost
  ? `https://${vercelHost}`
  : process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

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

const database = databaseURL
  ? postgresAdapter({
      pool: {
        connectionString: databaseURL,
        max: 5,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 10000,
      },
      // Payload intentionally ignores development schema push in production.
      // The one-time guarded bootstrap below handles a brand-new Neon database.
      push: false,
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
  onInit: async (payload) => {
    if (!databaseURL) return

    const adapter = payload.db as typeof payload.db & {
      pool?: {
        connect: () => Promise<{
          query: (query: string, values?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>
          release: () => void
        }>
      }
    }

    if (!adapter.pool) return

    // Several serverless instances can start at once. A Postgres advisory lock
    // guarantees that only one instance creates the initial schema.
    const client = await adapter.pool.connect()
    const lockID = 740150726

    try {
      await client.query('SELECT pg_advisory_lock($1)', [lockID])
      const result = await client.query(
        "SELECT to_regclass('public.users') AS users_table",
      )

      if (!result.rows[0]?.users_table) {
        payload.logger.info('Initializing Payload schema in the connected Neon database…')
        const previousForcePush = process.env.PAYLOAD_FORCE_DRIZZLE_PUSH
        process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'

        try {
          await pushDevSchema(payload.db as never)
        } finally {
          if (previousForcePush === undefined) {
            delete process.env.PAYLOAD_FORCE_DRIZZLE_PUSH
          } else {
            process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = previousForcePush
          }
        }

        payload.logger.info('Payload schema initialization completed.')
      }
    } finally {
      try {
        await client.query('SELECT pg_advisory_unlock($1)', [lockID])
      } finally {
        client.release()
      }
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: database,
  sharp,
})
