export type RecoveryEventType =
  | "call_missed"
  | "recovery_started"
  | "caller_qualified"
  | "appointment_booked"
  | "human_transfer"
  | "deal_won"
  | "deal_lost";

export type RecoveryEvent = {
  eventId: string;
  tenantId: string;
  callId: string;
  type: RecoveryEventType;
  occurredAt: string;
  provider?: string;
  contact?: {
    phone?: string;
    name?: string;
  };
  attribution?: {
    dealId?: string;
    revenueCents?: number;
    currency?: "EUR" | "USD" | "GBP" | "CHF";
  };
  metadata?: Record<string, unknown>;
};

export function isRecoveryEvent(value: unknown): value is RecoveryEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<RecoveryEvent>;
  return Boolean(event.eventId && event.tenantId && event.callId && event.type && event.occurredAt);
}

export function attributableRevenueCents(event: RecoveryEvent) {
  if (event.type !== "deal_won") return 0;
  return Math.max(0, event.attribution?.revenueCents ?? 0);
}
