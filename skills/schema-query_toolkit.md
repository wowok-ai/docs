# Schema: query_toolkit

> WOWOK data query toolkit: Query local naming info (accounts, names, Object IDs), and query on-chain WOWOK objects, received tokens, user profile, etc.
>
> **LOCAL** (device-only, never on-chain): `local_mark_list` | `account_list` | `local_info_list` | `local_names` | `token_list` | `account_balance`
>
> **ONCHAIN** (blockchain): `onchain_personal_profile` | `onchain_objects` | `onchain_received`
>
> Use local queries for account management and address book lookups. Use onchain queries for blockchain data exploration, user profiles, object inspection, and payment tracking.
>
> **Note**: Dynamic table data queries (`onchain_table`, `onchain_table_item_*`) have been moved to the dedicated **`onchain_table_data`** tool. See [schema-onchain_table_data.md](schema-onchain_table_data.md) for details.

---

## Top-Level Structure

```typescript
// Discriminated union by query_type — exactly ONE query per call
QueryToolkit = {
  query_type: "local_mark_list" | "account_list" | "local_info_list" | "local_names" |
              "token_list" | "account_balance" | "onchain_personal_profile" |
              "onchain_objects" | "onchain_received";
  // ... query-specific parameters (see below)
}
```

---

## Common Parameters (All Onchain Queries)

| Parameter | Type | Description |
|-----------|------|-------------|
| `no_cache` | `boolean` (optional) | Set to `true` to bypass cache and fetch fresh on-chain data |
| `network` | `"localnet" \| "testnet"` (optional) | Network to query; defaults to the configured default network |

---

## Common Parameters (Paginated Queries)

| Parameter | Type | Applies To | Description |
|-----------|------|-----------|-------------|
| `cursor` | `string \| null` (optional) | onchain_received, account_balance.coin | Pagination cursor from previous page's `nextCursor` |
| `limit` | `number \| null` (optional) | onchain_received, account_balance.coin | Max items per page |

---

## Query Types

### 1. local_mark_list

Query your LOCAL address book — maps human-readable names to blockchain addresses with optional tags.

```typescript
{
  query_type: "local_mark_list";
  filter?: LocalMarkFilter;
}

LocalMarkFilter {
  name?: string;                // Filter by mark name (fuzzy match)
  tags?: string[];              // Filter by tags — returns marks with ANY of the specified tags
  address?: string;             // Filter by address (exact match, 0x + 64 hex)
  createdAt?: { gte?: number; lte?: number };
  updatedAt?: { gte?: number; lte?: number };
}
```

**Result**: `MarkData[]`

```typescript
MarkData {
  name?: string;
  address: string;
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
}
```

---

### 2. account_list

Query your LOCAL accounts — view all accounts stored on this device.

```typescript
{
  query_type: "account_list";
  filter?: AccountFilter;
}

AccountFilter {
  name?: string;                // Filter by name (fuzzy match)
  address?: string;             // Filter by address (partial match)
  suspended?: boolean;          // Filter by suspension status
  hasMessenger?: boolean;       // Filter accounts with messenger enabled
  m?: string;                   // Filter by messenger name (fuzzy)
  createdAt?: { gte?: number; lte?: number };
  updatedAt?: { gte?: number; lte?: number };
}
```

**Result**: `AccountData[]`

```typescript
AccountData {
  name?: string;
  address: string;
  pubkey?: string;
  secret?: string;
  suspended?: boolean;
  createdAt?: number;
  updatedAt?: number;
  m?: string | null;            // Messenger name, null if disabled
}
```

---

### 3. local_info_list

Query your LOCAL private info — sensitive data like delivery addresses, phone numbers, contacts.

```typescript
{
  query_type: "local_info_list";
  filter?: LocalInfoFilter;
}

LocalInfoFilter {
  name?: string;
  default?: string;
  contents?: string[];
  createdAt?: { gte?: number; lte?: number };
  updatedAt?: { gte?: number; lte?: number };
}
```

**Result**: `InfoData[]`

```typescript
InfoData {
  name: string;
  default: string;
  contents?: string[];
  createdAt?: number;
  updatedAt?: number;
}
```

---

### 4. local_names

Batch reverse lookup — query local names by a list of addresses.

```typescript
{
  query_type: "local_names";
  addresses: string[];          // Array of account addresses (0x...) to look up
}
```

**Result**: `{ address: string; name?: string }[]`

```typescript
{
  address: string;              // The queried address
  name?: string;                // Local name assigned to this address, undefined if none
}
```

---

### 5. token_list

Query cached token metadata — symbol, decimals, icon URL, description.

```typescript
{
  query_type: "token_list";
  filter?: TokenDataFilter;
}

TokenDataFilter {
  alias_or_name?: string;       // Filter by alias or name (max 64 bcs characters)
  symbol?: string;              // Filter by symbol
  type?: string;                // Filter by token type (e.g., "0x2::wow::WOW")
}
```

**Result**: `TokenTypeInfo[]`

