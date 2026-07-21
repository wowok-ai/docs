# Bridge Component (🪙 Cross-Chain Bridge)

---

## Component Overview

The Bridge component is a **simplified cross-chain bridge** between **WOW mainnet** and **EVM** (currently Ethereum mainnet). It enables AI agents to move assets between the two chains without dealing with signing infrastructure, multi-sig coordinators, or per-chain RPC plumbing.

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "bridge_operation", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

All bridge operations are exposed through a single MCP sub-tool: **`bridge_operation`**. The sub-tool is **discriminative** — you select one of 10 operation types via the `operation_type` field, and the rest of the parameters are validated against the corresponding schema.

> **📋 Schema Reference**: Use MCP `schema_query` sub-tool with `action: "get"` and `name: "bridge_operation"` for full parameter/type definitions.

---

## Key Concepts

### 1. `activeEvmAccount` — The Single Global EVM Account

The bridge uses **one global EVM account per MCP instance**, called `activeEvmAccount`. It is:

- **Auto-generated** on first use (no setup needed).
- **Singleton** — there is exactly one per device/MCP install.
- **Transparent** — the user does not need to import a private key; the SDK manages it.
- **The intermediate account** for all cross-chain flows:
  - **EVM→WOW**: assets are sent **from** `activeEvmAccount` to a WOW address.
  - **WOW→EVM**: assets are claimed **into** `activeEvmAccount` (or forwarded to `withdrawTo` if provided).
  - **Withdraw**: assets can be withdrawn **from** `activeEvmAccount` to any other EVM address.

To cross-chain **from EVM to WOW**, you must **first fund `activeEvmAccount` from a regular Ethereum wallet** (e.g. MetaMask), then call `cross_chain_evm_to_wow`. The bridge does NOT pull from arbitrary external ETH wallets — only from `activeEvmAccount`.

### 2. Two-Step WOW→EVM vs. Single-Step EVM→WOW

| Direction | Steps | Total Time | WOW Gas? | EVM Gas? |
|-----------|-------|------------|----------|----------|
| **EVM → WOW** | 1 (auto-claim by bridge) | ~10–20 min | No | Yes (deposit) |
| **WOW → EVM** | 2 (deposit + manual claim) | ~5–15 min | Yes (deposit) | Yes (claim) |

- **EVM→WOW**: After you call `cross_chain_evm_to_wow`, the bridge **automatically** claims on WOW once 64 block confirmations are reached. No further user action is needed.
- **WOW→EVM**: After you call `cross_chain_wow_to_evm` (step 1: deposit), bridge nodes sign asynchronously (~1–5 min). When `latestState.step === "signatures_ready"`, you must **manually** call `claim_wow_to_evm` (step 2: claim) to finalize on EVM.

### 3. Supported Networks & Tokens

- **WOW side**: mainnet only. Operations requiring WOW signing/querying validate `env.network === "mainnet"`.
- **EVM side**: Ethereum mainnet (`chainId=1`, `bridgeChainId=10`). The enum is extensible to BSC/Polygon/Arbitrum in the future.
- **Tokens**: `ETH` (native), `WETH`, `WBTC`, `USDC`, `USDT`. Query `wowok_buildin_info` with `info: "mainnet bridge tokens"` for the full token list and type tags.

### 4. Gas Requirements

| Operation | WOW Gas | EVM Gas |
|-----------|---------|---------|
| `cross_chain_wow_to_evm` | ✅ Required | ✅ Required |
| `cross_chain_evm_to_wow` | ❌ | ✅ Required |
| `withdraw` | ❌ | ✅ Required |
| All `query_*` and `manage_evm_rpc` | ❌ | ❌ |

> **Note**: `cross_chain_wow_to_evm` needs WOW gas for deposit and EVM gas for final claim on Ethereum. `cross_chain_evm_to_wow` only needs EVM gas — bridge auto-claims on WOW (no WOW gas needed).

### 5. RPC Failover

Public EVM RPCs frequently hit **429 rate limit** or timeout. The bridge ships with **11 pre-configured public RPC endpoints** for Ethereum mainnet and rotates them automatically:

