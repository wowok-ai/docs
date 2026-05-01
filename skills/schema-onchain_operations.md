# Schema: onchain_operations

> ⛓️ Core on-chain operations tool. Discriminated union by `operation_type` with 16 object types. Every operation may submit a blockchain transaction and consume gas.

---

## Top-Level Structure

```
OnchainOperations
├── operation_type: string — One of 16 types (see below)
├── data: object — Type-specific data (required)
├── env?: CallEnv — Optional environment
└── submission?: SubmissionCall — Optional Guard submission data
```

### CallEnv

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account | string | No | Operating account (empty = default) |
| permission_guard | string[] | No | Permission Guard ID list for extended permissions |
| no_cache | boolean | No | Disable cache for fresh chain state |
| network | "localnet" \| "testnet" | No | Target network |
| referrer | string | No | Referrer ID |

### SubmissionCall

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | "submission" | Yes | Fixed value |
| guard | { object: string, impack: boolean }[] | Yes | Guard validation list |
| submission | GuardSubmissionToFill[] | Yes | Submission data per Guard |

---

## Operation Types

### service — Service Marketplace

**Capabilities**: Create/manage service listings, pricing, inventory, bind Machine workflows, set arbitration and compensation funds, issue discount coupons.

**CallService_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? }
│   — Existing object ID (modify) or creation config (new)
├── order_new?: OrderNew — Customer places order
│   └── { buy: BuySchema, agents?, order_required_info?, transfer?, namedNewOrder?, namedNewAllocation?, namedNewProgress? }
│       └── BuySchema: { items: ServiceBuyItem[], total_pay: CoinParam, discount?, payment_remark?, payment_index? }
│           └── ServiceBuyItem: { name, stock, wip_hash }
├── description?: string — Service description
├── location?: string — Service location
├── sales?: SalesOp — Sales item operations (discriminated union by op)
│   ├── { op: "add", sales: ServiceSale[], bReplace? }
│   ├── { op: "set", sales: ServiceSale[], bReplace? }
│   ├── { op: "remove", sales_name: string[] }
│   └── { op: "clear" }
│       └── ServiceSale: { name, price, stock, suspension, wip, wip_hash }
├── repositories?: ObjectsOp — Repository operations
├── rewards?: ObjectsOp — Reward object operations
├── arbitrations?: ObjectsOp — Arbitration object operations
├── machine?: string | null — Bind Machine (null = remove)
├── discount?: Discount — Issue discount coupon
│   └── { name, discount_type, discount_value, benchmark?, time_ms_start?, time_ms_end?, count?, recipient, transferable? }
├── discount_destroy?: string[] — Destroy discount object IDs
├── customer_required?: string[] — Required customer info (phone, email, shipping_address)
├── order_allocators?: Allocators | null — Order fund allocators
│   └── { description, threshold, allocators: Allocator[] }
│       └── Allocator: { guard, sharing: AllocationSharing[], fix?, max? }
│           └── AllocationSharing: { who: Recipient, sharing: string|number, mode: "Amount"|"Rate"|"Surplus" }
├── buy_guard?: string | null — Purchase Guard (null = remove)
├── compensation_fund_add?: CoinParam — Add to compensation fund
├── compensation_locked_time_add?: number — Compensation lock duration (ms)
├── compensation_fund_receive?: ReceivedBalanceOrRecently — Receive compensation funds
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap CoinWrapper to Permission owner
├── um?: string | null — Contact object
├── pause?: boolean — Pause new orders
└── publish?: boolean — Publish service (true = immutable)
```

**Critical Constraints**:
- After `publish=true`: Machine, arbitrations, order_allocators become immutable.
- Machine MUST be in `published` state before binding to Service.
- `order_allocators` Rate mode: `sharing` is in basis points (10,000 = 100%).

**Build & Publish Flow**:
1. Create empty Service (`publish=false`) → get Service address/name.
2. Create Guards referencing Service.
3. Create Machine, bind Guards/Permissions.
4. Bind Machine to Service.
5. Configure order_allocators, arbitrations, sales.
6. Publish Service (`publish=true`).

**Order Placement (order_new)**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "service_name",
    "order_new": {
      "buy": {
        "items": [{ "name": "product", "stock": 1, "wip_hash": "sha256:..." }],
        "total_pay": { "balance": "amount" }
      },
      "namedNewOrder": { "name": "order_name" },
      "namedNewAllocation": { "name": "allocation_name" },
      "namedNewProgress": { "name": "progress_name" }
    }
  }
}
```

