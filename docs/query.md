# WatchQuery Component (🔍 Data Query)

---

## Component Overview

The WatchQuery component (`query_toolkit`) is WoWok's core data query tool. It queries both **LOCAL** data (stored only on your device, never published to blockchain) and **ONCHAIN** data (published on the blockchain). Supports 9 query types across accounts, balances, objects, profiles, and received assets.

**LOCAL queries** (device-only): `local_mark_list` | `account_list` | `local_info_list` | `token_list` | `account_balance` | `local_names`

**ONCHAIN queries** (blockchain): `onchain_personal_profile` | `onchain_objects` | `onchain_received`

Use local queries for account management and address book lookups. Use onchain queries for blockchain data exploration, user profiles, object inspection, and payment tracking.

> **Note**: Dynamic table data queries (`onchain_table`, `onchain_table_item_*`) have been moved to the dedicated **[onchain_table_data](query.md#onchain_table_data-tool)** tool. See the [onchain_table_data section](#onchain_table_data-tool) below for details.

---

## Function List

| # | query_type | Description | Returns |
|---|-----------|-------------|---------|
| 1 | `local_mark_list` | Query your LOCAL address book — maps human-readable names to blockchain addresses with optional tags. Use to resolve names→addresses or find addresses by tag. | `MarkData[]` (name, address, tags, timestamps) |
| 2 | `account_list` | Query your LOCAL accounts — view all accounts stored on this device (addresses, public keys, messenger status, suspension state). Use to discover available accounts before operations. | `AccountData[]` (name, address, pubkey, suspended, messenger, timestamps) |
| 3 | `local_info_list` | Query your LOCAL private info — sensitive data like delivery addresses, phone numbers, contacts stored ONLY on this device. Use to retrieve saved contact/delivery details. | `InfoData[]` (name, default value, contents, timestamps) |
| 4 | `token_list` | Query cached token metadata — symbol, decimals, icon URL, description for tokens previously fetched from chain. Use to look up token info without an on-chain query. | `TokenTypeInfo[]` (type, alias, name, symbol, decimals, iconUrl) |
| 5 | `account_balance` | Query an account's coin balance OR paginated coin objects. Use `balance=true` for total amount, or `coin={cursor,limit}` to list individual coin objects. | `{ address, balance? \| coin? }` |
| 6 | `local_names` | Query local names by blockchain addresses — resolves addresses back to human-readable names. Use to find account/service names from their address. | `{ account?, local_mark?, address }[]` (array of name lookups) |
| 6a | `onchain_personal_profile` | Query any user's PUBLIC on-chain profile — social links, reputation (likes/dislikes), personal info records, voting history, referrer. Use to look up a user's public identity and reputation. | `ObjectPersonal \| undefined` |
| 7 | `onchain_objects` | Batch query on-chain WOWOK objects by ID — supports Service, Machine, Order, Treasury, Reward, Arb, Personal, Contact, and more. Use to inspect one or more objects in a single call. | `{ objects: ObjectBase[] }` |
| 8 | `onchain_received` | Query objects (payments, tokens, NFTs) received by an on-chain object. Use to track incoming payments or items sent to an on-chain object. Supports pagination and type filter. | `ReceivedBalance \| ReceivedNormal[]` |

---

## Schema Tree

```
query_toolkit (Query Operations)
├── query_type (discriminator, required)
│   ├── "local_mark_list"
│   │   └── filter (optional, LocalMarkFilter)
│   ├── "account_list"
│   │   └── filter (optional, AccountFilter)
│   ├── "local_info_list"
│   │   └── filter (optional, LocalInfoFilter)
│   ├── "token_list"
│   │   └── filter (optional, TokenDataFilter)
│   ├── "account_balance"
│   │   ├── name_or_address (optional, NameOrAddress)
│   │   ├── balance (optional, boolean)
│   │   ├── coin (optional, { cursor?, limit? })
│   │   ├── token_type (optional, TokenType)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_personal_profile"
│   │   ├── account (optional, NameOrAddress)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "local_names"
│   │   └── addresses (required, string[])
│   ├── "onchain_objects"
│   │   ├── objects (required, NameOrAddress[])
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   └── "onchain_received"
│       ├── name_or_address (required, string | AccountOrMark_Address) - Can be simple string (name/address) or full object
│       ├── type (optional, string | "CoinWrapper" | null) — Type filter: undefined/null queries all types; "CoinWrapper" queries object's CoinWrapper type; string queries specific StructType
│       ├── cursor (optional, string | null)
│       ├── limit (optional, number | null)
│       ├── no_cache (optional, boolean)
│       └── network (optional, "localnet" | "testnet" | "mainnet")
└── (no other top-level fields)
```

---

## Common Parameters

| Parameter | Type | Applies To | Description |
|-----------|------|-----------|-------------|
| `no_cache` | `boolean` (optional) | All onchain queries | Set to `true` to bypass cache and fetch fresh on-chain data |
| `network` | `"localnet" \| "testnet" \| "mainnet"` (optional) | All onchain + account_balance | Network to query; defaults to the configured default network |
| `cursor` | `string \| null` (optional) | onchain_received, account_balance.coin | Pagination cursor from previous page's `nextCursor` |
| `limit` | `number \| null` (optional) | onchain_received, account_balance.coin | Max items per page for paginated results |

---

## Example 1: Query Local Mark List

### 📝 Natural Language Prompt

Please help me query my local mark list, filtering for marks tagged with 'friend'.

### 📋 Generated Function JSON

```json
{
  "query_type": "local_mark_list",
  "filter": {
    "tags": ["friend"]
  }
}
```

---

## Example 2: Query Account List

### 📝 Natural Language Prompt

Please help me query all my local accounts.

### 📋 Generated Function JSON

```json
{
  "query_type": "account_list"
}
```

---

## Example 3: Query Local Info List

### 📝 Natural Language Prompt

Please help me query all my locally saved information entries.

### 📋 Generated Function JSON

```json
{
  "query_type": "local_info_list"
}
```

---

## Example 4: Query Token List

### 📝 Natural Language Prompt

Please help me query the list of available token types.

### 📋 Generated Function JSON

```json
{
  "query_type": "token_list"
}
```

---

## Example 5: Query Account Balance (Total)

### 📝 Natural Language Prompt

Please help me query the WOW token balance for my account named 'alice'.

### 📋 Generated Function JSON

```json
{
  "query_type": "account_balance",
  "name_or_address": "alice",
  "balance": true,
  "token_type": "0x2::wow::WOW"
}
```

---

## Example 5b: Query Account Coin Objects (Paginated)

### 📝 Natural Language Prompt

Please help me list the individual WOW coin objects for my default account, first page.

### 📋 Generated Function JSON

```json
{
  "query_type": "account_balance",
  "name_or_address": "",
  "coin": {
    "cursor": null,
    "limit": 10
  },
  "token_type": "0x2::wow::WOW"
}
```

---

## Example 6: Query Personal Profile

### 📝 Natural Language Prompt

Please help me query the public on-chain personal profile for the account named 'bob' on testnet, bypassing cache.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_personal_profile",
  "account": "bob",
  "no_cache": true,
  "network": "testnet"
}
```

---

## Example 7: Query Multiple Objects

### 📝 Natural Language Prompt

Please help me query the on-chain objects with IDs 'service_marketplace' and 'treasury_main'.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_objects",
  "objects": ["service_marketplace", "treasury_main"]
}
```

