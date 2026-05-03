# Schema: query_toolkit

> WOWOK data query toolkit: Query local naming info (accounts, names, Object IDs), and query on-chain WOWOK objects, table items, events, received tokens, user profile, etc.

---

## Top-Level Structure

```typescript
QueryToolkit {
  // Discriminated union by query_type
  query_type: string;
  // Query-specific parameters
  ...
}
```

---

## Query Types

### query_account

Query account's coin balance and coin objects.

```typescript
QueryAccount {
  query_type: "query_account";
  name_or_address?: string;     // Account name or address. Empty = default
  balance?: boolean;            // Whether to query coin balance
  coin?: {
    cursor?: string | null;     // Pagination cursor
    limit?: number | null;      // Max objects to return
  };
  token_type?: string;          // Default: 0x2::wow::WOW
  network?: "localnet" | "testnet";
}
```

**Result**:

```typescript
QueryAccountResult {
  name_or_address?: string;
  address?: string;
  balance?: CoinBalance;
  coin?: PaginatedCoins;
}

CoinBalance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
  lockedBalance: Record<string, string>;
}

PaginatedCoins {
  data: CoinStruct[];
  hasNextPage: boolean;
  nextCursor?: string | null;
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

### query_account_list

Query list of accounts.

```typescript
QueryAccountList {
  query_type: "query_account_list";
  filter?: AccountFilter;
}

AccountFilter {
  name?: string;                // Filter by name (fuzzy match)
  address?: string;             // Filter by address (partial match)
  suspended?: boolean;          // Filter by suspension status
  hasMessenger?: boolean;       // Filter accounts with messenger
  m?: string;                   // Filter by messenger name (fuzzy)
  createdAt?: { gte?: number; lte?: number };
  updatedAt?: { gte?: number; lte?: number };
}
```

**Result**:

```typescript
QueryAccountListResult {
  result: AccountData[];
}

AccountData {
  name?: string;
  address: string;
  pubkey?: string;
  secret?: string;
  suspended?: boolean;
  createdAt?: number;
  updatedAt?: number;
  m?: string | null;
}
```

---

### query_local_mark_list

Query local mark list.

```typescript
QueryLocalMarkList {
  query_type: "query_local_mark_list";
  filter?: LocalMarkFilter;
}

LocalMarkFilter {
  name?: string;
  tags?: string[];
  address?: string;
  createdAt?: { gte?: number; lte?: number };
  updatedAt?: { gte?: number; lte?: number };
}
```

**Result**:

```typescript
QueryLocalMarkListResult {
  result: MarkData[];
}

