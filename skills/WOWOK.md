# WoWok AI Skill Framework

> Master guidance for AI agents operating the WoWok MCP Server(wowok_agent). Companion schema files: `schema-<tool_name>.md` in this directory.

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

### 1.5 Guard Submission Mechanism

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

### 1.6 Object Creation Order (Dependency Chain)

> ⚠️ **Important**: When building multiple interdependent objects in one session, **set `env.no_cache: true`** on every operation. Local cache may lag behind chain state — creating Service → Guard referencing Service → Machine referencing Guard requires fresh reads at each step. Pure queries and single-step operations may omit `no_cache`.

The canonical Service build order:

```
1. Permission (infrastructure; reusable across projects)
2. Service (create empty, publish=false)
3. Guard (reference Service for validation)
4. Machine (create workflow, publish=false)
5. order_allocators (fund distribution rules)
6. Arbitration (bind before Service publish)
7. Reward (depends on published Service + Guard)
8. Publish Machine → Bind Machine/Objects to Service → Publish Service
```

**Critical constraints**:
- **Machine publish=true**: Node structure becomes immutable. Export via `machineNode2file` and confirm with user before publishing.
- **Service publish=true**: Machine, Arbitration, Reward bindings become immutable. Export full info and confirm before publishing.
- **Machine nodes**: Initial node name is `""` (empty string). Each node has `pairs` (prior_node → forwards). Each forward has `weight`, `permissionIndex` OR `namedOperator` (required), and optional `guard`.
  - `permissionIndex`: Shared across all Progress instances (internal roles).
  - `namedOperator`: Per-Progress namespace (external roles). Order user operations MUST use `namedOperator("")`.
- **Progress advancement**: Sum of completed forward weights ≥ threshold → session moves to history, next node becomes current.
  - Order users advance via `Order` object.
  - Non-order users advance via `Progress` object directly.

### 1.7 Privacy & Consensus via Messenger

Sensitive logistics and customer data flow through Messenger's end-to-end encryption (never on-chain, AI-automatable). Guard consensus follows: **who performs the key action, submits the proof; the other party confirms**.

| Scenario | Action | Proof Submission |
|----------|--------|------------------|
| Merchant ships | Receives address via Messenger, replies tracking number | Merchant submits Merkle Root to Guard |
| Customer returns | Sends return tracking via Messenger | Customer submits Merkle Root to Guard |
| Mutual confirmation | Both parties sign | Both submit confirmation proofs |

### 1.8 Payments & Refunds

- **Service purchase**: Always pay through `Service`. Name the generated `Order`, `Progress`, and `Allocation` via `namedNew*` fields for easy management.
- **Order operations**: All order user operations MUST go through `Order` object.
- **Refunds/withdrawals**: Users satisfy `Allocation` Guard conditions to withdraw instantly.
- **Arbitration claims**: Compensation payouts go through `Order`.
- **Alternative payments**:
  - `account_operation (transfer)`: Direct wallet-to-wallet.
  - `onchain_operations (payment)`: Payment object with commercial features (purpose, Guard validation).

---

## 2. Tool Overview & Quick Selection

| Tool | Type | Purpose | Detail Schema |
|------|------|---------|---------------|
| `onchain_operations` | ON-CHAIN | 16 object types: service, machine, progress, repository, arbitration, contact, treasury, reward, allocation, permission, guard, personal, payment, demand, order, gen_passport | [schema-onchain_operations.md](schema-onchain_operations.md) |
| `account_operation` | LOCAL | Wallet lifecycle: generate, suspend, resume, faucet, sign data | [schema-account_operation.md](schema-account_operation.md) |
| `local_mark_operation` | LOCAL | Address book: aliases and tags for IDs/addresses | [schema-local_mark_operation.md](schema-local_mark_operation.md) |
| `local_info_operation` | LOCAL | Sensitive data storage: delivery addresses, phone numbers | [schema-local_info_operation.md](schema-local_info_operation.md) |
| `query_toolkit` | QUERY | Unified query: local names, on-chain objects, tables, events, balances, profiles | [schema-query_toolkit.md](schema-query_toolkit.md) |
| `onchain_events` | QUERY | Event streams: Arb, Order, Progress, Demand, Entity events | [schema-onchain_events.md](schema-onchain_events.md) |
| `wowok_buildin_info` | QUERY | Protocol constants, permissions, Guard instructions, networks, value types | [schema-wowok_buildin_info.md](schema-wowok_buildin_info.md) |
| `wip_file` | LOCAL/ON-CHAIN | WIP promise files: generate, verify, sign, convert to HTML | [schema-wip_file.md](schema-wip_file.md) |
| `messenger_operation` | ON-CHAIN/LOCAL | Encrypted messaging: send/watch messages, WTS evidence, list management | [schema-messenger_operation.md](schema-messenger_operation.md) |
| `guard2file` | QUERY | Export Guard definition to JSON/Markdown for editing | [schema-guard2file.md](schema-guard2file.md) |
| `machineNode2file` | QUERY | Export Machine node tree to JSON/Markdown for editing | [schema-machineNode2file.md](schema-machineNode2file.md) |
| `documents_and_learn` | QUERY | Official documentation URLs | — |

