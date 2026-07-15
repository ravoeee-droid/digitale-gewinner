import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const env = {
    hasSecret: Boolean(process.env.PAYLOAD_SECRET),
    hasDatabaseURL: Boolean(process.env.DATABASE_URL),
    hasUnpooledURL: Boolean(
      process.env.DATABASE_URL_UNPOOLED ||
        process.env.DATABASE_POSTGRES_URL_NON_POOLING ||
        process.env.POSTGRES_URL_NON_POOLING,
    ),
    hasNeonPrismaURL: Boolean(process.env.DATABASE_POSTGRES_PRISMA_URL),
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelURL: process.env.VERCEL_URL || null,
    productionURL: process.env.VERCEL_PROJECT_PRODUCTION_URL || null,
  }

  try {
    const payload = await getPayload({ config })
    const users = await payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    return Response.json({
      ok: true,
      database: 'connected',
      usersTable: 'ready',
      userCount: users.totalDocs,
      env,
    })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    return Response.json(
      {
        ok: false,
        database: 'failed',
        error: err.message,
        cause:
          err.cause instanceof Error
            ? err.cause.message
            : err.cause
              ? String(err.cause)
              : null,
        env,
      },
      { status: 500 },
    )
  }
}
