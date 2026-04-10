# Guard Component (🛡️ Programmable Validation Rules)

---

## Component Overview

The Guard component creates immutable programmable validation rules that return boolean results (pass/fail). Guards can define complex validation logic for use cases like service marketplaces, permission management, workflow templates, and more.

> **Note**: Use the `wowok_buildin_info` tool with 'guard instructions' to query all available operations.

---
## Query Instructions and On-chain Object Access

### Overview

Guards can access data from ANY on-chain object using `query` nodes! This is a powerful feature that allows you to build validation logic based on real-time on-chain state.

### Total Instructions

There are **400+ guard instructions** available, including:
- Logic operations (12)
- Calculation operations (8)
- Type conversion operations (11)
- Data and vector operations (20+)
- Context operations (3)
- Object query operations (400+ query instructions)

Use the `wowok_buildin_info` tool with `'guard instructions' to query the complete list of available operations.

### Queryable Object Types

Guards can query data from the following on-chain objects:

| Object Type | Description | Instructions | Common Use Cases |
|-------------|-------------|--------------|----------------|
| **Permission** | Access control management | 13 | Check if user is owner, admin, or has specific permissions |
| **Service** | Service marketplace listings | 40 | Check service details, pricing, availability |
| **Machine** | Workflow templates | 25 | Check workflow state, node definitions |
| **Progress** | Order progress tracking | 65 | Check order status, task completion, history records |
| **Repository** | On-chain database | 23 | Read stored data, policies |
| **Arbitration** | Dispute resolution | 13 | Check voting status, arbitration results |
| **Treasury** | Team funds management | 23 | Check balance, deposit/withdrawal rules |
| **Reward** | Incentive pools | 21 | Check reward pool balance, claim conditions |
| **Allocation** | Auto-distribution plans | 18 | Check distribution rules, recipients |
| **Demand** | Service requests | 21 | Check demand details, reward pools |
| **Order** | Order management | 25 | Check order status, payment info |
| **Payment** | Direct coin transfers | 15 | Check payment amount, time, recipients |
| **Contact** | IM management | 8 | Check messenger configurations |
| **Arb** | Arbitration voting and execution | 38 | Check voting records, execution state |
| **Discount** | Discount and promotion management | 9 | Check discount rates, validity periods |
| **EntityLinker** | Entity relationship management | 9 | Check entity links and associations |
| **EntityRegistrar** | Entity registration system | 11 | Check registered entities and their status |
| **Passport** | Verified credentials and identities | 16 | Check passport validity, verified attributes |
| **Proof** | Proof and verification records | 11 | Check proof existence, verification status |
| **Resource** | Publicly available on-chain data of the account | 5 | Check resource availability, ownership |

**Total: 409 query instructions across all object types**

### Query Node Syntax

```json
{
  "type": "query",
  "query": "query_name",
  "object": "object_name_or_id",
  "parameters": [ ... ]
}
```

---

## Guard Node Type Reference

### Logic Operation Nodes (Return Bool)

| Node Type | Description | Parameters |
|-----------|-------------|------------|
| `logic_and` | Logical AND | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_or` | Logical OR | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_not` | Logical NOT | `node: GuardNode` |
| `logic_equal` | Equality comparison | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_as_u256_greater` | Greater than | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_as_u256_lesser` | Less than | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_as_u256_greater_or_equal` | Greater than or equal | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_as_u256_lesser_or_equal` | Less than or equal | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_as_u256_equal` | Numeric equality | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_string_contains` | String contains | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_string_nocase_contains` | String contains (case-insensitive) | `nodes: GuardNode[]` (2-8 nodes) |
| `logic_string_nocase_equal` | String equality (case-insensitive) | `nodes: GuardNode[]` (2-8 nodes) |

### Calculation Nodes

