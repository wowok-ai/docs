# Guard Component (🛡️ Programmable Validation Rules)

---

## Component Overview

The Guard component creates immutable programmable validation rules that return boolean results (pass/fail). Guards can define complex validation logic for use cases like service marketplaces, permission management, workflow templates, and more.

&gt; **Note**: Use the `wowok_buildin_info` tool with 'guard instructions' to query all available operations.

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

⚠️ **Guards are immutable once created!** Ensure your validation logic is correct before creating.

⚠️ **Root must return Bool type**, otherwise validation will fail.

⚠️ **Identifier range is 0-255**, values outside this range will cause errors.

⚠️ **Dependent Guards must already exist**, otherwise creation will fail.

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
Export an existing Guard's definition from the blockchain to a local JSON or Markdown file. This allows you to backup your Guard definitions, edit them locally, and create new Guards based on existing ones.

### Parameter Description

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guard` | string | Yes | Guard object ID or name to export |
| `file_path` | string | Yes | Output file path (absolute or relative) |
| `format` | enum | No | Output format: "json" (default) or "markdown" |
| `env` | object | No | Execution environment |

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

**Prompt**: Export the "public_age_check" Guard to a Markdown file for documentation purposes. Use Markdown format for better readability.

```json
{
  "guard": "public_age_check",
  "file_path": "...",
  "format": "markdown"
}
```

---

#### Example 3.3: Export with Network Specification

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

## Query Instructions and On-chain Object Access

Guards can access data from ANY on-chain object using `query` nodes! Use the `wowok_buildin_info` tool with `'guard instructions'` to query the complete list of available operations.
