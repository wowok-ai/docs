
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

## Schema Tree

```
allocation (Allocation Object)
├── operation_type: "allocation" (fixed value)
├── data (Allocation data definition)
│   ├── object (object definition, required)
│   │   ├── Option 1: Reference existing object (string) - object name or ID
│   │   └── Option 2: Create new object (object)
│   │       ├── name (string, optional) - local mark name, max 64 characters
│   │       ├── tags (array, optional) - tags array
│   │       ├── onChain (boolean, optional) - whether to sync name to blockchain
│   │       ├── replaceExistName (boolean, optional) - force claim existing name
│   │       └── type_parameter (string, optional) - token type, default: 0x2::wow::WOW
│   ├── allocators (object, required for create) - fund allocator list
│   │   ├── description (string, required) - allocators description, max 65535 characters
│   │   ├── threshold (number, required) - threshold amount in smallest units
│   │   └── allocators (array, required) - allocator list (1-100 allocators)
│   │       └── Allocator object
│   │           ├── guard (string, required) - Guard object ID or name
│   │           ├── sharing (array, required) - sharing items (1-100 items)
│   │           │   └── Sharing object
│   │           │       ├── who (object, required) - recipient type
│   │           │       │   ├── Option 1: GuardIdentifier (object)
│   │           │       │   │   └── GuardIdentifier (number) - Guard table identifier 0-255
│   │           │       │   ├── Option 2: Entity (object)
│   │           │       │   │   └── Entity (object)
│   │           │       │   │       └── name_or_address (string) - entity name or address
│   │           │       │   └── Option 3: Signer (object)
│   │           │       │       └── Signer (string) - fixed value "signer"
│   │           │       ├── sharing (number, required) - sharing amount/rate in smallest units
│   │           │       └── mode (string, required) - allocation mode: "Amount", "Rate", or "Surplus"
│   │           └── max (number | null, optional) - maximum allocation amount
│   ├── coin (object | string, required for create) - initial deposit coin
│   │   ├── Option 1: Balance object (object)
│   │   │   └── balance (number) - balance amount
│   │   └── Option 2: Coin object ID (string)
│   ├── payment_info (object, required for create) - payment info
│   │   ├── remark (string, required) - payment remark
│   │   ├── index (number | string, required) - payment record index
│   │   ├── for_object (string | null, optional) - payment for specific object
│   │   └── for_guard (string | null, optional) - payment for specific guard
│   ├── received_coins (string | object, optional) - receive funds configuration
│   │   ├── Option 1: "recently" (string) - receive all recent coins
│   │   └── Option 2: ReceivedBalance object (object)
│   │       ├── balance (number or string)
│   │       ├── token_type (string)
│   │       └── received (array of received items)
│   │           └── Received item
│   │               ├── id (string) - CoinWrapper object ID
│   │               └── payment (string) - Payment object ID
│   └── alloc_by_guard (string, optional) - Guard object ID/name to verify and execute distribution
├── env (optional, execution environment)
│   ├── account (string, optional) - account name or address, empty string for default
│   ├── network (string, optional) - "testnet" or "mainnet"
│   ├── permission_guard (array, optional) - list of permission guard IDs
│   ├── no_cache (boolean, optional) - disable caching
│   └── referrer (string, optional) - referrer ID
└── submission (optional, submission data)
    ├── type (string) - fixed value "submission"
    ├── guard (array) - list of guards to verify
    │   └── [{ object: "guard_id", impack: boolean }]
    └── submission (array) - submission data for guards
        └── [{ guard: "guard_id", submission: [guard_submission_items] }]
            └── guard_submission_items
                ├── identifier (number, 0-255) - Guard table item identifier
                ├── b_submission (boolean) - whether this item requires submission
                ├── value_type (number | string) - value type (e.g., 6 or "U64" for U64 type)
                ├── **value (any) - submitted value**
                └── name (string, optional) - item name
```

---

### ⚠️ Important Note About Submission

If the execution returns a `submission` field in the response, it indicates that additional Guard verification data is required. You must:

1. Complete all required submission data within the `submission` structure
2. Resubmit the operation with the completed submission data
3. **Do not modify any other parts of the structure** - only fill in the required submission values