| Node Type | Return Type | Description | Parameters |
|-----------|-------------|-------------|------------|
| `calc_number_add` | U256 | Addition | `nodes: GuardNode[]` |
| `calc_number_subtract` | U256 | Subtraction | `nodes: GuardNode[]` |
| `calc_number_multiply` | U256 | Multiplication | `nodes: GuardNode[]` |
| `calc_number_divide` | U256 | Division | `nodes: GuardNode[]` |
| `calc_number_mod` | U256 | Modulo | `nodes: GuardNode[]` |
| `calc_string_length` | U64 | String length | `node: GuardNode` |
| `calc_string_indexof` | U64 | Find substring | `nodeLeft, nodeRight, order` |
| `calc_string_nocase_indexof` | U64 | Find substring (case-insensitive) | `nodeLeft, nodeRight, order` |

### Type Conversion Nodes

| Node Type | Return Type | Description | Parameters |
|-----------|-------------|-------------|------------|
| `convert_number_address` | Address | Number to address | `node: GuardNode` |
| `convert_address_number` | U256 | Address to number | `node: GuardNode` |
| `convert_number_string` | String | Number to string | `node: GuardNode` |
| `convert_string_number` | U256 | String to number | `node: GuardNode` |
| `convert_safe_u8` | U8 | Safe convert to U8 | `node: GuardNode` |
| `convert_safe_u16` | U16 | Safe convert to U16 | `node: GuardNode` |
| `convert_safe_u32` | U32 | Safe convert to U32 | `node: GuardNode` |
| `convert_safe_u64` | U64 | Safe convert to U64 | `node: GuardNode` |
| `convert_safe_u128` | U128 | Safe convert to U128 | `node: GuardNode` |
| `convert_safe_u256` | U256 | Safe convert to U256 | `node: GuardNode` |

### Data Nodes

| Node Type | Return Type | Description | Parameters |
|-----------|-------------|-------------|------------|
| `identifier` | Depends on table item | Reference data from table | `identifier: number` (0-255) |
| `query` | Depends on query | **Powerful feature!** Query on-chain object data. Use this to access real-time state from Permission, Service, Machine, Treasury, etc. | `query: string`, `object: string`, `parameters: GuardNode[]` |
| `value_type` | U8 | Get value type of a node | `node: GuardNode` |

#### Query Node Examples
The `query` node is your gateway to on-chain data! Some common query patterns:
- `permission.owner`: Get Permission object owner (Address)
- `permission.admin has`: Check if user has admin permission (Bool)
- `permission.entity.perm has`: Check if user has specific permission (Bool)
- `treasury.balance`: Get Treasury balance (U256)
- `service.price`: Get Service price (U256)

### Context Nodes

| Node Type | Return Type | Description | Parameters |
|-----------|-------------|-------------|------------|
| `context` | Depends on context | System context information | `context: "Signer" \| "Clock" \| "Guard"` |

**Important**: Context nodes return non-bool types! **NEVER use them directly in logic gates like logic_and or logic_or.**
- `Signer`: Address type (transaction sender)
- `Clock`: U64 type (timestamp in milliseconds)
- `Guard`: Address type (current Guard object ID)

**Correct Usage**:
```json
{
  "type": "logic_equal",
  "nodes": [
    { "type": "context", "context": "Signer" },
    { "type": "identifier", "identifier": 0 }
  ]
}
```

Use context nodes as inputs to calculations or comparisons, not directly in logic gates.

---
## Complete Tool Call Structure

Guard operations use the following top-level structure:

```json
{
  "operation_type": "guard",
  "data": { ... },    // Guard data definition
  "env": { ... }       // Execution environment (optional)
}
```

---

## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `identifierMin` | 0 | Minimum identifier value |
| `identifierMax` | 255 | Maximum identifier value |
| `nameMaxLength` | 64 | Maximum name length (BCS characters) |
| `maxMultiOperands` | 8 | Maximum operands for multi-operand nodes |

---

## Feature Tree

