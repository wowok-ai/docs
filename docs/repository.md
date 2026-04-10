# Repository Component (📦 Data Repository)

---

## Component Overview

Repository is WoWok's on-chain data repository component, used to store structured data. Repository can be bound to Machine, Service, and other components to provide data storage and query capabilities.

---

## Feature Tree

```
Repository Component
├── Create New Repository
│   ├── Set Name (object.name)
│   ├── Bind Permission (object.permission)
│   ├── Set Description (description)
│   └── Set Repository Type (repo_type)
├── Manage Repository Tables (table)
│   ├── Add Table (table.op = "add")
│   ├── Set Tables (table.op = "set")
│   ├── Remove Table (table.op = "remove")
│   └── Clear Tables (table.op = "clear")
├── Manage Repository Data (data)
│   ├── Add Data (data.op = "add")
│   ├── Set Data (data.op = "set")
│   ├── Remove Data (data.op = "remove")
│   └── Clear Data (data.op = "clear")
├── Receive Objects (owner_receive)
└── Destroy Repository (destroy)
```

---

## Sub-feature 1: Create New Repository

### Feature Description

Create a new Repository object for storing structured data.

### Parameter Description

| Parameter | Type | Required | Description | Constraints |
|------|------|------|------|------|
| `object.name` | string | No | Local mark name | Max 64 characters |
| `object.id` | string | No | Object ID | 0x prefix + 64 hex characters |
| `object.type` | string | Yes | Object type | Must be "Repository" |
| `object.permission` | string/object | No | Permission object | Can be existing permission ID/name, or new permission object |
| `description` | string | No | Repository description | Max 4000 characters |
| `repo_type` | string | No | Repository type | Default is "Generic" |

### Repository Type Description

| Type | Description |
|------|------|
| `Generic` | Generic repository |
| `Service` | Service data repository |
| `Machine` | Machine data repository |
| `Progress` | Progress data repository |

### Examples

#### Example 1.1: Create Simple Repository

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data",
      "type": "Repository",
      "permission": "existing_permission"
    },
    "description": "Service data storage repository",
    "repo_type": "Service"
  }
}
```

#### Example 1.2: Create Repository and New Permission Simultaneously

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "user_data",
      "type": "Repository",
      "permission": {
        "name": "user_data_permission"
      }
    },
    "description": "User data repository",
    "repo_type": "Generic"
  }
}
```

---

## Sub-feature 2: Manage Repository Tables (table)

### Feature Description

Manage table structure of Repository.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `table.op` | string | Yes | Operation type: add/set/remove/clear |
| `table.tables` | array | Required for add/set | Table list |
| `table.tables[].name` | string | Yes | Table name |
| `table.tables[].fields` | array | Yes | Field list |
| `table.tables[].fields[].name` | string | Yes | Field name |
| `table.tables[].fields[].type` | string | Yes | Field type |
| `table.tables[].fields[].required` | boolean | No | Whether required |
| `table.table_name` | array | Required for remove | List of table names to remove |

### Field Type Description

| Type | Description |
|------|------|
| `string` | String type |
| `number` | Number type |
| `boolean` | Boolean type |
| `address` | Address type |
| `object` | Object type |
| `array` | Array type |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new tables to existing list |
| `set` | Replace entire table list |
| `remove` | Remove specified tables (by name) |
| `clear` | Clear all tables |

### Examples

#### Example 2.1: Add Table

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "table": {
      "op": "add",
      "tables": [
        {
          "name": "user_info",
          "fields": [
            {
              "name": "user_id",
              "type": "string",
              "required": true
            },
            {
              "name": "email",
              "type": "string",
              "required": true
            },
            {
              "name": "phone",
              "type": "string",
              "required": false
            },
            {
              "name": "created_at",
              "type": "number",
              "required": true
            }
          ]
        }
      ]
    }
  }
}
```

#### Example 2.2: Set Tables (Replace)

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "table": {
      "op": "set",
      "tables": [
        {
          "name": "order_info",
          "fields": [
            {
              "name": "order_id",
              "type": "string",
              "required": true
            },
            {
              "name": "user_id",
              "type": "string",
              "required": true
            },
            {
              "name": "amount",
              "type": "number",
              "required": true
            },
            {
              "name": "status",
              "type": "string",
              "required": true
            }
          ]
        }
      ]
    }
  }
}
```