- When a request fails (429/timeout/network), the SDK retries on the next healthy RPC.
- Failed RPCs are marked `healthy: false` with a `retryInMs` backoff timer.
- Use `manage_evm_rpc` (op=`list`/`ping`/`add`/`remove`/`set`) to inspect and customize the pool — see [Section 7](#7-rpc-management---manage_evm_rpc) below.

---

## Function List

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

## 1. Query Supported EVM Chains — `query_supported_evm_chains`

### Example 1.1: List supported EVM chains

**💬 You**: What EVM chains does the bridge support?

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_supported_evm_chains"
  }
}
```

**✅ Execution Successful** (real MCP server response):

```
1 EVM chain(s) supported: mainnet(chainId=1)
```

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "1 EVM chain(s) supported",
      "result": {
        "type": "data",
        "data": [
          {
            "chainId": 1,
            "name": "mainnet",
            "description": "Ethereum Mainnet",
            "bridgeChainId": 10,
            "explorerUrl": "https://etherscan.io",
            "rpcCount": 11,
            "healthyRpcCount": 11
          }
        ]
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "1 EVM chain(s) supported"
      }
    }
  },
  "schema": null
}
```

---

## 2. Query Supported Tokens — `query_supported_tokens`

### Example 2.1: List all supported bridge tokens

**💬 You**: List all supported bridge tokens on Ethereum mainnet.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_supported_tokens",
    "data": { "network": "mainnet" }
  }
}
```

**✅ Execution Successful** (real MCP server response):

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "1 EVM chain(s) supported",
      "result": {
        "type": "data",
        "data": [
          {
            "chainId": 1,
            "chainName": "mainnet",
            "bridgeChainId": 10,
            "tokens": [
              {
                "tokenId": 1,
                "symbol": "WBTC",
                "evmAddress": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                "evmDecimals": 8,
                "wowTypeTag": "0x06c69f212cc7bef6ff730b42bc739be7786902c501f15e99dbce1b8b5c7eff58::btc::BTC",
                "wowDecimals": 8,
                "description": "Wrapped BTC (ERC20). Bitcoin price exposure on Ethereum; 1 WBTC = 1 BTC."
              },
              {
                "tokenId": 2,
                "symbol": "ETH",
                "evmAddress": "0x0000000000000000000000000000000000000000",
                "evmDecimals": 18,
                "wowTypeTag": "0xdb429818d697419e12a3481af1d21f32e603bff8716d45b0e964c2191db6604f::eth::ETH",
                "wowDecimals": 8,
                "description": "Native ETH. Calls bridgeETHV2{value}; vault auto-wraps to WETH internally. 18 decimals on EVM, 8 decimals on WOW."
              },
              {
                "tokenId": 2,
                "symbol": "WETH",
                "evmAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                "evmDecimals": 18,
                "wowTypeTag": "0xdb429818d697419e12a3481af1d21f32e603bff8716d45b0e964c2191db6604f::eth::ETH",
                "wowDecimals": 8,
                "description": "Wrapped ETH (ERC20). Calls bridgeERC20V2; shares Token ID 2 and WOW type tag with native ETH."
              },
              {
                "tokenId": 3,
                "symbol": "USDC",
                "evmAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                "evmDecimals": 6,
                "wowTypeTag": "0xe70fcfd8ef984292b11346ee43880ea9d6fba9f270c90bd0432574db14af67bf::usdc::USDC",
                "wowDecimals": 6,
                "description": "USD Coin (USDC). Fully collateralized USD stablecoin; 6 decimals on both sides."
              },
              {
                "tokenId": 4,
                "symbol": "USDT",
                "evmAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                "evmDecimals": 6,
                "wowTypeTag": "0x4f160cf9a28ca8ac8bc0a46e13b02588dc05722148dd964807b9be89a0fcfe4d::usdt::USDT",
                "wowDecimals": 6,
                "description": "Tether USD (USDT). Fiat-collateralized stablecoin; 6 decimals on both sides."
              }
            ]
          }
        ]
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "1 EVM chain(s) supported"
      }
    }
  },
  "schema": null
}
```

> **Note**: `ETH` and `WETH` share `tokenId=2` and the same WOW type tag — the bridge treats them as the same underlying asset, just with different deposit entry points (`bridgeETHV2{value}` vs. `bridgeERC20V2`).

---

## 3. Query activeEvmAccount — `query_active_evm_account`

### Example 3.1: Query the global activeEvmAccount address and native balance

