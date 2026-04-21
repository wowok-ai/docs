# Repository Component (📦 Data Repository)

***

## Component Overview

Repository is WoWok's on-chain data repository component, used to store structured data. Repository can be bound to Machine, Service, and other components to provide data storage and query capabilities.

***

## Function List

| Function Name         | Purpose                                              | Usage Scenario                                    | Significance                                                    |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| **Create Repository** | Establish data repository with access controls       | Set up service data storage, user data records    | Creates secure on-chain database with permission management     |
| **Manage Policies**   | Define data write/read rules with Guard verification | Configure data permissions, set up access control | Defines who can write/read which data and under what conditions |
| **Add Data**          | Write data items to repository                       | Store user records, save workflow states          | Persists structured data on-chain with policy validation        |
| **Remove Data**       | Delete data items from repository                    | Clean up outdated records, remove invalid entries | Manages data lifecycle with permission checks                   |
| **Bind Rewards**      | Link reward objects for data incentives              | Encourage data contributions, reward active users | Incentivizes data quality and participation                     |
| **Owner Receive**     | Unwrap and send received assets to owner             | Forward received tokens, process payments         | Delivers received assets to permission owner                    |

***

## Complete Tool Call Structure

Repository operations use the following top-level structure:

```json
{
  "operation_type": "repository",
  "data": { ... },    // Repository data definition
  "env": { ... },       // Execution environment (optional)
  "submission": { ... }  // Submission data (optional)
}
```

***

## Schema Tree

```
repository (Repository Object)
├── operation_type: "repository" (fixed value)
├── data (Repository data definition)
│   ├── object (object definition, required)
│   │   ├── name|id (reference existing object)
│   │   └── name|tags|type_parameter|permission (create new object)
│   ├── description (description, optional)
│   ├── policies (policy rules, optional)
│   │   ├── op (operation: "add" | "set" | "remove" | "clear")
│   │   └── policy (array of PolicyRule, for add/set) | policy_name (array of strings, for remove)
│   │       └── PolicyRule structure (when op is "add" or "set"):
│   │           ├── name (string) - policy rule name
│   │           ├── description (string) - policy rule description
│   │           ├── write_guard (array of PolicyWriteGuard) - guards for write verification
│   │           │   └── PolicyWriteGuard structure:
│   │           │       ├── guard (string) - Guard object ID or name
│   │           │       ├── id_from_submission (number, 0-255, optional) - Guard table index for data ID
│   │           │       └── data_from_submission (number, 0-255, optional) - Guard table index for data value
│   │           ├── quote_guard (string or null, optional) - Guard for on-chain quote verification
│   │           ├── id_from (number 0-2 or string) - source of data ID
│   │           │   ├── 0 / "None" / "none" - user must specify ID
│   │           │   ├── 1 / "Clock" / "clock" - use current timestamp as ID
│   │           │   └── 2 / "Signer" / "signer" - use signer ID as data ID
│   │           └── value_type (number or string) - data value type
│   │               ├── 0 / "Address" / "address" - address type
│   │               ├── 1 / "Bool" / "bool" - boolean type
│   │               ├── 2 / "U8" / "u8" - unsigned 8-bit integer
│   │               ├── 3 / "U16" / "u16" - unsigned 16-bit integer
│   │               ├── 4 / "U32" / "u32" - unsigned 32-bit integer
│   │               ├── 5 / "U128" / "u128" - unsigned 128-bit integer
│   │               ├── 6 / "U64" / "u64" - unsigned 64-bit integer
│   │               ├── 7 / "U256" / "u256" - unsigned 256-bit integer
│   │               ├── 8 / "String" / "string" - string type
│   │               └── ... (see ValueType for complete list)
│   ├── data_add (add data items, optional)
│   │   ├── Option 1: SignerOrClock structure (when id_from is Clock or Signer)
│   │   │   ├── name (string) - data item name (must match PolicyRule name)
│   │   │   ├── write_guard (string, optional) - Guard ID for write permission
│   │   │   └── data (any) - data value (must match PolicyRule value_type)
│   │   └── Option 2: DataAddWithItems structure (when id_from is None)
│   │       ├── name (string) - data item name (must match PolicyRule name)
│   │       └── items (array of RepDataItem) - list of data items to add
│   │           └── RepDataItem structure:
│   │               ├── data (array of KeyData) - data key-value pairs
│   │               │   └── KeyData structure:
│   │               │       ├── id (number or string) - data item ID
│   │               │       └── data (any) - data value
│   │               └── write_guard (string, optional) - Guard ID for this data item
│   ├── data_remove (remove data items, optional)
│   │   ├── Option 1: SignerOrClockBase structure (when id_from is Clock or Signer)
│   │   │   ├── name (string) - data item name
│   │   │   └── write_guard (string, optional) - Guard ID for delete permission
│   │   └── Option 2: DataRemoveWithItems structure (when id_from is None)
│   │       ├── name (string) - data item name
│   │       └── items (array of DataRemoveItem) - list of data items to remove
│   │           └── DataRemoveItem structure:
│   │               ├── id (array of number|string) - data item IDs to remove
│   │               └── write_guard (string, optional) - Guard ID for delete permission
│   ├── rewards (reward objects, optional)
│   │   └── array of strings - Reward object names or IDs to bind
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
                ├── value (any) - submitted value
                └── name (string, optional) - item name
```

