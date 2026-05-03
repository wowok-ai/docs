# On-Chain Events Tool Schema

> **Tool Name**: `onchain_events`
> **Description**: Watch on-chain WOWOK events by type. Supports arbitration events, new order events, progress events, demand presentation events, demand feedback events, and new entity registration events. Use pagination cursor for fetching large result sets.

---

## Tool Schema

```typescript
onchain_events: OnchainEventsInput
```

---

## Input Schema

```typescript
OnchainEventsInput {
  type: EventType,                // REQUIRED - Event type to query
  cursor?: EventCursor | null,    // OPTIONAL - Pagination cursor for fetching next page
  limit?: number | null,          // OPTIONAL - Maximum number of events to return per query
  order?: "ascending" | "descending" | null,  // OPTIONAL - Sort order
  no_cache?: boolean,             // OPTIONAL - Whether to bypass cache
  network?: "localnet" | "testnet"  // OPTIONAL - Network to query
}
```

---

## Sub Schemas

### EventType

```typescript
EventType =
  | "ArbEvent"                    // Arbitration events
  | "NewOrderEvent"               // New order events
  | "ProgressEvent"               // Progress events
  | "DemandPresentEvent"          // Demand presentation events
  | "DemandFeedbackEvent"         // Demand feedback events
  | "NewEntityEvent"              // New entity registration events
```

### EventCursor

```typescript
EventCursor {
  eventSeq: string,               // Event sequence number
  txDigest: string                // Transaction digest
}
```

---

## Output Schema

```typescript
OnchainEventsResult {
  result: EventAnswer | null      // Event query result or null if no data
}

EventAnswer {
  data: EventBase[],              // Event object data array
  hasNextPage: boolean,           // Whether there is a next page
  nextCursor?: EventCursor | null, // Next page cursor
  cache_expire?: number | "INFINITE"  // Cache expiration time
}
```

---

## Event Type Schemas

### EventBase

Base schema for all event types.

```typescript
EventBase {
  id: EventCursor,                // Event identifier
  sender: string,                 // Event sender ID
  type: EventType | string,       // Event type
  type_raw: string,               // Raw event type
  time: string                    // Event occurrence time
}
```

### ArbEvent

Arbitration event schema.

```typescript
ArbEvent extends EventBase {
  arb: string,                    // Arbitration object ID
  arbitration: string,            // Arbitration object ID (alias)
  order: string,                  // Order object ID
  status: ArbStatus               // Arbitration status
}

ArbStatus =
  | "voting"                      // Voting in progress
  | "completed"                   // Completed
  | "cancelled"                   // Cancelled
```

### NewOrderEvent

New order event schema.

```typescript
NewOrderEvent extends EventBase {
  order: string,                  // Order object ID
  service: string,                // Service object ID
  progress?: string | null,       // Progress object ID
  discount?: string | null,       // Discount object ID
  allocation?: string | null,     // Allocation object ID
  amount: BalanceType             // Order amount
}
```

### ProgressEvent

Progress event schema.

```typescript
ProgressEvent extends EventBase {
  progress: string,               // Progress object ID
  machine: string,                // Machine object ID
  task?: string | null,           // Task object ID
  node: string,                   // Current node name
  forward?: string | null,        // Forward operation name
  hold?: boolean | null           // Whether it is a hold operation
}
```

### DemandPresentEvent

Demand presentation event schema.

```typescript
DemandPresentEvent extends EventBase {
  demand: string,                 // Demand object ID
  service?: string | null,        // Service object ID
  recommend: string               // Recommendation letter
}
```

### DemandFeedbackEvent

Demand feedback event schema.

```typescript
DemandFeedbackEvent extends EventBase {
  demand: string,                 // Demand object ID
  service?: string | null,        // Service object ID
  feedback: string,               // Feedback content
  acceptance_score?: number | null // Acceptance score
}
```

### NewEntityEvent

New entity registration event schema.

```typescript
NewEntityEvent extends EventBase {
  address: string,                // User ID
  resource: string,               // ID mark object ID owned by user
  referrer?: string | null        // Referrer ID
}
```

---

## Event Type Selection Guide

| Event Type | Use Case | Key Fields |
|------------|----------|------------|
| `ArbEvent` | Monitor arbitration status changes | `arb`, `order`, `status` |
| `NewOrderEvent` | Track new orders created | `order`, `service`, `amount` |
| `ProgressEvent` | Monitor workflow progress | `progress`, `machine`, `node` |
| `DemandPresentEvent` | Track demand presentations | `demand`, `service`, `recommend` |
| `DemandFeedbackEvent` | Monitor demand feedback | `demand`, `feedback`, `acceptance_score` |
| `NewEntityEvent` | Track new user registrations | `address`, `resource`, `referrer` |

---

## Pagination Guide

1. **First Query**: Set `cursor` to `null` to get the first page
2. **Subsequent Queries**: Use `nextCursor` from previous response
3. **Check `hasNextPage`**: Stop when `hasNextPage` is `false`

---

## Complete Event Union Type

```typescript
Event = ArbEvent | NewOrderEvent | ProgressEvent | DemandPresentEvent | DemandFeedbackEvent | NewEntityEvent
```
