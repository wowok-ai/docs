# Schema: schema_query

> Query JSON schemas for all WoWok MCP tools and operations. Use this tool to understand the exact structure required for calling other tools.
>
> Returns complete JSON Schema definitions with all properties, types, and descriptions. This is the authoritative source for tool schemas.

---

## Top-Level Structure

```typescript
// Discriminated union by action
SchemaQueryRequest = {
  action: "list" | "get" | "search" | "list_operations";
  name?: string;      // Required for "get" action
  query?: string;     // Required for "search" action
}
```

---

## Actions

### 1. list

List all available tool schemas.

**Parameters:** None required

**Returns:** Array of schema info objects with `name`, `title`, and `description`

**Example:**
```json
{
  "action": "list"
}
```

---

### 2. get

Get a specific schema by name.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Schema name (e.g., `onchain_operations`, `account_operation`, `onchain_operations_permission`) |

**Returns:** Complete JSON Schema object for the requested tool/operation

**Examples:**

Get base onchain_operations schema:
```json
{
  "action": "get",
  "name": "onchain_operations"
}
```

Get specific operation schema (permission):
```json
{
  "action": "get",
  "name": "onchain_operations_permission"
}
```

Get account operation schema:
```json
{
  "action": "get",
  "name": "account_operation"
}
```

---

### 3. search

Search schemas by keyword.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | `string` | Yes | Search keyword to find matching schemas |

**Returns:** Array of schema info objects matching the search query

**Example:**
```json
{
  "action": "search",
  "query": "guard"
}
```

---

### 4. list_operations

List all on-chain operations (operation_types for onchain_operations).

**Parameters:** None required

**Returns:** Array of operation schema info objects

**Example:**
```json
{
  "action": "list_operations"
}
```

---

## Available Schema Names

### Tool Schemas

| Schema Name | Description |
|-------------|-------------|
| `onchain_operations` | Base schema for all on-chain operations |
| `account_operation` | Local wallet management |
| `local_mark_operation` | Local address book management |
| `local_info_operation` | Local private data management |
| `query_toolkit` | Data query toolkit |
| `onchain_table_data` | Dynamic table data queries |
| `onchain_events` | On-chain event watching |
| `wowok_buildin_info` | Protocol information queries |
| `messenger_operation` | Encrypted messenger operations |
| `wip_file` | Witness Information Promise file operations |
| `guard2file` | Export Guard definitions to file |
| `machineNode2file` | Export Machine nodes to file |
| `schema_query` | This tool - schema queries |

### Operation Schemas (onchain_operations sub-types)

| Schema Name | Description |
|-------------|-------------|
| `onchain_operations_service` | Service marketplace listings |
| `onchain_operations_machine` | Workflow templates |
| `onchain_operations_progress` | Workflow progress tracking |
| `onchain_operations_repository` | Consensus database |
| `onchain_operations_arbitration` | Dispute resolution |
| `onchain_operations_contact` | IM contact profiles |
| `onchain_operations_treasury` | Team fund management |
| `onchain_operations_reward` | Reward pools |
| `onchain_operations_allocation` | Auto-distribution |
| `onchain_operations_permission` | Access control |
| `onchain_operations_guard` | Programmable validation rules |
| `onchain_operations_personal` | Public identity |
| `onchain_operations_payment` | Direct coin transfers |
| `onchain_operations_demand` | Service requests |
| `onchain_operations_order` | Order lifecycle |
| `onchain_operations_gen_passport` | Verified credentials |

---

## Response Structure

```typescript
SchemaQueryResponse = {
  success: boolean;           // Whether the request was successful
  action: string;             // The action that was performed
  data: any;                  // Response data (varies by action)
  message: string;            // Human-readable result message
  suggestions?: string[];     // Suggested next steps
}
```

### Response Data by Action

| Action | Data Type | Description |
|--------|-----------|-------------|
| `list` | `SchemaInfo[]` | Array of available schemas |
| `get` | `JSONSchema` | Complete JSON Schema object |
| `search` | `SchemaInfo[]` | Array of matching schemas |
| `list_operations` | `SchemaInfo[]` | Array of operation schemas |

---

## Usage Tips

1. **Start with `list`** to see all available schemas
2. **Use `get`** with specific schema names to get detailed parameter structures
3. **Use `search`** when you're not sure of the exact schema name
4. **Use `list_operations`** when you need to see all available on-chain operation types
5. **Schema names follow patterns:**
   - Base tools: `{tool_name}` (e.g., `account_operation`)
   - On-chain operations: `onchain_operations_{operation_type}` (e.g., `onchain_operations_guard`)

---

## Related Tools

- [schema-query_toolkit.md](schema-query_toolkit.md) - For data queries
- [schema-onchain_table_data.md](schema-onchain_table_data.md) - For table data queries
- [schema-wowok_buildin_info.md](schema-wowok_buildin_info.md) - For protocol constants
