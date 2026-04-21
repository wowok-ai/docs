
# Reward Component (🏆 Reward Pool)

---

## Component Overview

Reward is WoWok's reward pool component, used to create reward pools, set reward rules, and distribute rewards. Reward is usually bound to Service and triggered by Guard verification.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Reward** | Establish new reward pool with access controls | Set up user incentive programs, referral rewards | Creates secure on-chain reward pool with permission management |
| **Add Funds** | Deposit assets into reward pool balance | Fund incentive programs, top up reward budget | Fills the reward pool balance |
| **Claim Reward** | Verify Guard and distribute reward | Trigger reward payout, complete incentive conditions | Executes reward distribution when Guard verification passes |
| **Add Reward Guards** | Configure Guard-based reward rules | Set up conditional rewards, referral incentives | Defines reward eligibility with Guard validation |
| **Remove Expired Guards** | Clean up expired reward rules | Maintain active reward rules, reduce bloat | Keeps reward pool configuration clean |
| **Set Guard Expiration** | Lock reward rule modifications | Prevent rule changes during active campaigns | Ensures reward rules remain stable |
| **Receive Balance** | Process received CoinWrapper objects | Collect incoming payments, top up pool | Automatically adds received assets to pending balance |
| **Owner Receive** | Unwrap and send received assets to owner | Forward received tokens, process payments | Delivers received assets to permission owner |

---

## Complete Tool Call Structure

Reward operations use the following top-level structure:

```json
{
  "operation_type": "reward",
  "data": { ... },    // Reward data definition
  "env": { ... },       // Execution environment (optional)
  "submission": { ... }  // Submission data (optional)
}
```

---

## Schema Tree

```
reward (Reward Object)
├── operation_type: "reward" (fixed value)
├── data (Reward data definition)
│   ├── object (object definition, required)
│   │   ├── name|id (reference existing object)
│   │   └── name|tags|type_parameter|permission (create new object)
│   ├── claim (Guard to claim reward, optional)
│   ├── description (description, optional)
│   ├── coin_add (add funds, optional)
│   ├── receive (receive CoinWrapper, optional)
│   ├── guard_add (add RewardGuards, optional)
│   ├── guard_remove_expired (remove expired, optional)
│   ├── guard_expiration_time (expiration time, optional)
│   ├── owner_receive (transfer received coins or NFT objects to owner, optional)
│   │   ├── Option 1: "recently" (string) - receive all recent objects
│   │   ├── Option 2: Array of received objects
│   │   │   └── [{ id: "object_id", type: "object_type" }]
│   │   └── Option 3: Received balance object
│   │       ├── balance (number or string)
│   │       ├── token_type (string)
│   │       └── received (array of received items)
│   └── um (Contact object, optional)
│       ├── Option 1: Contact object name or ID (string)
│       └── Option 2: null (to unbind contact)
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

## Sub-feature 1: Create New Reward

### Feature Description

Create a new Reward object for managing rewards.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "reward" |
| `data.object` | object or string | Yes | Object definition | TypedPermissionObject |
| `data.description` | string | No | Reward description | Max 65535 characters |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **Reward Guards**: Define reward rules using RewardGuard objects, which include recipient, amount, and expiration.

⚠️ **Guard Verification**: Rewards are only distributed when the specified Guard verification passes.

---

### Examples

#### Example 1.1: Create Minimal Reward

**Prompt**: Create a Reward named "reward_test_1", use default account and testnet network.

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "reward_test_1"
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x11a5...b44e",
      "version": "214214",
      "change": "created"
    },
    {
      "type": "Permission",
      "object": "0xb991...16cd",
      "version": "214214",
      "change": "created"
    }
  ]
}
```

---

#### Example 1.2: Create Reward with Tags