---

## Example 8: Query Received Objects

### 📝 Natural Language Prompt

Please help me query all types of received objects for the treasury 'service_wallet', first page with 50 items.

### 📋 Generated Function JSON

```json
{
  "query_type": "onchain_received",
  "name_or_address": "service_wallet",
  "cursor": null,
  "limit": 50
}
```

---

## Best Practices

### 1. Use Filters Reasonably
Use filters to narrow query scope and improve efficiency. Local queries support `name`, `address`, `tags`, `createdAt`, `updatedAt` filters.

### 2. Batch Query Objects
Use `onchain_objects` to query multiple objects at once, reducing network requests.

### 3. Use Pagination for Large Results
For `onchain_received` and `account_balance.coin`, use `cursor`/`limit` to paginate through large result sets. For table queries, use the `onchain_table_data` tool which also supports pagination.

### 4. Control Cache with no_cache
Set `no_cache: true` when you need the latest on-chain data. Leave it unset (default) for faster cached responses.

### 5. Specify Network Explicitly
Always specify `network` when you need results from a specific network (`localnet`, `testnet`, or `mainnet`).

### 6. Query Balance vs Coin Objects
Use `balance: true` for a quick total balance check. Use `coin: { cursor, limit }` when you need to inspect individual coin objects.

---

## Important Notes

⚠️ **On-chain queries require network connection!**

⚠️ **Local queries are only on local device — data is NEVER published to blockchain!**

⚠️ **Querying large amounts of data may take longer — use pagination!**

⚠️ **`no_cache: true` fetches fresh data but is slower than cached queries!**

---

## onchain_table_data Tool

The `onchain_table_data` tool is a dedicated tool for querying dynamic table data of on-chain objects. It was split from `query_toolkit` to handle the unique characteristics of dynamic table queries — objects have fixed size, but their table data can grow dynamically.

### Why a Separate Tool?

- **Different data model**: Table queries operate on dynamic fields (key-value stores) attached to objects, not the objects themselves
- **Parent-child relationships**: Each table item belongs to a specific parent object type with well-defined semantics
- **Independent pagination**: Table queries have their own cursor/limit pagination separate from object queries

### Supported Query Types (12 total)