```
guard (Guard Object)
├── operation_type: "guard" (fixed value)
├── data (Guard data definition)
│   ├── namedNew (optional, new Guard naming)
│   │   ├── name (optional, Guard name)
│   │   ├── tags (optional, tag list)
│   │   ├── onChain (optional, whether to publish on-chain)
│   │   └── replaceExistName (optional, whether to replace existing name)
│   ├── description (optional, Guard description)
│   ├── table (optional, data table)
│   │   └── GuardTableItem[] (table item array)
│   │       ├── identifier (identifier, 0-255)
│   │       ├── b_submission (whether user submission is required)
│   │       ├── value_type (value type)
│   │       ├── value (optional, actual value)
│   │       └── name (optional, data name)
│   ├── root (root node definition)
│   │   ├── type (discriminator)
│   │   ├── type: "node" (direct node)
│   │   │   └── node (GuardNode computation tree)
│   │   └── type: "file" (file reference)
│   │       ├── file_path (file path)
│   │       └── format (optional, file format, default json)
│   └── rely (optional, dependent Guards)
│       ├── guards (dependent Guard ID/name list)
│       └── logic_or (optional, whether to use OR logic)
└── env (optional, execution environment)
    ├── account (optional, use specified account)
    ├── permission_guard (optional, permission Guard list)
    ├── no_cache (optional, whether to disable cache)
    ├── network (optional, network selection)
    └── referrer (optional, referrer ID)
```

---

## Sub-feature 1: Create Guard with Direct Nodes (type: "node")

### Feature Description
Create a Guard by directly providing a GuardNode computation tree through `root.type: "node"`, without requiring an external file.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `operation_type` | string | Yes | Operation type | Fixed value "guard" |
| `data.namedNew.name` | string | No | Guard name | Max 64 BCS characters, cannot start with '0x' |
| `data.namedNew.tags` | array | No | Tag list | String array |
| `data.namedNew.onChain` | boolean | No | Whether to publish on-chain | true=public; false/undefined=local only (default) |
| `data.namedNew.replaceExistName` | boolean | No | Whether to replace existing name | true=force replace; false=error if name exists (default) |
| `data.description` | string | No | Guard description | Maximum length limit |
| `data.table` | array | Yes | Data table | GuardTableItem array (cannot be empty) |
| `data.table[].identifier` | number | Yes | Identifier | Integer between 0-255 |
| `data.table[].b_submission` | boolean | Yes | Whether user submission is required | true=user submits; false=fixed value |
| `data.table[].value_type` | enum | Yes | Value type | Bool/Address/String/U8/U16/U32/U64/U128/U256/etc |
| `data.table[].value` | any | No | Actual value | Provide when b_submission=false |
| `data.table[].name` | string | No | Data name | Default is empty string |
| `data.root.type` | string | Yes | Root node type | Fixed value "node" |
| `data.root.node` | object | Yes | GuardNode computation tree | Must return Bool value |
| `data.rely.guards` | array | No | Dependent Guard list | Guard ID or name array |
| `data.rely.logic_or` | boolean | No | Dependency logic | true=OR; false=AND (default) |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.permission_guard` | array | No | Permission Guard list | Guard ID array |
| `env.no_cache` | boolean | No | Whether to disable cache | true=disable; false=enable |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |
| `env.referrer` | string | No | Referrer ID | Account name or address |

### Important Notes

⚠️ **Guards are immutable once created!** Ensure your validation logic is correct before creating.

⚠️ **Root must return Bool type**, otherwise validation will fail.

⚠️ **Identifier range is 0-255**, values outside this range will cause errors.

⚠️ **Dependent Guards must already exist**, otherwise creation will fail.

⚠️ **When using root.type='file'**, fields defined in the schema (namedNew, description, table, rely) will override the file content.

⚠️ **All data must be defined through table**, root.node can only use `identifier` to reference data in table, cannot use `value` nodes.

⚠️ **Context nodes do NOT return Bool!** Context nodes return:
- `Signer`: Address type - Current signer address for the transaction
- `Clock`: U64 type (timestamp)  - Current on-chain timestamp
- `Guard`: Address type - Current guard address being verified

Use context nodes as inputs to other operations, not directly in logic gates.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

#### Example 1.1: Minimal Guard (root only, no naming)

**Prompt**: Create a simple Guard that verifies if an age is at least 18. The age will be provided by the user, and the minimum age is fixed at 18. Do not give the Guard a name.

```json
{
  "operation_type": "guard",
  "data": {
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "age"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "18",
        "name": "min_age"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      }
    }
  }
}
```

---

#### Example 1.2: Complete Guard with Name, Tags, Description and Public On-chain

**Prompt**: Create an age verification Guard that checks if age is at least 18. Name this Guard "public_age_check", add tags "age", "verification", and "public", add a description, and publish it publicly on-chain so everyone can reference it.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "public_age_check",
      "tags": ["age", "verification", "public"],
      "onChain": true
    },
    "description": "Public age verification Guard - validates age is at least 18",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "age"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "18",
        "name": "min_age"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      }
    }
  }
}
```