```typescript
TokenTypeInfo {
  type: string;                 // Full token type (e.g., "0x2::wow::WOW")
  alias?: string;
  name: string;
  symbol: string;
  decimals: number;
  description: string;          // Token description (required)
  iconUrl?: string | null;      // URL for the token logo (may be null)
  id?: string | null;           // Object ID for the CoinMetadata object (may be null)
}
```

---

### 6. account_balance

Query an account's coin balance OR paginated coin objects.

```typescript
{
  query_type: "account_balance";
  name_or_address?: string;     // Account name or address. Empty string "" = default account
  balance?: boolean;            // Set to true to query total balance amount
  coin?: {                      // Set to query paginated coin objects instead of balance
    cursor?: string | null;     // Pagination cursor
    limit?: number | null;      // Max coin objects per page
  };
  token_type?: string;          // Token type; defaults to "0x2::wow::WOW" (platform token)
  network?: "localnet" | "testnet";
}
```

**Result** (when `balance: true`):

```typescript
{
  address: string;
  balance: {
    coinType: string;
    coinObjectCount: number;
    totalBalance: string;
    lockedBalance: Record<string, string>;
  };
}
```

**Result** (when `coin` is set):

```typescript
{
  address: string;
  coin: {
    data: CoinStruct[];
    hasNextPage: boolean;
    nextCursor?: string | null;
  };
}

CoinStruct {
  balance: string;
  coinObjectId: string;
  coinType: string;
  digest: string;
  previousTransaction: string;
  version: string;
}
```

---

### 7. onchain_personal_profile

Query any user's PUBLIC on-chain profile — social links, reputation, personal info, voting history, referrer.

```typescript
{
  query_type: "onchain_personal_profile";
  account?: string;             // Account name or ID. Empty string "" = default account
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `ObjectPersonal | undefined`

```typescript
ObjectPersonal {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  links?: PersonalLink[];
  likes?: number;
  dislikes?: number;
  records?: PersonalRecord[];
  votes?: PersonalVote[];
  referrer?: string;
}

PersonalLink {
  name: string;
  value: string;
}

PersonalRecord {
  name: string;
  value: string;
}

PersonalVote {
  entity: string;
  vote: boolean;                // true = like, false = dislike
}
```

---

### 8. onchain_objects

Batch query on-chain WOWOK objects by ID — supports Service, Machine, Order, Treasury, Reward, Arb, Personal, Contact, and more.

```typescript
{
  query_type: "onchain_objects";
  objects: string[];            // List of object IDs (names or addresses) to query in batch
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `{ objects: ObjectBase[] }`

```typescript
ObjectBase {
  id: string;
  type: string;                 // "Service" | "Machine" | "Order" | "Treasury" | "Reward" | "Arb" | "Personal" | "Contact" | ...
  version: string;
  digest: string;
  owner: string;
  // ... type-specific fields
}
```

---

### 9. onchain_received

Query objects (payments, tokens, NFTs) received by an on-chain object.

```typescript
{
  query_type: "onchain_received";
  name_or_address: string | AccountOrMark_Address; // Account name, address, or mark. Supports shorthand string (e.g. "alice") or full {name_or_address, local_mark_first} object
  type?: string | "CoinWrapper" | null;  // Type filter for querying received objects:
                                        // - undefined/null: query all types (equivalent to old all_type=true)
                                        // - "CoinWrapper": query object's CoinWrapper type (equivalent to old all_type=false)
                                        // - string: query specific StructType (e.g., "0x2::payment::CoinWrapper<0x2::wow::WOW>")
  cursor?: string | null;       // Pagination cursor from previous page
  limit?: number | null;        // Max records per page
  no_cache?: boolean;
  network?: "localnet" | "testnet";
}
```

**Result**: `ReceivedBalance | ReceivedNormal[]`

```typescript
// When querying CoinWrapper type (type: "CoinWrapper"):
ReceivedBalance {
  balance: string;
  token_type: string;
  received: { id: string; balance: string; payment: string; }[];
}

// When querying all types (type: undefined or null):
ReceivedNormal {
  id: string;
  type: string;
  content_raw?: any;  // raw content data
}

// When querying a specific StructType (type: string):
ReceivedNormal {
  id: string;
  type: string;
  content_raw?: any;  // raw content data
}
```

---

## Output Schema

All queries return results wrapped in a unified `z.object({ result: ... })` structure with strict schema validation:

```typescript
WatchQueryOperationsResult {
  result: {
    query_type: string;         // Echoes the requested query_type
    result: any;                // Query-specific result (see each query type above)
  }
}
```

The output schema validates all 9 query types with their specific return types. Each query's `result` field is strictly typed:
- Local queries return arrays (`MarkData[]`, `AccountData[]`, `InfoData[]`, `TokenTypeInfo[]`)
- `account_balance` returns `{ address, balance? | coin? }`
- Onchain queries return `ObjectType | undefined` or `{ objects: ObjectBase[] }`
- `onchain_received` returns `ReceivedBalance | ReceivedNormal[]`