***

### Complete Value Type Reference

The following table lists all supported `value_type` values for policy definitions:

| Numeric Value | String Value | Description |
|--------------|--------------|-------------|
| 0 | "Bool" / "bool" | Boolean type |
| 1 | "Address" / "address" | Address type |
| 2 | "String" / "string" | String type |
| 3 | "U8" / "u8" | Unsigned 8-bit integer |
| 4 | "U16" / "u16" | Unsigned 16-bit integer |
| 5 | "U32" / "u32" | Unsigned 32-bit integer |
| 6 | "U64" / "u64" | Unsigned 64-bit integer |
| 7 | "U128" / "u128" | Unsigned 128-bit integer |
| 8 | "U256" / "u256" | Unsigned 256-bit integer |
| 9 | "VecBool" / "vecbool" | Vector of booleans |
| 10 | "VecAddress" / "vecaddress" | Vector of addresses |
| 11 | "VecString" / "vecstring" | Vector of strings |
| 12 | "VecU8" / "vecu8" | Vector of unsigned 8-bit integers |
| 13 | "VecU16" / "vecu16" | Vector of unsigned 16-bit integers |
| 14 | "VecU32" / "vecu32" | Vector of unsigned 32-bit integers |
| 15 | "VecU64" / "vecu64" | Vector of unsigned 64-bit integers |
| 16 | "VecU128" / "vecu128" | Vector of unsigned 128-bit integers |
| 17 | "VecU256" / "vecu256" | Vector of unsigned 256-bit integers |
| 18 | "VecVecU8" / "vecvecu8" | Vector of vectors of unsigned 8-bit integers |

**Query via Tool**: You can also query all value types dynamically using the `wowok_buildin_info` tool with `info: "value types"`.

***

### ⚠️ Important Note About Submission

If the execution returns a `submission` field in the response, it indicates that additional Guard verification data is required. You must:

1. Complete all required submission data within the `submission` structure
2. Resubmit the operation with the completed submission data
3. **Do not modify any other parts of the structure** - only fill in the required submission values

The submission structure will specify which Guard objects need verification and what data needs to be provided for each Guard table item.

**Query Value Types**: Use the `wowok_buildin_info` tool with `{ "info": "value types" }` to query all supported value types with their numeric and string representations. This helps you understand what `value_type` values are valid for submission data.

***

## Sub-feature 1: Create New Repository

### Feature Description

Create a new Repository object for storing structured data.

### Parameter Description

| Parameter Path     | Type             | Required | Description            | Constraints                          |
| ------------------ | ---------------- | -------- | ---------------------- | ------------------------------------ |
| `operation_type`   | string           | Yes      | Operation type         | Fixed value "repository"             |
| `data.object`      | object or string | Yes      | Object definition      | WithPermissionObject                 |
| `data.description` | string           | No       | Repository description | Max 65535 characters                 |
| `env.account`      | string           | No       | Use specified account  | Empty string '' uses default account |
| `env.network`      | enum             | No       | Network selection      | "localnet" or "testnet"              |

### Important Notes

⚠️ **Policy Rules**: Policies define data write/read permissions using PolicyRule objects, which include write\_guard, id\_from, and value\_type.

***

### Examples

#### Example 1.1: Create Minimal Repository

