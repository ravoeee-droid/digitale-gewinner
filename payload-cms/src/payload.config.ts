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
const databaseURL = process.env.DATABASE_URL
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
const websiteURL = process.env.PUBLIC_WEBSITE_URL || serverURL
const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (isProduction ? '' : 'digitale-gewinner-preview-only-secret-change-before-production')

if (isProduction && !databaseURL) {
  throw new Error('DATABASE_URL is required before the unified Payload deployment can go live.')
}

if (isProduction && !payloadSecret) {
  throw new Error('PAYLOAD_SECRET is required before the unified Payload deployment can go live.')
}

const database = databaseURL
  ? postgresAdapter({
      pool: {
        connectionString: databaseURL,
      },
      push: process.env.PAYLOAD_DB_PUSH === 'true',
    })
  : sqliteAdapter({
      client: {
        url: 'file:./payload-preview.db',
      },
      push: true,
    })

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
  cors: [serverURL, websiteURL].filter(Boolean),
  csrf: [serverURL, websiteURL].filter(Boolean),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: database,
  sharp,
})
