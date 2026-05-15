# WoWok AI Skill Framework

> Master guidance for AI agents operating the WoWok MCP Server (wowok_agent). This document provides core principles, design patterns, and operational rules. For detailed tool schemas, see `schema-<tool_name>.md` files in this directory.

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Common Schemas & Patterns](#2-common-schemas--patterns)
3. [Tool Selection Guide](#3-tool-selection-guide)
4. [Object Creation Order (Dependency Chain)](#4-object-creation-order-dependency-chain)
5. [Guard Design Rules](#5-guard-design-rules)
6. [Machine Workflow Patterns](#6-machine-workflow-patterns)
7. [Operational Best Practices](#7-operational-best-practices)
8. [Appendix: Value Types](#8-appendix-value-types)

---

## 1. Core Principles

### 1.1 Security & Safety

- **Hot Wallet Usage**: WoWok never exposes private keys. Treat it as a spending account for transfers, receipts, and commerce. Flag large transactions for explicit user confirmation.
- **Amount-Sensitive Operations**: Any token transfer, payment, or reward distribution MUST be verbally confirmed with the user before execution. Use `Payment` objects for commercial transfers when possible (they offer Guard validation and purpose tracking).
- **LOCAL vs ON-CHAIN**: Tools marked `LOCAL ONLY` (`account_operation`, `local_mark_operation`, `local_info_operation`) never touch the blockchain and consume no gas.
- **Default Account**: Empty string `""` means the default account. Always use the default when the user does not specify an account.

### 1.2 Network & Token Defaults

| Parameter | Default Value | Notes |
|-----------|---------------|-------|
| Network | `testnet` | Override via `env.network` |
| Token | `0x2::wow::WOW` | 9 decimals (1 WOW = 1_000_000_000) |

- **Multi-Token Support**: All operations support custom `token_type`. ALWAYS query precision via `query_toolkit (token_list)` first. Never assume decimals.
- **Amount Formats**:
  - With unit: `"2WOW"`, `"10.5USDT"` — auto-converted using token precision.
  - Plain number: internal unit (e.g., `1000000000` = 1 WOW). Always clarify with users when displaying plain numbers.

### 1.3 Query-First Pattern

- **Query before mutate**: Always query current state before modifications. Use `query_toolkit` with filters.
- **Pagination**: All on-chain list queries (events, tables, received) support `cursor`/`limit`. Loop for large datasets.
- **Cache control**: Use `no_cache: true` for time-sensitive reads.

### 1.4 Naming Conventions (Mandatory for Complex Builds)

When users request complex systems (multiple objects, Guards, Machines, Services) without naming, propose a naming scheme:

```
<projectPrefix>_<type>_<purpose>_<version>
```

- **Project prefix**: e.g., `shopFunny_` — prevents cross-project collisions.
- **Type prefix**: e.g., `shopFunny_machine_`, `shopFunny_guard_` — clarifies object type.
- **Purpose suffix**: e.g., `shopFunny_guard_serviceWithdraw_v2` — describes function.
- **Version suffix**: e.g., `_v2` — enables iteration.
- **Tags**: Always provide `tags` on object creation for filtering and management.
- **Address display**: Use short form (`0x1234...def`). Use names as primary identifiers.

### 1.5 `replaceExistName` Flag

The `replaceExistName` boolean flag appears in **name configuration objects** (e.g., `name.replaceExistName` inside `MarkParam` and `AccountOperation.gen`). It controls whether a name collision causes an error or silently reclaims the name from an existing object.

**Schema Hierarchy**
```
OperationInput
└── name: object
    ├── value: string          // The desired name
    └── replaceExistName: boolean (optional, default: false)
```

**Behavior**
| `replaceExistName` | Effect |
|--------------------|--------|
| `false` (default)  | Throws an error if the name is already in use. |
| `true`             | Steals the name from the existing object and assigns it to the new one. The old object becomes unnamed. |

**Why It Matters**
- **Repeatable testing**: In iterative build-and-test workflows, you can reuse a fixed name (e.g., `testGuard_v1`) without manually cleaning up old objects first.
- **Deterministic references**: Scripts and documentation can refer to objects by stable names instead of unpredictable addresses.
- **Safe default**: Default `false` prevents accidental name hijacking in production; set `true` only when you explicitly intend to overwrite.

### 1.6 Guard Submission Mechanism

When an on-chain operation requires Guard validation and the Guard's table contains entries with **`b_submission: true`** (meaning user-submitted data is required for verification), the operation does NOT immediately return a transaction result. Instead, it returns a **`type: "submission"`** response containing the Guard's data requirements.

**Two-Step Flow**:

```
Step 1 — Initial Call
├── onchain_operations (service/machine/progress/order/etc.)
└── Response: type="submission"
    ├── guard: [{ object, impack }] — Guards to verify
    └── submission: [{ guard, submission: [{ identifier, value_type, value?, name }] }]
        ↑ You ONLY fill the `value` field based on `value_type`. Do NOT modify other fields.

Step 2 — Re-submit with Data
├── Same operation data
└── Add top-level `submission` field:
    {
      "type": "submission",
      "guard": [{ "object": "guard_name", "impack": true }],
      "submission": [{
        "guard": "guard_name",
        "submission": [
          { "identifier": 0, "value_type": "String", "value": "your_data_here" }
        ]
      }]
    }
```

**Critical Rules**:
- **Only fill `value`**: The returned submission template has `identifier`, `value_type`, `name` pre-filled. You ONLY add the `value` field matching the `value_type`. Never modify `identifier`, `value_type`, or `name`.
- **Value type matching**: `value_type` indicates the expected type (String, Address, U64, Bool, etc.). The `value` must match this type exactly.
- **Impack flag**: `impack: true` means this Guard's verification result affects the final outcome. All `impack=true` Guards must pass for the operation to proceed.
- **Multiple Guards**: If multiple Guards require submission, include all in the `submission` array.

**Operations Supporting Submission** (non-exhaustive):
`service`, `machine`, `progress`, `repository`, `arbitration`, `treasury`, `reward`, `allocation`, `demand`, `order`, `gen_passport`

**Common Submission Scenarios**:
- **Merkle Root proof**: `value_type: "String"`, value = 64-char hex string.
- **Progress/Order address**: `value_type: "Address"`, value = object name or ID.
- **Time verification**: `value_type: "Address"`, value = Progress address (for time-elapsed Guards).
- **Node set validation**: `value_type: "U64"` or custom type depending on Guard design.

---

## 1.7 User-Friendly Display Conventions

When displaying addresses, IDs, or object references to users, follow these naming priority and formatting rules for optimal readability.

### 1.7.1 Name Resolution Priority

| Priority | Source | Display Format | Example |
|----------|--------|----------------|---------|
| 1 (Highest) | `local_mark_operation` (local mark) | `{local_mark_name} (localmark)` | `my_service (localmark)` |
| 2 | `account_operation` (account name) | `{account_name}` | `alice_wallet` |
| 3 (Fallback) | None / Unnamed | `{first6}...{last3}` | `0x3a2f...8c1` |

**Rules**:
- Always prefer the **local mark name** if one exists. Append `(localmark)` to indicate the source.
- If no local mark exists, use the **account name** if available. Append `(account)` to indicate the source.
- Only fall back to the truncated address format when no name is found.
- Unless the user explicitly specifies a different priority, follow the order above.

### 1.7.2 Address Truncation Format

For unnamed addresses, use the compact format:

```
{first_6_chars}...{last_3_chars}
```

- Include the `0x` prefix in the character count if present.
- Use exactly **three dots** (`...`) as the separator.
- Example: `0x3a2f...8c1`

---

## 2. Common Schemas & Patterns

### 2.1 CallEnv

Environment configuration for on-chain operations.

```typescript
CallEnv {
  account?: string;              // Operating account (empty = default)
  permission_guard?: string[];   // Permission Guard ID list for extended permissions
  no_cache?: boolean;            // Disable cache for fresh chain state
  network?: "localnet" | "testnet"; // Target network
  referrer?: string;             // Referrer ID
}
```

**Important**: When building multiple interdependent objects, **set `env.no_cache: true`** on every operation to ensure fresh state.

### 2.2 NamedObject Pattern

Naming configuration for new objects.

```typescript
NamedObject {
  name?: string;              // Object name (max 64 chars)
  tags?: string[];            // Tags for organization
  onChain?: boolean;          // Whether to sync name to blockchain (PUBLIC if true)
  replaceExistName?: boolean; // Force claim existing name (default: false)
}
```

**Important**: By default (`onChain: false` or undefined), names are stored LOCALLY ONLY. Set `onChain: true` to create a PUBLIC on-chain identity.

### 2.3 Object Reference Patterns

Most object fields support two formats:

| Format | Type | Usage |
|--------|------|-------|
| String | `NameOrAddressSchema` | Reference EXISTING object by name or ID |
| Object | `NamedObjectSchema` | CREATE NEW object with name/tags |

Example:
```json
// Reference existing
{ "object": "my_existing_service" }

// Create new
{ "object": { "name": "my_new_service", "tags": ["v1"] } }
```

### 2.4 CoinParam

Token amount specification.

```typescript
CoinParam = 
  | { balance: string | number }  // Amount with optional unit (e.g., "10WOW" = 10_000_000_000)
  | { coin: string };             // Specific coin object ID
```

---

## 3. Tool Selection Guide

| User Intent | Correct Tool | Notes |
|------------|--------------|-------|
| Create service listing | `onchain_operations` (service) | Marketplace listings with pricing |
| Send coins to address | `onchain_operations` (payment) | Direct wallet-to-wallet transfer |
| Check my balance | `query_toolkit` (account_balance) | Read-only query |
| Manage local wallet | `account_operation` | LOCAL ONLY |
| Export Guard for edit | `guard2file` | Export to JSON/Markdown |
| Send encrypted message | `messenger_operation` | End-to-end encryption |
| Create workflow template | `onchain_operations` (machine) | State machine definition |
| Store my phone number | `local_info_operation` | LOCAL ONLY |
| Buy service | `onchain_operations` (order) | Creates Order from Service |
| Apply for arbitration | `onchain_operations` (order) | Order manages Arb lifecycle |
| Create reward pool | `onchain_operations` (reward) | Marketing incentives |
| Claim rewards | `onchain_operations` (reward) | Guard-verified claiming |
| Create fund allocation | `onchain_operations` (allocation) | Auto-distribution plans |
| Create access control | `onchain_operations` (permission) | Permission indices |
| Create validation rules | `onchain_operations` (guard) | Programmable boolean logic |

### 3.1 Local vs On-chain Operations

**LOCAL ONLY** (Never touch blockchain):
- `account_operation`
- `local_mark_operation`
- `local_info_operation`

**ON-CHAIN** (Blockchain transactions):
- `onchain_operations`
- `messenger_operation` (some operations)
- `wip_file` (sign operation)

**QUERY** (Read-only):
- `query_toolkit`
- `onchain_table_data`
- `onchain_events`
- `wowok_buildin_info`
- `guard2file`
- `machineNode2file`

---

## 4. Object Creation Order (Dependency Chain)

### 4.1 Canonical Service Build Order

> ⚠️ **Important**: When building multiple interdependent objects in one session, **set `env.no_cache: true`** on every operation. Local cache may lag behind chain state — creating Service → Guard referencing Service → Machine referencing Guard requires fresh reads at each step. Pure queries and single-step operations may omit `no_cache`.

```
1. Permission (infrastructure; reusable across projects)
2. Service (create empty, publish=false)
3. Machine (create workflow, publish=false)
4. Guard (reference Service and Machine for validation)
5. order_allocators (fund distribution rules)
6. Arbitration (bind before Service publish)
7. Reward (depends on published Service + Guard)
8. Publish Machine → Bind Machine/Objects to Service → Publish Service
```

### 4.2 Critical Constraints

- **Machine publish=true**: Node structure becomes immutable. Export via `machineNode2file` and confirm with user before publishing.
- **Service publish=true**: Machine, Arbitration, Reward bindings become immutable. Export full info and confirm before publishing.
- **Machine nodes**: Initial node name is `""` (empty string). Each node has `pairs` (prior_node → forwards). Each forward has `weight`, `permissionIndex` OR `namedOperator` (required), and optional `guard`.
  - **CRITICAL**: At least one node MUST have a pair with `prev_node: ""` (empty string). This defines the entry point from the initial state. Without such a node, Progress cannot advance from its initial empty state.
  - `permissionIndex`: Shared across all Progress instances (internal roles).
  - `namedOperator`: Per-Progress namespace (external roles). Order user operations MUST use `namedOperator("")`.
- **Progress advancement**: Sum of completed forward weights ≥ threshold → session moves to history, next node becomes current.
  - Order users advance via `Order` object.
  - Non-order users advance via `Progress` object directly.

### 4.3 Object Dependencies Summary

| Object | Depends On | Can Be Bound To | Immutable When |
|--------|-----------|-----------------|----------------|
| Permission | None | All other objects | Never (always editable) |
| Service | Permission | Machine, Allocation, Arbitration | `bPublished: true` |
| Machine | Permission | Service | `bPublished: true` |
| Guard | None | Service, Machine, Order, Treasury, etc. | Never (always editable) |
| Allocation | Permission, Guard | Service | `bPublished: true` (via Service) |
| Arbitration | Permission, Guard | Service | `bPublished: true` (via Service) |
| Order | Service, Permission | Progress, Allocation | After creation (some fields) |
| Progress | Machine, Order | None | During advancement |

### 4.4 Common Mistakes to Avoid

1. **Publishing too early**: Once published, Service and Machine cannot be modified. Always test thoroughly before publishing.
2. **Forgetting no_cache**: When creating interdependent objects, always set `env.no_cache: true` to ensure fresh state.
3. **Wrong order of operations**: Create Permission → Service (unpublished) → Machine (unpublished) → Guards → Allocation → Arbitration → Bind → Publish.
4. **Missing permission indices**: When creating Machine forwards, ensure the permission indices exist in the Permission object.
5. **Not exporting before publish**: Use `guard2file` and `machineNode2file` to export and review Guard and Machine definitions before publishing.

### 4.5 Privacy & Consensus via Messenger

Sensitive logistics and customer data flow through Messenger's end-to-end encryption (never on-chain, AI-automatable). Guard consensus follows: **who performs the key action, submits the proof; the other party confirms**.

| Scenario | Action | Proof Submission |
|----------|--------|------------------|
| Merchant ships | Receives address via Messenger, replies tracking number | Merchant submits Merkle Root to Guard |
| Customer returns | Sends return tracking via Messenger | Customer submits Merkle Root to Guard |
| Mutual confirmation | Both parties sign | Both submit confirmation proofs |

### 4.6 Payments & Refunds

- **Service purchase**: Always pay through `Service`. Name the generated `Order`, `Progress`, and `Allocation` via `namedNew*` fields for easy management.
- **Order operations**: All order user operations MUST go through `Order` object.
- **Refunds/withdrawals**: Users satisfy `Allocation` Guard conditions to withdraw instantly.
- **Arbitration claims**: Compensation payouts go through `Order`.
- **Alternative payments**:
  - `account_operation (transfer)`: Direct wallet-to-wallet.
  - `onchain_operations (payment)`: Payment object with commercial features (purpose, Guard validation).

---

## 5. Guard Design Rules

Guard is WoWok's on-chain validation engine. Every Guard object is a pure function tree that evaluates to `Bool` (pass/fail). Designing Guards correctly requires strict adherence to type safety, node constraints, and data flow rules.

### 5.1 The Root Node MUST Return Bool

The `root` field is mandatory. It defines the validation logic as a computational tree:

- `root.type = "node"`: Provide a `GuardNode` computational tree directly.
- `root.type = "file"`: Load the tree from a JSON/Markdown file (useful for complex Guards).

**The root node MUST return a `Bool` value (ValueType = 0).** This is the final pass/fail verdict. Any non-bool return type at the root is invalid and will cause Guard creation to fail.

### 5.2 Strong Typing Throughout

Guard validation is **strongly typed** from node design to user submission. Every node declares its return type, and child nodes must match the parent node's expected input types.

**Supported Value Types**:

| Type | ID | Description |
|------|-----|-------------|
| Bool | 0 | Boolean true/false |
| Address | 1 | Object or account address |
| String | 2 | UTF-8 string |
| U8 | 3 | 8-bit unsigned integer (0-255) |
| U16 | 4 | 16-bit unsigned integer (0-65535) |
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
| Value | 19 | **Internal dynamic type. Do NOT use directly.** |

**Guard Table Items** define the data schema:

```typescript
{
  identifier: number,      // 0-255, unique index in Guard table
  b_submission: boolean,   // true = user must submit this value; false = must provide default value
  value_type: ValueType,   // MUST match the expected type
  value?: SupportedValue,  // Required when b_submission=false; omit when b_submission=true
  name: string             // Description of this data field
}
```

- When `b_submission: true`: The value is provided by the user at verification time. Do NOT set a default `value`.
- When `b_submission: false`: A default `value` MUST be provided, and it must exactly match the declared `value_type`.
- Type mismatches between `value_type` and actual `value` (whether submitted or default) cause Guard evaluation to abort with failure.

### 5.3 Node Operand Constraints

Each node type enforces strict rules on the **number** and **types** of its child nodes (operands).

**Multi-Operand Nodes** (2 to 8 children, via `nodes` array):

| Node Type | Return Type | Child Node Requirements |
|-----------|-------------|------------------------|
| `logic_and` / `logic_or` | Bool | 2-8 Bool nodes |
| `logic_equal` | Bool | 2-8 nodes of any type (type + value must match) |
| `logic_as_u256_greater_or_equal` | Bool | 2-8 numeric nodes (U8, U16, U32, U64, U128, U256) |
| `logic_as_u256_lesser_or_equal` | Bool | 2-8 numeric nodes |
| `logic_as_u256_greater` | Bool | 2-8 numeric nodes |
| `logic_as_u256_lesser` | Bool | 2-8 numeric nodes |
| `logic_as_u256_equal` | Bool | 2-8 numeric nodes |
| `logic_string_contains` | Bool | 2-8 String nodes |
| `logic_string_nocase_contains` | Bool | 2-8 String nodes |
| `logic_string_nocase_equal` | Bool | 2-8 String nodes |
| `calc_number_add` | U256 | 2-8 numeric nodes |
| `calc_number_multiply` | U256 | 2-8 numeric nodes |
| `calc_number_subtract` | U256 | 2-8 numeric nodes |
| `calc_number_divide` | U256 | 2-8 numeric nodes (divisor != 0) |
| `calc_number_mod` | U256 | 2-8 numeric nodes (divisor != 0) |
| `calc_string_nocase_contains` | Bool | 2-8 String nodes |
| `calc_string_nocase_equal` | Bool | 2-8 String nodes |
| `calc_string_contains` | Bool | 2-8 String nodes |
| `vec_contains_bool` | Bool | 2-8 nodes. First: VecBool or Value. Rest: Bool or Value. |
| `vec_contains_address` | Bool | 2-8 nodes. First: VecAddress or Value. Rest: Address or Value. |
| `vec_contains_string` | Bool | 2-8 nodes. First: VecString or Value. Rest: String or Value. |
| `vec_contains_string_nocase` | Bool | 2-8 nodes. First: VecString or Value. Rest: String or Value. |
| `vec_contains_number` | Bool | 2-8 nodes. First: VecU8-VecU256 or Value. Rest: U8-U256 or Value. |

**Single-Operand Nodes** (1 child, via `node`):

| Node Type | Return Type | Child Requirement |
|-----------|-------------|-------------------|
| `logic_not` | Bool | 1 Bool node |
| `calc_string_length` | U64 | 1 String node |
| `convert_number_address` | Address | 1 numeric node |
| `convert_address_number` | U256 | 1 Address node |
| `convert_number_string` | String | 1 numeric node |
| `convert_string_number` | U256 | 1 String node (must be valid number) |
| `convert_safe_u8` | U8 | 1 numeric node (0-255) |
| `convert_safe_u16` | U16 | 1 numeric node (0-65535) |
| `convert_safe_u32` | U32 | 1 numeric node |
| `convert_safe_u64` | U64 | 1 numeric node |
| `convert_safe_u128` | U128 | 1 numeric node |
| `convert_safe_u256` | U256 | 1 numeric node |
| `value_type` | U8 | 1 node of any type |
| `vec_length` | U64 | 1 Vec* node |

**Dual-Operand Nodes** (2 children, via `nodeLeft` + `nodeRight`):

| Node Type | Return Type | Left Requirement | Right Requirement |
|-----------|-------------|------------------|-------------------|
| `calc_string_indexof` | U64 | String | String |
| `calc_string_nocase_indexof` | U64 | String | String |
| `vec_indexof_bool` | U64 | VecBool or Value | Bool or Value |
| `vec_indexof_address` | U64 | VecAddress or Value | Address or Value |
| `vec_indexof_string` | U64 | VecString or Value | String or Value |
| `vec_indexof_string_nocase` | U64 | VecString or Value | String or Value |
| `vec_indexof_number` | U64 | VecU8-VecU256 or Value | U8-U256 or Value |

**Special Nodes**:

| Node Type | Return Type | Description |
|-----------|-------------|-------------|
| `identifier` | Declared type | Returns constant or submitted value from Guard table |
| `query` | Query-dependent | Executes data query on specified object |
| `context` | Signer: Address, Clock: U64, Guard: Address | System context values |
| `query_reward_record_find` | U64 | Finds first/last reward record index by recipient + filters. Returns index if found. **Throws error if not found** (Guard validation fails). |
| `query_reward_record_count` | U64 | Counts reward records matching filters |
| `query_reward_record_exists` | Bool | Checks if any reward record exists matching filters |
| `query_progress_history_find` | U64 | Finds first/last history entry index. Returns index if found. **Throws error if not found** (Guard validation fails). |
| `query_progress_history_session_find` | U64 | Finds first/last session index within history. Returns index if found. **Throws error if not found** (Guard validation fails). |
| `query_progress_history_session_forward_find` | U64 | Finds first/last forward index within session. Returns index if found. **Throws error if not found** (Guard validation fails). |
| `query_progress_history_session_count` | U64 | Counts sessions within history entry |
| `query_progress_history_session_forward_count` | U64 | Counts forwards within session |
| `query_progress_history_session_forward_retained_submission_count` | U64 | Counts retained submissions within forward |

### 5.4 Query Nodes and `convert_witness`

The `query` node is powerful: it fetches on-chain data dynamically during Guard evaluation. Its structure:

```typescript
{
  type: "query",
  query: number | string,     // Guard query ID or name (e.g., 1001 or "permission.description")
  object: {
    identifier: number,       // Reference to object address in Guard table
    convert_witness?: number  // Optional: fetch from associated object instead
  },
  parameters: GuardNode[]     // Must match query's expected parameter types
}
```

**`convert_witness` — Cross-Object Data Retrieval**:

This is one of the most commonly used features. When querying an object, `convert_witness` allows you to fetch data from an **associated object** instead of the object itself.

| Witness Type | Value | Description |
|--------------|-------|-------------|
| TypeOrderProgress | 100 | From Order, get its Progress |
| TypeOrderMachine | 101 | From Order, get its Machine |
| TypeOrderService | 102 | From Order, get its Service |
| TypeProgressMachine | 103 | From Progress, get its Machine |
| TypeArbOrder | 104 | From Arb, get its Order |
| TypeArbArbitration | 105 | From Arb, get its Arbitration |
| TypeArbProgress | 106 | From Arb, get its Progress |
| TypeArbMachine | 107 | From Arb, get its Machine |
| TypeArbService | 108 | From Arb, get its Service |

**Example**: To verify that an Order's Progress is at a specific node, query the Order with `convert_witness = 100` (TypeOrderProgress) to fetch the Progress object, then query the Progress's current node name.

### 5.5 Discovering Query Instructions via `wowok_buildin_info`

Before using `query` nodes, you MUST discover available query instructions and their signatures:

```typescript
// Query all Guard instructions and object queries
{
  info: "guard instructions",
  filter: {
    scope: "all",           // "instruct" | "object query" | "all"
    objectType?: string,    // Filter by object type (for object queries)
    returnType?: string,    // Filter by return type
    paramCount?: number,    // Filter by parameter count
    name?: string           // Case-insensitive name filter
  }
}
```

This returns a list of all available operations with:
- `id`: Numeric operation ID
- `name`: Human-readable name (e.g., "machine.description")
- `objectType`: Target object type
- `parameters`: Array of expected parameter types
- `return`: Return value type
- `description`: Detailed usage description

**Best Practice**: Always query `guard instructions` before designing complex Guards. This ensures you use the correct query IDs, parameter types, and return types.

---

## 6. Machine Workflow Patterns

Machine defines order processing state machines. Each node represents a state with executable forwards.

### 6.1 Node Structure

```typescript
MachineNode {
  name: string;           // Node name (initial node is "")
  pairs: NodePair[];     // Prior node → forwards mappings
}

NodePair {
  prior_node: string;    // Previous node name ("" for entry)
  forwards: Forward[];   // Available operations
  threshold?: number;    // Weight threshold to advance
}

Forward {
  name: string;                    // Forward name
  namedOperator?: string;          // Per-Progress namespace
  permissionIndex?: number;        // Shared permission index
  weight: number;                  // Forward weight
  guard?: string;                  // Optional Guard
}
```

### 6.2 Critical Constraints

- **Initial node**: At least one node MUST have `prior_node: ""` (empty string).
- **Forward requirements**: Each forward MUST specify either `permissionIndex` OR `namedOperator` (both are supported).
- **Order user operations**: MUST use `namedOperator("")` for customer operations.
- **Publish immutability**: After `publish=true`, node structure is immutable.

### 6.3 Guard in Forwards

The optional `guard` field in a Forward is used to validate critical operation results before allowing the forward to complete. Common use cases include:

- **Repository submission validation**: Verify that required data was successfully submitted to a specified Repository object
- **Supply chain commitment validation**: Confirm that sub-order commitments in the supply chain were fulfilled
- **External condition checks**: Validate any external state or conditions that must be met before proceeding

When a forward has a Guard, the Guard's logic is evaluated when a user attempts to execute that forward. If the Guard returns `false`, the forward cannot be completed.

### 6.4 Progress Advancement

Sum of completed forward weights ≥ threshold → session completes → next node becomes current.

---

## 7. Operational Best Practices

### 7.1 Incremental Object Building

For complex objects with many fields (Service, Machine), use **incremental building** instead of creating everything in one call:

**Benefits**:
- Each step can be verified before proceeding
- Errors are isolated to specific fields
- Easier to retry failed steps without re-executing successful ones
- Better user feedback at each stage

### 7.2 Error Patterns

- **Guard validation failures**: After re-submitting with `submission`, if Guard logic evaluates to false, the transaction fails with a specific error. Review the Guard's rule tree (via `guard2file`) and the submitted data values.
- **File parsing failures** (`machineNode2file`, `guard2file`): Include line/column information in error messages. Check file format and schema compliance.
- **Cache stale reads**: If sequential operations fail unexpectedly (e.g., "object not found" when you just created it), retry with `env.no_cache: true`.
- **Permission denied**: The operating account lacks the required Permission index for this operation. Check the object's Permission configuration.

### 7.3 Testing & Validation Workflow

1. **Design Phase**: Use `wowok_buildin_info` to discover available permissions and Guard instructions
2. **Export & Review**: Before publishing, use `guard2file` and `machineNode2file` to export and review definitions
3. **Incremental Testing**: Build objects step-by-step, verifying each step
4. **Final Validation**: Test all Guard conditions and Machine transitions before publishing
5. **Publish**: Only after thorough testing, publish Service and Machine

---

## 8. Appendix: Value Types

### 8.1 Complete Value Type Reference

| Type | ID | String Form | Description |
|------|-----|-------------|-------------|
| Bool | 0 | "Bool" | Boolean true/false |
| Address | 1 | "Address" | WoWok address (0x + 64 hex) |
| String | 2 | "String" | UTF-8 string |
| U8 | 3 | "U8" | 8-bit unsigned (0-255) |
| U16 | 4 | "U16" | 16-bit unsigned (0-65535) |
| U32 | 5 | "U32" | 32-bit unsigned |
| U64 | 6 | "U64" | 64-bit unsigned |
| U128 | 7 | "U128" | 128-bit unsigned |
| U256 | 8 | "U256" | 256-bit unsigned |
| VecBool | 9 | "VecBool" | Vector of booleans |
| VecAddress | 10 | "VecAddress" | Vector of addresses |
| VecString | 11 | "VecString" | Vector of strings |
| VecU8 | 12 | "VecU8" | Vector of U8 |
| VecU16 | 13 | "VecU16" | Vector of U16 |
| VecU32 | 14 | "VecU32" | Vector of U32 |
| VecU64 | 15 | "VecU64" | Vector of U64 |
| VecU128 | 16 | "VecU128" | Vector of U128 |
| VecU256 | 17 | "VecU256" | Vector of U256 |
| VecVecU8 | 18 | "VecVecU8" | Vector of VecU8 |

### 8.2 Type Compatibility
- **Vector types**: Must match exactly (VecU8 ≠ VecU16).
- **Address**: Can be converted to/from U256 using `convert_address_number` / `convert_number_address`.
