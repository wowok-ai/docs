# Reward Component (🏆 Reward Pool)

---

## Component Overview

Reward is WoWok's reward pool component, used to create reward pools, set reward rules, and distribute rewards. Reward is usually bound to Service and triggered by Guard verification.

---

## Feature Tree

```
Reward Component
├── Create New Reward
│   ├── Set Name (object.name)
│   ├── Bind Permission (object.permission)
│   └── Set Description (description)
├── Manage Reward Rules (reward)
│   ├── Add Reward Rule (reward.op = "add")
│   ├── Set Reward Rules (reward.op = "set")
│   ├── Remove Reward Rule (reward.op = "remove")
│   └── Clear Reward Rules (reward.op = "clear")
├── Manage Reward Pool (reward_pool)
│   ├── Add Funds (reward_pool.op = "add")
│   └── Receive Funds (reward_pool.op = "receive")
├── Manage Reward Queue (reward_queue)
│   ├── Add to Queue (reward_queue.op = "add")
│   ├── Remove from Queue (reward_queue.op = "remove")
│   └── Clear Queue (reward_queue.op = "clear")
├── Receive Objects (owner_receive)
└── Destroy Reward (destroy)
```

---

## Sub-feature 1: Create New Reward

### Feature Description

Create a new Reward object for managing rewards.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|------|------|------|------|------|
| `object.name` | string | No | Local mark name | Max 64 characters |
| `object.id` | string | No | Object ID | 0x prefix + 64 hex characters |
| `object.type` | string | Yes | Object type | Must be "Reward" |
| `object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `description` | string | No | Reward description | Max 4000 characters |

### Examples

#### Example 1.1: Create Simple Reward

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward",
      "type": "Reward",
      "permission": "existing_permission"
    },
    "description": "New user registration reward pool"
  }
}
```

#### Example 1.2: Create Reward and New Permission Simultaneously

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "referral_reward",
      "type": "Reward",
      "permission": {
        "name": "referral_reward_permission"
      }
    },
    "description": "Referral reward pool"
  }
}
```

---

## Sub-feature 2: Manage Reward Rules (reward)

### Feature Description

Manage reward rules for Reward.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `reward.op` | string | Yes | Operation type: add/set/remove/clear |
| `reward.rewards` | array | Required for add/set | Reward rule list |
| `reward.rewards[].name` | string | Yes | Rule name |
| `reward.rewards[].guard` | string | Yes | Guard object ID/name |
| `reward.rewards[].type` | string | Yes | Reward type: fixed/percentage |
| `reward.rewards[].value` | string | Yes | Reward value (minimum unit) |
| `reward.rewards[].time_lock` | number | No | Lock time (milliseconds) |
| `reward.rewards[].time_start` | number | No | Start time (milliseconds) |
| `reward.rewards[].time_end` | number | No | End time (milliseconds) |
| `reward.rewards[].description` | string | No | Rule description |
| `reward.reward_name` | array | Required for remove | List of rule names to remove |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new rules to existing list |
| `set` | Replace entire rule list |
| `remove` | Remove specified rules (by name) |
| `clear` | Clear all rules |

### Reward Type Description

| Type | Description |
|------|------|
| `fixed` | Fixed amount reward |
| `percentage` | Percentage reward (100000000 = 10%) |

### Important Notes

⚠️ **Guard must be a valid Guard object ID or name**.

⚠️ **Reward rules are verified by Guard**, only users who pass Guard verification can receive rewards.

### Examples

#### Example 2.1: Add Fixed Amount Reward Rule

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward": {
      "op": "add",
      "rewards": [
        {
          "name": "New User Registration Reward",
          "guard": "new_user_guard",
          "type": "fixed",
          "value": "1000000000",
          "time_lock": 86400000,
          "description": "New users can receive 1 coin reward upon registration"
        }
      ]
    }
  }
}
```

#### Example 2.2: Add Percentage Reward Rule

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "referral_reward"
    },
    "reward": {
      "op": "add",
      "rewards": [
        {
          "name": "Referral Reward",
          "guard": "referral_guard",
          "type": "percentage",
          "value": "100000000",
          "time_start": 1704067200000,
          "time_end": 1735689600000,
          "description": "Referrers can receive 10% of the referral amount as reward"
        }
      ]
    }
  }
}
```

#### Example 2.3: Remove Reward Rule

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward": {
      "op": "remove",
      "reward_name": ["Old Reward Rule"]
    }
  }
}
```

