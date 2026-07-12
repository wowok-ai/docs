# Stage 9: Cross-Chain Bridge 🪙

---

**[← Stage 8: Practical Examples](stage-08-examples.md) | [Return to Main Directory →](../README.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about the **cross-chain bridge** between WOW mainnet and EVM (Ethereum mainnet), enabling AI agents to move assets across chains without dealing with multi-sig infrastructure or per-chain RPC plumbing. By the end, you will understand:

- The **`activeEvmAccount`** model — the single global EVM account that powers all bridge flows
- How to perform **EVM → WOW** (single-step, auto-claim by bridge) transfers
- How to perform **WOW → EVM** (two-step: deposit + claim) transfers
- How to **query transfer status** with `refresh=true` (on-chain) vs. `refresh=false` (cache)
- How to **manage EVM RPC endpoints** to mitigate public RPC 429 rate limits
- How to **withdraw** from `activeEvmAccount` to any other EVM address
- The **gas requirements** for each operation (WOW gas vs. EVM gas)
- Common **pitfalls** and troubleshooting steps

---

## 📚 Learning Content

### 9.1 Why a Cross-Chain Bridge?

WoWok's trust layer lives on the WOW mainnet, but real-world assets and users frequently live on EVM chains (Ethereum mainnet). The bridge lets an AI agent:

- **Pull liquidity** from Ethereum into WOW to pay for services, orders, and rewards.
- **Push settlement proceeds** from WOW back to Ethereum for treasury management.
- **Top up its own `activeEvmAccount`** so it can pay for gas and withdrawals on EVM.

Without the bridge, every AI agent would need to manually operate two separate wallets and coordinate cross-chain transfers out-of-band. The bridge **collapses all of that into a single MCP tool** (`bridge_operation`) with 10 operation types.

---

### 9.2 The `activeEvmAccount` Model

The bridge uses **one global EVM account per MCP instance**, called `activeEvmAccount`. It is:

- **Auto-generated** on first use (no setup, no private-key import).
- **Singleton** — exactly one per device/MCP install.
- **Transparent** — the SDK manages the key; the user never sees it.
- **The intermediate account** for all cross-chain flows:
  - **EVM → WOW**: assets are sent **from** `activeEvmAccount` to a WOW address.
  - **WOW → EVM**: assets are claimed **into** `activeEvmAccount` (or forwarded via `withdrawTo`).
  - **Withdraw**: assets can be moved **from** `activeEvmAccount` to any other EVM address.

> **📢 Important**: To cross-chain **from EVM to WOW**, you must **first fund `activeEvmAccount` from a regular Ethereum wallet** (e.g. MetaMask). The bridge does NOT pull from arbitrary external ETH wallets — only from `activeEvmAccount`.

---

### 9.3 Two-Step WOW→EVM vs. Single-Step EVM→WOW

| Direction | Steps | Total Time | WOW Gas | EVM Gas |
|-----------|-------|------------|---------|---------|
| **EVM → WOW** | 1 (auto-claim by bridge) | ~10–20 min | No | Yes (deposit) |
| **WOW → EVM** | 2 (deposit + manual claim) | ~5–15 min | Yes (deposit) | Yes (claim) |

- **EVM→WOW**: After `cross_chain_evm_to_wow`, the bridge **automatically** claims on WOW once 64 EVM block confirmations are reached. No further action needed.
- **WOW→EVM**: After `cross_chain_wow_to_evm` (step 1: deposit), bridge nodes sign asynchronously (~1–5 min). When `latestState.step === "signatures_ready"`, you must **manually** call `claim_wow_to_evm` (step 2: claim) to finalize on EVM.

---

### 9.4 Supported Networks & Tokens

- **WOW side**: mainnet only. Operations requiring WOW signing/querying validate `env.network === "mainnet"`.
- **EVM side**: Ethereum mainnet (`chainId=1`, `bridgeChainId=10`). Extensible to BSC/Polygon/Arbitrum in the future.
- **Tokens**: `ETH` (native), `WETH`, `WBTC`, `USDC`, `USDT`.

| Token | EVM Decimals | WOW Decimals | Notes |
|-------|--------------|--------------|-------|
| `ETH`  | 18 | 8 | Native ETH; vault auto-wraps to WETH. |
| `WETH` | 18 | 8 | ERC20; shares Token ID 2 with native ETH. |
| `WBTC` | 8  | 8 | Wrapped BTC. |
| `USDC` | 6  | 6 | USD Coin. |
| `USDT` | 6  | 6 | Tether USD. |

> **Amount is always a string** in the smallest unit (wei / token minimal unit). Examples: `1 ETH` on EVM = `"1000000000000000000"`; `0.001 ETH` on EVM = `"1000000000000000"`; `0.001 ETH` on WOW = `"100000"` (8 decimals).

---

### 9.5 The 10 Operation Types

| Operation Type | Purpose | WOW Gas | EVM Gas | env Required |
|----------------|---------|---------|---------|---------------|
| `cross_chain_wow_to_evm` | WOW→EVM step 1 (deposit) | ✅ | ❌ | ✅ mainnet |
| `cross_chain_evm_to_wow` | EVM→WOW (auto-claim by bridge) | ❌ | ✅ | ✅ mainnet |
| `claim_wow_to_evm` | WOW→EVM step 2 (claim on EVM) | ❌ | ✅ | ✅ mainnet |
| `withdraw` | Withdraw from `activeEvmAccount` | ❌ | ✅ | ❌ |
| `query_active_evm_account` | Query `activeEvmAccount` address + balances | ❌ | ❌ | ❌ |
| `query_supported_evm_chains` | List supported EVM chains | ❌ | ❌ | ❌ |
| `query_supported_tokens` | List supported bridge tokens per chain | ❌ | ❌ | ❌ |
| `query_transfer_list` | Query transfer history with filters | ❌ | ❌ | ❌ |
| `query_transfer_status` | Query a single transfer's detail | ❌ | ❌ | ❌ |
| `manage_evm_rpc` | Manage EVM RPC endpoints (list/add/remove/set/ping) | ❌ | ❌ | ❌ |

---

### 9.6 Status & Step Semantics

Bridge transfers go through a status lifecycle. Two layers of status are tracked:

- **`record.status` / `record.step`** — high-level lifecycle: `pending` → `in_progress` → `success` / `failed`. Steps: `deposit` → `claimed` / `withdraw`.
- **`latestState.step`** — fine-grained on-chain progress, only populated when you call `query_transfer_status(refresh=true)`:

```
source_tx_pending     ← source chain tx submitted, awaiting block confirmation
  ↓
source_tx_confirmed   ← source confirmed, waiting for bridge nodes to sign
  ↓
node_signing          ← nodes collecting signatures
  ↓
signatures_ready      ← sufficient signatures collected — ready to call claim_wow_to_evm (WOW→EVM only)
  ↓
claim_tx_pending      ← claim tx submitted on target chain, awaiting confirmation
  ↓
completed             ← assets arrived on target chain — done
```

For **EVM→WOW**, the bridge auto-progresses from `signatures_ready` → `completed` — no user action needed.
For **WOW→EVM**, you must **manually** call `claim_wow_to_evm` at `signatures_ready`.

---

### 9.7 RPC Failover & Management

Public EVM RPCs frequently hit **429 rate limit** or timeout. The bridge ships with **11 pre-configured public RPC endpoints** for Ethereum mainnet and rotates them automatically:

- When a request fails (429/timeout/network), the SDK retries on the next healthy RPC.
- Failed RPCs are marked `healthy: false` with a `retryInMs` backoff timer.
- Use `manage_evm_rpc` (`op=list/ping/add/remove/set`) to inspect and customize the pool.

**Best practice for production**: Use a paid private RPC (Alchemy/Infura/QuickNode) with `op=set` to replace all public RPCs for higher reliability.

---

## 🎓 Practice Exercises

### Exercise 1: Inspect Your Bridge Environment

**💬 You**: Show me my bridge environment — supported chains, tokens, and my activeEvmAccount.

**🤖 AI Generated Request JSON**:

```json
[
  { "operation_type": "query_supported_evm_chains" },
  { "operation_type": "query_supported_tokens", "data": { "network": "mainnet" } },
  { "operation_type": "query_active_evm_account" }
]
```

**Expected**: Three result blocks listing the chain (Ethereum mainnet, `chainId=1`), 5 supported tokens (WBTC, ETH, WETH, USDC, USDT), and your `activeEvmAccount` address with its native ETH balance.

---

### Exercise 2: Bridge 0.001 ETH from EVM to WOW

**💬 You**: Bridge 0.001 ETH from my activeEvmAccount to my WOW account on mainnet, then show me the transfer status.

**🤖 AI Generated Request JSON**:

```json
{
  "operation_type": "cross_chain_evm_to_wow",
  "data": { "token": "ETH", "amount": "1000000000000000" },
  "env": { "network": "mainnet" }
}
```

Then poll status every 1–2 minutes:

```json
{
  "operation_type": "query_transfer_status",
  "data": { "transferId": "<transferId from previous step>", "refresh": true }
}
```

**Expected**: Transfer completes (~10–20 min) when `latestState.step === "completed"`. No manual claim needed.

---

### Exercise 3: Bridge 0.001 ETH from WOW to EVM (two-step)

**💬 You**: Bridge 0.001 ETH from my WOW account to my activeEvmAccount on mainnet.

**Step 1 — Deposit**:

```json
{
  "operation_type": "cross_chain_wow_to_evm",
  "data": { "token": "ETH", "amount": "100000" },
  "env": { "network": "mainnet" }
}
```

**Step 2 — Poll until signatures ready** (~1–5 min):

```json
{
  "operation_type": "query_transfer_status",
  "data": { "transferId": "<transferId>", "refresh": true }
}
```

Wait until `latestState.step === "signatures_ready"`.

**Step 3 — Claim on EVM**:

```json
{
  "operation_type": "claim_wow_to_evm",
  "data": { "transferId": "<transferId>" },
  "env": { "network": "mainnet" }
}
```

**Expected**: `claimTxHash` returned. Verify `latestState.step === "completed"` via `query_transfer_status(refresh=true)`.

> **Prerequisites**: WOW account must have WOW gas (for step 1); `activeEvmAccount` must have EVM gas (for step 3).

---

### Exercise 4: Manage RPC Endpoints

**💬 You**: Show me the health of all my EVM RPCs, then remove any unhealthy ones and add a backup.

```json
[
  { "operation_type": "manage_evm_rpc", "data": { "op": "ping" } },
  { "operation_type": "manage_evm_rpc", "data": { "op": "remove", "rpcUrls": ["<unhealthy_url>"] } },
  { "operation_type": "manage_evm_rpc", "data": { "op": "add", "rpcUrls": ["https://1rpc.io/eth"] } },
  { "operation_type": "manage_evm_rpc", "data": { "op": "list" } }
]
```

---

## 🏆 Stage Checklist

Before moving on, confirm you have:

- [ ] Understood the `activeEvmAccount` model and funded it from a regular Ethereum wallet
- [ ] Performed an EVM→WOW transfer and monitored it to completion
- [ ] Performed a WOW→EVM transfer (both steps: deposit + claim)
- [ ] Used `query_transfer_status` with both `refresh=true` and `refresh=false`
- [ ] Listed and pinged RPC endpoints, and added/removed at least one RPC
- [ ] Identified the gas requirements for each operation type
- [ ] Reviewed the [common pitfalls](bridge.md#8-common-pitfalls--troubleshooting)

---

## 🔗 Next Steps

- **Topic deep dive**: [bridge.md](bridge.md) — Concepts, prerequisites, and worked examples with real MCP server responses.
- **Schema reference**: Use MCP `schema_query` tool with `tool_name: "bridge_operation"` — Full parameter/type definitions for all 10 operation types.
- **Live test script**: [`agent/mcp/scripts/test-bridge.mjs`](../../agent/mcp/scripts/test-bridge.mjs) — Reproducible live tests of all bridge operations.
- **Live test output**: [`agent/mcp/scripts/test-bridge-output.log`](../../agent/mcp/scripts/test-bridge-output.log) — Real MCP server responses captured during testing.

---

**[← Stage 8: Practical Examples](stage-08-examples.md) | [Return to Main Directory →](../README.md)**