---

#### Example 1.3: Order Validation Guard

**Prompt**: Create an order validation Guard that checks two conditions: quantity must be greater than 0, and quantity must be less than or equal to available stock. Name this Guard "order_validation", add tags "order", "validation", and "ecommerce", and add a description explaining its purpose.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "order_validation",
      "tags": ["order", "validation", "ecommerce"]
    },
    "description": "Order validation Guard - validates quantity is between 0 and available stock",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "quantity"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "0",
        "name": "min_quantity"
      },
      {
        "identifier": 2,
        "b_submission": true,
        "value_type": "U64",
        "name": "stock"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_as_u256_greater",
            "nodes": [
              { "type": "identifier", "identifier": 0 },
              { "type": "identifier", "identifier": 1 }
            ]
          },
          {
            "type": "logic_as_u256_lesser_or_equal",
            "nodes": [
              { "type": "identifier", "identifier": 0 },
              { "type": "identifier", "identifier": 2 }
            ]
          }
        ]
      }
    }
  }
}
```

---

#### Example 1.4: Force Replace Existing Name

**Prompt**: Update the "order_validation" Guard to change the minimum quantity from 0 to 1. Since "order_validation" already exists, set replaceExistName to true to force the name replacement.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "order_validation",
      "replaceExistName": true
    },
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "quantity"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "1",
        "name": "min_quantity"
      },
      {
        "identifier": 2,
        "b_submission": true,
        "value_type": "U64",
        "name": "stock"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_as_u256_greater",
            "nodes": [
              { "type": "identifier", "identifier": 0 },
              { "type": "identifier", "identifier": 1 }
            ]
          },
          {
            "type": "logic_as_u256_lesser_or_equal",
            "nodes": [
              { "type": "identifier", "identifier": 0 },
              { "type": "identifier", "identifier": 2 }
            ]
          }
        ]
      }
    }
  }
}
```

---

#### Example 1.5: Guard with Dependencies (AND Logic)

**Prompt**: Create a composite Guard named "composite_guard" that depends on both "order_validation" and "public_age_check". Both dependent Guards must pass for this Guard to pass (use AND logic). Also verify that age is greater than or equal to 18.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "composite_guard"
    },
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "age"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "18",
        "name": "min_age"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      }
    },
    "rely": {
      "guards": ["order_validation", "public_age_check"],
      "logic_or": false
    }
  }
}
```

---

#### Example 1.6: Guard with Dependencies (OR Logic)

**Prompt**: Create a flexible Guard named "flexible_guard" that depends on either "order_validation" or "public_age_check". Only one of the dependent Guards needs to pass for this Guard to pass (use OR logic). Also verify that a dummy value equals 0.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "flexible_guard"
    },
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "dummy_value"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "0",
        "name": "zero"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      }
    },
    "rely": {
      "guards": ["order_validation", "public_age_check"],
      "logic_or": true
    }
  }
}
```

---

#### Example 1.7: Complete Parameter Guard

