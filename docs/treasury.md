# Treasury Component (💰 Team Fund Vault Management)

---

## Component Overview

The Treasury component is used to create and manage team fund vaults, set deposit/withdrawal rules, etc. Treasury supports two operation modes: permission management through Permission objects, or verification through external Guard objects.

---

## Complete Tool Call Structure

Treasury operations use the following top-level structure:

```json
{
  "operation_type": "treasury",
  "data": { ... },    // Treasury data definition
  "env": { ... },       // Execution environment (optional)
  "submission": { ... }  // Submission data (optional)
}
```

---

## Feature Tree

```
treasury (Treasury Object)
├── operation_type: "treasury" (fixed value)
├── data (Treasury data definition)
│   ├── object (object definition, required)
│   │   ├── new: true (create new object)
│   │   │   ├── name (object name)
│   │   │   ├── type: "Treasury" (fixed type)
│   │   │   ├── permission (Permission object, optional)
│   │   │   │   ├── new: true (create new Permission)
│   │   │   │   │   ├── name (Permission name)
│   │   │   │   │   ├── admin (admin list)
│   │   │   │   │   └── description (description)
│   │   │   │   └── name|id (reference existing Permission)
│   │   │   └── namedNew (optional, local naming)
│   │   │       ├── name (local name)
│   │   │       ├── tags (tag list, optional)
│   │   │       └── replaceExistName (whether to replace existing name, optional)
│   │   └── name|id (operate existing object)
│   ├── description (description, optional)
│   ├── receive (receive CoinWrapper and deposit to balance, optional)
│   │   ├── recently: true (recently received)
│   │   └── balance (receive specified balance object, optional)
│   ├── deposit (deposit, optional)
│   │   ├── coin (asset, required)
│   │   │   ├── fixed (fixed amount)
│   │   │   └── balance (use balance object)
│   │   ├── by_external_deposit_guard (external Guard verification, optional)
│   │   ├── payment_info (payment information, required)
│   │   └── namedNewPayment (create new Payment object, optional)
│   ├── withdraw (withdrawal, optional)
│   │   ├── amount (amount, required)
│   │   │   ├── fixed (fixed amount, withdraw through Permission)
│   │   │   └── by_external_withdraw_guard (external Guard verification withdrawal)
│   │   ├── recipient (recipient, required)
│   │   ├── payment_info (payment information, required)
│   │   └── namedNewPayment (create new Payment object, optional)
│   ├── external_deposit_guard (external deposit Guard management, optional)
│   │   └── op (operation type: add|set|remove|clear)
│   │       ├── add: guards (Guard list)
│   │       ├── set: guards (Guard list)
│   │       ├── remove: guards (Guard name list)
│   │       └── clear (clear all)
│   ├── external_withdraw_guard (external withdrawal Guard management, optional)
│   │   └── op (operation type: add|set|remove|clear)
│   │       ├── add: guards (Guard list)
│   │       ├── set: guards (Guard list)
│   │       ├── remove: guards (Guard name list)
│   │       └── clear (clear all)
│   ├── owner_receive (unwrap CoinWrapper and send to owner, optional)
│   │   ├── recently: true (recently received)
│   │   └── objects (object list, optional)
│   └── um (Contact object, optional)
├── env (optional, execution environment)
│   ├── account (optional, use specified account)
│   ├── permission_guard (optional, permission Guard list)
│   ├── no_cache (optional, whether to disable cache)
│   ├── network (optional, network selection)
│   └── referrer (optional, referrer ID)
└── submission (optional, submission data)
```

---

## Sub-feature 1: Create New Treasury