**💬 You**: What is my activeEvmAccount address, and how much ETH does it have?

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_active_evm_account"
  }
}
```

**✅ Execution Successful** (real MCP server response):

```
activeEvmAccount: 0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412 (1 chain(s))
```

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "activeEvmAccount: 0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412 (1 chain(s))",
      "result": {
        "type": "data",
        "data": {
          "address": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
          "chains": [
            {
              "chainId": 1,
              "name": "mainnet",
              "nativeBalance": "151954693179315936"
            }
          ]
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "activeEvmAccount: 0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412 (1 chain(s))"
      }
    }
  },
  "schema": null
}
```

**Interpretation**: `nativeBalance` is in wei (string). `151954693179315936 wei` ≈ `0.152 ETH`. This is the balance of `activeEvmAccount` on Ethereum mainnet.

> **Before any EVM→WOW cross-chain**: Make sure `nativeBalance` is greater than the amount you want to bridge **plus** a small gas reserve (~0.001 ETH for gas). Use a regular Ethereum wallet (e.g. MetaMask) to top up `activeEvmAccount` first.

---

## 4. Query Transfer List — `query_transfer_list`

### Example 4.1: List the 5 most recent transfers

**💬 You**: Show me my 5 most recent bridge transfers.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_transfer_list",
    "data": { "limit": 5 }
  }
}
```

**✅ Execution Successful** (real MCP server response — abbreviated):

```
5 transfer record(s) (4 in progress)
```

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "2 transfer record(s)",
      "result": {
        "type": "data",
        "data": [
          {
            "transferId": "br_1783383544244_20",
            "direction": "wow_to_evm",
            "token": "ETH",
            "amount": "100000",
            "recipientEth": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
            "intermediateEthAccount": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
            "withdrawToProvided": false,
            "step": "deposit",
            "status": "in_progress",
            "createdAt": 1783383544244,
            "updatedAt": 1783383553198,
            "depositTxDigest": "6NJU4RahjFMfvNU66c3yaYUP855ZvWqz6AZgWZZdyeAt",
            "bridgeSeq": "19"
          },
          {
            "transferId": "br_1783383520516_19",
            "direction": "evm_to_wow",
            "token": "ETH",
            "amount": "1000000000000000",
            "recipientWow": "0x48386bd7bf48f462fe594358ca6674f7483d23441d28a377762b1767bf207f06",
            "intermediateEthAccount": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
            "step": "deposit",
            "status": "in_progress",
            "createdAt": 1783383520516,
            "updatedAt": 1783383544241,
            "depositTxHash": "0x2623878058763d37f997c584a6021b2bc76787e3665c1f99cf072bba17f59ed0"
          }
        ]
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "2 transfer record(s)"
      }
    }
  },
  "schema": null
}
```

### Example 4.2: List only in-progress transfers

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_transfer_list",
    "data": { "onlyActive": true }
  }
}
```

Returns only transfers with `status: "in_progress"`. Useful for monitoring pending cross-chain operations.

### Filter combinations

```json
{ "tool": "bridge_operation", "data": { "operation_type": "query_transfer_list", "data": { "direction": "evm_to_wow", "token": "ETH", "onlyActive": true, "limit": 10 } } }
{ "tool": "bridge_operation", "data": { "operation_type": "query_transfer_list", "data": { "status": "failed" } } }
```

---

## 5. Query Transfer Status — `query_transfer_status`

### Example 5.1: Query a completed transfer (refresh=false — instant from cache)

**💬 You**: Show me the details of transfer `br_1783379714784_14`.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_transfer_status",
    "data": { "transferId": "br_1783379714784_14", "refresh": false }
  }
}
```

**✅ Execution Successful**:

```
Transfer br_1783379714784_14: wow_to_evm / claimed / success
```

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "Transfer br_1783379714784_14: wow_to_evm / claimed / success",
      "result": {
        "type": "data",
        "data": {
          "transferId": "br_1783379714784_14",
          "direction": "wow_to_evm",
          "token": "ETH",
          "amount": "600000",
          "recipientEth": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
          "intermediateEthAccount": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
          "withdrawToProvided": false,
          "step": "claimed",
          "status": "success",
          "createdAt": 1783379714784,
          "updatedAt": 1783379719021,
          "depositTxDigest": "92qt2UjZrPAjiuVyA1K2BrSyZW9izCFvDTcSVdX18cUd",
          "bridgeSeq": "17"
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "Transfer br_1783379714784_14: wow_to_evm / claimed / success"
      }
    }
  },
  "schema": null
}
```

### Example 5.2: Query an in-progress EVM→WOW transfer (refresh=true — on-chain)

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_transfer_status",
    "data": { "transferId": "br_1783383680255_21", "refresh": true }
  }
}
```

