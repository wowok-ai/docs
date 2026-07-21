# Schema Query — Universal Lookup Skill (📋 Meta Sub-Tool)

---

## Why a "Universal Lookup Skill"?

The WoWok MCP Server exposes a **single unified `wowok` tool** that dispatches to **17 sub-tools** (including `onchain_operations`, which itself carries 16+ on-chain operation types). That is over 30 schemas in total. Remembering the exact parameter structure for every one is impractical, and documentation can lag behind the code.

`schema_query` is a **meta sub-tool**: it does not query business data. It queries **the sub-tools themselves** — their input/output schemas, field types, required vs. optional parameters, and discriminators. Think of it as "self-introspection" for the MCP server.

**Core principle:** the `wowok` handler already returns the correct schema on any parameter mismatch (see [Response Format](response-format.md#status-schema_mismatch)), so you usually do **not** need to call `schema_query` proactively. Use `schema_query` when you want to browse all available schemas, discover capabilities, or pre-fetch a schema for planning.

---

## How It Differs from Other Query Sub-Tools

| Sub-tool | What it queries | Typical question |
|----------|-----------------|------------------|
| `query_toolkit` | Business data (accounts, balances, objects) | "What is Alice's WOW balance?" |
| `onchain_table_data` | Dynamic table items on-chain | "What are this Permission's perm items?" |
| `onchain_events` | On-chain emitted events | "What NewOrderEvents happened?" |
| `wowok_buildin_info` | Protocol constants & enumerations | "What are the built-in permission indexes?" |
| **`schema_query`** | **Sub-tool & operation schemas (metadata)** | **"What fields does `onchain_operations_treasury` require?"** |

The first four answer *"what is the data?"*; `schema_query` answers *"how do I call the sub-tool that gets or mutates the data?"*.

---

## Actions

`schema_query` supports five actions:

| Action | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| `list` | — | Array of schema names | Enumerate every available schema (sub-tools + operations) |
| `get` | `name` | JSON Schema (input) | Get the **input** schema of a sub-tool or operation by name |
| `get_output` | `name` | JSON Schema (output) | Get the **output** schema of a sub-tool by name |
| `search` | `query` | Array of matching schema names | Find schemas by keyword (name or description) |
| `list_operations` | — | Array of on-chain operation names | List only the 16 on-chain operation types (subset of `list`) |

---

## Tool Call Structure

All calls go through the unified `wowok` tool. Pass `schema_query` as the `tool` field and the action parameters inside `data`:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "list | get | get_output | search | list_operations",
    "name": "schema_name",
    "query": "keyword"
  }
}
```

| `data` field | Required | Description |
|--------------|----------|-------------|
| `action` | Yes | One of `list`, `get`, `get_output`, `search`, `list_operations` |
| `name` | Required for `get` and `get_output` | Schema name (e.g. `onchain_operations`, `onchain_operations_service`) |
| `query` | Required for `search` | Keyword to match against schema names and descriptions |

> **Aliases (deprecated):** `tool_name`/`name` (top-level) can substitute for `tool`, and `args`/`params` can substitute for `data`. Inline params (e.g. `{ "tool": "schema_query", "action": "list" }`) are also auto-wrapped into `data`.

---

## Examples

### Example 1: List All Available Schemas

Enumerate every schema registered on the MCP server (sub-tools + on-chain operations).

```json
{
  "tool": "schema_query",
  "data": {
    "action": "list"
  }
}
```

**Result (excerpt):**
```json
{
  "result": {
    "status": "success",
    "data": {
      "success": true,
      "action": "list",
      "message": "Found 34 available schemas",
      "data": [
        {
          "name": "account_operation",
          "title": "Account Operation",
          "description": "Local account management: generate, faucet, suspend, resume, rename, transfer, etc.",
          "path": "schemas/account_operation.schema.json"
        },
        {
          "name": "local_mark_operation",
          "title": "Local Mark Operation",
          "description": "Local address book management: add, remove, clear marks.",
          "path": "schemas/local_mark_operation.schema.json"
        },
        {
          "name": "onchain_operations_service",
          "title": "Onchain Operations - Service",
          "description": "Service object on-chain operations.",
          "path": "schemas/onchain_operations_service.schema.json"
        }
        // ... 31 more schema entries (query_toolkit, onchain_events, schema_query, etc.)
      ]
    }
  },
  "schema": null
}
```

> **Tip**: On-chain operation schemas follow the naming convention `onchain_operations_<object_type>` (e.g. `onchain_operations_service` for Service operations). Each entry in the `data` array is a `SchemaInfo` object with `name`, `title`, `description`, and `path` fields.

---

### Example 2: Get the Input Schema of a Specific Sub-Tool

Retrieve the full JSON Schema for the `onchain_operations` input (the wrapper that carries all 16 operation types):

```json
{
  "tool": "schema_query",
  "data": {
    "action": "get",
    "name": "onchain_operations"
  }
}
```

**Result (excerpt):**
```json
{
  "result": {
    "status": "success",
    "data": {
      "success": true,
      "action": "get",
      "message": "Retrieved schema: onchain_operations",
      "data": {
        "type": "object",
        "properties": {
          "operation_type": {
            "type": "string",
            "enum": ["permission", "repository", "machine", "service", "..."]
          },
          "data": { "...": "..." },
          "env": { "...": "..." },
          "submission": { "...": "..." }
        },
        "required": ["operation_type", "data"]
      }
    }
  },
  "schema": null
}
```

---

### Example 3: Get the Input Schema of a Specific On-Chain Operation

Retrieve the schema for Service operations only:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "get",
    "name": "onchain_operations_service"
  }
}
```