### Feature Description
Create a new Treasury object, can simultaneously create a new Permission object or reference an existing Permission.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "treasury" |
| `data.object.new` | boolean | Yes | Create new object | true |
| `data.object.name` | string | Yes | Treasury name | Maximum 64 BCS characters |
| `data.object.type` | string | Yes | Object type | Fixed value "Treasury" |
| `data.object.permission` | object | No | Permission object | Can be newly created or reference existing |
| `data.object.permission.new` | boolean | No | Create new Permission | true |
| `data.object.permission.name` | string | No | Permission name | Maximum 64 BCS characters |
| `data.object.permission.admin` | array | No | Admin list | Address array |
| `data.object.permission.description` | string | No | Permission description | Maximum length limit |
| `data.object.namedNew.name` | string | No | Local name | Maximum 64 BCS characters |
| `data.object.namedNew.tags` | array | No | Tag list | String array |
| `data.object.namedNew.replaceExistName` | boolean | No | Whether to replace existing name | true=force replace; false=error when name exists (default) |
| `data.description` | string | No | Treasury description | Maximum length limit |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **Permission Object**: Treasury requires Permission to manage permissions, can create new or reference existing.

⚠️ **External Guard**: Can set external verification rules through `external_deposit_guard` and `external_withdraw_guard`, allowing non-permission users to deposit/withdraw through Guard verification.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Create Minimal Treasury (name only)

**Prompt**: Create a Treasury named "team_treasury", use default account and network, no other configuration specified.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "new": true,
      "name": "team_treasury",
      "type": "Treasury"
    }
  }
}
```

---

#### Example 1.2: Create Treasury and Simultaneously Create New Permission

**Prompt**: Create a Treasury named "project_fund", simultaneously create a new Permission object named "project_perm", set admin, add tags "project", "finance", and add description.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "new": true,
      "name": "project_fund",
      "type": "Treasury",
      "permission": {
        "new": true,
        "name": "project_perm",
        "admin": ["0x1234...5678"],
        "description": "Permission for project fund management"
      },
      "namedNew": {
        "name": "project_fund",
        "tags": ["project", "finance"]
      }
    },
    "description": "Project fund treasury for managing team finances"
  }
}
```

---

#### Example 1.3: Create Treasury and Reference Existing Permission

**Prompt**: Create a Treasury named "marketing_budget", reference existing Permission "marketing_perm", add tags "marketing", "budget", and specify testnet network.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "new": true,
      "name": "marketing_budget",
      "type": "Treasury",
      "permission": {
        "name": "marketing_perm"
      },
      "namedNew": {
        "name": "marketing_budget",
        "tags": ["marketing", "budget"]
      }
    },
    "description": "Marketing budget treasury"
  },
  "env": {
    "network": "testnet"
  }
}
```

---

#### Example 1.4: Create Treasury and Set External Guard

**Prompt**: Create a Treasury named "community_fund", set external deposit Guard and external withdrawal Guard, allowing deposit/withdrawal operations through Guard verification.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "new": true,
      "name": "community_fund",
      "type": "Treasury",
      "permission": {
        "name": "community_perm"
      },
      "namedNew": {
        "name": "community_fund",
        "tags": ["community", "fund"]
      }
    },
    "description": "Community fund treasury with external Guard access",
    "external_deposit_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "deposit_guard",
          "identifier": 0
        }
      ]
    },
    "external_withdraw_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "withdraw_guard",
          "identifier": 1
        }
      ]
    }
  }
}
```

---

## Sub-feature 2: Deposit

### Feature Description
Deposit assets into Treasury, supports verification through Permission or external Guard.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "treasury" |
| `data.object.name` | string | Yes | Treasury name or ID | |
| `data.deposit.coin.fixed` | string | Yes | Deposit amount | Minimum unit |
| `data.deposit.by_external_deposit_guard` | string | No | External Guard verification | Guard object ID or name |
| `data.deposit.payment_info` | object | Yes | Payment information | |
| `data.deposit.namedNewPayment` | object | No | Create new Payment object | |

### Important Notes

⚠️ **Two Deposit Methods**: 
- Deposit through Permission (default, requires permission)
- Deposit through external Guard verification (use `by_external_deposit_guard`)

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 2.1: Deposit through Permission

