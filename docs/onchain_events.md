# On-chain Events Component (📅 Watch On-chain Events)

---

## Component Overview

The On-chain Events component is used to watch and query on-chain WOWOK events by type. Supports arbitration events, new order events, progress events, demand presentation events, demand feedback events, and new entity registration events. Use pagination cursor for fetching large result sets.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Watch Arbitration Events** | Monitor dispute resolution events | Track arbitration status changes | Get real-time dispute resolution updates |
| **Watch New Order Events** | Monitor new order creation | Track when customers place orders | Stay informed about new business |
| **Watch Progress Events** | Monitor workflow progress changes | Track order processing stages | Get real-time workflow updates |
| **Watch Demand Present Events** | Monitor demand presentation submissions | Track when presenters submit demands | Stay informed about new submissions |
| **Watch Demand Feedback Events** | Monitor demand feedback | Track responses to presented demands | Stay informed about demand outcomes |
| **Watch New Entity Events** | Monitor new entity registrations | Track new user/entity sign-ups | Stay informed about platform growth |

---

## Complete Tool Call Structure

On-chain events query uses the following top-level structure:

```json
{
  "type": "EventType",
  // optional fields
}
```

---

## Schema Tree

```
onchain_events (On-chain Events Operations)
├── type (required, EventType)
│   ├── "ArbEvent" (Arbitration Events)
│   ├── "NewOrderEvent" (New Order Events)
│   ├── "ProgressEvent" (Progress Events)
│   ├── "DemandPresentEvent" (Demand Presentation Events)
│   ├── "DemandFeedbackEvent" (Demand Feedback Events)
│   └── "NewEntityEvent" (New Entity Events)
├── cursor (optional, EventCursor)
│   ├── eventSeq (required, string)
│   └── txDigest (required, string)
├── limit (optional, number)
├── order (optional, "ascending"/"descending")
├── no_cache (optional, boolean)
└── network (optional, "localnet"/"testnet")
```

---

## Example 1: Watch Arbitration Events

### Feature Description

Monitor arbitration events to track dispute resolution status changes.

### Examples

#### Example 1.1: Query Latest Arbitration Events

**Prompt**: View the most recent arbitration events, sorted in descending order.

```json
{
  "type": "ArbEvent",
  "order": "descending"
}
```

---

#### Example 1.2: Query with Limit and Pagination

**Prompt**: Get 20 arbitration events, using pagination cursor from previous query.

```json
{
  "type": "ArbEvent",
  "cursor": {
    "eventSeq": "12345",
    "txDigest": "0xabc123...def456"
  },
  "limit": 20
}
```

---

## Example 2: Watch New Order Events

### Feature Description

Monitor new order creation events to stay informed about new customer purchases.

### Examples

#### Example 2.1: Query Newest Orders First

**Prompt**: View new order events, most recent first.

```json
{
  "type": "NewOrderEvent",
  "order": "descending"
}
```

---

#### Example 2.2: Bypass Cache for Fresh Data

**Prompt**: Get fresh order events directly from the blockchain, skipping cache.

```json
{
  "type": "NewOrderEvent",
  "no_cache": true
}
```

---

## Example 3: Watch Progress Events

### Feature Description

Monitor progress events to track order and workflow processing stages.

### Examples

#### Example 3.1: Query Progress Updates

**Prompt**: View progress events in chronological order.

```json
{
  "type": "ProgressEvent",
  "order": "ascending"
}
```

---

#### Example 3.2: Query Specific Network

**Prompt**: View progress events on the testnet network.

```json
{
  "type": "ProgressEvent",
  "network": "testnet"
}
```

---

## Example 4: Watch Demand Present Events

### Feature Description

Monitor demand presentation events to track when presenters submit their solutions.

### Examples

#### Example 4.1: Query Recent Presentations

**Prompt**: View the 50 most recent demand presentation events.

```json
{
  "type": "DemandPresentEvent",
  "limit": 50,
  "order": "descending"
}
```

---

## Example 5: Watch Demand Feedback Events

### Feature Description

Monitor demand feedback events to track responses to presented demands.

### Examples

#### Example 5.1: Query Feedback Events

**Prompt**: View demand feedback events, sorted from oldest to newest.

```json
{
  "type": "DemandFeedbackEvent",
  "order": "ascending"
}
```

---

## Example 6: Watch New Entity Events

### Feature Description

Monitor new entity registration events to track platform growth and new sign-ups.

### Examples

#### Example 6.1: Query New Entity Registrations

**Prompt**: View new entity registration events, most recent first, 100 per page.

```json
{
  "type": "NewEntityEvent",
  "order": "descending",
  "limit": 100
}
```

---

#### Example 6.2: Pagination with Cursor

**Prompt**: Get next page of entity events using cursor from previous result.

```json
{
  "type": "NewEntityEvent",
  "cursor": {
    "eventSeq": "98765",
    "txDigest": "0x123abc...456def"
  },
  "limit": 100
}
```

---

## Important Notes

⚠️ **Use pagination for large result sets** - events can be numerous, always use cursor for paging.

⚠️ **Events are immutable** - once emitted, on-chain events cannot be modified or deleted.

⚠️ **Order matters** - use "descending" for newest events, "ascending" for chronological order.

⚠️ **Network selection** - specify network if you need events from a specific blockchain environment.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Arbitration](arbitration.md)** | Dispute resolution - arbitration events come from arbitration objects |
| **[Order](order.md)** | Order management - new order events track order creation |
| **[Progress](progress.md)** | Order progress - progress events track workflow state changes |
| **[Demand](demand.md)** | Seeking assistance - demand events track demand lifecycle |