This returns the `CallService_InputSchema` — the exact structure for creating or operating a Service object, including all optional fields (`description`, `location`, `sales`, `order_new`, etc.) and their types.

---

### Example 4: Get the Output Schema of a Sub-Tool

Retrieve the **output** (return value) schema of `onchain_operations`:

```json
{
  "tool": "schema_query",
  "data": {
    "action": "get_output",
    "name": "onchain_operations"
  }
}
```

This is useful when you need to know the shape of the result before processing it — for example, whether the result will be `{type: "data", data: [...]}`, `{type: "transaction", ...}`, or `{type: "submission", ...}`.

---

### Example 5: Search Schemas by Keyword

Find every schema whose name or description mentions "guard":

```json
{
  "tool": "schema_query",
  "data": {
    "action": "search",
    "query": "guard"
  }
}
```

**Result (excerpt):**
```json
{
  "result": {
    "status": "success",
    "data": {
      "success": true,
      "action": "search",
      "message": "Found 2 schemas matching 'guard'",
      "data": [
        {
          "name": "onchain_operations_guard",
          "title": "Onchain Operations - Guard",
          "description": "Guard object on-chain operations.",
          "path": "schemas/onchain_operations_guard.schema.json"
        },
        {
          "name": "guard2file",
          "title": "Guard To File",
          "description": "Export a Guard object to a portable file format.",
          "path": "schemas/guard2file.schema.json"
        }
      ]
    }
  },
  "schema": null
}
```

---

### Example 6: List Only On-Chain Operations

When you only care about the 16 on-chain operation types (not the local/query sub-tools):

```json
{
  "tool": "schema_query",
  "data": {
    "action": "list_operations"
  }
}
```

**Result (excerpt):**
```json
{
  "result": {
    "status": "success",
    "data": {
      "success": true,
      "action": "list_operations",
      "message": "Found 16 on-chain operations",
      "data": [
        {
          "name": "onchain_operations_permission",
          "title": "Onchain Operations - Permission",
          "description": "Permission object on-chain operations.",
          "path": "schemas/onchain_operations_permission.schema.json"
        },
        {
          "name": "onchain_operations_repository",
          "title": "Onchain Operations - Repository",
          "description": "Repository object on-chain operations.",
          "path": "schemas/onchain_operations_repository.schema.json"
        },
        {
          "name": "onchain_operations_machine",
          "title": "Onchain Operations - Machine",
          "description": "Machine object on-chain operations.",
          "path": "schemas/onchain_operations_machine.schema.json"
        },
        {
          "name": "onchain_operations_service",
          "title": "Onchain Operations - Service",
          "description": "Service object on-chain operations.",
          "path": "schemas/onchain_operations_service.schema.json"
        }
        // ... 12 more on-chain operation schemas (progress, treasury, reward, allocation,
        //     order, demand, guard, arbitration, personal, contact, payment, proof)
      ]
    }
  },
  "schema": null
}
```

> **Note**: `onchain_operations_bridge` is a separate operation schema for cross-chain bridge operations. It is included in the full `list` but may appear under bridge-specific tooling rather than the standard 16 object operations.

---

## Recommended Workflow

### For AI Agents

The `wowok` handler already returns the correct schema on any parameter mismatch (status `schema_mismatch`), so the typical flow is **try-then-fix** rather than **query-then-call**:

1. **Call the sub-tool directly** via `wowok({ tool, data })`.
2. **If you receive `result.status === "schema_mismatch"`** — Read `schema.input`, fix the parameters, cache the schema, and retry. No `schema_query` call is needed.
3. **Use `schema_query` proactively** only when you want to:
   - Browse all available schemas (`action: "list"`)
   - Discover capabilities you may not know exist (`action: "search"`)
   - Pre-fetch a schema for planning before the first call (`action: "get"`)
   - Understand the output shape of a sub-tool (`action: "get_output"`)

### For Developers

- **Debugging a failed call**: use `get` to verify the exact field names, types, and required/optional markers.
- **Understanding return values**: use `get_output` to see what fields the result will contain.
- **Discovering capabilities**: use `list` or `search` to find sub-tools you may not know exist.

---

## Important Notes

⚠️ **Single tool entry point** — `schema_query` is a sub-tool dispatched via `wowok({ tool: "schema_query", data: {...} })`. It is NOT registered as a standalone MCP tool.

⚠️ **Schemas are authoritative** — The JSON Schemas returned by `schema_query` are generated directly from the Zod definitions in the MCP server source code. They are always up-to-date; documentation may lag.

⚠️ **Mismatch responses already include schemas** — When a `wowok` call fails validation (`result.status === "schema_mismatch"`), the response carries the correct schema in `schema.input`. You usually do not need a separate `schema_query` call.

⚠️ **`get` vs `get_output`** — `get` returns the **input** schema (what you send to the sub-tool); `get_output` returns the **output** schema (what the sub-tool returns). Both require the `name` parameter inside `data`.

⚠️ **On-chain operation naming** — On-chain operation input schemas are named `onchain_operations_<object_type>`. The wrapper schema that contains all 16 operation types is named `onchain_operations`.

⚠️ **Search is keyword-based** — The `search` action matches against schema names and descriptions. It is case-insensitive and supports partial matches.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Response Format](response-format.md)** | Unified `wowok` response envelope and `schema_mismatch` flow |
| **[Stage 7: Data Query](stage-07-query.md)** | Tutorial covering all query sub-tools including `schema_query` |
| **[wowok_buildin_info](wowok_buildin_info.md)** | Query protocol constants, permissions, Guard instructions, and mainnet bridge tokens |
| **[query_toolkit](query.md)** | Query local and on-chain business data |