**Prompt**: Create a comprehensive Guard named "full_guard" with tags "complete" and "example". This Guard should verify two things: email contains "@" symbol, and age is >= 18. It should also depend on "public_age_check". Specify the network as testnet and use the default account.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "full_guard",
      "tags": ["complete", "example"],
      "onChain": false,
      "replaceExistName": false
    },
    "description": "Complete parameter example Guard",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "String",
        "name": "email"
      },
      {
        "identifier": 1,
        "b_submission": true,
        "value_type": "U64",
        "name": "age"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "@",
        "name": "at_symbol"
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "U64",
        "value": "18",
        "name": "min_age"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_string_contains",
            "nodes": [
              { "type": "identifier", "identifier": 0 },
              { "type": "identifier", "identifier": 2 }
            ]
          },
          {
            "type": "logic_as_u256_greater_or_equal",
            "nodes": [
              { "type": "identifier", "identifier": 1 },
              { "type": "identifier", "identifier": 3 }
            ]
          }
        ]
      }
    },
    "rely": {
      "guards": ["public_age_check"],
      "logic_or": false
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

#### Example 1.8: Using Context Nodes Correctly

**Prompt**: Create a Guard that demonstrates the correct usage of context nodes. This Guard verifies that the user age is at least 18. The context nodes (Signer, Clock, Guard) are non-boolean and cannot be used directly in logic_and operations. They must be used in calculations or comparisons first. Name this Guard "context_demo_guard".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "context_demo_guard"
    },
    "description": "Demonstrates correct context node usage - context nodes are non-boolean",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "user_age"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "18",
        "name": "min_age"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      }
    }
  }
}
```

---

#### Example 1.9: Using Query Nodes

**Prompt**: Create a Guard that demonstrates logic operations including AND, OR, NOT, comparisons, and string operations. Name it "logic_demo".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "logic_demo"
    },
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "user_age"
      },
      {
        "identifier": 1,
        "b_submission": true,
        "value_type": "U64",
        "name": "user_score"
      },
      {
        "identifier": 2,
        "b_submission": true,
        "value_type": "String",
        "name": "user_email"
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "U64",
        "value": "18",
        "name": "min_age"
      },
      {
        "identifier": 4,
        "b_submission": false,
        "value_type": "U64",
        "value": "70",
        "name": "passing_score"
      },
      {
        "identifier": 5,
        "b_submission": false,
        "value_type": "String",
        "value": "@example.com",
        "name": "allowed_domain"
      },
      {
        "identifier": 6,
        "b_submission": false,
        "value_type": "Bool",
        "value": "true",
        "name": "always_true"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_as_u256_greater_or_equal",
            "nodes": [
              { "type": "identifier", "identifier": 0 },
              { "type": "identifier", "identifier": 3 }
            ]
          },
          {
            "type": "logic_as_u256_greater_or_equal",
            "nodes": [
              { "type": "identifier", "identifier": 1 },
              { "type": "identifier", "identifier": 4 }
            ]
          },
          {
            "type": "logic_string_contains",
            "nodes": [
              { "type": "identifier", "identifier": 2 },
              { "type": "identifier", "identifier": 5 }
            ]
          },
          { "type": "identifier", "identifier": 6 }
        ]
      }
    }
  }
}
```

---

#### Example 1.10: Query Permission Object - Check Owner

**Prompt**: Create a Guard that queries a Permission object to verify if the current signer is the owner of the Permission. Name it "permission_owner_check". This demonstrates how to use query nodes to access on-chain object data.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "permission_owner_check"
    },
    "description": "Checks if signer is Permission owner using query node",
    "table": [
      {
        "identifier": 0,
        "b_submission": false,
        "value_type": "String",
        "value": "my_permission_object",
        "name": "permission_object_name"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          { "type": "context", "context": "Signer" },
          {
            "type": "query",
            "query": "permission.owner",
            "object": "my_permission_object",
            "parameters": []
          }
        ]
      }
    }
  }
}
```

---

#### Example 1.11: Query Permission Object - Check Admin Permission

**Prompt**: Create a Guard that verifies if a specific user has admin permissions on a Permission object. Name it "admin_permission_check". This demonstrates querying permission.admin_has to check for admin rights.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "admin_permission_check"
    },
    "description": "Checks if user has admin permission using query node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "user_to_check"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "my_permission_object",
        "name": "permission_object_name"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "query",
        "query": "permission.admin has",
        "object": "my_permission_object",
        "parameters": [
          { "type": "identifier", "identifier": 0 }
        ]
      }
    }
  }
}
```