### Tool Selection Matrix

| User Intent | Correct Tool | Avoid |
|-------------|--------------|-------|
| Create service listing | `onchain_operations` (service) | `query_toolkit` |
| Send coins to address | `onchain_operations` (payment) | `account_operation` |
| Check my balance | `query_toolkit` (account_balance) | `onchain_operations` |
| Manage local wallet | `account_operation` | `onchain_operations` |
| Export Guard for edit | `guard2file` | `query_toolkit` |
| Send encrypted message | `messenger_operation` | `onchain_operations` |
| Create workflow template | `onchain_operations` (machine) | `wip_file` |
| Store my phone number | `local_info_operation` | `onchain_operations` |
| Buy service / create order | `onchain_operations` (service.order_new) | `onchain_operations` (order) |
| Apply for arbitration | `onchain_operations` (order) | `onchain_operations` (arbitration) |
| Create reward pool | `onchain_operations` (reward) | `onchain_operations` (treasury) |
| Claim rewards | `onchain_operations` (reward) | `query_toolkit` |
| Create fund allocation | `onchain_operations` (allocation) | `onchain_operations` (treasury) |
| Execute distribution | `onchain_operations` (allocation) | `onchain_operations` (payment) |
| Post service demand | `onchain_operations` (demand) | `onchain_operations` (service) |
| Submit solution | `onchain_operations` (demand) | `onchain_operations` (order) |
| Create team treasury | `onchain_operations` (treasury) | `onchain_operations` (allocation) |
| Deposit/Withdraw treasury | `onchain_operations` (treasury) | `onchain_operations` (payment) |
| Create access control | `onchain_operations` (permission) | `onchain_operations` (guard) |
| Create validation rules | `onchain_operations` (guard) | `onchain_operations` (permission) |
| Query token precision | `query_toolkit` (token_list) | `wowok_buildin_info` |
| Watch on-chain events | `onchain_events` | `query_toolkit` |
| Generate WIP promise | `wip_file` (generate) | `messenger_operation` |
| Sign WIP file | `wip_file` (sign) | `account_operation` (signData) |
| Verify WIP integrity | `wip_file` (verify) | `query_toolkit` |
| Send encrypted file | `messenger_operation` (send_file) | `wip_file` |
| Generate WTS evidence | `messenger_operation` (generate_wts) | `wip_file` |
| Query protocol constants | `wowok_buildin_info` | `query_toolkit` |
| Get documentation URL | `documents_and_learn` | `wowok_buildin_info` |

---

## 3. Per-Tool Core Principles

### 3.1 onchain_operations

**Structure**: Discriminated union by `operation_type` (16 types). Each has `data`, optional `env`, optional `submission`.

**Pre-flight checklist**:
1. Identify target object type.
2. Prepare `data` fields.
3. Set `env` (account, network, no_cache).
4. Prepare `submission` if Guard validation required.

**Infrastructure first**: Guard and Permission are prerequisites for most business objects. Permission manages access control; Guard manages validation logic. Permission can also authorize Guards (satisfy conditions without being a specific user).

**Common mistakes to avoid**:
- Do not confuse `permission` (access control) with `guard` (validation rules).
- Guard `root` supports direct definition (`type='node'`) or file load (`type='file'`).
- Machine `node` supports incremental ops or complete file replacement.
- **Service MUST be created (`publish=false`) BEFORE binding Machine/Arbitration/Reward**.