**Prompt**: Deposit 100 WOW into "team_treasury", operate through Permission permission.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "team_treasury"
    },
    "deposit": {
      "coin": {
        "fixed": "100000000000"
      },
      "payment_info": {}
    }
  }
}
```

---

#### Example 2.2: Deposit through External Guard

**Prompt**: Deposit 50 WOW into "community_fund", verify through external Guard "deposit_guard", simultaneously create a Payment object named "deposit_payment".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "deposit": {
      "coin": {
        "fixed": "50000000000"
      },
      "by_external_deposit_guard": "deposit_guard",
      "payment_info": {},
      "namedNewPayment": {
        "name": "deposit_payment"
      }
    }
  }
}
```

---

## Sub-feature 3: Withdrawal

### Feature Description
Withdraw assets from Treasury, supports fixed amount withdrawal through Permission, or withdrawal through external Guard verification.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "treasury" |
| `data.object.name` | string | Yes | Treasury name or ID | |
| `data.withdraw.amount.fixed` | string | Yes | Withdrawal amount (Permission method) | Minimum unit |
| `data.withdraw.amount.by_external_withdraw_guard` | string | Yes | External Guard verification (Guard method) | Guard object ID or name |
| `data.withdraw.recipient` | string | Yes | Recipient address | |
| `data.withdraw.payment_info` | object | Yes | Payment information | |
| `data.withdraw.namedNewPayment` | object | No | Create new Payment object | |

### Important Notes

⚠️ **Two Withdrawal Methods**: 
- Fixed amount withdrawal: Set through `amount.fixed`, must go through Permission permission
- Guard verification withdrawal: Set through `amount.by_external_withdraw_guard`, amount obtained from Guard table data

⚠️ **Balance Check**: Ensure Treasury has sufficient balance before withdrawal.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 3.1: Fixed Amount Withdrawal through Permission

**Prompt**: Withdraw 50 WOW from "team_treasury", through Permission permission, send to "0x1234...5678".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "team_treasury"
    },
    "withdraw": {
      "amount": {
        "fixed": "50000000000"
      },
      "recipient": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "payment_info": {}
    }
  }
}
```

---

#### Example 3.2: Withdrawal through External Guard

**Prompt**: Withdraw from "community_fund", verify through external Guard "withdraw_guard", send to "0xabcd...1234", simultaneously create Payment object.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "withdraw": {
      "amount": {
        "by_external_withdraw_guard": "withdraw_guard"
      },
      "recipient": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
      "payment_info": {},
      "namedNewPayment": {
        "name": "withdraw_payment"
      }
    }
  }
}
```

---

## Sub-feature 4: Manage External Deposit Guard

### Feature Description
Manage Treasury's external deposit Guard list, supports add, set, remove, clear operations.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "treasury" |
| `data.object.name` | string | Yes | Treasury name or ID | |
| `data.external_deposit_guard.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.external_deposit_guard.guards` | array | Yes | Guard list | Required for add/set |

### Important Notes

⚠️ **External Guard Function**: Allows non-Permission permission users to deposit through Guard verification.

⚠️ **identifier Parameter**: Corresponds to data index in Guard table, its value is depositable amount, null means unlimited.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 4.1: Add External Deposit Guard

**Prompt**: Add external deposit Guard "public_deposit_guard" to "community_fund", identifier is 0, meaning depositable amount obtained from Guard table index 0.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_deposit_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "public_deposit_guard",
          "identifier": 0
        }
      ]
    }
  }
}
```

---

#### Example 4.2: Add Unlimited Deposit Guard

**Prompt**: Add external deposit Guard "unlimited_deposit", identifier is null, meaning unlimited deposit amount.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_deposit_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "unlimited_deposit",
          "identifier": null
        }
      ]
    }
  }
}
```

---

#### Example 4.3: Set External Deposit Guard (Replace)