---

### machine — Workflow Template

**Capabilities**: Define order processing state machines. Each node represents a state with executable forwards (operations).

**CallMachine_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? }
├── progress_new?: ProgressNew — Generate new Progress
│   └── { task?, repository?, progress_namedOperator?, namedNew? }
│       └── progress_namedOperator: { op: "add"|"set"|"remove", name: string, operators: ManyAccountOrMark_Address }
├── description?: string — Description
├── repository?: ObjectsOp — Consensus repository operations
├── node?: NodeField — Node operations (two mutually exclusive modes)
│   **Mode 1: NodeSchema (incremental)**
│   └── { op: "add"|"set", nodes: MachineNode[], bReplace? }
│       └── MachineNode: { name, pairs: NodePair[] }
│           └── NodePair: { prior_node, forwards: Forward[], threshold? }
│               └── Forward: { name, namedOperator?, permissionIndex?, weight, guard? }
│   Or: { op: "remove", nodes: string[] }
│   Or: { op: "clear" }
│   Or: { op: "exchange", node_one, node_other }
│   Or: { op: "rename", node_name_old, node_name_new }
│   Or: { op: "remove prior node", pairs: NodeRemovePriorNodeData[] }
│   Or: { op: "add forward", data: NodeAddForwardData[] }
│   Or: { op: "remove forward", data: NodeRemoveForwardData[] }
│   **Mode 2: NodeJsonOrMarkdownFileSchema (complete replacement)**
│   └── { json_or_markdown_file: string }
├── pause?: boolean — Pause new Progress generation
├── publish?: boolean — Publish (nodes become immutable)
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

**Critical Constraints**:
- After `publish=true`: Node structure is immutable.
- Initial node name is `""` (empty string).
- Each forward MUST specify either `permissionIndex` OR `namedOperator`.
- `namedOperator("")` = order owner/agents can execute (for customer operations).

**Node Design Best Practices**:
- **Node names**: Describe business states (e.g., "Order Confirmed", "Shipping", "Delivery Complete").
- **Forward names**: Describe actions (e.g., "Submit Messenger Merkle Root", "Confirm Receipt").
- **Threshold**: 1 for single-signature; 2+ for multi-party confirmation.
- **Permission mapping**: Document index semantics in Permission remarks.

---

### progress — Workflow Instance

**Capabilities**: Drive Machine-defined workflows forward. Manage sessions and forwards.

**CallProgress_Data Structure**:

```
├── object: string — Progress ID or name (required, modify only)
├── task?: string | null — Target task ID (immutable after set)
├── repository?: ObjectsOp — Context repository operations
├── progress_namedOperator?: ProgressNamedOperator — Manage namespace operators
│   └── { op: "add"|"set"|"remove", name: string, operators: ManyAccountOrMark_Address }
├── operate?: Operate — Advance workflow (core field)
│   └── { operation: { next_node_name, forward }, hold?, adminUnhold?, message? }
└── permission?: string | null — Permission object
```

**Operate Structure**:
```json
{
  "operate": {
    "operation": {
      "next_node_name": "target_node",
      "forward": "forward_name"
    },
    "hold": false,
    "message": "operation note"
  }
}
```

**With Guard Submission**:
```json
{
  "submission": {
    "type": "submission",
    "guard": [{ "object": "guard_name", "impack": true }],
    "submission": [{
      "guard": "guard_name",
      "submission": [
        { "identifier": 0, "value_type": "String", "value": "merkle_root" },
        { "identifier": 1, "value_type": "Address", "value": "progress_name" }
      ]
    }]
  }
}
```

**Common Submission Values**:
- Merkle Root: `value_type: "String"`, 64-char hex.
- Order/Service address: `value_type: "Address"`.
- Progress address (time Guards): `value_type: "Address"`.

