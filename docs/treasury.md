
# Treasury Component (💰 Team Fund Vault Management)

---

## Component Overview

The Treasury component is used to create and manage team fund vaults, set deposit/withdrawal rules, etc. Treasury supports two operation modes: permission management through Permission objects, or verification through external Guard objects.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Create Treasury** | Establish new fund vault with access controls | Set up team budget vaults, project fund pools | Creates secure on-chain treasury with permission management |
| **Deposit Funds** | Add assets to Treasury balance | Contribute to team funds, deposit project budgets | Fills the treasury balance pool |
| **Withdraw Funds** | Remove assets from Treasury balance | Pay expenses, distribute bonuses, allocate funds | Releases funds from treasury to recipients |
| **Manage Deposit Guards** | Configure external Guard verification for deposits | Allow public deposits, controlled external contributions | Enables permissionless deposits with Guard validation |
| **Manage Withdrawal Guards** | Configure external Guard verification for withdrawals | Enable automated payouts, controlled external withdrawals | Enables permissionless withdrawals with Guard validation |
| **Receive Assets** | Process received CoinWrapper objects | Deposit incoming payments, collect fees | Automatically adds received assets to treasury balance |
| **Owner Receive** | Unwrap and send received assets to owner | Forward received tokens, process incoming payments | Delivers received assets to permission owner |

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

## Schema Tree

```
treasury (Treasury Object)
├── operation_type: "treasury" (fixed value)
├── data (Treasury data definition)
│   ├── object (object definition, required)
│   │   ├── name|id (reference existing object)
│   │   └── name|tags|type_parameter|permission (create new object)
│   ├── description (description, optional)
│   ├── receive (receive CoinWrapper, optional)
│   ├── deposit (deposit, optional)
│   │   ├── coin (asset, required)
│   │   ├── by_external_deposit_guard (optional)
│   │   ├── payment_info (required)
│   │   └── namedNewPayment (optional)
│   ├── withdraw (withdrawal, optional)
│   │   ├── amount (amount, required)
│   │   ├── recipient (recipient, required)
│   │   ├── payment_info (required)
│   │   └── namedNewPayment (optional)
│   ├── external_deposit_guard (optional)
│   │   └── op (add|set|remove|clear)
│   ├── external_withdraw_guard (optional)
│   │   └── op (add|set|remove|clear)
│   ├── owner_receive (optional)
│   └── um (Contact object, optional)
├── env (optional, execution environment)
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
| `data.object` | object or string | Yes | Object definition | TypedPermissionObject |
| `data.description` | string | No | Treasury description | Max 65535 characters |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **Permission Object**: Treasury requires Permission to manage permissions, can create new or reference existing.

⚠️ **External Guard**: Can set external verification rules through `external_deposit_guard` and `external_withdraw_guard`, allowing non-permission users to deposit/withdraw through Guard verification.

---

### Examples

#### Example 1.1: Create Minimal Treasury (name only)

**Prompt**: Create a Treasury named "team_treasury", use default account and network, no other configuration specified.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "team_treasury"
    }
  }
}
```

---

#### Example 1.2: Create Treasury with Tags

**Prompt**: Create a Treasury named "project_fund", add tags "project", "finance", and description "Project fund treasury for managing team finances".

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "project_fund",
      "tags": ["project", "finance"]
    },
    "description": "Project fund treasury for managing team finances"
  }
}
```

---

#### Example 1.3: Create Treasury and Set External Guards

**Prompt**: Create a Treasury named "community_fund", set external deposit Guard and external withdrawal Guard, allowing deposit/withdrawal operations through Guard verification.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "name": "community_fund",
      "tags": ["community", "fund"]
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
| `data.object` | string | Yes | Treasury name or ID | |
| `data.deposit.coin` | object | Yes | Asset to deposit | { balance: number } or { coin: string } |
| `data.deposit.by_external_deposit_guard` | string | No | External Guard verification | Guard object ID or name |
| `data.deposit.payment_info` | object | Yes | Payment information | |
| `data.deposit.namedNewPayment` | object | No | Create new Payment object | |

### Important Notes

⚠️ **Two Deposit Methods**: 
- Deposit through Permission (default, requires permission)
- Deposit through external Guard verification (use `by_external_deposit_guard`)

---

### Examples

#### Example 2.1: Deposit through Permission

**Prompt**: Deposit 100 WOW into "team_treasury", operate through Permission.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "team_treasury",
    "deposit": {
      "coin": {
        "balance": 100000000000
      },
      "payment_info": {
        "remark": "treasury operation",
        "index": 1
      }
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
    "object": "community_fund",
    "deposit": {
      "coin": {
        "balance": 50000000000
      },
      "by_external_deposit_guard": "deposit_guard",
      "payment_info": {
        "remark": "treasury operation",
        "index": 1
      },
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
| `data.object` | string | Yes | Treasury name or ID | |
| `data.withdraw.amount` | object | Yes | Withdrawal amount | { fixed: number } or { by_external_withdraw_guard: string } |
| `data.withdraw.recipient` | object | Yes | Recipient | AccountOrMark_Address object |
| `data.withdraw.payment_info` | object | Yes | Payment information | |
| `data.withdraw.namedNewPayment` | object | No | Create new Payment object | |

### Important Notes

⚠️ **Two Withdrawal Methods**: 
- Fixed amount withdrawal: Set through `amount.fixed`, must go through Permission
- Guard verification withdrawal: Set through `amount.by_external_withdraw_guard`, amount obtained from Guard table data

---

### Examples

#### Example 3.1: Fixed Amount Withdrawal through Permission

**Prompt**: Withdraw 50 WOW from "team_treasury", through Permission, send to alice.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "team_treasury",
    "withdraw": {
      "amount": {
        "fixed": 50000000000
      },
      "recipient": {
        "name_or_address": "alice"
      },
      "payment_info": {
        "remark": "treasury operation",
        "index": 1
      }
    }
  }
}
```