### 3.2 account_operation

- All operations are local except `faucet`, `transfer`, `get` (these submit transactions).
- Account has `name` (locally unique) and `address` (globally unique on-chain).
- `suspend`: Account cannot sign transactions but address remains on-chain. `resume` restores.
- `messenger` field: Enables encrypted communication. `m` is the messenger name.

### 3.3 local_mark_operation / local_info_operation

- Pure local data, never on-chain.
- `mark`: Aliases + tags for addresses/object IDs.
- `info`: Structured private data (delivery addresses, phone numbers).
- Both support `add`/`remove`/`clear`; `info` additionally supports `reset` (modify contents).

### 3.4 query_toolkit

- Discriminated union by `query_type` (~20 subtypes).
- On-chain queries need object ID or name; local queries need no network.
- **Table item queries**: Different key types per table (string/u64/address/name+address). Choose correct `query_type` subtype.
- `received`: Query tokens/NFTs received by an object. Supports pagination.

### 3.5 onchain_events

- 6 event types: `ArbEvent`, `NewOrderEvent`, `ProgressEvent`, `DemandPresentEvent`, `DemandFeedbackEvent`, `NewEntityEvent`.
- Cursor pagination + asc/desc sorting.
- First query: `cursor: null`. Subsequent: use returned `nextCursor`.

### 3.6 wowok_buildin_info

- 5 query types: `constants`, `built-in permissions`, `guard instructions`, `current network`, `value types`.
- **Mandatory pre-step**: Query `built-in permissions` before creating Permission; query `guard instructions` before creating Guard.

### 3.7 wip_file

- 4 sub-operations: `generate`, `verify`, `sign`, `wip2html`.
- WIP = "Witness Immutable Promise" — tamper-proof document for AI-to-AI information transfer and commercial promises.
- `generate`: Supports local paths, URLs, and data URLs for images.
- `sign`: Requires account; produces verifiable signature (e.g., VIP endorsement for product reputation).

### 3.8 messenger_operation

- 14 sub-operations grouped as:
  - **Messaging**: `send_message`, `send_file`, `watch_messages`, `watch_conversations`
  - **WTS**: `generate_wts`, `verify_wts`, `sign_wts`, `wts2html`
  - **Lists**: `blacklist`, `friendslist`, `guardlist`, `settings`
  - **Status**: `mark_messages_as_viewed`, `mark_conversation_as_viewed`
  - **On-chain proof**: `proof_message`

- `send_message`/`send_file`: `from`/`to` accept strings or objects. `to` supports `AccountOrMark_AddressAISchema`.
- `watch_conversations`: `unreadOnly=true` for quick triage; `previewMessageCount` controls preview depth.
- `watch_messages`: `viewed` filter for read/unread; multi-dimensional time filtering.
- **WTS** (Witness Timestamp Signature): Conversation evidence with timestamps. Convert to HTML for presentation.
- **guardlist**: Unlike blacklist/friendslist, stores Guard addresses + passport validity. Anyone completing the Guard verification can initiate encrypted communication.

---

## 4. Workflow Patterns

### Pattern A: Create and Publish a Service

Follows Section 1.6 dependency chain exactly:

```
1. wowok_buildin_info → query built-in permissions
2. onchain_operations (permission) → create Permission object
3. onchain_operations (service) → create empty Service (publish=false)
4. onchain_operations (guard) → create Guards referencing Service
5. onchain_operations (machine) → create workflow, bind Guards/Permissions
6. onchain_operations (service) → create order_allocators
7. onchain_operations (service) → bind Machine to Service
8. onchain_operations (arbitration) → create Arbitration, bind to Service
9. onchain_operations (reward) → create Reward pool (after Service published)
10. onchain_operations (machine) → publish Machine (publish=true)
11. onchain_operations (service) → publish Service (publish=true)
```

**Pre-publish verification**:
- Export Machine nodes: `machineNode2file` → review file → confirm with user.
- Export Guard definitions: `guard2file` → review file → confirm with user.
- Query full Service state with `no_cache: true` → confirm all fields.

### Pattern B: User Purchase and Order Processing