**Prompt**: Create a Repository named "repo\_test\_1", use default account and network, no other configuration specified.

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "repo_test_1"
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
      "type": "Permission",
      "object": "0x875e...0192",
      "version": "190089",
      "change": "created"
    },
    {
      "type": "Repository",
      "object": "0xa588...78f7",
      "version": "190089",
      "change": "created"
    }
  ]
}
```

***

#### Example 1.2: Create Repository with Tags

**Prompt**: Create a Repository named "repo\_test\_2", add tags "users", "storage", description "User data storage repository".

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "repo_test_2",
      "tags": ["users", "storage"]
    },
    "description": "User data storage repository"
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
      "type": "Permission",
      "object": "0xe391...d3ca",
      "version": "190619",
      "change": "created"
    },
    {
      "type": "Repository",
      "object": "0x2e14...d800",
      "version": "190619",
      "change": "created"
    }
  ]
}
```

***

#### Example 1.3: Create Complete Repository with Policies

**Prompt**: Create a Repository named "complete\_repo": 1) Add tags "service", "database", 2) Add description "Complete repository example", 3) Add a policy named "user\_notes" with write guard "repo\_guard\_1", id from clock, value type string.

> **Prerequisite**: Need to create Guard object first
>
> ```json
> {
>   "operation_type": "guard",
>   "data": {
>     "namedNew": {"name": "repo_guard_1"},
>     "description": "Always true guard for repository testing",
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
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "complete_repo",
      "tags": ["service", "database"]
    },
    "description": "Complete repository example",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "user_notes",
          "description": "User notes storage",
          "write_guard": [{"guard": "repo_guard_1"}],
          "id_from": "Clock",
          "value_type": "string"
        }
      ]
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
      "type": "Permission",
      "object": "0x2de2...8571",
      "version": "191543",
      "change": "created"
    },
    {
      "type": "Repository",
      "object": "0x5e97...4970",
      "version": "191543",
      "change": "created"
    }
  ]
}
```

***

## Sub-feature 2: Manage Policies

### Feature Description

Add, set, remove, or clear policy rules that define data write permissions and ID sources.

### Parameter Description

| Parameter Path   | Type   | Required | Description           | Constraints                            |
| ---------------- | ------ | -------- | --------------------- | -------------------------------------- |
| `operation_type` | string | Yes      | Operation type        | Fixed value "repository"               |
| `data.object`    | string | Yes      | Repository name or ID | <br />                                 |
| `data.policies`  | object | Yes      | Policy operations     | { op: "add\|set\|remove\|clear", ... } |

### PolicyRule Structure

| Field         | Type           | Required | Description                                                                                                  |
| ------------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `name`        | string         | Yes      | Policy rule name                                                                                             |
| `description` | string         | Yes      | Policy rule description                                                                                      |
| `write_guard` | array          | Yes      | Guard object list for write verification                                                                     |
| `quote_guard` | string or null | No       | Guard for on-chain reference verification                                                                    |
| `id_from`     | enum or number | Yes      | ID source: can be string ("None", "Clock", "Signer", case-insensitive) or number (0=None, 1=Clock, 2=Signer) |
| `value_type`  | enum           | Yes      | Value type: "string", "number", "boolean", etc.                                                              |

### Operation Types

- **add**: Add new policies to existing list
- **set**: Replace entire policy list
- **remove**: Remove specified policies (by name)
- **clear**: Clear all policies

***

### Examples

#### Example 2.1: Add Single Policy

**Prompt**: Add a policy to "repo\_test\_2": 1) Policy name "user\_profile", 2) Write guard "profile\_guard", 3) ID from signer, 4) Value type Address.

> **Prerequisite**: Need to create Guard object first
>
> ```json
> {
>   "operation_type": "guard",
>   "data": {
>     "namedNew": {"name": "profile_guard"},
>     "description": "Guard for profile policy",
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
  "operation_type": "repository",
  "data": {
    "object": "repo_test_2",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "user_profile",
          "description": "User profile data",
          "write_guard": [{"guard": "profile_guard"}],
          "id_from": "Signer",
          "value_type": "Address"
        }
      ]
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
      "type": "Repository",
      "object": "0x2e14...d800",
      "version": "192431",
      "change": "modified"
    }
  ]
}
```

***

#### Example 2.2: Add Multiple Policies

**Prompt**: Add two policies to "repo\_test\_1": 1) First policy "order\_info" with clock ID and U64 type, 2) Second policy "feedback" with signer ID and String type.