**Prompt**: Create a Reward named "reward_test_2", add tags "referral", "incentive", description "Referral reward program".

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "reward_test_2",
      "tags": ["referral", "incentive"]
    },
    "description": "Referral reward program"
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x85cb...ab07",
      "version": "214844",
      "change": "created"
    },
    {
      "type": "Permission",
      "object": "0xe6cc...1508",
      "version": "214844",
      "change": "created"
    }
  ]
}
```

---

#### Example 1.3: Create Reward with Funds

**Prompt**: Create a Reward named "reward_test_3": 1) Add tags "incentive", "promotion", 2) Add description "Complete reward pool example", 3) Add 100 WOW initial funds.

> **Prerequisite**: Need to create Guard object first for subsequent reward rules
> ```json
> {
>   "operation_type": "guard",
>   "data": {
>     "namedNew": {"name": "new_user_guard"},
>     "description": "New user reward guard",
>     "table": [{"identifier": 0, "value_type": "bool", "b_submission": false, "value": true}],
>     "root": {
>       "type": "node",
>       "node": {
>         "type": "logic_equal",
>         "nodes": [{"type": "identifier", "identifier": 0}, {"type": "identifier", "identifier": 0}]
>       }
>     }
>   },
>   "env": {"network": "testnet"}
> }
> ```

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "reward_test_3",
      "tags": ["incentive", "promotion"]
    },
    "description": "Complete reward pool example",
    "coin_add": {
      "balance": 100000000000
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": []
}
```

> **Note**: When creating object and adding funds simultaneously, the returned object list may be empty. You can confirm successful creation through query.

---

## Sub-feature 2: Add Funds to Reward Pool

### Feature Description

Add assets to the Reward object's balance.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "reward" |
| `data.object` | string | Yes | Reward name or ID | |
| `data.coin_add` | object | Yes | Amount to add | { balance: number } or { coin: string } |

---

### Examples

#### Example 2.1: Add Fixed Amount

**Prompt**: Add 500 WOW to "reward_test_1" pool.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "reward_test_1",
    "coin_add": {
      "balance": 500000000000
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x11a5...b44e",
      "version": "216638",
      "change": "modified"
    }
  ]
}
```

---

#### Example 2.2: Add Funds with Multiple Operations

**Prompt**: For "reward_test_2": Add 200 WOW funds.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "reward_test_2",
    "coin_add": {
      "balance": 200000000000
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x85cb...ab07",
      "version": "217xxx",
      "change": "modified"
    }
  ]
}
```

---

## Sub-feature 3: Claim Reward

### Feature Description

Verify the specified Guard and execute the corresponding reward distribution.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "reward" |
| `data.object` | string | Yes | Reward name or ID | |
| `data.claim` | string | Yes | Guard object to verify | Guard name or ID |

### Important Notes

⚠️ **Guard Must Be Configured**: The specified Guard must be in the reward's guard list.

⚠️ **Sufficient Pool Balance**: Ensure the reward pool has enough balance to cover the reward.

---

### Example

#### Example 3.1: Claim Reward by Guard

**Prompt**: Claim reward from "new_user_reward" by verifying "new_user_guard".

```json
{
  "operation_type": "reward",
  "data": {
    "object": "new_user_reward",
    "claim": "new_user_guard"
  }
}
```

---

## Sub-feature 4: Manage Reward Guards

### Feature Description

Add RewardGuard objects to the reward pool, remove expired guards, and set guard expiration time.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "reward" |
| `data.object` | string | Yes | Reward name or ID | |
| `data.guard_add` | array | No | Add RewardGuards | Array of RewardGuard objects |
| `data.guard_remove_expired` | boolean | No | Remove expired guards | |
| `data.guard_expiration_time` | number or null | No | Set guard expiration lock | Milliseconds, null to unlock |

### RewardGuard Structure

| Field | Type | Required | Description |
|-------|------|------|------|
| `guard` | string | Yes | Guard object ID or name |
| `recipient` | object | Yes | Recipient specification |
| `amount` | object | Yes | Reward amount |
| `expiration_time` | number | No | Expiration time in milliseconds (Unix timestamp) |

