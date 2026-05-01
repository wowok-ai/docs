# Schema: onchain_events

> 📡 Watch on-chain WoWok events by type. Supports pagination for fetching large result sets.

---

## Top-Level Structure

```
OnchainEvents
├── type: EventType              // Event type to query (required)
├── limit?: number              // Max results per query (optional)
├── cursor?: EventCursor        // Pagination cursor (optional, null for first query)
├── order?: "ascending" | "descending"  // Sort order (optional)
├── network?: "localnet" | "testnet"    // Network (optional, uses default)
└── no_cache?: boolean          // Bypass cache (optional)
```

---

## Event Types

| Type | Description | Key Fields |
|------|-------------|------------|
| `ArbEvent` | Arbitration events | arb_id, order_id, status, voting_result |
| `NewOrderEvent` | New order creation | order_id, service_id, buyer, amount |
| `ProgressEvent` | Workflow progress | progress_id, machine_id, node_name, forward |
| `DemandPresentEvent` | Service recommendation | demand_id, service_id, recommender |
| `DemandFeedbackEvent` | Demand feedback | demand_id, service_id, score |
| `NewEntityEvent` | New entity registration | entity_type, entity_id, creator |

---

## Pagination

### First Query

```json
{
  "type": "NewOrderEvent",
  "limit": 10,
  "cursor": null,
  "order": "descending"
}
```

### Subsequent Query

```json
{
  "type": "NewOrderEvent",
  "limit": 10,
  "cursor": {
    "txDigest": "previous_tx_digest",
    "eventSeq": "previous_event_seq"
  },
  "order": "descending"
}
```

**Response includes**: `nextCursor` for the next page of results.

---

## Usage Patterns

### Pattern 1: Monitor New Orders

```json
{
  "type": "NewOrderEvent",
  "limit": 20,
  "order": "descending"
}
```

**Use case**: Service provider monitoring incoming orders.

### Pattern 2: Track Progress State Changes

```json
{
  "type": "ProgressEvent",
  "limit": 50,
  "order": "descending"
}
```

**Use case**: Workflow monitoring and analytics.

### Pattern 3: Arbitration Monitoring

```json
{
  "type": "ArbEvent",
  "limit": 10,
  "order": "descending"
}
```

**Use case**: Arbitration institution tracking dispute status.

---

## AI Planning Notes

1. **Event-driven architecture**: Use events to trigger subsequent operations rather than polling object state.
2. **Pagination best practices**: Store `nextCursor` from each response. Use it in the next query to fetch subsequent pages.
3. **Descending order**: Use `descending` for recent events; `ascending` for historical analysis.
4. **Cache control**: Use `no_cache: true` when you need the absolute latest events.
5. **Event correlation**: Cross-reference event data with `query_toolkit (onchain_object)` for full context.