**✅ Execution Successful** (real MCP server response — abbreviated; `latestState` shows on-chain progress):

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "Transfer br_1783383680255_21: evm_to_wow / deposit / in_progress",
      "result": {
        "type": "data",
        "data": {
          "transferId": "br_1783383680255_21",
          "direction": "evm_to_wow",
          "token": "ETH",
          "amount": "1000000000000000",
          "recipientWow": "0x48386bd7bf48f462fe594358ca6674f7483d23441d28a377762b1767bf207f06",
          "intermediateEthAccount": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
          "step": "deposit",
          "status": "in_progress",
          "createdAt": 1783383680255,
          "updatedAt": 1783383686333,
          "depositTxHash": "0xbdd8afe66deed902035c487d6b075ef1aecdf42273213f6c1cdac51266e71573",
          "latestState": {
            "status": "confirmed",
            "stepDescription": "源链交易已确认，等待 bridge 节点签名 approve",
            "updatedAt": 1783383690068,
            "step": "source_tx_confirmed",
            "direction": "evm_to_wow",
            "sourceTxHash": "0xbdd8afe66deed902035c487d6b075ef1aecdf42273213f6c1cdac51266e71573",
            "bridgeSeq": "47",
            "confirmations": 0,
            "ethReceipt": {
              "blockHash": "0xed36de80dc568c17da2b29440b6346bef2d2fb0c0a05241be45e0ba6591bca21",
              "blockNumber": "0x184bfb9",
              "status": "0x1",
              "from": "0x2cba468e82e7ecb8dab23bf14aa5fa3ffb060412",
              "to": "0xa8d914cc121cb2d2179ca540bc0b8213f224aa00",
              "gasUsed": "0x19e4b",
              "effectiveGasPrice": "0x4173a0d8",
              "transactionHash": "0xbdd8afe66deed902035c487d6b075ef1aecdf42273213f6c1cdac51266e71573"
            }
          }
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "Transfer br_1783383680255_21: evm_to_wow / deposit / in_progress"
      }
    }
  },
  "schema": null
}
```

**Interpretation**:
- `record.step = "deposit"`, `record.status = "in_progress"` — high-level state.
- `latestState.step = "source_tx_confirmed"` — fine-grained: source tx is confirmed on EVM, waiting for bridge nodes to sign.
- `latestState.stepDescription = "源链交易已确认，等待 bridge 节点签名 approve"` — human-readable (Chinese).
- `latestState.confirmations = 0` — EVM→WOW needs 64 confirmations to finalize; once `confirmations >= 64`, the bridge will sign and `latestState.step` advances to `signatures_ready` → `completed`.

> **Polling cadence**: Call `refresh=true` every 1–2 minutes for ongoing transfers. Between refreshes, use `refresh=false` for instant cached state.

---

## 6. Cross-Chain Transfers

### Example 6.1: EVM → WOW (single-step, auto-claim)

Transfer **0.001 ETH** from `activeEvmAccount` to the WOW account. Bridge will auto-claim on WOW after 64 EVM confirmations.

**Prerequisites**:
- `activeEvmAccount` has ≥ 0.001 ETH + gas reserve. (Example 3.1 shows ~0.152 ETH balance — sufficient.)
- `env.network = "mainnet"`.

**💬 You**: Bridge 0.001 ETH from my activeEvmAccount to my WOW account on mainnet.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "cross_chain_evm_to_wow",
    "data": {
      "token": "ETH",
      "amount": "1000000000000000"
    },
    "env": { "network": "mainnet" }
  }
}
```

> **Amount math**: 0.001 ETH × 10^18 (evmDecimals=18) = `10^15` = `"1000000000000000"`.

**✅ Execution Successful** (real MCP server response):