The submission structure will specify which Guard objects need verification and what data needs to be provided for each Guard table item.

**Query Value Types**: Use the `wowok_buildin_info` tool with `{ "info": "value types" }` to query all supported value types with their numeric and string representations. This helps you understand what `value_type` values are valid for submission data.

---

## Sub-feature 1: Create New Allocation

### Feature Description

Create a new Allocation object with predefined distribution rules. Newly created allocations can receive funds and automatically distribute them based on the configured allocators.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "allocation" |
| `data.object` | object | Yes | Create new Allocation | TypeNamedObject structure |
| `data.object.name` | string | No | Local mark name | Max 64 BCS bytes, cannot start with "0x" |
| `data.object.tags` | array | No | Tags array | String array |
| `data.object.onChain` | boolean | No | Whether to mark on-chain | |
| `data.object.replaceExistName` | boolean | No | Replace existing name | |
| `data.object.type_parameter` | string | No | Token type | Default: 0x2::wow::WOW |
| `data.allocators.description` | string | Yes | Allocators description | Max 4000 BCS bytes |
| `data.allocators.threshold` | number | Yes | Threshold amount in smallest units | No decimals or negatives |
| `data.allocators.allocators` | array | Yes | Allocator list | 1-100 allocators |
| `data.allocators.allocators[].guard` | string | Yes | Guard object for this allocator | Guard name or ID |
| `data.allocators.allocators[].sharing` | array | Yes | Sharing items for this allocator | 1-100 sharing items |
| `data.allocators.allocators[].sharing[].who` | object | Yes | Recipient type | `{ GuardIdentifier: number }`, `{ Entity: { name_or_address: string } }`, or `{ Signer: "signer" }` |
| `data.allocators.allocators[].sharing[].sharing` | number | Yes | Sharing amount or rate in smallest units | No decimals or negatives |
| `data.allocators.allocators[].sharing[].mode` | string | Yes | Allocation mode | "Amount", "Rate", or "Surplus" |
| `data.allocators.allocators[].fix` | number | No | Fixed allocation amount for all recipients | No decimals or negatives |
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

⚠️ **Rate Mode Requirements**: When using pure Rate mode (without any Amount mode items), the total rate must equal 10000 (100%). The sharing amounts will be calculated as percentages of the available balance during execution.

⚠️ **Threshold Check**: For Amount mode allocations, the sum of all amounts must be greater than or equal to the threshold. For Rate mode allocations, the threshold check is performed during execution based on the actual balance.

---

### Examples

#### Example 1.1: Create Simple Amount-based Allocation

**Prompt**: Create a new allocation named "profit_sharing" with: 1) Description "Monthly profit distribution", 2) Threshold at 1000000000 (1 WOW), 3) One allocator with "always_true_guard" guard, 4) Sharing items: 1000000000 to alice, 500000000 to testuser1, 500000000 to bob using Amount mode, 5) Initial deposit of 2000000000 (2 WOW), 6) Payment info with remark "Initial deposit" and index 1.

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
      "threshold": 1000000000,
      "allocators": [
        {
          "guard": "always_true_guard",
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
                  "name_or_address": "testuser1"
                }
              },
              "sharing": 500000000,
              "mode": "Amount"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "bob"
                }
              },
              "sharing": 500000000,
              "mode": "Amount"
            }
          ],
          "max": null
        }
      ]
    },
    "coin": {
      "balance": 2000000000
    },
    "payment_info": {
      "remark": "Initial deposit",
      "index": 1
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x8a63...331b",
  "type": "Allocation",
  "version": "100983",
  "change": "created"
}
```

#### Example 1.2: Create Allocation with Amount Mode

**Prompt**: Create allocation "team_payouts" with: 1) Description "Team weekly payouts", 2) Threshold at 500000000 (0.5 WOW), 3) One allocator with "weekly_guard" (fixed amount to alice, testuser1, and bob), 4) Initial deposit of 2000000000 (2 WOW), 5) Payment info with remark "Team payout initial" and index 2.

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
      "threshold": 500000000,
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
              "sharing": 500000000,
              "mode": "Amount"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "testuser1"
                }
              },
              "sharing": 300000000,
              "mode": "Amount"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "bob"
                }
              },
              "sharing": 200000000,
              "mode": "Amount"
            }
          ],
          "max": 10000000000
        }
      ]
    },
    "coin": {
      "balance": 2000000000
    },
    "payment_info": {
      "remark": "Team payout initial",
      "index": 2,
      "for_guard": "weekly_guard"
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xa223...3a4e",
  "type": "Allocation",
  "version": "101677",
  "change": "created"
}
```