**Prompt**: Set "community_fund" external deposit Guard list, replace existing list, only keep "new_deposit_guard".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_deposit_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "new_deposit_guard",
          "identifier": 1
        }
      ]
    }
  }
}
```

---

#### Example 4.4: Remove External Deposit Guard

**Prompt**: Remove external deposit Guard named "old_deposit_guard" from "community_fund".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_deposit_guard": {
      "op": "remove",
      "guards": ["old_deposit_guard"]
    }
  }
}
```

---

#### Example 4.5: Clear External Deposit Guard

**Prompt**: Clear all external deposit Guards of "community_fund".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_deposit_guard": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 5: Manage External Withdrawal Guard

### Feature Description
Manage Treasury's external withdrawal Guard list, supports add, set, remove, clear operations.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "treasury" |
| `data.object.name` | string | Yes | Treasury name or ID | |
| `data.external_withdraw_guard.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.external_withdraw_guard.guards` | array | Yes | Guard list | Required for add/set |

### Important Notes

⚠️ **External Guard Function**: Allows non-Permission permission users to withdraw through Guard verification.

⚠️ **identifier Parameter**: Corresponds to data index in Guard table, its value is withdrawable amount.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 5.1: Add External Withdrawal Guard

**Prompt**: Add external withdrawal Guard "approved_withdraw_guard" to "community_fund", identifier is 1, meaning withdrawable amount obtained from Guard table index 1.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_withdraw_guard": {
      "op": "add",
      "guards": [
        {
          "guard": "approved_withdraw_guard",
          "identifier": 1
        }
      ]
    }
  }
}
```

---

#### Example 5.2: Set External Withdrawal Guard (Replace)

**Prompt**: Set "community_fund" external withdrawal Guard list, replace existing list.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_withdraw_guard": {
      "op": "set",
      "guards": [
        {
          "guard": "new_withdraw_guard",
          "identifier": 2
        }
      ]
    }
  }
}
```

---

#### Example 5.3: Remove External Withdrawal Guard

**Prompt**: Remove external withdrawal Guard named "old_withdraw_guard" from "community_fund".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_withdraw_guard": {
      "op": "remove",
      "guards": ["old_withdraw_guard"]
    }
  }
}
```

---

#### Example 5.4: Clear External Withdrawal Guard

**Prompt**: Clear all external withdrawal Guards of "community_fund".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund"
    },
    "external_withdraw_guard": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 6: Receive and Manage Received Assets

### Feature Description
Process CoinWrapper objects received by Treasury, can deposit to balance or unwrap and send to Permission owner.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------|------|------|------|------|
| `operation_type` | string | Yes | Operation type | Fixed value "treasury" |
| `data.object.name` | string | Yes | Treasury name or ID | |
| `data.receive.recently` | boolean | No | Receive recently received | true |
| `data.receive.balance` | string | No | Receive specified balance object | |
| `data.owner_receive.recently` | boolean | No | Unwrap recently received | true |
| `data.owner_receive.objects` | array | No | Unwrap specified object list | |

### Important Notes

⚠️ **receive**: Deposit received CoinWrapper into Treasury balance.

⚠️ **owner_receive**: Unwrap CoinWrapper and send to Permission owner.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 6.1: Receive Recently Received CoinWrapper and Deposit to Balance

**Prompt**: Deposit recently received CoinWrapper of "team_treasury" into balance.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "team_treasury"
    },
    "receive": {
      "recently": true
    }
  }
}
```

---

#### Example 6.2: Unwrap CoinWrapper and Send to Owner

**Prompt**: Unwrap recently received CoinWrapper and other objects of "team_treasury", send to Permission owner.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "team_treasury"
    },
    "owner_receive": {
      "recently": true
    }
  }
}
```

---

## Sub-feature 7: Operate Existing Treasury (Combined Operations)

### Feature Description
Perform multiple operations on existing Treasury in a single transaction, such as simultaneous deposit and withdrawal, or simultaneous management of external Guards.

### Important Notes

⚠️ **Combined Operations**: Can combine multiple operations in the same transaction to improve efficiency.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---
