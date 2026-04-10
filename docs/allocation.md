
# Allocation Component (📤 Auto Distribution)

---

## Component Overview

The Allocation component is WoWok protocol's automatic fund distribution module, used to create distribution plans that auto-distribute funds to multiple recipients. Allocation objects can be created with predefined distribution rules, receive funds, and automatically distribute them based on the configured allocators when Guard verification passes.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Allocation** | Define fund distribution plans | Set up profit sharing, team payouts | Establishes automated distribution rules |
| **Receive Funds** | Deposit funds for distribution | Collect payments, revenues | Fills the allocation pool |
| **Execute Distribution** | Trigger fund distribution | Run scheduled payouts, one-time distributions | Executes pre-defined sharing rules |
| **Combined Operations** | Receive and distribute in one call | Complete payout workflow | Streamlines end-to-end distribution process |

---

## Complete Tool Call Structure

Allocation operations use the following top-level structure:

```json
{
  "operation_type": "allocation",
  "data": { ... },    // Allocation data definition
  "env": { ... },      // Execution environment (optional)
  "submission": { ... } // Guard verification submission (optional)
}
```

---

## Sub-feature 1: Create New Allocation

### Feature Description

Create a new Allocation object with predefined distribution rules. Newly created allocations can receive funds and automatically distribute them based on the configured allocators.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "allocation" |
| `data.object` | object | Yes | Create new Allocation | TypeNamedObject structure |
| `data.object.name` | string | No | Local mark name | Max 64 characters |
| `data.object.tags` | array | No | Tags array | String array |
| `data.object.onChain` | boolean | No | Whether to mark on-chain | |
| `data.object.replaceExistName` | boolean | No | Replace existing name | |
| `data.object.type_parameter` | string | No | Token type | Default: 0x2::wow::WOW |
| `data.allocators.description` | string | Yes | Allocators description | Max 65535 characters |
| `data.allocators.threshold` | number | Yes | Threshold amount in smallest units | No decimals or negatives |
| `data.allocators.allocators` | array | Yes | Allocator list | 1-100 allocators |
| `data.allocators.allocators[].guard` | string | Yes | Guard object for this allocator | Guard name or ID |
| `data.allocators.allocators[].sharing` | array | Yes | Sharing items for this allocator | 1-100 sharing items |
| `data.allocators.allocators[].sharing[].who` | object | Yes | Recipient type | `{ GuardIdentifier: number }`, `{ Entity: { name_or_address: string } }`, or `{ Signer: "signer" }` |
| `data.allocators.allocators[].sharing[].sharing` | number | Yes | Sharing amount or rate in smallest units | No decimals or negatives |
| `data.allocators.allocators[].sharing[].mode` | string | Yes | Allocation mode | "Amount", "Rate", or "Surplus" |
| `data.allocators.allocators[].max` | number or null | No | Maximum allocation amount | No decimals or negatives |
| `data.coin` | object or string | Yes | Initial deposit coin | CoinParam structure |
| `data.coin.balance` | number | No | Balance amount | No decimals or negatives |
| `data.payment_info.remark` | string | Yes | Payment record remark | |
| `data.payment_info.index` | number or string | Yes | Payment record index | |
| `data.payment_info.for_object` | string or null | No | Payment for specific object | |
| `data.payment_info.for_guard` | string or null | No | Payment for specific guard | |

### Important Notes

⚠️ **Sum of all sharing rates should be ≤ 10000 (100%).**

⚠️ **When mode is "Surplus", the sharing field is ignored.**

---

### Examples

#### Example 1.1: Create Simple Rate-based Allocation

**Prompt**: Create a new allocation named "profit_sharing" with: 1) Description "Monthly profit distribution", 2) Threshold at 5000000000 (5 WOW), 3) One allocator with "distribution_guard" guard, 4) Sharing items: 50% to founder, 30% to developer, 20% to marketing, 5) Initial deposit of 10000000000 (10 WOW), 6) Payment info with remark "Initial deposit" and index 1.

```json
{
  "operation_type": "allocation",
  "data": {
    "object": {
      "name": "profit_sharing",
      "type_parameter": "0x2::wow::WOW",
      "tags": ["profit", "distribution"],
      "onChain": false
    },
    "allocators": {
      "description": "Monthly profit distribution",
      "threshold": 5000000000,
      "allocators": [
        {
          "guard": "distribution_guard",
          "sharing": [
            {
              "who": {
                "Entity": {
                  "name_or_address": "founder"
                }
              },
              "sharing": 5000,
              "mode": "Rate"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "developer"
                }
              },
              "sharing": 3000,
              "mode": "Rate"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "marketing"
                }
              },
              "sharing": 2000,
              "mode": "Rate"
            }
          ],
          "max": null
        }
      ]
    },
    "coin": {
      "balance": 10000000000
    },
    "payment_info": {
      "remark": "Initial deposit",
      "index": 1
    }
  }
}
```

