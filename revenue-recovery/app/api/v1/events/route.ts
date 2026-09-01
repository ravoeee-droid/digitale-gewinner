import { NextResponse } from "next/server";
import { attributableRevenueCents, isRecoveryEvent } from "../../../../lib/events";

export async function POST(request: Request) {
  const expectedSecret = process.env.RECOVERY_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("x-recovery-secret");

  if (expectedSecret && suppliedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isRecoveryEvent(body)) {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 422 });
  }

  const revenueCents = attributableRevenueCents(body);

  // V1 contract: provider adapters send one normalized event here.
  // Persistence is intentionally not faked. The production milestone writes
  // idempotently by eventId to Postgres and updates tenant attribution totals.
  console.info("recovery_event", {
    eventId: body.eventId,
    tenantId: body.tenantId,
    callId: body.callId,
    type: body.type,
    attributableRevenueCents: revenueCents,
  });

  return NextResponse.json({
    ok: true,
    accepted: true,
    attributableRevenueCents: revenueCents,
  });
}