#### Example 2.4: Clear Reward Rules

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 3: Manage Reward Pool (reward_pool)

### Feature Description

Manage the funds in Reward's reward pool.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `reward_pool.op` | string | Yes | Operation type: add/receive |
| `reward_pool.value` | string | Required for add | Amount to add (minimum unit) |
| `reward_pool.recent` | boolean | Required for receive | Whether to receive recent funds |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add funds to reward pool |
| `receive` | Receive funds from reward pool |

### Examples

#### Example 3.1: Add Funds to Reward Pool

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward_pool": {
      "op": "add",
      "value": "100000000000"
    }
  }
}
```

#### Example 3.2: Receive Funds from Reward Pool

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward_pool": {
      "op": "receive",
      "recent": true
    }
  }
}
```

---

## Sub-feature 4: Manage Reward Queue (reward_queue)

### Feature Description

Manage Reward's reward queue, used for batch processing reward distributions.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `reward_queue.op` | string | Yes | Operation type: add/remove/clear |
| `reward_queue.queue` | array | Required for add | Queue item list |
| `reward_queue.queue[].name` | string | Yes | Queue item name |
| `reward_queue.queue[].guard` | string | Yes | Guard object ID/name |
| `reward_queue.queue[].type` | string | Yes | Reward type: fixed/percentage |
| `reward_queue.queue[].value` | string | Yes | Reward value |
| `reward_queue.queue_name` | array | Required for remove | List of queue item names to remove |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new items to queue |
| `remove` | Remove specified items from queue |
| `clear` | Clear all queue items |

### Examples

#### Example 4.1: Add Items to Reward Queue

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward_queue": {
      "op": "add",
      "queue": [
        {
          "name": "Batch Reward 1",
          "guard": "batch_guard_1",
          "type": "fixed",
          "value": "500000000"
        },
        {
          "name": "Batch Reward 2",
          "guard": "batch_guard_2",
          "type": "fixed",
          "value": "300000000"
        }
      ]
    }
  }
}
```

#### Example 4.2: Remove Items from Reward Queue

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward_queue": {
      "op": "remove",
      "queue_name": ["Batch Reward 1"]
    }
  }
}
```

#### Example 4.3: Clear Reward Queue

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "reward_queue": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 5: Receive Objects (owner_receive)

### Feature Description

Receive objects sent to this Reward object and unwrap them to send to the permission owner.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `owner_receive.objects` | array | No | Specify list of object IDs to receive |
| `owner_receive.recent` | boolean | No | Whether to receive recent objects |

### Example

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "owner_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-feature 6: Destroy Reward

### Feature Description

Destroy the Reward object.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `destroy` | boolean | Yes | Whether to destroy |

### Important Notes

⚠️ **Reward must be in a destroyable state**.

⚠️ **All funds in the reward pool will be returned to the permission owner**.

### Example

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "new_user_reward"
    },
    "destroy": true
  }
}
```

---

## Sub-feature 7: Combined Operations

### Feature Description

Execute multiple operations in one call.

### Example

#### Example 7.1: Complete Reward Creation Process

```json
{
  "operation_type": "reward",
  "data": {
    "object": {
      "name": "complete_reward",
      "type": "Reward",
      "permission": "reward_permission"
    },
    "description": "Complete reward pool example",
    "reward": {
      "op": "add",
      "rewards": [
        {
          "name": "New User Reward",
          "guard": "new_user_guard",
          "type": "fixed",
          "value": "1000000000",
          "description": "New users can receive 1 coin reward"
        },
        {
          "name": "Referral Reward",
          "guard": "referral_guard",
          "type": "percentage",
          "value": "100000000",
          "description": "Referrers can receive 10% reward"
        }
      ]
    },
    "reward_pool": {
      "op": "add",
      "value": "100000000000"
    }
  }
}
```

---

## Important Notes

⚠️ **Reward rules are verified by Guard**, only users who pass Guard verification can receive rewards.

⚠️ **Reward is usually bound to Service**, and Guard is triggered when users complete specific actions.

⚠️ **Reward pool funds must be sufficient**, otherwise rewards cannot be distributed.

---

## Related Components

- **Service**: Service marketplace
- **Guard**: Trust verification engine
- **Permission**: Permission management
- **Treasury**: Team fund management