---

#### Example 1.12: Query Permission Object - Check Specific Permission

**Prompt**: Create a Guard that verifies if a user has a specific permission (e.g., permission index 300 for service.new). Name it "specific_permission_check". This demonstrates querying permission.entity.perm_has with a permission index.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "specific_permission_check"
    },
    "description": "Checks if user has specific permission using query node",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "user_to_check"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U16",
        "value": "300",
        "name": "permission_index"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "my_permission_object",
        "name": "permission_object_name"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "query",
        "query": "permission.entity.perm has",
        "object": "my_permission_object",
        "parameters": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      }
    }
  }
}
```

---

## Sub-feature 2: Create Guard from File (type: "file")

### Feature Description
Load a Guard definition from a JSON or Markdown file through `root.type: "file"`. The file can contain all Guard fields, and fields defined in the schema will override the file content.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `operation_type` | string | Yes | Operation type | Fixed value "guard" |
| `data.namedNew` | object | No | New Guard naming | Will override namedNew in file |
| `data.description` | string | No | Guard description | Will override description in file |
| `data.table` | array | No | Data table | Will override table in file |
| `data.root.type` | string | Yes | Root node type | Fixed value "file" |
| `data.root.file_path` | string | Yes | File path | JSON or Markdown file path |
| `data.root.format` | enum | No | File format | "json" (default) or "markdown" |
| `data.rely` | object | No | Dependent Guards | Will override rely in file |
| `env` | object | No | Execution environment | Same as above |

### Important Notes

⚠️ **When using type: "file"**, fields defined in the schema (namedNew, description, table, rely) will override corresponding fields in the file.

⚠️ **File paths**: Both absolute and relative paths are supported.

⚠️ **File format**: Default is "json", Markdown files need to explicitly specify format="markdown".

⚠️ **All data must be defined through table**, root.node can only use `identifier` to reference data in table.

### Return Result

Returns transaction block information (WowTransactionBlockSchema).

---

### Examples

First, let's create a sample JSON file that we'll use in the examples.

**File: guard-definition.json**
```json
{
  "description": "Guard loaded from file",
  "table": [
    {
      "identifier": 0,
      "b_submission": true,
      "value_type": "U64",
      "name": "amount"
    },
    {
      "identifier": 1,
      "b_submission": false,
      "value_type": "U64",
      "value": "100",
      "name": "min_amount"
    }
  ],
  "root": {
    "type": "logic_as_u256_greater_or_equal",
    "nodes": [
      { "type": "identifier", "identifier": 0 },
      { "type": "identifier", "identifier": 1 }
    ]
  }
}
```

---

#### Example 2.1: Create from JSON File (No Override)

**Prompt**: Create a Guard using the definition from guard-definition.json. Use the file exactly as it is without overriding any fields.

```json
{
  "operation_type": "guard",
  "data": {
    "root": {
      "type": "file",
      "file_path": "...",
      "format": "json"
    }
  }
}
```

---

#### Example 2.2: Create from JSON File and Override namedNew

**Prompt**: Create a Guard from guard-definition.json, but give it a custom name "file_based_guard" and add tags "file" and "json".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "file_based_guard",
      "tags": ["file", "json"]
    },
    "root": {
      "type": "file",
      "file_path": "..."
    }
  }
}
```

---

#### Example 2.3: Create from JSON File and Override Multiple Fields