---

### repository — On-Chain Database

**Capabilities**: Store strongly-typed data with consensus field + address as key.

**CallRepository_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? }
├── description?: string — Description
├── policies?: PoliciesOp — Policy rules (discriminated union by op)
│   ├── { op: "add"|"set", policy: PolicyRule[] }
│   ├── { op: "remove", policy: string[] }
│   └── { op: "clear" }
│       └── PolicyRule: { name, type_guard?, read_guard?, consensus?, write_guard? }
├── data_add?: DataAdd — Add data items
│   **Mode 1: SignerOrClock**
│   └── { name, write_guard?, data: SupportedValue }
│   **Mode 2: DataAddWithItems**
│   └── { name, items: RepDataItem[] }
│       └── RepDataItem: { data: KeyData[], write_guard? }
│           └── KeyData: { id: string|number, data: SupportedValue }
├── data_remove?: DataRemove — Remove data items
│   **Mode 1: SignerOrClockBase**
│   └── { name, write_guard? }
│   **Mode 2: By name and ID list**
│   └── { name, items: DataRemoveItem[] }
│       └── DataRemoveItem: { id: (string|number)[], write_guard? }
├── rewards?: ObjectsOp — Reward object operations
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### arbitration — Arbitration System

**Capabilities**: Create arbitration institutions, handle order disputes, define arbitrators and voting rules.

**CallArbitration_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? }
├── dispute?: Dispute — Create new Arb for an order
│   └── { order, description?, proposition: string[], fee: CoinParam, namedArb? }
├── description?: string — Arbitration institution description
├── location?: string — Arbitration location
├── fee?: string|number — Arbitration fee
├── pause?: boolean — Pause arbitration
├── confirm?: Confirm — Confirm user's arbitration materials
│   └── { arb, voting_deadline: number|null }
├── voting_deadline_change?: VotingDeadlineChange — Modify voting deadline
│   └── { arb, voting_deadline: number|null }
├── vote?: Vote — Vote on propositions
│   └── { arb, votes: number[], voting_guard? }
├── feedback?: Feedback — Arbitration feedback
│   └── { arb, feedback: string }
├── arbitration?: ArbitrationAction — Final arbitration result
│   └── { arb, feedback: string, indemnity: number }
├── reset?: Reset — User requests resubmission
│   └── { arb, feedback: string }
├── arb_withdraw?: ArbWithdraw — Withdraw arbitration fee from Arb
│   └── { arb }
├── fees_transfer?: FeesTransfer — Distribute collected arbitration fees
│   └── { to: { allocation } | { treasury }, payment_remark, payment_index, newPayment? }
├── usage_guard?: string | null — Guard for applying for arbitration
├── voting_guard?: VotingGuardAction — Guard for voting
│   └── { op: "add"|"set", guards: VotingGuard[] } | { op: "remove", guards: string[] } | { op: "clear" }
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### contact — Contact Management

**Capabilities**: Manage on-chain instant messaging contact profiles.

**CallContact_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? }
├── my_status?: string — Status message in contact list
├── description?: string — Contact object description
├── location?: string — Location
├── ims?: ImsOperation — IM contact list operations
│   ├── { op: "add", im: ImEntry[] }
│   ├── { op: "set", im: ImEntry[] }
│   ├── { op: "remove", im: string[] }
│   └── { op: "clear" }
│       └── ImEntry: { at: string, description? }
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### treasury — Team Treasury

**Capabilities**: Create team fund pools with deposit/withdrawal rules.

**CallTreasury_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? }
├── description?: string — Description
├── receive?: ReceivedBalanceOrRecently — Receive CoinWrapper into balance
├── deposit?: Deposit — Deposit funds
│   └── { coin: CoinParam, by_external_deposit_guard?, payment_info, namedNewPayment? }
├── withdraw?: Withdraw — Withdraw funds
│   └── { amount: { fixed: string|number } | { by_external_withdraw_guard: string }, recipient, payment_info, namedNewPayment? }
├── external_deposit_guard?: ExternalDepositGuardOp — External deposit Guards
│   └── { op: "add"|"set", guards: AmountFromDepositGuard[] } | { op: "remove", guards: string[] } | { op: "clear" }
├── external_withdraw_guard?: ExternalWithdrawGuardOp — External withdraw Guards
│   └── { op: "add"|"set", guards: AmountFromWithdrawGuard[] } | { op: "remove", guards: string[] } | { op: "clear" }
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### reward — Reward Pool

