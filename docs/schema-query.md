# Schema Query — Universal Lookup Skill (📋 Meta-Tool)

---

## Why a "Universal Lookup Skill"?

The WoWok MCP Server exposes 14 tools and 16 on-chain operation types — over 30 schemas in total. Remembering the exact parameter structure for every one is impractical, and documentation can lag behind the code.

`schema_query` is a **meta-tool**: it does not query business data. It queries **the tools themselves** — their input/output schemas, field types, required vs. optional parameters, and discriminators. Think of it as "self-introspection" for the MCP server.

**Core principle: before calling any unfamiliar WoWok tool, query its schema first.**

---

## How It Differs from Other Query Tools

| Tool | What it queries | Typical question |
|------|----------------|------------------|
| `query_toolkit` | Business data (accounts, balances, objects) | "What is Alice's WOW balance?" |
| `onchain_table_data` | Dynamic table items on-chain | "What are this Permission's perm items?" |
| `onchain_events` | On-chain emitted events | "What NewOrderEvents happened?" |
| `wowok_buildin_info` | Protocol constants & enumerations | "What are the built-in permission indexes?" |
| **`schema_query`** | **Tool & operation schemas (metadata)** | **"What fields does `onchain_operations_treasury` require?"** |

The first four answer *"what is the data?"*; `schema_query` answers *"how do I call the tool that gets or mutates the data?"*.

---

## Actions

`schema_query` supports five actions:

| Action | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| `list` | — | Array of schema names | Enumerate every available schema (tools + operations) |
| `get` | `name` | JSON Schema (input) | Get the **input** schema of a tool or operation by name |
| `get_output` | `name` | JSON Schema (output) | Get the **output** schema of a tool by name |
| `search` | `query` | Array of matching schema names | Find schemas by keyword (name or description) |
| `list_operations` | — | Array of on-chain operation names | List only the 16 on-chain operation types (subset of `list`) |

---

## Tool Call Structure

```json
{
  "action": "list | get | get_output | search | list_operations",
  "name": "schema_name",   // required for "get" and "get_output"
  "query": "keyword"       // required for "search"
}
```

---

## Examples

### Example 1: List All Available Schemas

Enumerate every schema registered on the MCP server (tools + on-chain operations).

```json
{
  "action": "list"
}
```

**Result (excerpt):**
```json
{
  "result": {
    "type": "data",
    "data": [
      "account_operation",
      "local_mark_operation",
      "local_info_operation",
      "query_toolkit",
      "onchain_table_data",
      "onchain_events",
      "wowok_buildin_info",
      "schema_query",
      "guard2file",
      "machineNode2file",
      "wip_file",
      "messenger_operation",
      "bridge_operation",
      "onchain_operations",
      "onchain_operations_permission",
      "onchain_operations_repository",
      "onchain_operations_treasury",
      "onchain_operations_service",
      "onchain_operations_machine",
      "onchain_operations_progress",
      "onchain_operations_reward",
      "onchain_operations_allocation",
      "onchain_operations_order",
      "onchain_operations_demand",
      "onchain_operations_guard",
      "onchain_operations_arbitration",
      "onchain_operations_personal",
      "onchain_operations_contact",
      "onchain_operations_payment",
      "onchain_operations_proof",
      "onchain_operations_bridge"
    ]
  }
}
```

> **Tip**: On-chain operation schemas follow the naming convention `onchain_operations_<object_type>` (e.g. `onchain_operations_service` for Service operations).

---

### Example 2: Get the Input Schema of a Specific Tool

Retrieve the full JSON Schema for the `onchain_operations` input (the wrapper that carries all 16 operation types):

```json
{
  "action": "get",
  "name": "onchain_operations"
}
```

**Result (excerpt):**
```json
{
  "result": {
    "type": "data",
    "data": {
      "type": "object",
      "properties": {
        "operation_type": {
          "type": "string",
          "enum": ["permission", "repository", "machine", "service", ...]
        },
        "data": { ... },
        "env": { ... },
        "submission": { ... }
      },
      "required": ["operation_type", "data"]
    }
  }
}
```