```
1. query_toolkit (onchain_objects) → inspect Service details
   (analyze Machine flow, WIP promises, Arbitration/compensation_fund,
    Repository reputation, Discounts, Rewards, order_allocators)
2. onchain_operations (service.order_new) → place order
   (name Order, Progress, Allocation via namedNew*)
3. query_toolkit (onchain_objects) → query associated Progress
4. onchain_operations (order) → advance order via Order object per Machine flow
5. If arbitration needed: onchain_operations (order) → create Arb object
6. Withdrawals/refunds: onchain_operations (order) → satisfy Guard conditions
```

### Pattern C: Create and Claim Rewards

```
1. onchain_operations (guard) → create claim validation Guard
2. onchain_operations (reward) → create Reward pool, bind Guard
3. User claims: onchain_operations (reward) → submit Guard verification → receive reward
```

### Pattern D: Encrypted Communication Flow

```
1. account_operation → ensure messenger enabled (m field set)
2. messenger_operation (send_message / send_file) → exchange encrypted data
3. messenger_operation (watch_conversations, unreadOnly=true) → locate active conversations
4. messenger_operation (watch_messages, viewed=false) → read unread messages
5. messenger_operation (mark_messages_as_viewed) → mark as read
6. messenger_operation (generate_wts) → generate conversation evidence
7. messenger_operation (sign_wts) → sign evidence
8. messenger_operation (wts2html) → convert to HTML
9. messenger_operation (proof_message) → optionally anchor on-chain
```

**Privacy logistics pattern** (e-commerce):
- Customer sends address via Messenger → Merchant replies tracking number.
- Only Merkle Root goes on-chain as proof; actual data stays encrypted.
- Merchant submits Merkle Root to Progress; customer confirms receipt.

### Pattern E: Local Account & Address Management

```
1. account_operation (gen) → generate new account
2. account_operation (faucet) → get testnet tokens (testnet/localnet only)
3. local_mark_operation (add) → alias frequently used addresses
4. local_info_operation (add) → store delivery addresses, phone numbers
5. query_toolkit (account_list / local_mark_list) → manage local data
```

---

## 5. Schema File Index

| File | Content |
|------|---------|
| [schema-onchain_operations.md](schema-onchain_operations.md) | 16 object types: data structures, constraints, AI planning notes |
| [schema-account_operation.md](schema-account_operation.md) | Local wallet operations: gen, suspend, resume, faucet, transfer, signData |
| [schema-local_mark_operation.md](schema-local_mark_operation.md) | Address aliases and tags |
| [schema-local_info_operation.md](schema-local_info_operation.md) | Sensitive personal data storage |
| [schema-query_toolkit.md](schema-query_toolkit.md) | Query types: local names, objects, tables, events, balances |
| [schema-onchain_events.md](schema-onchain_events.md) | 6 event types, pagination, sorting |
| [schema-wowok_buildin_info.md](schema-wowok_buildin_info.md) | Protocol constants, permissions, Guard instructions |
| [schema-wip_file.md](schema-wip_file.md) | WIP file generation, verification, signing, HTML conversion |
| [schema-messenger_operation.md](schema-messenger_operation.md) | Encrypted messaging, WTS evidence, list management |
| [schema-guard2file.md](schema-guard2file.md) | Export Guard definition to editable file |
| [schema-machineNode2file.md](schema-machineNode2file.md) | Export Machine nodes to editable file |

---

## 6. Quick Reference: Critical Constraints

| Constraint | Value | Applies To |
|------------|-------|------------|
| Max markdown text (WIP) | 10,000 chars | `wip_file` generate |
| Max images (WIP) | 10 | `wip_file` generate |
| Max image size | 2MB each, 10MB total | `wip_file` generate |
| Guard identifier range | 0-255 | `guard` table |
| Permission custom index | 1000-65535 | `permission` user-defined |
| Rate mode denominator | 10,000 = 100% | `service` order_allocators |
| Local mark name max | 64 BCS chars | `local_mark_operation` |
| Local info name max | 64 BCS chars | `local_info_operation` |
| Local info content max | 300 BCS chars per item | `local_info_operation` |
| Account name max | 64 chars | `account_operation` |

---

## 7. Response Types & Error Handling

All on-chain operations return a discriminated union via `result.type`. The response type determines the next action.