> **Prerequisite**: Need to create Guard object first
>
> ```json
> {
>   "operation_type": "guard",
>   "data": {
>     "namedNew": {"name": "order_guard"},
>     "description": "Guard for order policy",
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
>
> ```json
> {
>   "operation_type": "guard",
>   "data": {
>     "namedNew": {"name": "feedback_guard"},
>     "description": "Guard for feedback policy",
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
  "operation_type": "repository",
  "data": {
    "object": "repo_test_1",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "order_info",
          "description": "Order information records",
          "write_guard": [{"guard": "order_guard"}],
          "id_from": "Clock",
          "value_type": "U64"
        },
        {
          "name": "feedback",
          "description": "User feedback records",
          "write_guard": [{"guard": "feedback_guard"}],
          "id_from": "Signer",
          "value_type": "String"
        }
      ]
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
      "type": "Repository",
      "object": "0xa588...78f7",
      "version": "193331",
      "change": "modified"
    }
  ]
}
```

***

#### Example 2.3: Remove Policies

**Prompt**: Remove policy "order\_info" from "repo\_test\_1".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "repo_test_1",
    "policies": {
      "op": "remove",
      "policy": ["order_info"]
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
      "type": "Repository",
      "object": "0xa588...78f7",
      "version": "193332",
      "change": "modified"
    }
  ]
}
```

***

#### Example 2.4: Clear All Policies