**Prompt**: Create a Guard from guard-definition.json, but override the description, table, and rely fields. Name it "custom_guard", change the minimum amount to 50, and make it depend on "order_validation".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "custom_guard"
    },
    "description": "Overridden description",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "custom_amount"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "50",
        "name": "custom_min"
      }
    ],
    "root": {
      "type": "file",
      "file_path": "..."
    },
    "rely": {
      "guards": ["order_validation"],
      "logic_or": false
    }
  }
}
```

---

#### Example 2.4: Using Absolute Path

**Prompt**: Create a Guard from guard-definition.json using an absolute file path. Name it "absolute_path_guard" and specify testnet network.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "absolute_path_guard"
    },
    "root": {
      "type": "file",
      "file_path": "...",
      "format": "json"
    }
  },
  "env": {
    "network": "testnet"
  }
}
```

---

#### Example 2.5: Complete File Loading with All Overrides

**Prompt**: Create a Guard from guard-definition.json with comprehensive overrides. Name it "full_file_guard" with tags, override description, provide a custom table, and add a dependency on "order_validation".

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "full_file_guard",
      "tags": ["file", "complete", "example"],
      "onChain": false
    },
    "description": "Fully overridden file Guard",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "String",
        "name": "username"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "3",
        "name": "min_length"
      }
    ],
    "root": {
      "type": "file",
      "file_path": "...",
      "format": "json"
    },
    "rely": {
      "guards": ["order_validation"],
      "logic_or": false
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

## Sub-feature 3: Export Guard to File (guard2file)

### Feature Description
Export an existing Guard's definition from the blockchain to a local JSON or Markdown file. This allows you to:
1. Backup your Guard definitions
2. Edit Guard definitions locally
3. Create new Guards based on existing ones
4. Share Guard definitions with others

**Pro Tip**: Using existing Guards as templates is a powerful way to build complex validation logic quickly! You don't have to start from scratch every time. Export an existing Guard, modify it to fit your needs, then create a new Guard from the modified file.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guard` | string | Yes | Guard object ID or name to export |
| `file_path` | string | Yes | Output file path (absolute or relative) |
| `format` | enum | No | Output format: "json" (default) or "markdown" |
| `env` | object | No | Execution environment |

### Return Result

Returns success status with file path, format, and Guard object information.

---

### Examples

#### Example 3.1: Export Guard to JSON File

**Prompt**: Export the "order_validation" Guard to a JSON file named "order_validation_export.json" so I can view and edit its definition.

```json
{
  "guard": "order_validation",
  "file_path": "...",
  "format": "json"
}
```

---

#### Example 3.2: Export Guard to Markdown File

**Prompt**: Export the "logic_demo" Guard to a Markdown file for documentation purposes. Use Markdown format for better readability.

```json
{
  "guard": "logic_demo",
  "file_path": "...",
  "format": "markdown"
}
```

---

#### Example 3.3: Export Using Guard ID

**Prompt**: Export a Guard using its object ID instead of name. Save it as "guard_by_id.json".

```json
{
  "guard": "0xfa42eda64db63394b0ccf3ded7d9cb4103d9ae70ee81fa4f4e7ebbc8c8c986ef",
  "file_path": "...",
  "format": "json"
}
```

---

#### Example 3.4: Export with Network Specification

**Prompt**: Export the "public_age_check" Guard from testnet network. Specify the network explicitly.

```json
{
  "guard": "public_age_check",
  "file_path": "...",
  "format": "json",
  "env": {
    "network": "testnet"
  }
}
```

---

## Sub-feature 4: Modify and Recreate Guard from Exported File

### Workflow: Build New Guards from Existing Ones

This is one of the most powerful Guard patterns! Here's how to leverage existing Guards:

1. **Export** an existing Guard to a file using `guard2file`
2. **Edit** the file to modify the logic
3. **Create** a new Guard from the modified file

This workflow saves you time and ensures consistency across your validation logic.

---

### Complete Workflow Example

Let's walk through a complete example of creating a new Guard based on an existing one.

#### Step 1: Export the Existing Guard

First, let's export the "order_validation" Guard:

```json
{
  "guard": "order_validation",
  "file_path": "...",
  "format": "json"
}
```

#### Step 2: Edit the Exported File

After exporting, you'll have a file like this. Let's modify it to create a wholesale order check:

**File: order_validation_template.json (modified)**
```json
{
  "description": "Wholesale order verification - validates quantity is between 100 and 1000",
  "table": [
    {
      "identifier": 0,
      "b_submission": true,
      "value_type": "U64",
      "name": "quantity"
    },
    {
      "identifier": 1,
      "b_submission": false,
      "value_type": "U64",
      "value": "100",
      "name": "min_wholesale_quantity"
    },
    {
      "identifier": 2,
      "b_submission": true,
      "value_type": "U64",
      "name": "stock"
    },
    {
      "identifier": 3,
      "b_submission": false,
      "value_type": "U64",
      "value": "1000",
      "name": "max_wholesale_quantity"
    }
  ],
  "root": {
    "type": "logic_and",
    "nodes": [
      {
        "type": "logic_as_u256_greater_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 1 }
        ]
      },
      {
        "type": "logic_as_u256_lesser_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 3 }
        ]
      },
      {
        "type": "logic_as_u256_lesser_or_equal",
        "nodes": [
          { "type": "identifier", "identifier": 0 },
          { "type": "identifier", "identifier": 2 }
        ]
      }
    ]
  }
}
```

#### Step 3: Create New Guard from Modified File

**Prompt**: Create a new Guard named "wholesale_order_check" from the modified template file. This Guard will verify that quantity is between 100 and 1000 and not exceed available stock.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "wholesale_order_check",
      "tags": ["wholesale", "order", "verification"]
    },
    "root": {
      "type": "file",
      "file_path": "...",
      "format": "json"
    }
  }
}
```

---

### Advanced: Create Multiple Variations

You can create multiple Guards from the same base template by overriding different fields:

#### Example 4.1: Create Premium Check from Template

**Prompt**: Using the same order_validation_template.json, create a "premium_order_check" Guard that verifies quantity is at least 500. Override the table and root logic.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "premium_order_check",
      "tags": ["premium", "order", "verification"]
    },
    "description": "Premium order verification - validates quantity is at least 500",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "quantity"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "500",
        "name": "min_premium_quantity"
      }
    ],
    "root": {
      "type": "file",
      "file_path": "...",
      "format": "json"
    }
  }
}
```