#### ⚠️ Important Notes About `expiration_time`

**Timestamp Format**: `expiration_time` is a Unix timestamp in milliseconds, representing the expiration deadline for the reward rule.

**Key Constraints**:
1. **Must be future time**: `expiration_time` must be greater than the current blockchain time, otherwise the transaction will fail (error code: E_GUARD_EXPIRED)
2. **Unit is milliseconds**: Not seconds! For example, `1876000000000` represents around year 2029
3. **Permanent if not set**: If `expiration_time` is not set, the reward rule will be valid permanently

**How to Calculate**:
- Current timestamp (ms): `Date.now()`
- Future time: `Date.now() + 30 * 24 * 60 * 60 * 1000` (30 days later)
- Online tool: https://www.unixtimestamp.com/ (remember to multiply by 1000 to convert to milliseconds)

**Common Error**:
```
Error: E_GUARD_EXPIRED (error code 2)
```
This indicates that the set `expiration_time` is less than or equal to the current blockchain time.

### Recipient Types

- **Signer**: `{ "Signer": "signer" }` - Current transaction signer
- **Entity**: `{ "Entity": "name_or_address" }` - Fixed entity ID
- **GuardIdentifier**: `{ "GuardIdentifier": number }` - From Guard table

### Amount Types

- **Fixed**: `{ "type": "Fixed", "value": number }` - Fixed amount

---

### Examples

#### Example 4.1: Add Single RewardGuard

**Prompt**: Add a RewardGuard to "reward_test_1": 1) Guard "new_user_guard", 2) Recipient is signer, 3) Fixed amount 10 WOW, 4) Expires in 30 days (from current time).

> **Note**: `expiration_time` must be a future timestamp (milliseconds) and must be greater than the current blockchain time.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "reward_test_1",
    "guard_add": [
      {
        "guard": "new_user_guard",
        "recipient": {
          "Signer": "signer"
        },
        "amount": {
          "type": "Fixed",
          "value": 1000000000
        },
        "expiration_time": 1876000000000
      }
    ]
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x11a5...b44e",
      "version": "218xxx",
      "change": "modified"
    }
  ]
}
```

---

#### Example 4.2: Add Multiple RewardGuards

**Prompt**: Add two RewardGuards to "referral_reward": 1) First guard for referrer (entity "referrer"), 2) Second guard for referee (entity "referee").

```json
{
  "operation_type": "reward",
  "data": {
    "object": "referral_reward",
    "guard_add": [
      {
        "guard": "referrer_guard",
        "recipient": {
          "Entity": "referrer"
        },
        "amount": {
          "type": "Fixed",
          "value": 500000000
        }
      },
      {
        "guard": "referee_guard",
        "recipient": {
          "Entity": "referee"
        },
        "amount": {
          "type": "Fixed",
          "value": 300000000
        }
      }
    ]
  }
}
```

---

#### Example 4.3: Remove Expired Guards

**Prompt**: Remove all expired RewardGuards from "new_user_reward".

```json
{
  "operation_type": "reward",
  "data": {
    "object": "new_user_reward",
    "guard_remove_expired": true
  }
}
```

---

#### Example 4.4: Set Guard Expiration Lock

**Prompt**: Set guard expiration lock on "reward_test_2" for 7 days, preventing new guards from being added during that time.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "reward_test_2",
    "guard_expiration_time": 1876000000000
  },
  "env": {
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x85cb...ab07",
      "version": "228609",
      "change": "mutated"
    }
  ]
}
```

---

#### Example 4.5: Unlock Guard Expiration