MarkData {
  name?: string;
  address: string;
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
}
```

---

### query_local_info_list

Query local info list.

```typescript
QueryLocalInfoList {
  query_type: "query_local_info_list";
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

**Result**:

```typescript
QueryLocalInfoListResult {
  result: InfoData[];
}

InfoData {
  name: string;
  default: string;
  contents?: string[];
  createdAt?: number;
  updatedAt?: number;
}
```

---

### query_object

Query on-chain object by ID.

```typescript
QueryObject {
  query_type: "query_object";
  id: string;                   // Object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**: Object-specific data (Service, Machine, Order, etc.)

---

### query_table

Query table items.

```typescript
QueryTable {
  query_type: "query_table";
  parent: string;               // Parent object ID
  table: string;                // Table type
  cursor?: string | null;
  limit?: number | null;
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

---

### query_table_item

Query specific table item.

```typescript
QueryTableItem {
  query_type: "query_table_item";
  parent: string;               // Parent object ID
  table: string;                // Table type
  key: string | number;         // Item key
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

---

### query_received

Query objects/tokens received by an object.

```typescript
QueryReceived {
  query_type: "query_received";
  object: string;               // Object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryReceivedResult {
  id: string;
  type: string;
}[];
```

---

### query_guard

Query Guard object with parsed table.

```typescript
QueryGuard {
  query_type: "query_guard";
  id: string;                   // Guard object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryGuardResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  table: GuardTableItem[];
  root: GuardNode;
}

GuardTableItem {
  identifier: number;
  b_submission: boolean;
  value_type: ValueType;
  value?: SupportedValue;
  name?: string;
}

GuardNode =
  | { logic: "and" | "or"; nodes: GuardNode[] }
  | { logic: "not"; node: GuardNode }
  | { type: "query"; query: number | string; object: { identifier: number; convert_witness?: number }; parameters: GuardNode[] }
  | { type: "context"; context: "Signer" | "Clock" | "Guard" }
  | { type: "identifier"; identifier: number }
  | { type: "constant"; value_type: ValueType; value: SupportedValue };
```

---

### query_machine

Query Machine object with nodes.

```typescript
QueryMachine {
  query_type: "query_machine";
  id: string;                   // Machine object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryMachineResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  node_count: number;
  consensus_repositories: string[];
  bPaused: boolean;
  bPublished: boolean;
  um: string | null;
  permission: string;
  nodes: MachineNode[];
}

MachineNode {
  name: string;
  pairs: {
    prior_node: string;
    forwards: {
      name: string;
      namedOperator?: string;
      permissionIndex?: number;
      weight: number;
      guard?: string;
    }[];
    threshold?: number;
  }[];
}
```

---

### query_service

Query Service object.

```typescript
QueryService {
  query_type: "query_service";
  id: string;                   // Service object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryServiceResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  location: string;
  sales: ServiceSale[];
  repositories: string[];
  buy_guard: string | null;
  machine: string | null;
  bPublished: boolean;
  bPaused: boolean;
  customer_required: string[];
  arbitrations: string[];
  compensation_fund: number;
  paused_time: number | null;
  compensation_lock_duration: string | number;
  order_allocators: Allocators | null;
  rewards: string[];
  um: string | null;
  permission: string;
}

ServiceSale {
  name: string;
  price: number;
  stock: number;
  suspension: boolean;
  wip: string;
  wip_hash: string;
}
```

---

### query_order

Query Order object.

```typescript
QueryOrder {
  query_type: "query_order";
  id: string;                   // Order object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryOrderResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  items: PurchasedItem[];
  discount: string | null;
  progress: string | null;
  machine: string | null;
  amount: number;
  builder: string;
  service: string;
  dispute: string[];
  agent: string[];
  allocation: string | null;
  claimed_by: string | null;
  required_info: string;
  time: string | number;
}

PurchasedItem {
  name: string;
  price: number;
  quantity: number;
  wip_hash: string;
}
```

---

### query_progress

Query Progress object.

```typescript
QueryProgress {
  query_type: "query_progress";
  id: string;                   // Progress object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryProgressResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  machine: string;
  context_repositories: string[];
  current: string;
  task: string | null;
  namedOperator: NamedOperator[];
  session: ProgressSession[];
  history_count: number;
  current_time: number;
}

NamedOperator {
  name: string;
  operators: string[];
}

ProgressSession {
  next_node: string;
  forwards: ProgressSessionHolder[];
  weights: number;
  threshold: number;
}

ProgressSessionHolder {
  forward: string;
  who: string | null;
  retained_submission: GuardSubmission[];
  msg: string;
  accomplished: boolean;
  time: number;
}
```

---

### query_permission

Query Permission object.

```typescript
QueryPermission {
  query_type: "query_permission";
  id: string;                   // Permission object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryPermissionResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  builder: string;
  admins: string[];
  entity: PermissionEntity[];
  remarks: PermissionRemark[];
}

PermissionEntity {
  address: string;
  index: number[];
}

PermissionRemark {
  index: number;
  remark: string;
}
```

---

### query_repository

Query Repository object.

```typescript
QueryRepository {
  query_type: "query_repository";
  id: string;                   // Repository object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryRepositoryResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  policies: RepositoryPolicy[];
  rewards: string[];
  um: string | null;
  permission: string;
}

RepositoryPolicy {
  name: string;
  type_guard?: string;
  read_guard?: string;
  consensus: boolean;
  write_guard?: string;
}
```

---

### query_arbitration

Query Arbitration object.

```typescript
QueryArbitration {
  query_type: "query_arbitration";
  id: string;                   // Arbitration object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryArbitrationResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  location: string;
  fee: number;
  pause: boolean;
  usage_guard: string | null;
  voting_guard: VotingGuard[];
  um: string | null;
  permission: string;
}

VotingGuard {
  guard: string;
  service_identifier?: number;
}
```

---

### query_arb

Query Arb (dispute) object.

```typescript
QueryArb {
  query_type: "query_arb";
  id: string;                   // Arb object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryArbResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  order: string;
  description: string;
  proposition: string[];
  fee: number;
  voting_deadline: number | null;
  votes: ArbVoted[];
  feedback: string;
  arbitration: {
    feedback: string;
    indemnity: number;
  } | null;
  reset_count: number;
  status: number;
}

ArbVoted {
  voter: string;
  agrees: number[];
  weight: number;
  time: number;
}
```

---

### query_demand

Query Demand object.

```typescript
QueryDemand {
  query_type: "query_demand";
  id: string;                   // Demand object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryDemandResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  location: string;
  rewards: string[];
  guards: ServiceGuard[];
  presenters_count: number;
  um: string | null;
  permission: string;
}

ServiceGuard {
  guard: string;
  service_identifier?: number;
}
```

---

### query_reward

Query Reward object.

```typescript
QueryReward {
  query_type: "query_reward";
  id: string;                   // Reward object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryRewardResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  guards: RewardGuard[];
  balance: number;
  guard_not_added_expiration_time: string | number | null;
  record_count: number;
  um: string | null;
  permission: string;
}

RewardGuard {
  guard: string;
  recipient: Recipient;
  amount: Amount;
  expiration_time?: number;
  store_from_id?: number;
}

Amount =
  | { type: "GuardU64Identifier"; value: number }
  | { type: "Fixed"; value: number };

Recipient =
  | { GuardIdentifier: number }
  | { Entity: { name_or_address?: string; local_mark_first?: boolean } }
  | { Signer: "signer" };
```

---

### query_treasury

Query Treasury object.

```typescript
QueryTreasury {
  query_type: "query_treasury";
  id: string;                   // Treasury object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryTreasuryResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  balance: number;
  external_deposit_guard: AmountFromDepositGuard[];
  external_withdraw_guard: AmountFromWithdrawGuard[];
  um: string | null;
  permission: string;
}

AmountFromDepositGuard {
  guard: string;
  amount: Amount;
}

AmountFromWithdrawGuard {
  guard: string;
  amount: Amount;
}
```

---

### query_allocation

Query Allocation object.

```typescript
QueryAllocation {
  query_type: "query_allocation";
  id: string;                   // Allocation object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryAllocationResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  balance: number;
  bPaused: boolean;
  um: string | null;
  permission: string;
}
```

---

### query_personal

Query Personal (public profile) object.

```typescript
QueryPersonal {
  query_type: "query_personal";
  id: string;                   // Personal object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryPersonalResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  description: string;
  avatar?: string;
  resource?: string;
  entity?: string;
  linker?: string;
  mark?: string;
}
```

---

### query_contact

Query Contact object.

```typescript
QueryContact {
  query_type: "query_contact";
  id: string;                   // Contact object ID or name
  network?: "localnet" | "testnet";
  no_cache?: boolean;
}
```

**Result**:

```typescript
QueryContactResult {
  id: string;
  type: string;
  version: string;
  digest: string;
  owner: string;
  my_status: string;
  description: string;
  location: string;
  ims: IMContact[];
  um: string | null;
  permission: string;
}

IMContact {
  at: string;
  description?: string;
}
```

---

### query_guard_instructions

Query available Guard query instructions.

```typescript
QueryGuardInstructions {
  query_type: "query_guard_instructions";
}
```

**Result**:

```typescript
QueryGuardInstructionsResult {
  instructions: GuardQuery[];
}

GuardQuery {
  id: number | string;
  name: string;
  objectType: string;
  parameters: ValueType[];
  return: ValueType;
  description: string;
  parameters_description: string[];
}
```

---

## Value Types

| Type | ID | Description |
|------|-----|-------------|
| Bool | 0 | Boolean |
| Address | 1 | Object or account address |
| String | 2 | UTF-8 string |
| U8 | 3 | 8-bit unsigned integer |
| U16 | 4 | 16-bit unsigned integer |
| U32 | 5 | 32-bit unsigned integer |
| U64 | 6 | 64-bit unsigned integer |
| U128 | 7 | 128-bit unsigned integer |
| U256 | 8 | 256-bit unsigned integer |
| VecBool | 9 | Vector of booleans |
| VecAddress | 10 | Vector of addresses |
| VecString | 11 | Vector of strings |
| VecU8 | 12 | Vector of U8 |
| VecU16 | 13 | Vector of U16 |
| VecU32 | 14 | Vector of U32 |
| VecU64 | 15 | Vector of U64 |
| VecU128 | 16 | Vector of U128 |
| VecU256 | 17 | Vector of U256 |
| VecVecU8 | 18 | Vector of VecU8 |