**Capabilities**: Create reward pools with Guard-verified claim conditions.

**CallReward_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? }
├── claim?: string — Guard object ID; on verification success, triggers reward distribution
├── description?: string — Description
├── coin_add?: CoinParam — Add funds to Reward
├── receive?: ReceivedBalanceOrRecently — Unwrap CoinWrapper into pending balance
├── guard_add?: RewardGuard[] — Add reward Guard conditions
│   └── { guard, recipient, amount, expiration_time?, store_from_id? }
│       └── recipient: { GuardIdentifier: number } | { Entity: string } | { Signer: boolean }
├── guard_remove?: string[] — Remove reward Guards by ID
├── guard_pause?: boolean — Pause reward claiming
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### allocation — Fund Allocation

**Capabilities**: Create distribution plans for auto-distributing funds to multiple recipients.

**CallAllocation_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter?, permission? }
├── description?: string — Description
├── bPaused?: boolean — Pause distribution
├── withdraw?: AllocationWithdraw — Execute distribution
│   └── { guard: string, submission?: SubmissionCall }
├── deposit?: AllocationDeposit — Deposit funds
│   └── { coin: CoinParam }
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### permission — Access Control

**Capabilities**: Define who can perform which operations on WoWok objects.

**CallPermission_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, type_parameter? }
├── description?: string — Description
├── table?: TableOp — Permission table operations
│   ├── { op: "add perm by index", index: number, entity: ManyAccountOrMark_Address }
│   ├── { op: "remove perm by index", index: number, entity: ManyAccountOrMark_Address }
│   ├── { op: "add perm by index with guard", index: number, entity: ManyAccountOrMark_Address, guard: string }
│   ├── { op: "remove perm by index with guard", index: number, entity: ManyAccountOrMark_Address, guard: string }
│   └── { op: "clear" }
├── remark?: RemarkOp — Index remark operations
│   └── { op: "set"|"remove", index: number, remark: string }
├── apply?: string[] — Apply Permission to object list
├── builder?: AccountOrMark_Address — Set/transfer ownership
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

**Critical Constraints**:
- Query `wowok_buildin_info (built-in permissions)` BEFORE creating Permission.
- Custom permission index range: 1000-65535.
- Document each index with `remark` for maintainability.

---

### guard — Programmable Validation Rules

**Capabilities**: Create immutable validation rule trees returning boolean results.

**CallGuard_Data Structure**:

```
├── namedNew?: { name: string, tags?: string[], onChain?: boolean, replaceExistName?: boolean }
├── description?: string — Guard description
├── table?: GuardTableItem[] — Data table definitions
│   └── { identifier(0-255), b_submission: boolean, value_type: ValueType, value?, name? }
├── root: GuardRoot — Rule tree root (required)
│   ├── type: "node" → node: GuardNode (direct definition)
│   └── type: "file" → file_path: string, format?: "json"|"markdown" (load from file)
│       └── GuardNode: { logic?: "and"|"or"|"not", instructions?, queries?, children?: GuardNode[] }
│           └── instructions: { name, id, parameters?: SupportedValue[], returnType? }
│           └── queries: { id, name, objectType, parameters, return, description, parameters_description }
└── rely?: { guards: string[], logic_or?: boolean } — Dependent Guard objects
```

**Critical Constraints**:
- Query `wowok_buildin_info (guard instructions)` BEFORE creating Guard.
- Guard is immutable once created. Design carefully.
- Complex Guards: use `guard2file` to export templates for editing.
- `table` identifier range: 0-255. Used for submission indexing.

**Common Guard Patterns**:
- **Merkle Root validation**: Verify 64-char hex string format.
- **Service-Order association**: Verify order belongs to specified Service and current node is expected.
- **Time Guard**: Verify elapsed time since entering a node (e.g., 10 days = 864000000ms).
- **Node set validation**: Verify current node is in allowed set.