#### Example 1.2: Create Allocation with Mixed Modes

**Prompt**: Create allocation "team_payouts" with: 1) Description "Team weekly payouts", 2) Threshold at 2000000000 (2 WOW), 3) Two allocators: first with "weekly_guard" (fixed amount to alice, rate to bob, surplus to charlie), second with "bonus_guard" (rate-based), 4) Initial deposit of 5000000000 (5 WOW), 5) Payment info with remark "Team payout initial" and index 2.

```json
{
  "operation_type": "allocation",
  "data": {
    "object": {
      "name": "team_payouts",
      "type_parameter": "0x2::wow::WOW"
    },
    "allocators": {
      "description": "Team weekly payouts",
      "threshold": 2000000000,
      "allocators": [
        {
          "guard": "weekly_guard",
          "sharing": [
            {
              "who": {
                "Entity": {
                  "name_or_address": "alice"
                }
              },
              "sharing": 1000000000,
              "mode": "Amount"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "bob"
                }
              },
              "sharing": 4000,
              "mode": "Rate"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "charlie"
                }
              },
              "sharing": 0,
              "mode": "Surplus"
            }
          ],
          "max": 10000000000
        },
        {
          "guard": "bonus_guard",
          "sharing": [
            {
              "who": {
                "Signer": "signer"
              },
              "sharing": 10000,
              "mode": "Rate"
            }
          ],
          "max": null
        }
      ]
    },
    "coin": {
      "balance": 5000000000
    },
    "payment_info": {
      "remark": "Team payout initial",
      "index": 2,
      "for_guard": "weekly_guard"
    }
  }
}
```

---

## Sub-feature 2: Operate Existing Allocation - Receive Funds

### Feature Description

Receive CoinWrapper objects sent to the Allocation object and deposit them into the pending distribution balance.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "allocation" |
| `data.object` | string | Yes | Reference existing Allocation | Allocation name or ID |
| `data.received_coins` | string or object | No | Receive funds configuration | "recently" or ReceivedBalance object |

### Important Notes

⚠️ **Use "recently" to receive all recently received coins.**

---

### Example

#### Example 2.1: Receive Recently Received Coins

**Prompt**: Receive all recently received coins into the "profit_sharing" allocation object.

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "received_coins": "recently"
  }
}
```

---

## Sub-feature 3: Operate Existing Allocation - Execute Distribution

### Feature Description

Verify the specified Guard and execute the corresponding fund distribution based on the configured allocators.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "allocation" |
| `data.object` | string | Yes | Reference existing Allocation | Allocation name or ID |
| `data.alloc_by_guard` | string | Yes | Guard object to verify and execute | Guard name or ID |

### Important Notes

⚠️ **The Guard must be configured in the allocators to execute distribution.**

---

### Example

#### Example 3.1: Execute Distribution by Guard

**Prompt**: Execute fund distribution for "profit_sharing" allocation by verifying "distribution_guard".

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "alloc_by_guard": "distribution_guard"
  }
}
```

---

## Sub-feature 4: Combined Operations

### Feature Description

Execute multiple operations in a single call: receive funds and execute distribution.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "allocation" |
| `data.object` | string | Yes | Reference existing Allocation | Allocation name or ID |
| `data.received_coins` | string or object | No | Receive funds configuration | "recently" or ReceivedBalance object |
| `data.alloc_by_guard` | string | No | Guard object to execute | Guard name or ID |

---

### Example

#### Example 4.1: Receive and Distribute in One Call

**Prompt**: For "team_payouts" allocation: 1) Receive all recently received coins, 2) Execute distribution using "weekly_guard".

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "team_payouts",
    "received_coins": "recently",
    "alloc_by_guard": "weekly_guard"
  }
}
```

---

## Important Notes

⚠️ **Sum of all sharing rates should be ≤ 10000 (100%) when no Surplus mode is used.**

⚠️ **Automatic distribution can be initiated after deposit reaches the threshold.**

⚠️ **Distribution records are permanently public on-chain.**

⚠️ **After creating an Allocation, you cannot modify the allocators configuration.**

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading - can use Allocation for order fund distribution |
| **[Reward](reward.md)** | Marketing incentives - similar distribution mechanism |
| **[Treasury](treasury.md)** | Team fund management |
| **[Permission](permission.md)** | Permission management |
| **[Guard](guard.md)** | Trust verification engine - required for executing distributions |

