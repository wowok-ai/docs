# Schema: onchain_table_data

> **Tool Name**: `onchain_table_data`
> **Description**: Query dynamic table data of on-chain objects — supports paginated table queries and specific table item lookups. Each table item belongs to a parent object type and has a specific meaning.
>
> This tool was split from `query_toolkit` to handle the unique characteristics of dynamic table queries — objects have fixed size, but their table data can grow dynamically.

---

## Top-Level Structure

```typescript
// Discriminated union by query_type — exactly ONE query per call
OnchainTableData = {
  query_type: "onchain_table" | "onchain_table_item_repository_data" |
              "onchain_table_item_permission_perm" | "onchain_table_item_entity_registrar" |
              "onchain_table_item_entity_linker" | "onchain_table_item_reward_record" |
              "onchain_table_item_demand_presenter" | "onchain_table_item_treasury_history" |
              "onchain_table_item_machine_node" | "onchain_table_item_progress_history" |
              "onchain_table_item_address_mark" | "onchain_table_item_generic";
  // ... query-specific parameters (see below)
}
```

---

## Common Parameters (All Queries)

| Parameter | Type | Description |
|-----------|------|-------------|
| `no_cache` | `boolean` (optional) | Set to `true` to bypass cache and fetch fresh on-chain data |
| `network` | `"localnet" \| "testnet"` (optional) | Network to query; defaults to the configured default network |

---

## Common Parameters (Paginated Queries)

| Parameter | Type | Applies To | Description |
|-----------|------|-----------|-------------|
| `cursor` | `string \| null` (optional) | onchain_table | Pagination cursor from previous page's `nextCursor` |
| `limit` | `number \| null` (optional) | onchain_table | Max items per page |

---

## Query Types

### 1. onchain_table

Paginated query of ANY object's dynamic fields table. Returns all entries with keys, types, and object IDs. Use to explore all sub-items of an object.

**Parent**: Any object

```typescript
{
  query_type: "onchain_table";
  parent: string;               // Parent object ID whose dynamic fields table to query
  cursor?: string | null;       // Pagination cursor from previous page's nextCursor
  limit?: number | null;        // Max items per page
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableAnswer | undefined`

```typescript
TableAnswer {
  items: TableItem[];
  hasNextPage: boolean;
  nextCursor?: string | null;
}

TableItem {
  object: string;               // Object ID of the table item
  type: string;                 // Type of the table item
  version: number;              // Version of the table item
  key: {                        // Key of the dynamic field entry
    type: string;               // Key type (e.g., "address", "string", "u64")
    value: string;              // Key value
  };
}
```

---

### 2. onchain_table_item_repository_data

Query a record from a Repository's on-chain key-value database.

**Parent**: Repository | **Key**: name + entity (address or number)

```typescript
{
  query_type: "onchain_table_item_repository_data";
  parent: string;               // Parent Repository object ID
  name: string;                 // Name/key of the record to retrieve
  entity: string | number;      // Entity ID or address that owns/identifies the record
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_RepositoryData | undefined`

---

### 3. onchain_table_item_permission_perm

Query a permission entry from a Permission object's access control table. Returns the permission list (perm[]) granted to that user/guard.

**Parent**: Permission | **Key**: user address or Guard ID

```typescript
{
  query_type: "onchain_table_item_permission_perm";
  parent: string;               // Parent Permission object ID
  address: string;              // User address or Guard ID whose permissions to check
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_PermissionPerm | undefined`

```typescript
TableItem_PermissionPerm {
  object: string;
  type: string;
  type_raw: string;
  owner: object;
  version: string;
  previousTransaction: string;
  address: string;              // The entity address
  perm: number[];               // List of permission indexes granted
}
```

---

### 4. onchain_table_item_entity_registrar

Query an entity's registration record from the GLOBAL EntityRegistrar. Returns registration info: description, referrer, records, mark_object.

**Parent**: System EntityRegistrar | **Key**: user address

```typescript
{
  query_type: "onchain_table_item_entity_registrar";
  address: string;              // User address to look up in the global EntityRegistrar
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_EntityRegistrar | undefined`

---