```
EVM→WOW cross-chain submitted. transferId=br_1783383680255_21, activeEvmAccount=0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412. Bridge will auto-claim on WOW (~10-20 min). Poll query_transfer_status to monitor progress.
```

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "Cross-chain transfer submitted. transferId=br_1783383680255_21, activeEvmAccount=0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
      "result": {
        "type": "data",
        "data": {
          "depositTxHash": "0xbdd8afe66deed902035c487d6b075ef1aecdf42273213f6c1cdac51266e71573",
          "activeEvmAccount": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
          "transferId": "br_1783383680255_21"
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "Cross-chain transfer submitted. transferId=br_1783383680255_21, activeEvmAccount=0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412"
      }
    }
  },
  "schema": null
}
```

**Monitor progress** (see Example 5.2 for the full output):

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "query_transfer_status",
    "data": { "transferId": "br_1783383680255_21", "refresh": true }
  }
}
```

**Status flow**: `source_tx_pending` → `source_tx_confirmed` → `signatures_ready` → `completed`. Total time ~10–20 min (64-block EVM confirmation + bridge auto-claim on WOW).

### Example 6.2: WOW → EVM (step 1: deposit)

Transfer **0.001 ETH** from the WOW account to `activeEvmAccount`. This is **step 1 of 2** — assets are locked on WOW; you must call `claim_wow_to_evm` (step 2) once bridge signatures are ready.

**Prerequisites**:
- WOW account has gas (or step 1 fails with `InsufficientCoinBalance`).
- `env.network = "mainnet"`.

**💬 You**: Bridge 0.001 ETH from my WOW account to my activeEvmAccount on mainnet.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "cross_chain_wow_to_evm",
    "data": {
      "token": "ETH",
      "amount": "100000"
    },
    "env": { "network": "mainnet" }
  }
}
```

> **Amount math**: 0.001 ETH × 10^8 (wowDecimals=8) = `10^5` = `"100000"`. Note: the WOW side uses **8 decimals** for ETH, not 18.

**✅ Execution Successful** (real MCP server response from a prior run):

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "Cross-chain transfer submitted. transferId=br_1783383544244_20, activeEvmAccount=0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412",
      "result": {
        "type": "data",
        "data": {
          "depositTxDigest": "6NJU4RahjFMfvNU66c3yaYUP855ZvWqz6AZgWZZdyeAt",
          "bridgeSeq": "19",
          "transferId": "br_1783383544244_20",
          "activeEvmAccount": "0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412"
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "Cross-chain transfer submitted. transferId=br_1783383544244_20, activeEvmAccount=0x2cbA468e82E7EcB8dAb23BF14aA5fA3Ffb060412"
      }
    }
  },
  "schema": null
}
```

**❌ Failure case — insufficient WOW gas** (observed when WOW account is out of gas):

```
Bridge operation failed: Transaction resolution failed: InsufficientCoinBalance in command 1
```

> **Fix**: Fund the WOW account with WOW gas first, then retry.

### Example 6.3: WOW → EVM (step 2: claim on EVM)

Once `query_transfer_status` shows `latestState.step === "signatures_ready"`, call `claim_wow_to_evm` to finalize on EVM. **Skip this step for EVM→WOW** — bridge auto-claims.

**💬 You**: Claim my WOW→EVM transfer `br_1783383544244_20`.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "claim_wow_to_evm",
    "data": { "transferId": "br_1783383544244_20" },
    "env": { "network": "mainnet" }
  }
}
```

**Expected result on success**:

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "WOW→EVM claim (step 2) completed. transferId=br_1783383544244_20, claimTxHash=0x...",
      "result": {
        "type": "data",
        "data": {
          "claimTxHash": "0x...",
          "transferId": "br_1783383544244_20"
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "WOW→EVM claim (step 2) completed. transferId=br_1783383544244_20, claimTxHash=0x..."
      }
    }
  },
  "schema": null
}
```

**❌ Failure case — signatures not ready**:

```
claim_wow_to_evm failed: Request timed out
```

> **Fix**: Wait 1–5 minutes and retry. Use `query_transfer_status(refresh=true)` to verify `latestState.step === "signatures_ready"` before calling claim.

### Example 6.4: Withdraw from activeEvmAccount (non-cross-chain)

Move 0.001 ETH from `activeEvmAccount` to an external EVM wallet (e.g. your MetaMask).