| # | query_type | Parent Object | Key | Meaning |
|---|-----------|--------------|-----|---------|
| 1 | `onchain_table` | Any object | — | Paginated query of ANY object's dynamic fields table. Returns all entries with keys, types, and object IDs. Use to explore all sub-items of an object. |
| 2 | `onchain_table_item_repository_data` | Repository | name + entity (address or number) | Query a record from a Repository's on-chain key-value database. Returns the stored data record with typed value. |
| 3 | `onchain_table_item_permission_perm` | Permission | user address or Guard ID | Query a permission entry from a Permission object's access control table. Returns the permission list (perm[]) granted to that user/guard. |
| 4 | `onchain_table_item_entity_registrar` | System EntityRegistrar | user address | Query an entity's registration record from the GLOBAL EntityRegistrar. Returns registration info: description, referrer, records, mark_object. |
| 5 | `onchain_table_item_entity_linker` | System EntityLinker | entity address | Query community votes/endorsements for an entity from the GLOBAL EntityLinker. Returns vote records (likes/dislikes) showing community trust. |
| 6 | `onchain_table_item_reward_record` | Reward | recipient address | Query a reward claim record from a Reward object's distribution table. Returns claim history: guard used, total claimed, per-claim details. |
| 7 | `onchain_table_item_demand_presenter` | Demand | presenter address | Query a demand submission from a Demand object's presenter table. Returns submission details: recommendation, service, feedback, acceptance score. |
| 8 | `onchain_table_item_treasury_history` | Treasury | payment ID (address) | Query a payment record from a Treasury's history table. Returns payment details: operation type, signer, amount, external guard. |
| 9 | `onchain_table_item_machine_node` | Machine | node name (string) | Query a workflow node definition from a Machine object's node table. Returns node configuration: pairs, forwards, guards, thresholds. |
| 10 | `onchain_table_item_progress_history` | Progress | sequence number (u64) | Query a progress step record from a Progress object's history table. Returns step details: node, next_node, session state, time. |
| 11 | `onchain_table_item_address_mark` | AddressMark | address | Query a PUBLIC on-chain name/tag mark from an AddressMark object's table. Unlike local marks, these are published on-chain. Returns public labels: entity, name, tags[]. |
| 12 | `onchain_table_item_generic` | Generic | key_type + key_value | Query a generic record by key from any object's on-chain data table. Use when the object type is unknown or unsupported. Returns the raw table item with typed key and object reference. |

### Schema Tree

```
onchain_table_data (Table Data Query)
├── query_type (discriminator, required)
│   ├── "onchain_table"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── cursor (optional, string | null)
│   │   ├── limit (optional, number | null)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_repository_data"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── name (required, string)
│   │   ├── entity (required, Address | number)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_permission_perm"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── address (required, Address | string)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_entity_registrar"
│   │   ├── address (required, Address | string)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_entity_linker"
│   │   ├── address (required, Address | string)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_reward_record"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── address (required, Address)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_demand_presenter"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── address (required, Address)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_treasury_history"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── address (required, Address)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_machine_node"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── key (required, string)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_progress_history"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── u64 (required, number | string)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   ├── "onchain_table_item_address_mark"
│   │   ├── parent (required, NameOrAddress)
│   │   ├── address (required, Address)
│   │   ├── no_cache (optional, boolean)
│   │   └── network (optional, "localnet" | "testnet" | "mainnet")
│   └── "onchain_table_item_generic"
│       ├── parent (required, NameOrAddress)
│       ├── key_type (required, string)
│       ├── key_value (required, any)
│       ├── no_cache (optional, boolean)
│       └── network (optional, "localnet" | "testnet" | "mainnet")
```

### Output Schema

All queries return results wrapped in a unified `z.object({ result: ... })` structure:

```typescript
OnchainTableDataResult {
  result: {
    query_type: string;         // Echoes the requested query_type
    result: TableAnswer | TableItem_* | undefined;  // Query-specific result
  }
}
```

### Examples

#### Example: Query Table Data (Paginated)

```json
{
  "query_type": "onchain_table",
  "parent": "my_service",
  "cursor": null,
  "limit": 20
}
```

#### Example: Query Permission Perm Item

```json
{
  "query_type": "onchain_table_item_permission_perm",
  "parent": "perm_admin",
  "address": "alice"
}
```

#### Example: Query Repository Data Item

```json
{
  "query_type": "onchain_table_item_repository_data",
  "parent": "repo_main",
  "name": "user_settings",
  "entity": "alice"
}
```

#### Example: Query Entity Registrar Item

```json
{
  "query_type": "onchain_table_item_entity_registrar",
  "address": "service_provider"
}
```

#### Example: Query Machine Node Item

```json
{
  "query_type": "onchain_table_item_machine_node",
  "parent": "workflow_v1",
  "key": "validation_step"
}
```

#### Example: Query Progress History Item

```json
{
  "query_type": "onchain_table_item_progress_history",
  "parent": "order_456",
  "u64": 1
}
```

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Account](account.md)** | Local wallet management |
| **[LocalMark](localmark.md)** | User/Object naming and categorization |
| **[LocalInfo](localinfo.md)** | Private information management |
| **[Personal](personal.md)** | Personal on-chain portal |
| **[On-chain Events](onchain_events.md)** | Watch and query on-chain events |
| **[WoWok Build-in Info](wowok_buildin_info.md)** | Query protocol constants and info |
| **Schema: query_toolkit** | Use MCP `schema_query` tool with `tool_name: "query_toolkit"` |
| **Schema: onchain_table_data** | Use MCP `schema_query` tool with `tool_name: "onchain_table_data"` |