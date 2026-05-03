# WoWok Built-in Info Tool Schema

> **Tool Name**: `wowok_buildin_info`
> **Description**: Query WoWok protocol information: 'constants', 'built-in permissions', 'guard instructions', 'current network', or 'value types'.

---

## Tool Schema

```typescript
wowok_buildin_info: ProtocolInfoQuery
```

---

## Input Schema

```typescript
ProtocolInfoQuery =
  | { info: "constants" }
  | { info: "built-in permissions"; filter?: PermissionFilter }
  | { info: "guard instructions"; filter?: GuardInstructFilterOptions }
  | { info: "current network" }
  | { info: "value types" }
```

---

## Sub Schemas

### PermissionFilter

```typescript
PermissionFilter {
  index?: number,                 // Filter by permission index
  name?: string,                  // Filter by permission name (partial match, case-insensitive)
  module?: string                 // Filter by module name (e.g., 'service', 'order', 'machine')
}
```

### GuardInstructFilterOptions

```typescript
GuardInstructFilterOptions {
  id?: number,                    // Filter by instruction ID
  name?: string,                  // Filter by instruction name (partial match, case-insensitive)
  objectType?: string,            // Filter by object type
  returnType?: string             // Filter by return value type
}
```

---

## Output Schema

```typescript
ProtocolInfoResult {
  result: ProtocolInfoResultWrapped
}

ProtocolInfoResultWrapped =
  | { info: "constants"; result: ConstantItem[] }
  | { info: "built-in permissions"; result: PermissionInfoType[] }
  | { info: "guard instructions"; result: GuardItem[] }
  | { info: "current network"; result: Entrypoint }
  | { info: "value types"; result: ConstantItem[] }
```

---

## Result Type Schemas

### ConstantItem

```typescript
ConstantItem {
  name: string,                   // Constant name
  value: string,                  // Constant value
  description: string             // Constant description
}
```

### PermissionInfoType

```typescript
PermissionInfoType {
  index: number,                  // Permission index (0-65535)
  name: string,                   // Permission name
  module: string,                 // Module name
  description: string             // Permission description
}
```

### GuardItem

```typescript
GuardItem {
  id: number,                     // Instruction ID
  name: string,                   // Instruction name
  objectType: string,             // Object type this instruction operates on
  parameters: ValueType[],        // Parameter types
  return: ValueType,              // Return value type
  description: string,            // Instruction description
  parameters_description: string[] // Parameter descriptions
}
```

### Entrypoint

```typescript
Entrypoint = "localnet" | "testnet"
```

### ValueType

```typescript
ValueType =
  | "Bool" | "Address" | "String"
  | "U8" | "U16" | "U32" | "U64" | "U128" | "U256"
  | "VecBool" | "VecAddress" | "VecString"
  | "VecU8" | "VecU16" | "VecU32" | "VecU64" | "VecU128" | "VecU256"
  | "VecVecU8"
  | number  // Numeric representation (0-18)
```

---

## Query Type Selection Guide

| Query Type | Description | Use Case |
|------------|-------------|----------|
| `constants` | Protocol constants | Get system-wide constant values |
| `built-in permissions` | Built-in permission definitions | Find permission indices for Permission objects |
| `guard instructions` | Guard query instructions | Find available data queries for Guard nodes |
| `current network` | Current network entrypoint | Verify which network is active |
| `value types` | Supported value types | Get type mappings for Guard/Repository data |

---

## Examples

### Query Constants

```typescript
wowok_buildin_info: {
  info: "constants"
}
```

### Query Built-in Permissions with Filter

```typescript
wowok_buildin_info: {
  info: "built-in permissions",
  filter: {
    module: "service"             // Filter for service-related permissions
  }
}
```

### Query Guard Instructions with Filter

```typescript
wowok_buildin_info: {
  info: "guard instructions",
  filter: {
    objectType: "Service",        // Filter for Service object queries
    returnType: "U64"             // Filter for U64 return type
  }
}
```

### Query Current Network

```typescript
wowok_buildin_info: {
  info: "current network"
}
```

### Query Value Types

```typescript
wowok_buildin_info: {
  info: "value types"
}
```

---

## Output Examples

### Constants Result

```json
{
  "result": {
    "info": "constants",
    "result": [
      {
        "name": "MAX_GUARD_NODES",
        "value": "64",
        "description": "Maximum number of nodes in a Guard"
      },
      {
        "name": "MAX_MACHINE_NODES",
        "value": "256",
        "description": "Maximum number of nodes in a Machine"
      }
    ]
  }
}
```

### Built-in Permissions Result

```json
{
  "result": {
    "info": "built-in permissions",
    "result": [
      {
        "index": 0,
        "name": "service.create",
        "module": "service",
        "description": "Create new service"
      },
      {
        "index": 1,
        "name": "service.update",
        "module": "service",
        "description": "Update service settings"
      }
    ]
  }
}
```

### Guard Instructions Result

```json
{
  "result": {
    "info": "guard instructions",
    "result": [
      {
        "id": 1001,
        "name": "service.description",
        "objectType": "Service",
        "parameters": [],
        "return": "String",
        "description": "Get service description",
        "parameters_description": []
      }
    ]
  }
}
```

### Current Network Result

```json
{
  "result": {
    "info": "current network",
    "result": "testnet"
  }
}
```

### Value Types Result

```json
{
  "result": {
    "info": "value types",
    "result": [
      {
        "name": "Bool",
        "value": "0",
        "description": "Boolean type"
      },
      {
        "name": "Address",
        "value": "1",
        "description": "Address type"
      },
      {
        "name": "String",
        "value": "2",
        "description": "String type"
      }
    ]
  }
}
```
