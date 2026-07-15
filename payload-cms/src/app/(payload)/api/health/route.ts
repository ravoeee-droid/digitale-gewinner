import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    return Response.json({
      ok: true,
      database: 'connected',
      usersTable: 'ready',
    })
  } catch (error) {
    console.error('Payload health check failed', error)
    return Response.json(
      {
        ok: false,
        database: 'failed',
        usersTable: 'unavailable',
      },
      { status: 500 },
    )
  }
}