### 7.1 Response Type Reference

| `result.type` | Meaning | Next Action |
|---------------|---------|-------------|
| `"submission"` | Guard requires user-submitted data | Fill `value` fields and re-submit (see Section 1.5) |
| `"transaction"` | Transaction executed on-chain | Check `effects.status` for success/failure |
| `"error"` | Operation failed before reaching chain | Read `error` message, fix input, retry |
| `"data"` | Object change data returned | Process `data` array for created/modified objects |
| `"null"` | No return value | Operation completed with no data to return |

### 7.2 Handling `type: "submission"` Responses

When a Guard's table contains `b_submission: true` entries, the operation returns submission requirements instead of executing. This is **not an error** — it is a normal part of the Guard verification flow.

**What to do when you receive `submission`**:

1. **Present Guard info to the user clearly**:
   - Show each Guard's `object` (name/ID) and `impack` status
   - Explain what each Guard validates
   - Suggest querying the Guard definition if context is unclear: `query_toolkit (onchain_object)` with the Guard ID

2. **Explain each submission field**:
   - `identifier`: The data slot index (0-255) in the Guard's table
   - `value_type`: The expected data type (String, Address, U64, Bool, etc.)
   - `name`: Human-readable description of what this field represents
   - `object_type`: When `value_type` is "Address", this indicates the expected object type (e.g., Progress, Order, Service)
   - `value`: **The ONLY field you fill**. All other fields must remain unchanged.

3. **Handle multiple Guards**:
   - The `guard` array may contain multiple Guard objects
   - Each Guard has its own `submission` array with required fields
   - All Guards with `impack: true` must pass for the operation to proceed
   - Present each Guard's requirements separately to avoid confusion

**Example user-facing explanation**:

```
This operation requires Guard verification. Please provide the following:

Guard: shipping_confirmation_guard (impack: true)
  This Guard validates that the merchant has provided shipping proof.
  - Field [0] "merkle_root" (type: String): Enter the 64-character hex Merkle root of the shipping receipt.

Guard: time_lock_guard (impack: true)
  This Guard ensures sufficient time has passed.
  - Field [1] "progress_ref" (type: Address, object_type: Progress): Enter the Progress object address to verify elapsed time.
```

### 7.3 Operation Splitting for Debugging

While `onchain_operations` supports multiple fields in a single `data` object, **splitting complex operations into multiple sequential calls** is often better for debugging and error isolation.

**When to split**:
- **Field dependencies**: If field `B` depends on the result of field `A` (e.g., creating an object then referencing it), but the schema execution order does not match your dependency chain. Fields execute in schema definition order, not the order you write them.
- **Complex transactions**: Multiple mutations in one call make it hard to identify which field failed.
- **Guard submissions**: If multiple fields require different Guard validations, splitting avoids confusion about which submission belongs to which field.

**Example — Splitting a Service build**:

Instead of one large call:
```json
{ "operation_type": "service", "data": { "object": {...}, "sales": {...}, "machine": "...", "order_allocators": {...}, "publish": true } }
```

Split into steps:
```
Call 1: Create empty service → { "object": { "name": "my_service" } }
Call 2: Add sales → { "object": "my_service", "sales": { "op": "add", ... } }
Call 3: Bind machine → { "object": "my_service", "machine": "my_machine" }
Call 4: Set allocators → { "object": "my_service", "order_allocators": {...} }
Call 5: Publish → { "object": "my_service", "publish": true }
```

**Benefits**:
- Each step can be verified before proceeding
- Errors are isolated to specific fields
- Easier to retry failed steps without re-executing successful ones
- Better user feedback at each stage

### 7.4 Error Patterns

- **Guard validation failures**: After re-submitting with `submission`, if Guard logic evaluates to false, the transaction fails with a specific error. Review the Guard's rule tree (via `guard2file`) and the submitted data values.
- **File parsing failures** (`machineNode2file`, `guard2file`): Include line/column information in error messages. Check file format and schema compliance.
- **Cache stale reads**: If sequential operations fail unexpectedly (e.g., "object not found" when you just created it), retry with `env.no_cache: true`.
- **Permission denied**: The operating account lacks the required Permission index for this operation. Check the object's Permission configuration.
