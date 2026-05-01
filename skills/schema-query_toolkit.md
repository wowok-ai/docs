# Schema: query_toolkit

> 🔍 WoWok data query toolkit. Query local naming info (accounts, names, Object IDs) and query on-chain WoWok objects, table items, events, received tokens, user profile, etc.

---

## Top-Level Structure

```
QueryToolkit
├── Exactly one query type (see below)
└── env?: { account?, network?, no_cache?, permission_guard?, referrer? }
```

---

## Query Types

### local_name — Query Local Naming Info

```
{
  "local_name": {
    "name_or_address": "my_account"   // Name or address to resolve
  }
}
```

**Returns**: Account/object name resolution from local storage.

---

### local_names — Query All Local Names

```
{
  "local_names": {}
}
```

**Returns**: All locally stored name mappings.

---

### onchain_object — Query On-Chain Object

```
{
  "onchain_object": {
    "object": "object_id_or_name",    // Object ID or local name
    "type": "service"                 // Optional: object type hint
  }
}
```

**Returns**: Full object state from the blockchain.

---

### onchain_table_item — Query Table Item

```
{
  "onchain_table_item": {
    "object": "object_id",            // Table object ID
    "key": "item_key",                // Table item key
    "type": "repository"              // Table type
  }
}
```

---

### onchain_table_item_machine_node — Query Machine Node

```
{
  "onchain_table_item_machine_node": {
    "object": "machine_name",         // Machine object ID or name
    "node_name": "current_node"       // Node name to query
  }
}
```

**Returns**: Node state including available forwards and their requirements.

**Critical for Progress operations**: Always query this before calling `progress.operate` to determine valid `next_node_name` and `forward` values.

---

### onchain_events — Query On-Chain Events

```
{
  "onchain_events": {
    "type": "NewOrderEvent",          // Event type
    "limit": 10,                      // Max results
    "cursor": null,                   // Pagination cursor
    "order": "descending"             // Sort order
  }
}
```

**Event types**: `ArbEvent`, `NewOrderEvent`, `ProgressEvent`, `DemandPresentEvent`, `DemandFeedbackEvent`, `NewEntityEvent`

---

### onchain_received_tokens — Query Received Tokens

```
{
  "onchain_received_tokens": {
    "address": "account_address",     // Account to query
    "token_type": "0x2::wow::WOW"    // Optional: filter by token type
  }
}
```

---

### onchain_user_profile — Query User Profile

```
{
  "onchain_user_profile": {
    "address": "account_address"      // Account address
  }
}
```

**Returns**: Public profile data including Personal object information.

---

### onchain_dynamic_field — Query Dynamic Field

```
{
  "onchain_dynamic_field": {
    "object": "parent_object",        // Parent object ID
    "field_name": "field_name"        // Field name
  }
}
```

---

### onchain_dynamic_fields — Query All Dynamic Fields

```
{
  "onchain_dynamic_fields": {
    "object": "parent_object"         // Parent object ID
  }
}
```

---

### onchain_table_items — Query All Table Items

```
{
  "onchain_table_items": {
    "object": "table_object",         // Table object ID
    "limit": 50,                      // Max results
    "cursor": null                    // Pagination cursor
  }
}
```

---

### onchain_object_changes — Query Object Changes

```
{
  "onchain_object_changes": {
    "digest": "transaction_digest"    // Transaction digest
  }
}
```

---

### onchain_checkpoints — Query Checkpoints

```
{
  "onchain_checkpoints": {
    "limit": 10,
    "cursor": null
  }
}
```

---

### onchain_reference_gas_price — Query Reference Gas Price

```
{
  "onchain_reference_gas_price": {}
}
```

---

### onchain_protocol_config — Query Protocol Config

```
{
  "onchain_protocol_config": {}
}
```

---

## AI Planning Notes

1. **Query-first pattern**: Always query object state before modifying it, especially for Progress operations.
2. **Cache control**: Use `env.no_cache: true` for fresh data when chaining operations.
3. **Pagination**: Event and table queries support cursor-based pagination. Store `nextCursor` for subsequent queries.
4. **Machine node query**: This is the most critical query for workflow operations. It reveals:
   - Current node state
   - Available forwards (with their names)
   - Forward requirements (Guards, permissions, thresholds)
5. **Local vs on-chain**: `local_name` resolves from device storage; `onchain_object` reads from the blockchain.