#### Example 1.3: Create Rate-based Allocation

**Prompt**: Create a new allocation named "profit_sharing_rate" with: 1) Description "Monthly profit distribution by rate", 2) Threshold at 1000000000 (1 WOW), 3) One allocator with "always_true_guard" guard, 4) Sharing items: 50% to alice, 30% to testuser1, 20% to bob using Rate mode (total must be 10000 = 100%), 5) Initial deposit of 2000000000 (2 WOW), 6) Payment info with remark "Rate mode deposit" and index 3.

```json
{
  "operation_type": "allocation",
  "data": {
    "object": {
      "name": "profit_sharing_rate",
      "type_parameter": "0x2::wow::WOW"
    },
    "allocators": {
      "description": "Monthly profit distribution by rate",
      "threshold": 1000000000,
      "allocators": [
        {
          "guard": "always_true_guard",
          "sharing": [
            {
              "who": {
                "Entity": {
                  "name_or_address": "alice"
                }
              },
              "sharing": 5000,
              "mode": "Rate"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "testuser1"
                }
              },
              "sharing": 3000,
              "mode": "Rate"
            },
            {
              "who": {
                "Entity": {
                  "name_or_address": "bob"
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
      "balance": 2000000000
    },
    "payment_info": {
      "remark": "Rate mode deposit",
      "index": 3
    }
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xb071...650c",
  "type": "Allocation",
  "version": "992",
  "change": "created"
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

**Prerequisites**: Before receiving funds, you need to send a Payment to the Allocation object. Here are the steps:

**Step 1**: Create and send a Payment to the Allocation object

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "name": "payment_to_allocation"
    },
    "revenue": [
      {
        "recipient": {
          "name_or_address": "profit_sharing"
        },
        "amount": {
          "balance": 1000000000
        }
      }
    ],
    "info": {
      "remark": "Payment to profit sharing allocation",
      "index": 5
    }
  }
}
```

**Step 2**: Receive the funds into the Allocation object

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

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x8a63...331b",
  "type": "Allocation",
  "version": "102109",
  "change": "mutated",
  "received": [
    {
      "id": "0xd9fe...1f70",
      "type": "0x2::payment::CoinWrapper<0x2::wow::WOW>",
      "amount": 1000000000
    }
  ]
}
```

⚠️ **Note**: You can also use the detailed format for `received_coins` with specific object details:

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "received_coins": {
      "balance": 1000000000,
      "token_type": "0x2::wow::WOW",
      "received": [
        {
          "id": "0xd9fed2a4b98b8125dd252775e5954d6db4be7bc8c9e53d176fa76ba1a5721f70",
          "payment": "0x2197a9421d457c45bdec487a3e506c89861a2935806493615028994f1b8794ac",
          "balance": 1000000000
        }
      ]
    }
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

**Prompt**: Execute fund distribution for "profit_sharing" allocation by verifying "always_true_guard".

```json
{
  "operation_type": "allocation",
  "data": {
    "object": "profit_sharing",
    "alloc_by_guard": "always_true_guard"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x8a63...331b",
  "type": "Allocation",
  "version": "102951",
  "change": "mutated"
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
    "received_coins": {
      "balance": 1000000000,
      "token_type": "0x2::wow::WOW",
      "received": [
        {
          "id": "0x7857681fd9b9eeced363dfcf05750d6fa37178995fe88ab6cddd008b7e11365c",
          "payment": "0xdde7c6c1906bbd0592b742b2772b5fc81fa1d1deb400a2ef3e59a644e9dd84bf",
          "balance": 1000000000
        }
      ]
    },
    "alloc_by_guard": "weekly_guard"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0xa223...3a4e",
  "type": "Allocation",
  "version": "103485",
  "change": "mutated"
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