**💬 You**: Withdraw 0.001 ETH from my activeEvmAccount to `0xABCDEF...1234`.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "withdraw",
    "data": {
      "to": "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
      "amount": "1000000000000000",
      "token": "ETH"
    }
  }
}
```

**Expected result**:

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "Withdrawal submitted. transferId=br_..., txHash=0x...",
      "result": {
        "type": "data",
        "data": {
          "txHash": "0x...",
          "transferId": "br_..."
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "Withdrawal submitted. transferId=br_..., txHash=0x..."
      }
    }
  },
  "schema": null
}
```

---

## 7. RPC Management — `manage_evm_rpc`

### Example 7.1: List all configured RPC endpoints

**💬 You**: Show all configured EVM RPC endpoints and their health.

**🤖 AI Generated Request JSON**:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "manage_evm_rpc",
    "data": { "op": "list" }
  }
}
```

**✅ Execution Successful** (real MCP server response):

```
RPC 'list' operation succeeded
```

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "RPC 'list' operation succeeded",
      "result": {
        "type": "data",
        "data": {
          "op": "list",
          "success": true,
          "result": [
            {
              "url": "https://rpc.ankr.com/eth",
              "healthy": false,
              "retryInMs": 299021,
              "failCount": 1
            },
            {
              "url": "https://ethereum-rpc.publicnode.com",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://eth.drpc.org",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://rpc.mevblocker.io",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://rpc.flashbots.net",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://cloudflare-eth.com",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://eth.merkle.io",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://0xrpc.io/eth",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://ethereum.blockpi.network/v1/rpc/public",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://eth.llamarpc.com",
              "healthy": true,
              "failCount": 0
            },
            {
              "url": "https://api.zan.top/eth/mainnet",
              "healthy": true,
              "failCount": 0
            }
          ]
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "RPC 'list' operation succeeded"
      }
    }
  },
  "schema": null
}
```

**Interpretation**: `https://rpc.ankr.com/eth` is marked `healthy: false` with `retryInMs: 299021` (~5 min backoff) and `failCount: 1`. The SDK will skip it until the backoff expires, then probe it again.

### Example 7.2: Ping all RPC endpoints (health check)

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "manage_evm_rpc",
    "data": { "op": "ping" }
  }
}
```

**✅ Execution Successful**:

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "RPC 'ping' operation succeeded",
      "result": {
        "type": "data",
        "data": {
          "op": "ping",
          "success": true,
          "result": [
            {
              "url": "https://rpc.ankr.com/eth",
              "healthy": true
            },
            {
              "url": "https://ethereum-rpc.publicnode.com",
              "healthy": true
            },
            {
              "url": "https://eth.drpc.org",
              "healthy": true
            },
            {
              "url": "https://rpc.mevblocker.io",
              "healthy": true
            },
            {
              "url": "https://rpc.flashbots.net",
              "healthy": true
            },
            {
              "url": "https://cloudflare-eth.com",
              "healthy": true
            },
            {
              "url": "https://eth.merkle.io",
              "healthy": true
            },
            {
              "url": "https://0xrpc.io/eth",
              "healthy": true
            },
            {
              "url": "https://ethereum.blockpi.network/v1/rpc/public",
              "healthy": false
            },
            {
              "url": "https://eth.llamarpc.com",
              "healthy": false
            },
            {
              "url": "https://api.zan.top/eth/mainnet",
              "healthy": false
            }
          ]
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "RPC 'ping' operation succeeded"
      }
    }
  },
  "schema": null
}
```

> **Note**: Health status is real-time and may fluctuate. Three endpoints returned `healthy: false` during this ping — likely transient rate limits. The SDK will still try them again later (backoff).

### Example 7.3: Add a new RPC endpoint

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "manage_evm_rpc",
    "data": { "op": "add", "rpcUrls": ["https://rpc.ankr.com/eth"] }
  }
}
```

**Result when the RPC already exists** (no duplicates allowed):

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "RPC 'add' operation failed",
      "result": {
        "type": "data",
        "data": {
          "op": "add",
          "success": false,
          "result": {
            "added": 0
          }
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "RPC 'add' operation failed"
      }
    }
  },
  "schema": null
}
```