---

### Example 3: Get the Input Schema of a Specific On-Chain Operation

Retrieve the schema for Service operations only:

```json
{
  "action": "get",
  "name": "onchain_operations_service"
}
```

This returns the `CallService_InputSchema` — the exact structure for creating or operating a Service object, including all optional fields (`description`, `location`, `sales`, `order_new`, etc.) and their types.

---

### Example 4: Get the Output Schema of a Tool

Retrieve the **output** (return value) schema of `onchain_operations`:

```json
{
  "action": "get_output",
  "name": "onchain_operations"
}
```

This is useful when you need to know the shape of the result before processing it — for example, whether the result will be `{type: "data", data: [...]}`, `{type: "transaction", ...}`, or `{type: "submission", ...}`.

---

### Example 5: Search Schemas by Keyword

Find every schema whose name or description mentions "guard":

```json
{
  "action": "search",
  "query": "guard"
}
```

**Result (excerpt):**
```json
{
  "result": {
    "type": "data",
    "data": [
      "onchain_operations_guard",
      "guard2file"
    ]
  }
}
```

---

### Example 6: List Only On-Chain Operations

When you only care about the 16 on-chain operation types (not the local/query tools):

```json
{
  "action": "list_operations"
}
```

**Result (excerpt):**
```json
{
  "result": {
    "type": "data",
    "data": [
      "onchain_operations_permission",
      "onchain_operations_repository",
      "onchain_operations_machine",
      "onchain_operations_service",
      "onchain_operations_progress",
      "onchain_operations_treasury",
      "onchain_operations_reward",
      "onchain_operations_allocation",
      "onchain_operations_order",
      "onchain_operations_demand",
      "onchain_operations_guard",
      "onchain_operations_arbitration",
      "onchain_operations_personal",
      "onchain_operations_contact",
      "onchain_operations_payment",
      "onchain_operations_proof"
    ]
  }
}
```

> **Note**: `onchain_operations_bridge` is a separate operation schema for cross-chain bridge operations. It is included in the full `list` but may appear under bridge-specific tooling rather than the standard 16 object operations.

---

## Recommended Workflow

### For AI Agents

When an AI agent encounters a WoWok tool it has not used before, the recommended workflow is:

1. **`list`** — See all available schemas.
2. **`get`** — Retrieve the input schema for the specific tool/operation.
3. **`get_output`** (optional) — Retrieve the output schema to understand the return shape.
4. **Construct the call** — Fill in the parameters according to the schema.
5. **Execute** — Call the actual tool.

This "query-then-call" pattern guarantees parameter accuracy and avoids schema drift between documentation and code.

### For Developers

- **Debugging a failed call**: use `get` to verify the exact field names, types, and required/optional markers.
- **Understanding return values**: use `get_output` to see what fields the result will contain.
- **Discovering capabilities**: use `list` or `search` to find tools you may not know exist.

---

## Important Notes

⚠️ **Schemas are authoritative** — The JSON Schemas returned by `schema_query` are generated directly from the Zod definitions in the MCP server source code. They are always up-to-date; documentation may lag.

⚠️ **`get` vs `get_output`** — `get` returns the **input** schema (what you send to the tool); `get_output` returns the **output** schema (what the tool returns). Both require the `name` parameter.

⚠️ **On-chain operation naming** — On-chain operation input schemas are named `onchain_operations_<object_type>`. The wrapper schema that contains all 16 operation types is named `onchain_operations`.

⚠️ **Search is keyword-based** — The `search` action matches against schema names and descriptions. It is case-insensitive and supports partial matches.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Stage 7: Data Query](stage-07-query.md)** | Tutorial covering all query tools including `schema_query` |
| **[wowok_buildin_info](wowok_buildin_info.md)** | Query protocol constants, permissions, Guard instructions, and mainnet bridge tokens |
| **[query_toolkit](query.md)** | Query local and on-chain business data |