**Prompt**: Clear all policies from "repo\_test\_1".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "repo_test_1",
    "policies": {
      "op": "clear"
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
      "type": "Repository",
      "object": "0xa588...78f7",
      "version": "196947",
      "change": "modified"
    }
  ]
}
```

***

## Sub-feature 3: Add Data

### Feature Description

Add data items to the repository, following policy rules for ID source and value type.

### Parameter Description

| Parameter Path   | Type   | Required | Description           | Constraints                     |
| ---------------- | ------ | -------- | --------------------- | ------------------------------- |
| `operation_type` | string | Yes      | Operation type        | Fixed value "repository"        |
| `data.object`    | string | Yes      | Repository name or ID | <br />                          |
| `data.data_add`  | object | Yes      | Data to add           | Must match policy name and type |

### DataAdd Types

1. **SignerOrClock**: `{ name: "...", write_guard: "...", data: value }`
2. **DataAddWithItems**: `{ name: "...", items: [{ data: [{ id, data }], write_guard: "..." }] }`

***

### Examples

#### Example 3.1: Add Data with Signer/Clock ID

**Prompt**: Add data to "simple\_repo": 1) Policy name "simple\_data", 2) Data value "Test data without guard".

> **Prerequisite**: Need to create Repository with policy first
>
> ```json
> {
>   "operation_type": "repository",
>   "data": {
>     "object": {"name": "simple_repo"},
>     "policies": {
>       "op": "add",
>       "policy": [
>         {
>           "name": "simple_data",
>           "description": "Simple data storage",
>           "write_guard": [],
>           "id_from": "Clock",
>           "value_type": "String"
>         }
>       ]
>     }
>   },
>   "env": {"network": "testnet"}
> }
> ```

```json
{
  "operation_type": "repository",
  "data": {
    "object": "simple_repo",
    "data_add": {
      "name": "simple_data",
      "data": "Test data without guard"
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
  "status": "success"
}
```

***

#### Example 3.2: Add Multiple Data Items

**Prompt**: Add multiple data items to "simple\_repo" for policy "simple\_data": 1) First item with id 100 and value "First data item", 2) Second item with id 200 and value "Second data item".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "simple_repo",
    "data_add": {
      "name": "simple_data",
      "items": [
        {
          "data": [
            {
              "id": 100,
              "data": "First data item"
            },
            {
              "id": 200,
              "data": "Second data item"
            }
          ]
        }
      ]
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
  "status": "success"
}
```

***

## Sub-feature 4: Remove Data

### Feature Description

Remove data items from the repository.

### Parameter Description

| Parameter Path     | Type   | Required | Description           | Constraints              |
| ------------------ | ------ | -------- | --------------------- | ------------------------ |
| `operation_type`   | string | Yes      | Operation type        | Fixed value "repository" |
| `data.object`      | string | Yes      | Repository name or ID | <br />                   |
| `data.data_remove` | object | Yes      | Data to remove        | Must match policy name   |

### DataRemove Types

1. **SignerOrClockBase**: `{ name: "...", write_guard: "..." }`
2. **By IDs**: `{ name: "...", items: [{ id: [...], write_guard: "..." }] }`

***

### Examples

#### Example 4.1: Remove Data by Signer/Clock

**Prompt**: Remove data from "simple\_repo" for policy "simple\_data".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "simple_repo",
    "data_remove": {
      "name": "simple_data"
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
  "status": "success"
}
```

***

#### Example 4.2: Remove Data by Specific IDs

**Prompt**: Remove data items with ids 100 and 200 from "simple\_repo" for policy "simple\_data".

```json
{
  "operation_type": "repository",
  "data": {
    "object": "simple_repo",
    "data_remove": {
      "name": "simple_data",
      "items": [
        {
          "id": [100, 200]
        }
      ]
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
  "status": "success"
}
```

***

## Sub-feature 5: Bind Rewards and Receive Assets

### Feature Description

Bind reward objects for data contribution incentives, and process received assets.

### Parameter Description

| Parameter Path       | Type             | Required | Description                     | Constraints                   |
| -------------------- | ---------------- | -------- | ------------------------------- | ----------------------------- |
| `operation_type`     | string           | Yes      | Operation type                  | Fixed value "repository"      |
| `data.object`        | string           | Yes      | Repository name or ID           | <br />                        |
| `data.rewards`       | array            | No       | Reward object names/IDs to bind | <br />                        |
| `data.owner_receive` | string or object | No       | Unwrap and send to owner        | "recently" or ReceivedObjects |

***

### Examples

#### Example 5.1: Bind Reward Objects

**Prompt**: Bind reward object "test\_reward" to "repo\_test\_1".

> **Prerequisite**: Need to create Reward object first
>
> ```json
> {
>   "operation_type": "reward",
>   "data": {
>     "object": {"name": "test_reward"},
>     "description": "Test reward for repository",
>     "time": {"op": "add", "time": [3600]}
>   },
>   "env": {"network": "testnet"}
> }
> ```

```json
{
  "operation_type": "repository",
  "data": {
    "object": "repo_test_1",
    "rewards": ["test_reward"]
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
      "type": "Repository",
      "object": "0xa588...78f7",
      "version": "198001",
      "change": "modified"
    }
  ]
}
```

***

#### Example 5.2: Unwrap and Send to Owner

**Prompt**: Unwrap recently received objects of "repo\_test\_1", send to permission owner.

> **Prerequisite**: Need to send some objects to Repository first (e.g., via Payment)
>
> ```json
> {
>   "operation_type": "payment",
>   "data": {
>     "for_object": "repo_test_1",
>     "remark": "Test payment to repository"
>   },
>   "env": {"network": "testnet"}
> }
> ```

```json
{
  "operation_type": "repository",
  "data": {
    "object": "repo_test_1",
    "owner_receive": "recently"
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
      "type": "Repository",
      "object": "0xa588...78f7",
      "version": "198002",
      "change": "modified"
    }
  ]
}
```

***

## Sub-feature 6: Combined Operations

### Feature Description

Perform multiple operations on existing Repository in a single transaction.

***

### Example

#### Example 6.1: Complete Repository Setup

**Prompt**: For "repo\_test\_2": 1) Set description "Updated repository description", 2) Add a policy without write\_guard, 3) Add data.

```json
{
  "operation_type": "repository",
  "data": {
    "object": "repo_test_2",
    "description": "Updated repository description",
    "policies": {
      "op": "add",
      "policy": [
        {
          "name": "logs",
          "description": "Log records",
          "write_guard": [],
          "id_from": "Clock",
          "value_type": "String"
        }
      ]
    },
    "data_add": {
      "name": "logs",
      "data": "System started"
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
      "type": "Repository",
      "object": "0x2e14...d800",
      "version": "198500",
      "change": "modified"
    }
  ]
}
```

***

## Important Notes

⚠️ **Policies define data structure and permissions**, always define policies before adding data.

⚠️ **All data must conform to policy-defined value types and ID sources.**

⚠️ **Use names instead of addresses in prompts for better readability.**

⚠️ **Write guards must verify successfully before data can be written.**

⚠️ **Repository can bind multiple Reward objects for data contribution incentives.**

***

## Related Components

| Component                       | Description                                                     |
| ------------------------------- | --------------------------------------------------------------- |
| **[Service](service.md)**       | WYSIWYG product trading - can bind Repository to Service        |
| **[Machine](machine.md)**       | Workflow template - can bind Repository to Machine              |
| **[Guard](guard.md)**           | Trust verification engine - required for data write permissions |
| **[Permission](permission.md)** | Permission management                                           |
| **[Reward](reward.md)**         | Marketing incentives - can bind for data incentives             |