**Result on successful add**: `{ "result": { "status": "success", "data": { "message": "RPC 'add' operation succeeded", "result": { "type": "data", "data": { "op": "add", "success": true, "result": { "added": 1 } } }, "semantic": { "intent": "bridge_operation", "status": "success", "summary": "RPC 'add' operation succeeded" } } }, "schema": null }`.

### Example 7.4: Remove an RPC endpoint

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "manage_evm_rpc",
    "data": { "op": "remove", "rpcUrls": ["https://rpc.ankr.com/eth"] }
  }
}
```

**✅ Execution Successful**:

```json
{
  "result": {
    "status": "success",
    "data": {
      "message": "RPC 'remove' operation succeeded",
      "result": {
        "type": "data",
        "data": {
          "op": "remove",
          "success": true,
          "result": {
            "removed": 1
          }
        }
      },
      "semantic": {
        "intent": "bridge_operation",
        "status": "success",
        "summary": "RPC 'remove' operation succeeded"
      }
    }
  },
  "schema": null
}
```

### Example 7.5: Full replace (op=set)

Replace the entire RPC pool with a custom list:

```json
{
  "tool": "bridge_operation",
  "data": {
    "operation_type": "manage_evm_rpc",
    "data": {
      "op": "set",
      "rpcUrls": [
        "https://ethereum-rpc.publicnode.com",
        "https://cloudflare-eth.com",
        "https://eth.drpc.org"
      ]
    }
  }
}
```

> **Use case**: If you have a paid private RPC (e.g. Alchemy/Infura API key), use `op=set` to replace all public RPCs with your private endpoint for higher reliability.

### RPC Failover Logic

1. **Request fails** (429 / timeout / network error) on RPC #N.
2. **SDK marks RPC #N as `healthy: false`** with exponential backoff (`retryInMs`).
3. **SDK retries on RPC #N+1** (next healthy endpoint in the pool).
4. **Backoff expires** → SDK probes RPC #N again; if successful, marks `healthy: true`.
5. **All RPCs unhealthy** → request fails; user is expected to add new RPCs via `op=add` or `op=set`.

---

## 8. Complete Workflow Example

End-to-end: bridge 0.001 ETH from EVM to WOW, then back from WOW to EVM.

```text
Step 0  query_active_evm_account         → confirm activeEvmAccount address & ETH balance
Step 0  query_supported_tokens             → confirm token/decimals (ETH: evm=18, wow=8)
Step 1  cross_chain_evm_to_wow (0.001 ETH) → get transferId=T1, depositTxHash
Step 2  query_transfer_status(T1, refresh=true)
        └─ latestState.step: source_tx_pending → source_tx_confirmed → signatures_ready → completed
        └─ wait ~10-20 min for completion
Step 3  (optional) verify recipientWow balance increased by 0.001 ETH (wowDecimals=8)

Step 4  cross_chain_wow_to_evm (0.001 ETH) → get transferId=T2, depositTxDigest
        └─ (WOW account must have WOW gas)
Step 5  query_transfer_status(T2, refresh=true)
        └─ wait for latestState.step === "signatures_ready" (~1-5 min)
Step 6  claim_wow_to_evm(T2)               → get claimTxHash
        └─ (activeEvmAccount must have EVM gas)
Step 7  query_transfer_status(T2, refresh=true)
        └─ verify latestState.step === "completed"
Step 8  (optional) withdraw from activeEvmAccount to your MetaMask
```

---

## 🔗 See Also

- **Schema reference**: Use MCP `schema_query` sub-tool with `action: "get"` and `name: "bridge_operation"`
- **Stage entry**: [stage-09-bridge.md](stage-09-bridge.md)
- **Live test script**: [`agent/mcp/scripts/test-bridge.mjs`](../../agent/mcp/scripts/test-bridge.mjs)
- **Live test output**: [`agent/mcp/scripts/test-bridge-output.log`](../../agent/mcp/scripts/test-bridge-output.log)
- **Tool source**: [`agent/mcp/src/index.ts#L1607-L1608`](../../agent/mcp/src/index.ts) — tool registration
- **Handler source**: [`agent/mcp/src/schema/call/bridge-handler.ts`](../../agent/mcp/src/schema/call/bridge-handler.ts)
- **Schema source**: [`agent/mcp/src/schema/call/bridge.ts`](../../agent/mcp/src/schema/call/bridge.ts)
