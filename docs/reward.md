
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
│   ├── owner_receive (unwrap and send to owner, optional)
│   └── um (Contact object, optional)
├── env (optional, execution environment)
└── submission (optional, submission data)
```

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

**Prompt**: Create a Reward named "new_user_reward", use default account and network, no other configuration specified.

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    }
  }
}
```

---

#### Example 1.2: Create Reward with Tags

**Prompt**: Create a Reward named "referral_reward", add tags "referral", "incentive", description "Referral reward program", and set guard expiration time to 30 days.

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "referral_reward",
      "tags": ["referral", "incentive"]
    },
    "description": "Referral reward program",
    "guard_expiration_time": 2592000000
  }
}
```

---

#### Example 1.3: Create Complete Reward with Guards and Funds

**Prompt**: Create a Reward named "complete_reward": 1) Add tags "incentive", "promotion", 2) Add description "Complete reward pool example", 3) Add 100 WOW initial funds, 4) Add two RewardGuards: one for new users (fixed amount to signer), one for referrals (fixed amount to entity "referral_recipient").

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "complete_reward",
      "tags": ["incentive", "promotion"]
    },
    "description": "Complete reward pool example",
    "coin_add": {
      "balance": 100000000000
    },
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
        "expiration_time": 1735689600000
      },
      {
        "guard": "referral_guard",
        "recipient": {
          "Entity": "referral_recipient"
        },
        "amount": {
          "type": "Fixed",
          "value": 500000000
        }
      }
    ]
  }
}
```

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

**Prompt**: Add 500 WOW to "new_user_reward" pool.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "new_user_reward",
    "coin_add": {
      "balance": 500000000000
    }
  }
}
```

---

#### Example 2.2: Add Funds and Process Received Balance

**Prompt**: For "referral_reward": 1) Add 200 WOW, 2) Process recently received CoinWrapper objects.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "referral_reward",
    "coin_add": {
      "balance": 200000000000
    },
    "receive": "recently"
  }
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
| `expiration_time` | number | No | Expiration time in milliseconds |

### Recipient Types

- **Signer**: `{ "Signer": "signer" }` - Current transaction signer
- **Entity**: `{ "Entity": "name_or_address" }` - Fixed entity ID
- **GuardIdentifier**: `{ "GuardIdentifier": number }` - From Guard table

### Amount Types

- **Fixed**: `{ "type": "Fixed", "value": number }` - Fixed amount

---

### Examples

#### Example 4.1: Add Single RewardGuard

**Prompt**: Add a RewardGuard to "new_user_reward": 1) Guard "new_user_guard", 2) Recipient is signer, 3) Fixed amount 10 WOW, 4) Expires in 30 days.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "new_user_reward",
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
        "expiration_time": 1735689600000
      }
    ]
  }
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

**Prompt**: Set guard expiration lock on "campaign_reward" for 7 days, preventing new guards from being added during that time.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "campaign_reward",
    "guard_expiration_time": 604800000
  }
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

**Prompt**: Unwrap recently received CoinWrapper and other objects of "new_user_reward", send to permission owner.

```json
{
  "operation_type": "reward",
  "data": {
    "object": "new_user_reward",
    "owner_receive": "recently"
  }
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

- **Service**: Service marketplace - can bind Reward to Service
- **Guard**: Validation rules - required for reward claiming
- **Permission**: Permission management
- **Treasury**: Fund management - can fund reward pools from treasury
- **Allocation**: Auto-distribution - similar distribution mechanism

