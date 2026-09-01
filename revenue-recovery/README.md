# Revenue Recovery V1

## The one problem

**Unanswered inbound new-business calls that would otherwise disappear.**

We do not sell a generic AI assistant. We recover an existing revenue leak and make the result attributable.

## Product promise

> Every eligible missed inbound call is routed into a recovery flow within seconds, qualified, and either booked, transferred or cleanly documented.

The technical promise is under our control. Revenue guarantees are only offered to tenants that pass the eligibility gate below.

## Initial ICP

Start narrow: service businesses with high-intent inbound calls, meaningful order value, and employees who cannot always answer the phone.

V1 qualification gate:

- at least 100 relevant inbound calls/month
- measurable missed-call volume
- average first-order value >= EUR 750
- an existing calendar or CRM path
- business can mark deals won/lost and attach real deal value
- no medical, legal or other highly sensitive workflow in the first rollout

## Installation target

The finished installer should require only:

1. Company website
2. Main phone number / recovery forwarding number
3. Calendar or CRM connection
4. Average order value + operating rules
5. Activate

Everything else is generated or tested automatically.

## Call flow

```text
Inbound caller
   -> business rings normally
      -> answered by human: stop
      -> unanswered/busy/after-hours
         -> recovery number / SIP route
            -> transparent AI introduction
            -> intent + qualification
            -> FAQ / booking / human transfer
            -> normalized events
            -> CRM outcome
            -> deal won/lost
            -> attributable recovered revenue
```

## Attribution rules

Never mix estimates with proof.

### Estimated revenue leak

Used only in sales/audit mode:

```text
monthly inbound calls
x missed rate
x qualified-lead rate
x close rate
x average order value
= estimated monthly leak
```

### Attributable recovered revenue

Counts only when all are true:

- call was eligible and previously unanswered
- recovery flow has a unique call ID
- lead/deal is linked to that call ID
- CRM outcome is `won`
- actual deal value is present

Appointments, qualified leads and pipeline value stay separate from recovered revenue.

## Guarantee design

### Guarantee A — technical

**100% of eligible calls that reach the recovery number enter a recovery flow, or the affected service period is credited according to SLA rules.**

This must exclude carrier outages, customer-side forwarding errors, force majeure and unsupported numbers.

### Guarantee B — performance (only after eligibility audit)

A strong commercial version can be:

> If attributable recovered revenue does not at least equal the agreed guarantee threshold during the measurement window, the next service period is credited until the threshold is reached, subject to the agreed eligibility and CRM-data requirements.

Do not promise arbitrary company revenue or closed sales that depend on the customer's team.

## Provider architecture

Own the business logic; rent the pipes.

```text
Carrier / PBX
  -> provider adapter (Vapi / Retell / CloudTalk / SIP)
  -> Recovery Core
       - tenant rules
       - generated knowledge
       - qualification logic
       - booking/transfer tools
       - event normalization
  -> CRM / calendar
  -> attribution store
  -> dashboard
```

The provider adapter must be replaceable without changing customer attribution or dashboard logic.

## Compliance defaults for Germany / EU

- AI identifies itself clearly at the beginning of the interaction.
- No covert audio recording.
- Raw audio recording is **off by default**.
- If recording is later enabled, explicit legal/compliance review and appropriate consent flow are required.
- Data minimization: keep only the data needed for qualification, booking, service and attribution.
- Sensitive sectors are excluded from V1.
- Retention and deletion rules must be tenant-configurable before production rollout.

This is product architecture, not legal advice.

## V1 repository structure

- `app/page.tsx` — sales audit + product concept dashboard
- `app/api/v1/events/route.ts` — normalized provider/event contract
- `lib/events.ts` — canonical recovery event types and strict revenue rule

## Next production milestones

1. Postgres persistence with idempotency on `eventId`
2. Tenant auth + onboarding
3. Website crawler -> structured business knowledge
4. Vapi EU adapter first; SIP/other providers behind same interface
5. Calendar adapter
6. CRM adapter and `deal_won` sync
7. Live dashboard with real calls, booked appointments and recovered revenue
8. Automated synthetic test call before activation
9. SLA monitor and alerting
10. First controlled pilot with a real business

## North-star metrics

- eligible missed calls
- recovery answer rate
- qualified rate
- booking/transfer rate
- won deals
- attributable recovered revenue
- recovered revenue / service fee
- false-answer / escalation rate
- median recovery latency

The north star is **attributable recovered revenue from calls that otherwise would have been lost**.