### 5. onchain_table_item_entity_linker

Query community votes/endorsements for an entity from the GLOBAL EntityLinker. Returns vote records (likes/dislikes) showing community trust.

**Parent**: System EntityLinker | **Key**: entity address

```typescript
{
  query_type: "onchain_table_item_entity_linker";
  address: string;              // Entity address whose community votes to query
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_EntityLinker | undefined`

---

### 6. onchain_table_item_reward_record

Query a reward claim record from a Reward object's distribution table. Returns claim history: guard used, total claimed, per-claim details.

**Parent**: Reward | **Key**: recipient address

```typescript
{
  query_type: "onchain_table_item_reward_record";
  parent: string;               // Parent Reward object ID
  address: string;              // User address that claimed the reward
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_RewardRecord | undefined`

---

### 7. onchain_table_item_demand_presenter

Query a demand submission from a Demand object's presenter table. Returns submission details: recommendation, service, feedback, acceptance score.

**Parent**: Demand | **Key**: presenter address

```typescript
{
  query_type: "onchain_table_item_demand_presenter";
  parent: string;               // Parent Demand object ID
  address: string;              // Presenter address that submitted the demand
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_DemandPresenter | undefined`

---

### 8. onchain_table_item_treasury_history

Query a payment record from a Treasury's history table. Returns payment details: operation type, signer, amount, external guard.

**Parent**: Treasury | **Key**: payment ID (address)

```typescript
{
  query_type: "onchain_table_item_treasury_history";
  parent: string;               // Parent Treasury object ID
  address: string;              // Payment ID whose treasury record to look up
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_TreasuryHistory | undefined`

---

### 9. onchain_table_item_machine_node

Query a workflow node definition from a Machine object's node table. Returns node configuration: pairs, forwards, guards, thresholds.

**Parent**: Machine | **Key**: node name (string)

```typescript
{
  query_type: "onchain_table_item_machine_node";
  parent: string;               // Parent Machine object ID
  key: string;                  // Node name (string key) in the Machine's workflow definition
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_MachineNode | undefined`

---

### 10. onchain_table_item_progress_history

Query a progress step record from a Progress object's history table. Returns step details: node, next_node, session state, time.

**Parent**: Progress | **Key**: sequence number (u64)

```typescript
{
  query_type: "onchain_table_item_progress_history";
  parent: string;               // Parent Progress object ID
  u64: number | string;         // Sequence number (u64) of the progress step to query
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_ProgressHistory | undefined`

---

### 11. onchain_table_item_address_mark

Query a PUBLIC on-chain name/tag mark from an AddressMark object's table. Unlike local marks, these are published on-chain. Returns public labels: entity, name, tags[].

**Parent**: AddressMark | **Key**: address

```typescript
{
  query_type: "onchain_table_item_address_mark";
  parent: string;               // Parent AddressMark object ID
  address: string;              // Address whose PUBLIC on-chain name/tags to look up
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `TableItem_AddressMark | undefined`

---

### 12. onchain_table_item_generic

Query a generic table item from ANY object's dynamic fields. Supports arbitrary key types and values for non-WoWok objects or custom queries. Use for general-purpose table lookups.

**Parent**: Any object | **Key**: arbitrary (key_type + key_value)

```typescript
{
  query_type: "onchain_table_item_generic";
  parent: string;               // Parent object ID whose dynamic field to query
  key_type: string;             // Type of the key (e.g., "address", "u64", "string", "0x2::object::ID")
  key_value: any;               // Value of the key — must match key_type format
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `ObjectBase | undefined`

---

## Output Schema

All queries return results wrapped in a unified `z.object({ result: ... })` structure with strict schema validation:

```typescript
OnchainTableDataResult {
  result: {
    query_type: string;         // Echoes the requested query_type
    result: TableAnswer | TableItem_* | undefined;  // Query-specific result
  }
}
```

The output schema validates all 12 query types with their specific return types. Each query's `result` field is strictly typed:
- `onchain_table` returns `TableAnswer | undefined` (items[], nextCursor, hasNextPage)
- All `onchain_table_item_*` queries return their specific `TableItem_* | undefined`