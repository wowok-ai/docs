# Guard Component (🛡️ Programmable Validation Rules)

---

## Component Overview

The Guard component creates immutable programmable validation rules that return boolean results (pass/fail). Guards can define complex validation logic for use cases like service marketplaces, permission management, workflow templates, and more.

**Note**: Use the `guard2file` tool (see [Sub-feature 3](#sub-feature-3-export-guard-to-file-guard2file)) to export existing Guard definitions from the blockchain, then use [Sub-feature 2](#sub-feature-2-create-guard-from-file-type-file) to quickly build new trust verification Guard objects. Use `gen_passport` (see [Sub-feature 4](#sub-feature-4-generate-verified-passport-gen_passport)) to generate verifiable credentials for Messenger stranger verification. Use the `wowok_buildin_info` tool with 'guard instructions' to query all available operations.

---
## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|--------------|
| **Create Guard with Direct Nodes** | Create a Guard by directly providing a GuardNode computation tree through `root.type: "node"` | Quick creation of simple to moderately complex Guards; no external file needed | Core function for Guard creation; enables immediate validation logic definition |
| **Create Guard from File** | Load a Guard definition from a JSON or Markdown file through `root.type: "file"` | Reusing existing Guard definitions; editing Guards in external files; version control of Guard logic | Enables Guard templates and reusability; simplifies complex Guard management |
| **Name Guard** | Assign a name and optional tags to a new Guard using `namedNew` | Identifying Guards by meaningful names; categorizing Guards with tags; sharing Guards publicly | Essential for Guard discoverability and organization; enables public on-chain identities |
| **Set Guard Description** | Add a description to explain the Guard's purpose | Documenting what the Guard validates; helping other users understand Guard usage | Improves Guard usability and maintainability |
| **Define Data Table** | Define the data table that the Guard uses for validation | Specifying user-submitted data and fixed constants for validation logic | Foundation of Guard validation; all data must be defined here |
| **Set Dependencies** | Define Guards that this Guard depends on using `rely` | Building composite validation logic from multiple simpler Guards; reusing existing Guards | Enables modular Guard design; reduces redundant validation logic |
| **Export Guard to File** | Export an existing Guard's definition from the blockchain to a local JSON or Markdown file | Backing up Guards; editing Guard definitions locally; creating new Guards from templates | Enables Guard template workflow; facilitates Guard sharing and version control |
| **Generate Verified Passport** | Create immutable verified Passport object after Guard validation passes | Offline friend verification in Messenger; transaction condition verification | Creates verifiable credentials; enables trust-based interactions without on-chain validation every time |
| **Use Query Nodes** | Access real-time on-chain object data using `query` nodes | Building validation logic based on current on-chain state (e.g., Treasury balance, Service price, Permission status) | Most powerful Guard feature; enables dynamic, state-aware validation |
| **Use Logic Nodes** | Combine and transform boolean results using logic operations | Building complex boolean expressions from simpler conditions | Core of Guard validation; enables multi-condition checks |
| **Use Context Nodes** | Access system context like Signer, Clock, and Guard | Validating based on transaction sender, current time, or Guard itself | Enables time-based, sender-based, and self-referential validation |

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
## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `identifierMin` | 0 | Minimum identifier value |
| `identifierMax` | 255 | Maximum identifier value |
| `nameMaxLength` | 64 | Maximum name length (BCS characters) |
| `maxMultiOperands` | 8 | Maximum operands for multi-operand nodes |

---

## Schema Tree

```
guard (Guard Object)
├── operation_type: "guard" (fixed value)
├── data (Guard data definition)
│   ├── namedNew (optional)
│   │   ├── name (optional, Guard name)
│   │   ├── tags (optional, tag list)
│   │   ├── onChain (optional, publish on-chain)
│   │   └── replaceExistName (optional, force name replacement)
│   ├── description (optional, Guard description)
│   ├── table (optional, data table)
│   │   └── GuardTableItem[]
│   │       ├── identifier (0-255)
│   │       ├── b_submission (user submission required)
│   │       ├── value_type (Bool/Address/String/U8/U16/U32/U64/U128/U256/etc)
│   │       ├── value (optional, fixed value)
│   │       └── name (optional, data name)
│   ├── root (root node definition, required)
│   │   ├── type (discriminator)
│   │   ├── type: "node"
│   │   │   └── node (GuardNode computation tree)
│   │   └── type: "file"
│   │       ├── file_path (file path)
│   │       └── format (optional, json/markdown)
│   └── rely (optional, dependent Guards)
│       ├── guards (dependent Guard ID/name list)
│       └── logic_or (optional, use OR logic)
└── env (optional, execution environment)
    ├── account (optional, use specified account)
    ├── permission_guard (optional, permission Guard list)
    ├── no_cache (optional, disable cache)
    ├── network (optional, localnet/testnet)
    └── referrer (optional, referrer ID)
```

---

## Complete Tool Call Structure

Guard operations use the following top-level structure:

```json
{
  "operation_type": "guard",
  "data": { ... },
  "env": { ... }
}
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

#### ⚠️ Network and Account Configuration

All examples in this document use the **testnet** network and **default account** (empty string `""`). When using in production, please configure according to your actual environment:

```json
{
  "operation_type": "guard",
  "data": { ... },
  "env": {
    "account": "",              // Empty string for default account, or use account name/address
    "network": "testnet"        // Options: "testnet" | "mainnet"
  }
}
```

**Note**: If the `env` field is not specified, the operation will use the **default account** and the **last used network** for execution.

#### ⚠️ Guard Creation Constraints

- **Guards are immutable once created!** Ensure your validation logic is correct before creating.
- **Root must return Bool type**, otherwise validation will fail.
- **Identifier range is 0-255**, values outside this range will cause errors.
- **Dependent Guards must already exist**, otherwise creation will fail.

### Examples

#### Example 1.0: Always True Guard (Simplest Guard)

**Prompt**: Create the simplest Guard that always returns true. This Guard has no validation logic and always passes. Useful for testing or as a placeholder Guard.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "always_true_guard",
      "onChain": true
    },
    "description": "A simple guard that always returns true for testing purposes",
    "table": [
      {
        "identifier": 0,
        "b_submission": false,
        "value_type": "Bool",
        "value": true
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "identifier",
        "identifier": 0
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Execution Result**:
```json
{
  "status": "success",
  "object": "0x3d0e02...6a5ad",
  "type": "Guard",
  "version": "10316067",
  "change": "created"
}
```

---

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
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

#### Example 1.2: Complete Guard with Name, Tags, and Description

**Prompt**: Create an age verification Guard that checks if age is at least 18. Name this Guard "public_age_check", add tags "age", "verification", and "public", add a description explaining its purpose.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "public_age_check",
      "tags": ["age", "verification", "public"]
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
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

#### Example 1.3: Order Validation Guard with Multiple Conditions

**Prompt**: Create an order validation Guard that checks two conditions: quantity must be greater than 0, and quantity must be less than or equal to available stock. Name this Guard "order_validation", add tags "order", "validation", and "ecommerce", and add a description.

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
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

#### Example 1.4: Guard with Dependencies (AND Logic)

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
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

#### Example 1.5: Guard with Dependencies (OR Logic)

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
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

---

#### Example 1.6: Complete Parameter Guard with All Fields

**Prompt**: Create a comprehensive Guard named "full_guard" with tags "complete" and "example". This Guard should verify two things: email contains "@" symbol, and age is &gt;= 18. It should also depend on "public_age_check". Specify the network as testnet and use the default account.

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

## Sub-feature 3: Export Guard to File (guard2file)

### Feature Description

Use the `guard2file` tool to export a Guard object's definition from the blockchain to a local JSON or Markdown file. The exported file can be edited and used to create new Guard objects, enabling rapid reuse and reconstruction of validation rules.

**Core Benefits:**
- Quickly extract Guard definitions from ANY on-chain Guard
- Edit and refine validation logic offline
- Use exported files with "Create Guard from File" (Sub-feature 2) to build new Guards
- Create validation template libraries and backups

### Schema Tree (4-Level Structure)

```
guard2file (Guard to File)
├── guard (required)
│   └── [Guard name or Address/ID]
├── file_path (required)
│   └── [Output file path]
├── format (optional)
│   ├── "json" (default)
│   └── "markdown"
└── env (optional)
    ├── account (optional)
    ├── permission_guard (optional)
    ├── no_cache (optional)
    ├── network (optional)
    └── referrer (optional)
```

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `guard` | string | Yes | Guard object ID or name to export | Use name (preferred) or ID |
| `file_path` | string | Yes | Output file path | Absolute or relative path |
| `format` | enum | No | Output format | "json" (default) or "markdown" |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |
| `env.no_cache` | boolean | No | Disable caching | true=bypass cache |

### Important Notes

⚠️ **This is a read-only operation!** Does not modify any on-chain state.

⚠️ **Use names instead of 0x addresses!** Reference Guards by name for clarity.

⚠️ **Exported file matches Guard structure!** The output format is compatible with "Create Guard from File" (Sub-feature 2).

### Return Result

Returns the exported file path, format, and Guard object:

```json
{
  "result": {
    "status": "success",
    "data": {
      "file_path": "./exported_guard.json",
      "format": "json",
      "guard_object": "public_age_check"
    }
  }
}
```

---

### Examples

#### Example 3.1: Export to JSON (Default Format)

**Prompt**: Export the "order_validation" Guard to a JSON file named "order_validation_export.json".

```json
{
  "guard": "order_validation",
  "file_path": "./order_validation_export.json"
}
```

#### Example 3.2: Export to Markdown Format

**Prompt**: Export the "public_age_check" Guard to a Markdown file for documentation.

```json
{
  "guard": "public_age_check",
  "file_path": "public_age_check.md",
  "format": "markdown"
}
```

#### Example 3.3: Export with Custom Network

**Prompt**: Export "public_template" Guard from testnet to "template_backup.json".

```json
{
  "guard": "public_template",
  "file_path": "template_backup.json",
  "format": "json",
  "env": {
    "network": "testnet"
  }
}
```

#### Example 3.4: Guard Reuse Pattern

**Prompt**: Export "proven_guard" definition, edit to create a new variant, then use Sub-feature 2 to import into a new Guard.

Step 1: Export
```json
{
  "guard": "proven_guard",
  "file_path": "guard_template.json"
}
```

Step 2: Edit `guard_template.json` (modify validation logic as needed)

Step 3: Import into new Guard (see Sub-feature 2)
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "new_guard_variant"
    },
    "root": {
      "type": "file",
      "file_path": "guard_template.json"
    }
  }
}
```

---

## Sub-feature 4: Generate Verified Passport (gen_passport)

### Feature Description

Generate an immutable verified Passport object after Guard validation passes. Passports can be used for offline friend verification in Messenger, transaction condition verification, and more.

**Core Benefits:**
- Create verifiable credentials that prove Guard validation passed
- Use Passports in Messenger to verify strangers before accepting messages
- Passports are immutable and tamper-proof on-chain
- Enables trust-based interactions without direct on-chain validation every time

### Schema Tree (4-Level Structure)

```
gen_passport (Generate Verified Passport)
├── operation_type: "gen_passport" (fixed)
├── guard (required)
│   └── [Guard name or Address/ID]
├── info (optional)
│   └── [Submission data]
└── env (optional)
    ├── account (optional)
    ├── permission_guard (optional)
    ├── no_cache (optional)
    ├── network (optional)
    └── referrer (optional)
```

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|----------------|------|----------|-------------|-------------|
| `operation_type` | string | Yes | Operation type | Fixed value "gen_passport" |
| `guard` | string | Yes | Guard object ID to verify and generate passport from | Use name (preferred) or ID |
| `info` | object | No | Optional submission data | If not provided, will attempt to get existing submissions from the guard |
| `env.account` | string | No | Use specified account | Empty string '' uses default account |
| `env.network` | enum | No | Network selection | "localnet" or "testnet" |

### Important Notes

⚠️ **Guard validation must pass!** The Passport is only generated if the Guard validation succeeds.

⚠️ **Passports are immutable!** Once created, Passports cannot be modified.

⚠️ **Use names instead of 0x addresses!** Reference Guards by name for clarity.

⚠️ **Messenger integration!** Passports can be used in Messenger tools to verify strangers before accepting messages.

### Return Result

Returns the created Passport object.

---

### Examples

#### Example 4.1: Generate Passport with Submission Data

**Prompt**: Generate a Passport using the "public_age_check" Guard. Submit age 25 to pass validation.

```json
{
  "operation_type": "gen_passport",
  "guard": "public_age_check",
  "info": {
    "submissions": [
      {
        "identifier": 0,
        "value": "25"
      }
    ]
  }
}
```

#### Example 4.2: Generate Passport with Existing Submissions

**Prompt**: Generate a Passport from "order_validation" Guard, using existing submissions already attached to the Guard.

```json
{
  "operation_type": "gen_passport",
  "guard": "order_validation"
}
```

#### Example 4.3: Generate Passport with Custom Network

**Prompt**: Generate a Passport from "identity_verify" Guard on testnet.

```json
{
  "operation_type": "gen_passport",
  "guard": "identity_verify",
  "info": {
    "submissions": [
      {
        "identifier": 0,
        "value": "verified_user"
      }
    ]
  },
  "env": {
    "network": "testnet"
  }
}
```

#### Example 4.4: Passport Usage in Messenger

**Prompt**: Use a Passport to verify a stranger in Messenger. First generate the Passport, then reference it in Messenger's permission checks.

Step 1: Generate Passport
```json
{
  "operation_type": "gen_passport",
  "guard": "friend_verification",
  "info": {
    "submissions": [
      {
        "identifier": 0,
        "value": "mutual_friend_verified"
      }
    ]
  }
}
```

Step 2: Use Passport in Messenger (see [messenger.md](messenger.md)) to verify strangers before accepting messages.

---

## Constraint Constants

| Constant Name | Value | Description |
|---------------|-------|-------------|
| `identifierMin` | 0 | Minimum identifier value |
| `identifierMax` | 255 | Maximum identifier value |
| `nameMaxLength` | 64 | Maximum name length (BCS characters) |
| `maxMultiOperands` | 8 | Maximum operands for multi-operand nodes |

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

### Data Nodes

| Node Type | Return Type | Description | Parameters |
|-----------|-------------|-------------|------------|
| `identifier` | Depends on table item | Reference data from table | `identifier: number` (0-255) |
| `query` | Depends on query | Query on-chain object data | `query: string`, `object: { identifier: number }`, `parameters: GuardNode[]` |
| `context` | Depends on context | System context information | `context: "Signer" \| "Clock" \| "Guard"` |

**Important**: Context nodes return non-bool types! Never use them directly in logic gates like logic_and or logic_or.

---

## Query Instructions and Witness Types

### Overview

Guards can access data from ANY on-chain object using `query` nodes! This is a powerful feature that allows you to build validation logic based on real-time on-chain state.

### Query Node Structure

```json
{
  "type": "query",
  "query": 1253,
  "object": {
    "identifier": 0,
    "convert_witness": 100
  },
  "parameters": []
}
```

**Parameters:**
- `query`: Query instruction ID (number) or name (string). Use the `wowok_buildin_info` tool with `'guard instructions'` to query all available IDs.
- `object.identifier`: References the object ID from the Guard table (identifier 0-255).
- `object.convert_witness` (optional): **Critical for cross-object queries!** When specified, the query retrieves data from an associated object instead of the object itself.

### Witness Types for Cross-Object Queries

When you submit one object type but need to query data from a related object, use `convert_witness`:

| Witness Type | Value | Description | Use Case |
|--------------|-------|-------------|----------|
| `TypeOrderProgress` | 100 | Order → Progress | Query order's progress status |
| `TypeOrderMachine` | 101 | Order → Machine | Query order's workflow machine |
| `TypeOrderService` | 102 | Order → Service | Query order's service details |
| `TypeProgressMachine` | 103 | Progress → Machine | Query progress's machine |
| `TypeArbOrder` | 104 | Arbitration → Order | Query arbitration's order |
| `TypeArbArbitration` | 105 | Arb → Arbitration | Query arb's arbitration |
| `TypeArbProgress` | 106 | Arb → Progress | Query arb's progress |
| `TypeArbMachine` | 107 | Arb → Machine | Query arb's machine |
| `TypeArbService` | 108 | Arb → Service | Query arb's service |

### Common Progress Query Instructions

When querying Progress objects (directly or via witness), these instructions are frequently used:

| ID | Name | Return Type | Description | Parameters |
|----|------|-------------|-------------|------------|
| 1253 | `progress.current` | String | Current node name | None |
| 1271 | `progress.session.forward.time` | U64 | Timestamp of specific operation | [next_node_name, forward_name] |
| 1254 | `progress.task some` | Bool | Whether task object is set | None |
| 1255 | `progress.task` | Address | Task object ID | None |
| 1272 | `progress.history count` | U64 | Number of history records | None |

### Example: Query Order's Progress Status

**Scenario**: Create a Guard that checks if an order has reached "Completed" status.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "order_completed_guard"
    },
    "description": "Verify order is in Completed node. Submit order object ID.",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_id"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Completed",
        "name": "completed_node"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_equal",
        "nodes": [
          {
            "type": "query",
            "query": 1253,
            "object": {
              "identifier": 0,
              "convert_witness": 100
            },
            "parameters": []
          },
          {
            "type": "identifier",
            "identifier": 1
          }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Key Points:**
1. User submits `order_id` (identifier 0)
2. Query uses `convert_witness: 100` (TypeOrderProgress) to access the order's Progress object
3. Query ID `1253` (`progress.current`) retrieves the current node name
4. Compares with "Completed" to verify order status

### Example: Check Order Completion Time

**Scenario**: Create a Guard that checks if an order was completed more than 15 days ago.

```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "withdraw_guard"
    },
    "description": "Verify order completed > 15 days ago. Submit order object ID.",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_id"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Completed",
        "name": "completed_node"
      },
      {
        "identifier": 2,
        "b_submission": false,
        "value_type": "String",
        "value": "Complete Order",
        "name": "forward_name"
      },
      {
        "identifier": 3,
        "b_submission": false,
        "value_type": "U64",
        "value": "1296000000",
        "name": "15_days_ms"
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "type": "logic_and",
        "nodes": [
          {
            "type": "logic_equal",
            "nodes": [
              {
                "type": "query",
                "query": 1253,
                "object": {
                  "identifier": 0,
                  "convert_witness": 100
                },
                "parameters": []
              },
              {
                "type": "identifier",
                "identifier": 1
              }
            ]
          },
          {
            "type": "logic_as_u256_greater_or_equal",
            "nodes": [
              {
                "type": "context",
                "context": "Clock"
              },
              {
                "type": "calc_number_add",
                "nodes": [
                  {
                    "type": "query",
                    "query": 1271,
                    "object": {
                      "identifier": 0,
                      "convert_witness": 100
                    },
                    "parameters": [
                      {
                        "type": "identifier",
                        "identifier": 1
                      },
                      {
                        "type": "identifier",
                        "identifier": 2
                      }
                    ]
                  },
                  {
                    "type": "identifier",
                    "identifier": 3
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  "env": {
    "account": "",
    "network": "testnet"
  }
}
```

**Note**: The `context` node with `"Clock"` returns the current on-chain timestamp (U64).

---

## Query Instructions and On-chain Object Access

Guards can access data from ANY on-chain object using `query` nodes! Use the `wowok_buildin_info` tool with `'guard instructions'` to query the complete list of available operations.
