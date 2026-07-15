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
import { seedDefaultContent } from './seed/defaultContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.VERCEL_ENV === 'production'

const databaseURL =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_PRISMA_URL

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
    if (!databaseURL) {
      try {
        await seedDefaultContent(payload)
      } catch (error) {
        payload.logger.error({ err: error, msg: 'CMS default content seed failed' })
      }
      return
    }

    const adapter = payload.db as typeof payload.db & {
      pool?: {
        connect: () => Promise<{
          query: (query: string, values?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }>
          release: () => void
        }>
      }
    }

    if (!adapter.pool) return

    const client = await adapter.pool.connect()
    const lockID = 740150726

    try {
      await client.query('SELECT pg_advisory_lock($1)', [lockID])

      const usersResult = await client.query("SELECT to_regclass('public.users') AS users_table")
      const schemaResult = await client.query(
        `SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'case_studies'
            AND column_name = 'image_path'
        ) AS schema_ready`,
      )

      const usersTableExists = Boolean(usersResult.rows[0]?.users_table)
      const currentSchemaReady = Boolean(schemaResult.rows[0]?.schema_ready)

      if (!usersTableExists || !currentSchemaReady) {
        payload.logger.info('Synchronizing the current Payload schema with Neon…')
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

        payload.logger.info('Payload schema synchronization completed.')
      }

      try {
        await seedDefaultContent(payload)
      } catch (error) {
        // Never make the whole admin unavailable because a single optional
        // default record failed. The API remains usable and the exact record
        // error is preserved in the runtime log.
        payload.logger.error({ err: error, msg: 'CMS default content seed failed' })
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