**Prompt**: Unlock guard expiration on "campaign_reward", allowing new guards to be added again.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "campaign_reward",
    "guard_expiration_time": null
  }
}
```

---

## Sub-feature 5: Receive and Manage Assets

### Feature Description

Process CoinWrapper objects received by Reward, can deposit to pending balance or unwrap and send to permission owner.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "reward" |
| `data.object` | string | Yes | Reward name or ID | |
| `data.receive` | string or object | No | Receive CoinWrapper | "recently" or ReceivedBalance object |
| `data.owner_receive` | string or object | No | Unwrap and send to owner | "recently" or ReceivedObjects object |

### Important Notes

⚠️ **receive**: Unwrap received CoinWrapper and store in reward's pending balance.

⚠️ **owner_receive**: Unwrap CoinWrapper and send to permission owner.

---

### Examples

#### Example 5.1: Receive Recently Received CoinWrapper

**Prompt**: Deposit recently received CoinWrapper of "new_user_reward" into pending balance.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "new_user_reward",
    "receive": "recently"
  }
}
```

---

#### Example 5.2: Unwrap and Send to Owner

**Prompt**: First send Coin to "reward_test_1" via Payment, then unwrap and send to permission owner.

**Step 1: Send Coin to Reward via Payment**

```json
{
  "operation_type": "payment",
  "data": {
    "object": {
      "type_parameter": "0x2::wow::WOW"
    },
    "revenue": [
      {
        "recipient": {"name_or_address": "reward_test_1"},
        "amount": {"balance": "5000000000"}
      }
    ],
    "info": {
      "remark": "Send coin to reward object",
      "index": 1
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

**Step 1 Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "WReceivedObject",
      "object": "0x3b5e...af84",
      "change": "created"
    },
    {
      "type": "Payment",
      "object": "0x4fa5...b21e",
      "change": "created"
    }
  ]
}
```

**Step 2: Unwrap and Send to Owner**

```json
{
  "operation_type": "reward",
  "data": {
    "object": "reward_test_1",
    "owner_receive": "recently"
  },
  "env": {
    "network": "testnet"
  }
}
```

**Step 2 Execution Result**:
```json
{
  "status": "success",
  "objects": [
    {
      "type": "Reward",
      "object": "0x11a5...b44e",
      "version": "233053",
      "change": "mutated"
    },
    {
      "type": "WReceivedObject",
      "object": "0x3b5e...af84",
      "version": "233053",
      "change": "mutated"
    }
  ]
}
```

---

## Sub-feature 6: Combined Operations

### Feature Description

Perform multiple operations on existing Reward in a single transaction, such as adding funds and adding guards simultaneously.

### Important Notes

⚠️ **Combined Operations**: Can combine multiple operations in the same transaction to improve efficiency.

---

### Example

#### Example 6.1: Complete Reward Setup

**Prompt**: For "complete_reward": 1) Add 500 WOW funds, 2) Add two RewardGuards, 3) Process received balance, 4) Set description.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "complete_reward",
    "description": "Complete reward setup example",
    "coin_add": {
      "balance": 500000000000
    },
    "receive": "recently",
    "guard_add": [
      {
        "guard": "bonus_guard_1",
        "recipient": {
          "Signer": "signer"
        },
        "amount": {
          "type": "Fixed",
          "value": 2000000000
        }
      },
      {
        "guard": "bonus_guard_2",
        "recipient": {
          "Entity": "team_member"
        },
        "amount": {
          "type": "Fixed",
          "value": 1000000000
        }
      }
    ]
  }
}
```

---

## Important Notes

⚠️ **Reward distribution requires Guard verification**, only users who pass Guard verification can receive rewards.

⚠️ **Reward pool funds must be sufficient**, otherwise rewards cannot be distributed.

⚠️ **Guard expiration time locks modifications**, new guards cannot be added before expiration.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | WYSIWYG product trading - can bind Reward to Service |
| **[Guard](guard.md)** | Trust verification engine - required for reward claiming |
| **[Permission](permission.md)** | Permission management |
| **[Treasury](treasury.md)** | Team fund management - can fund reward pools from treasury |
| **[Allocation](allocation.md)** | Automatic fund distribution - similar distribution mechanism |