#### Example 2.3: Remove Table

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "table": {
      "op": "remove",
      "table_name": ["old_table"]
    }
  }
}
```

#### Example 2.4: Clear Tables

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "table": {
      "op": "clear"
    }
  }
}
```

---

## Sub-feature 3: Manage Repository Data (data)

### Feature Description

Manage data in Repository.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `data.op` | string | Yes | Operation type: add/set/remove/clear |
| `data.table_name` | string | Required for add/set/remove | Table name |
| `data.records` | array | Required for add/set | Record list |
| `data.record_keys` | array | Required for remove | List of record keys to remove |

### Operation Type Description

| Operation Type | Description |
|----------|------|
| `add` | Add new records to table |
| `set` | Replace records in table |
| `remove` | Remove specified records (by key) |
| `clear` | Clear all records in table |

### Examples

#### Example 3.1: Add Data

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "data": {
      "op": "add",
      "table_name": "user_info",
      "records": [
        {
          "user_id": "user_001",
          "email": "user001@example.com",
          "phone": "1234567890",
          "created_at": 1704067200000
        },
        {
          "user_id": "user_002",
          "email": "user002@example.com",
          "created_at": 1704067200000
        }
      ]
    }
  }
}
```

#### Example 3.2: Set Data (Replace)

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "data": {
      "op": "set",
      "table_name": "user_info",
      "records": [
        {
          "user_id": "user_001",
          "email": "updated@example.com",
          "phone": "0987654321",
          "created_at": 1704067200000
        }
      ]
    }
  }
}
```

#### Example 3.3: Remove Data

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "data": {
      "op": "remove",
      "table_name": "user_info",
      "record_keys": ["user_001"]
    }
  }
}
```

#### Example 3.4: Clear Data

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "data": {
      "op": "clear",
      "table_name": "user_info"
    }
  }
}
```

---

## Sub-feature 4: Receive Objects (owner_receive)

### Feature Description

Receive objects sent to this Repository object and unwrap them to send to the permission owner.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `owner_receive.objects` | array | No | Specify list of object IDs to receive |
| `owner_receive.recent` | boolean | No | Whether to receive recent objects |

### Example

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "owner_receive": {
      "recent": true
    }
  }
}
```

---

## Sub-feature 5: Destroy Repository

### Feature Description

Destroy the Repository object.

### Parameter Description

| Parameter | Type | Required | Description |
|------|------|------|------|
| `destroy` | boolean | Yes | Whether to destroy |

### Important Notes

⚠️ **Repository must be in a destroyable state**.

⚠️ **All data in the repository will be deleted**.

### Example

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "service_data"
    },
    "destroy": true
  }
}
```

---

## Sub-feature 6: Combined Operations

### Feature Description

Execute multiple operations in one call.

### Example

#### Example 6.1: Complete Repository Creation Process

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "name": "complete_repository",
      "type": "Repository",
      "permission": "repository_permission"
    },
    "description": "Complete repository example",
    "repo_type": "Service",
    "table": {
      "op": "add",
      "tables": [
        {
          "name": "users",
          "fields": [
            {
              "name": "id",
              "type": "string",
              "required": true
            },
            {
              "name": "name",
              "type": "string",
              "required": true
            },
            {
              "name": "email",
              "type": "string",
              "required": true
            }
          ]
        },
        {
          "name": "orders",
          "fields": [
            {
              "name": "order_id",
              "type": "string",
              "required": true
            },
            {
              "name": "user_id",
              "type": "string",
              "required": true
            },
            {
              "name": "amount",
              "type": "number",
              "required": true
            }
          ]
        }
      ]
    },
    "data": {
      "op": "add",
      "table_name": "users",
      "records": [
        {
          "id": "user_001",
          "name": "Alice",
          "email": "alice@example.com"
        }
      ]
    }
  }
}
```

---

## Important Notes

⚠️ **Table structure must be defined before adding data**.

⚠️ **Data must conform to table field types and required constraints**.

⚠️ **Repository is usually bound to Service or Machine**.

---

## Related Components

- **Service**: Service marketplace
- **Machine**: Workflow template
- **Permission**: Permission management
- **Progress**: Workflow execution