---

#### Example 3.2: Withdrawal through External Guard

**Prompt**: Withdraw from "community_fund", verify through external Guard "withdraw_guard", send to bob, simultaneously create Payment object.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "community_fund",
    "withdraw": {
      "amount": {
        "by_external_withdraw_guard": "withdraw_guard"
      },
      "recipient": {
        "name_or_address": "bob"
      },
      "payment_info": {
        "remark": "treasury operation",
        "index": 1
      },
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
| `data.object` | string | Yes | Treasury name or ID | |
| `data.external_deposit_guard.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.external_deposit_guard.guards` | array | No | Guard list | Required for add/set/remove |

### Important Notes

⚠️ **External Guard Function**: Allows non-Permission users to deposit through Guard verification.

⚠️ **identifier Parameter**: Corresponds to data index in Guard table, its value is depositable amount, null means unlimited.

---

### Examples

#### Example 4.1: Add External Deposit Guard

**Prompt**: Add external deposit Guard "public_deposit_guard" to "community_fund", identifier is 0, meaning depositable amount obtained from Guard table index 0.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "community_fund",
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
    "object": "community_fund",
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
    "object": "community_fund",
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
    "object": "community_fund",
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
    "object": "community_fund",
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
| `data.object` | string | Yes | Treasury name or ID | |
| `data.external_withdraw_guard.op` | string | Yes | Operation type | "add", "set", "remove", "clear" |
| `data.external_withdraw_guard.guards` | array | No | Guard list | Required for add/set/remove |

### Important Notes

⚠️ **External Guard Function**: Allows non-Permission users to withdraw through Guard verification.

⚠️ **identifier Parameter**: Corresponds to data index in Guard table, its value is withdrawable amount.

---

### Examples

#### Example 5.1: Add External Withdrawal Guard

**Prompt**: Add external withdrawal Guard "approved_withdraw_guard" to "community_fund", identifier is 1, meaning withdrawable amount obtained from Guard table index 1.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "community_fund",
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
    "object": "community_fund",
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
    "object": "community_fund",
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
    "object": "community_fund",
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
| `data.object` | string | Yes | Treasury name or ID | |
| `data.receive` | string or object | No | Receive CoinWrapper | "recently" or ReceivedBalance object |
| `data.owner_receive` | string or object | No | Unwrap and send to owner | "recently" or ReceivedObjects object |

### Important Notes

⚠️ **receive**: Deposit received CoinWrapper into Treasury balance.

⚠️ **owner_receive**: Unwrap CoinWrapper and send to Permission owner.

---

### Examples

#### Example 6.1: Receive Recently Received CoinWrapper and Deposit to Balance

**Prompt**: Deposit recently received CoinWrapper of "team_treasury" into balance.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "team_treasury",
    "receive": "recently"
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
    "object": "team_treasury",
    "owner_receive": "recently"
  }
}
```

---

## Sub-feature 7: Operate Existing Treasury (Combined Operations)

### Feature Description

Perform multiple operations on existing Treasury in a single transaction, such as simultaneous deposit and withdrawal, or simultaneous management of external Guards.

### Important Notes

⚠️ **Combined Operations**: Can combine multiple operations in the same transaction to improve efficiency.

---

### Example

#### Example 7.1: Combined Deposit and Withdrawal

**Prompt**: For "team_treasury": 1) Deposit 200 WOW, 2) Withdraw 50 WOW to alice, 3) Simultaneously process received assets.

```json
{
  "operation_type": "treasury",
  "data": {
    "object": "team_treasury",
    "receive": "recently",
    "deposit": {
      "coin": {
        "balance": 200000000000
      },
      "payment_info": {
        "remark": "treasury operation",
        "index": 1
      }
    },
    "withdraw": {
      "amount": {
        "fixed": 50000000000
      },
      "recipient": {
        "name_or_address": "alice"
      },
      "payment_info": {
        "remark": "treasury operation",
        "index": 1
      }
    }
  }
}
```

---

## Important Notes

⚠️ **Treasury operations require Permission or external Guard verification.**

⚠️ **External Guard verification allows permissionless operations with validation rules.**

---

## Related Components

- **Permission**: Access control management
- **Guard**: Validation rules for external operations
- **Payment**: Payment tracking and management
- **Allocation**: Auto-distribution of treasury funds
- **Reward**: Incentive pools linked to treasury

