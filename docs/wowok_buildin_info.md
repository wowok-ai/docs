# WoWok Build-in Information Component (ℹ️ WoWok Build-in Information)

---

## Component Overview

The WoWok Build-in Information component is used to query WoWok protocol information, including constants, built-in permissions, guard instructions, current network, and value types.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Query Constants** | Get protocol constant values | Reference system limits and defaults | Understand protocol configuration |
| **Query Built-in Permissions** | Get built-in permission definitions | Set up permission objects | Know available permission options |
| **Query Guard Instructions** | Get Guard instruction reference | Build Guard logic | Access all available operations |
| **Query Current Network** | Get current network entrypoint | Check which network is active | Verify environment configuration |
| **Query Value Types** | Get supported value type mappings | Work with on-chain data types | Understand type system |

---

## Complete Tool Call Structure

Build-in info query uses the following top-level structure:

```json
{
  "info": "info_type",
  // optional filter fields
}
```

---

## Schema Tree

```
wowok_buildin_info (Build-in Information Operations)
├── info (discriminator, required)
│   ├── "constants"
│   ├── "built-in permissions"
│   │   └── filter (optional, PermissionFilter)
│   │       ├── objectType (optional, ObjectType)
│   │       ├── name (optional, string)
│   │       ├── index (optional, number)
│   │       └── description (optional, string)
│   ├── "guard instructions"
│   │   └── filter (optional, GuardInstructFilter)
│   │       ├── name (optional, string)
│   │       ├── id (optional, number[])
│   │       ├── returnType (optional, ValueType)
│   │       ├── paramCount (optional, number)
│   │       ├── scope (optional, "instruct"/"object query"/"all")
│   │       └── objectType (optional, ObjectType, only for "object query" scope)
│   ├── "current network"
│   └── "value types"
└── (no other top-level fields)
```

---

## Example 1: Query Constants

### Feature Description

Get protocol constant values, including system limits, default values, and configuration parameters.

### Examples

#### Example 1.1: Get All Constants

**Prompt**: Query all protocol constants to understand system configuration.

```json
{
  "info": "constants"
}
```

---

## Example 2: Query Built-in Permissions

### Feature Description

Get definitions of built-in permissions, including their indexes, names, descriptions, and applicable object types.

### Examples

#### Example 2.1: Get All Built-in Permissions

**Prompt**: Query all built-in permissions to see available options.

```json
{
  "info": "built-in permissions"
}
```

---

#### Example 2.2: Filter by Object Type

**Prompt**: Filter built-in permissions to only show those applicable to Service objects.

```json
{
  "info": "built-in permissions",
  "filter": {
    "objectType": "Service"
  }
}
```

---

#### Example 2.3: Filter by Name

**Prompt**: Search for built-in permissions with "update" in their name.

```json
{
  "info": "built-in permissions",
  "filter": {
    "name": "update"
  }
}
```

---

## Example 3: Query Guard Instructions

### Feature Description

Get reference information for Guard instructions and object queries, including their IDs, names, parameters, return types, and descriptions.

### Examples

#### Example 3.1: Get All Guard Instructions

**Prompt**: Query all Guard instructions to understand available operations.

```json
{
  "info": "guard instructions"
}
```

---

#### Example 3.2: Filter by Name

**Prompt**: Search for Guard instructions with "equal" in their name (case-insensitive).

```json
{
  "info": "guard instructions",
  "filter": {
    "name": "equal"
  }
}
```

---

#### Example 3.3: Filter by Return Type

**Prompt**: Find all Guard instructions that return Bool type.

```json
{
  "info": "guard instructions",
  "filter": {
    "returnType": "Bool"
  }
}
```

---

#### Example 3.4: Filter by Parameter Count

**Prompt**: Find Guard instructions that take exactly 2 parameters.

```json
{
  "info": "guard instructions",
  "filter": {
    "paramCount": 2
  }
}
```

---

#### Example 3.5: Filter by Scope

**Prompt**: Show only object query instructions (not basic instructions).

```json
{
  "info": "guard instructions",
  "filter": {
    "scope": "object query"
  }
}
```

---

#### Example 3.6: Multiple Filters Combined

**Prompt**: Find instructions with "logic" in name, returning Bool, with 2 parameters.

```json
{
  "info": "guard instructions",
  "filter": {
    "name": "logic",
    "returnType": "Bool",
    "paramCount": 2,
    "scope": "all"
  }
}
```

---

#### Example 3.7: Filter by Object Type

**Prompt**: Show only object query instructions that operate on Permission objects.

```json
{
  "info": "guard instructions",
  "filter": {
    "scope": "object query",
    "objectType": "Permission"
  }
}
```

---

## Example 4: Query Current Network

### Feature Description

Get the current network entrypoint to verify which blockchain environment you're connected to.

### Examples

#### Example 4.1: Get Current Network

**Prompt**: Check which network is currently active (localnet or testnet).

```json
{
  "info": "current network"
}
```

---

## Example 5: Query Value Types

### Feature Description

Get mappings of supported value types, showing both their numeric IDs and string representations.

### Examples

#### Example 5.1: Get All Value Types

**Prompt**: Query all supported value types to understand type system mappings.

```json
{
  "info": "value types"
}
```

---

## Important Notes

⚠️ **Constants are protocol-wide** - these values are fixed and consistent across the entire WoWok ecosystem.

⚠️ **Built-in permissions have fixed indexes** - indexes below 1000 are reserved for built-in permissions.

⚠️ **Guard instructions are comprehensive** - use name filtering to find specific operations quickly.

⚠️ **Value types can be referenced by name or number** - string format ("Bool", "Address") is recommended for readability.

⚠️ **Current network indicates environment** - localnet for development, testnet for testing, mainnet for production.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Guard](guard.md)** | Trust verification engine - uses guard instructions |
| **[Permission](permission.md)** | Permission management - uses built-in permissions |
| **All components** | Every object uses the value type system |