---

#### Example 4.2: Create Retail Check with Dependency

**Prompt**: Create a "retail_order_check" Guard based on the template, but also add a dependency on "order_validation" for extra validation.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "retail_order_check",
      "tags": ["retail", "order", "composite"]
    },
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "U64",
        "name": "quantity"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": "1",
        "name": "min_retail_quantity"
      },
      {
        "identifier": 2,
        "b_submission": true,
        "value_type": "U64",
        "name": "stock"
      }
    ],
    "root": {
      "type": "file",
      "file_path": "...",
      "format": "json"
    },
    "rely": {
      "guards": ["order_validation"],
      "logic_or": false
    }
  }
}
```

---


## Important Tips

⚠️ **Guards are immutable once created!** Ensure your validation logic is correct before creating.

⚠️ **Root must return Bool type**, otherwise validation will fail.

⚠️ **Identifier range is 0-255**, values outside this range will cause errors.

⚠️ **Dependent Guards must already exist**, otherwise creation will fail.

⚠️ **When using root.type='file'**, fields defined in the schema will override the file content.

⚠️ **When namedNew.onChain=true**, the name will be publicly visible on-chain for everyone to see.

⚠️ **When namedNew.replaceExistName=true**, it will force unbind the name from the original object, potentially breaking existing references.

⚠️ **All data must be defined through table**, root.node can only use `identifier` to reference data in table, cannot use `value` nodes.

⚠️ **Context nodes do NOT return Bool!** Use them as inputs to other operations.

💡 **Pro Tip**: Use `guard2file` to export existing Guards as templates! This is the fastest way to build new Guards - export, modify, and recreate. You can build an entire library of reusable validation logic this way.

---

## Related Components

- **Permission**: Access control management
- **Service**: Service marketplace
- **Machine**: Workflow templates
- **Progress**: Order progress tracking
- **Passport**: Verified credentials