---

### personal — Public Identity Profile

**⚠️ CRITICAL**: All data is PERMANENTLY PUBLIC on the blockchain.

**CallPersonal_Data Structure**:

```
├── description?: string — Personal description
├── referrer?: string | null — Referrer ID (join network)
├── information?: InformationOp — Personal information operations
│   ├── { op: "add", data: RecordsInEntity[] }
│   ├── { op: "remove", name: string[] }
│   └── { op: "clear" }
│       └── RecordsInEntity: { name, value_type: ValueType, value: SupportedValue }
└── mark?: MarkOp — On-chain identity mark operations
    ├── { op: "add", data: { address, name?, tags? }[] }
    ├── { op: "remove", data: { address, tags? }[] }
    ├── { op: "clear", address: ManyAccountOrMark_Address }
    ├── { op: "transfer", to: AccountOrMark_Address }
    ├── { op: "replace", new_mark_object: string }
    └── { op: "destroy" }
```

---

### payment — Direct Transfer

**Capabilities**: Create immutable payment objects for multi-recipient transfers.

**CallPayment_Data Structure**:

```
├── object: { name, type_parameter? } — Create new Payment (required, immutable)
├── revenue: Revenue[] — Recipients (required)
│   └── { recipient: AccountOrMark_Address, amount: CoinParam }
└── info: PaymentInfo — Payment information (required)
```

---

### demand — Service Demand

**Capabilities**: Post service requests with reward pools for recommenders.

**CallDemand_Data Structure**:

```
├── object: string | { name?, tags?, onChain?, replaceExistName?, permission? }
├── present?: DemandPresent — Recommend service to Demand
│   └── { recommend: string, by_guard?, service? }
├── description?: string — Description
├── location?: string — Location
├── rewards?: ObjectsOp — Reward object operations
├── feedback?: FeedbackInfo[] — User feedback
│   └── { who: AccountOrMark_Address, acceptance_score?, feedback? }
├── guards?: GuardsOp — Guard list operations
│   ├── { op: "add"|"set", guard: ServiceGuard[] }
│   ├── { op: "remove", guard: string[] }
│   └── { op: "clear" }
│       └── ServiceGuard: { guard, service_identifier? }
├── owner_receive?: ReceivedObjectsOrRecently — Unwrap to Permission owner
└── um?: string | null — Contact object
```

---

### order — Order Management

**Capabilities**: Manage full order lifecycle: arbitration, progress advancement, refunds, agent setting.

**CallOrder_Data Structure**:

```
├── object: string — Order ID or name (required)
├── agents?: ManyAccountOrMark_Address — Order agents (can operate but not collect payment)
├── required_info?: string | null — Contact object ID or WTS Proof (delivery proof via Messenger)
├── progress?: Operate — Advance order workflow
│   └── { operation: { next_node_name, forward }, hold?, adminUnhold?, message? }
├── arb_confirm?: ArbConfirm — Submit compensation claim and apply for arbitration
│   └── { arb, confirm, description?, proposition? }
├── arb_objection?: ArbObjection — Object to arbitration result and appeal
│   └── { arb, objection: string }
├── arb_claim_compensation?: ArbClaimCompensation — Claim compensation from arbitrated Arb
│   └── { arb }
├── receive?: QueryReceivedResult — Unwrap CoinWrapper to order owner
└── transfer_to?: AccountOrMark_Address — Transfer order ownership
```

**Order Creation (via Service)**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "service_name",
    "order_new": {
      "buy": { "items": [...], "total_pay": { "balance": "amount" } },
      "namedNewOrder": { "name": "order_name" },
      "namedNewAllocation": { "name": "allocation_name" },
      "namedNewProgress": { "name": "progress_name" }
    }
  }
}
```

**Fund Withdrawal**:
```json
{
  "data": { "object": "order_name", "receive": "withdraw_guard_name" },
  "submission": {
    "type": "submission",
    "guard": [{ "object": "withdraw_guard_name", "impack": true }],
    "submission": [{
      "guard": "withdraw_guard_name",
      "submission": [
        { "identifier": 0, "value_type": "Address", "value": "progress_name" }
      ]
    }]
  }
}
```

---

### gen_passport — Generate Verified Passport

**Capabilities**: Create immutable verified credentials after Guard validation passes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| guard | string | Yes | Guard object ID to verify |
| info | SubmissionCall | No | Submission data (omitted = use existing submissions) |
| env | CallEnv | No | Environment config |

---

## Output Structure

```
CallOutput
└── result: CallResult (discriminated union by type)
    ├── type: "submission" → guard, submission — Requires additional Guard data
    ├── type: "transaction" → WowTransactionBlockResponse — Transaction receipt
    ├── type: "error" → error: string — Error message
    ├── type: "data" → data: ResponseData[] — Object change data
    └── type: "null" — No return value
```

---

## Guard Submission Mechanism

When an operation requires Guard validation and the Guard's table contains entries with **`b_submission: true`**, the tool returns `type: "submission"` instead of executing the transaction. This is a **two-step process**:

### Step 1 — Initial Call (Returns Submission Requirements)

```json
{
  "result": {
    "type": "submission",
    "guard": [{ "object": "guard_name", "impack": true }],
    "submission": [{
      "guard": "guard_name",
      "submission": [
        { "identifier": 0, "value_type": "String", "name": "merkle_root", "value": null }
      ]
    }]
  }
}
```

**What you receive**:
- `guard`: List of Guards to verify, each with `object` (Guard ID/name) and `impack` (whether it affects final result).
- `submission`: Array of submission requirements per Guard. Each item has `identifier` (0-255), `value_type` (expected type), `name` (description), and optionally `value` (pre-filled if available).

### Step 2 — Re-submit with Filled Values

**CRITICAL**: Only fill the `value` field. Do NOT modify `identifier`, `value_type`, or `name`.

```json
{
  "operation_type": "progress",
  "data": { "object": "progress_name", "operate": { ... } },
  "submission": {
    "type": "submission",
    "guard": [{ "object": "guard_name", "impack": true }],
    "submission": [{
      "guard": "guard_name",
      "submission": [
        { "identifier": 0, "value_type": "String", "value": "64_char_hex_merkle_root", "name": "merkle_root" }
      ]
    }]
  }
}
```

**Rules**:
1. **Only fill `value`**: The returned template has `identifier`, `value_type`, `name` pre-filled. Add `value` matching the `value_type`.
2. **Value type matching**: Ensure `value` matches `value_type` exactly (String, Address, U64, Bool, etc.).
3. **Impack**: All Guards with `impack: true` must pass verification for the operation to proceed.
4. **Multiple Guards**: Include all required submissions in the array.

### Supported Operations

The following `operation_type` values support the `submission` field:
- `service`, `machine`, `progress`, `repository`, `arbitration`
- `treasury`, `reward`, `allocation`, `demand`, `order`
- `gen_passport`

---

## AI Planning Notes

1. **Object creation vs modification**:
   - Create: `object` = `{ name, tags?, onChain?, replaceExistName?, type_parameter?, permission? }`
   - Modify: `object` = existing ID or name string.

2. **Infrastructure dependency**:
   - Guard and Permission MUST be ready before business objects.
   - `wowok_buildin_info (guard instructions)` → design Guard → `onchain_operations (guard)`.
   - `wowok_buildin_info (built-in permissions)` → design Permission → `onchain_operations (permission)`.

3. **Amount handling**:
   - All amount fields accept unit strings (e.g., `"2WOW"`) or plain numbers.
   - Non-WOW tokens require explicit `token_type`.

4. **Pre-publish verification checklist**:
   - Machine: All nodes defined? Forward Guards/permissions configured? Exported via `machineNode2file`?
   - Service: Machine bound? Sales pricing correct? order_allocators Rate sum = 10000? Arbitration and compensation configured?

5. **Progress operations**:
   - Always check current node and available forwards via `query_toolkit (onchain_table_item_machine_node)` before operating.
   - Use `env.no_cache: true` when chaining Progress operations.
