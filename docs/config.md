# Config Component (⚙️ Runtime Service Toggles)

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "config_operation", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The Config component provides runtime control over Phase 2 services. It allows AI or users to toggle services on/off WITHOUT restarting the MCP server. This is the session-level switch mechanism for enabling/disabling features like the Safety Confirmation Gate, Project Namespace, Harness Verify Loop, and more.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **List Services** | View all services with current state | Check which features are active | Understand current runtime configuration |
| **Toggle Service** | Switch a service on/off | Enable or disable a feature mid-session | Quick runtime control without restart |
| **Enable Service** | Turn a service on | Activate a specific feature | Explicit enablement with confirmation |
| **Disable Service** | Turn a service off | Deactivate a specific feature | Explicit disablement with confirmation |
| **Reset Service** | Restore default state | Revert a service to its default | Undo manual changes |
| **Service Info** | Get detailed info about a service | Understand what a service does | Learn about service behavior and side effects |

---

## Complete Tool Call Structure

```json
{
  "tool": "config_operation",
  "data": {
    "action": "list | toggle | enable | disable | reset | info",
    "service": "service_name"
  }
}
```

---

## Schema Tree

```
config_operation (Runtime Service Toggles)
├── action (required)
│   ├── "list" — List all services with current state
│   ├── "toggle" — Toggle a service on/off (requires service)
│   ├── "enable" — Enable a service (requires service)
│   ├── "disable" — Disable a service (requires service)
│   ├── "reset" — Reset a service to default (requires service)
│   └── "info" — Get detailed info about a service (requires service)
└── service (optional, required for toggle/enable/disable/reset/info)
    ├── "confirm_gate" — Safety Confirmation Gate (default ON)
    ├── "project_service" — Project Namespace + Dependency Graph (default ON)
    ├── "harness" — L4 Verify/Recover Loop (default OFF)
    ├── "graph_persist" — Graph Persistence to File (default OFF)
    ├── "semantic_rich" — Semantic Layer Enrichment Reminder (default ON)
    ├── "experience_layer" — Real-time Experience Layer (default ON)
    ├── "customer_intelligence" — Buyer Intelligence / Risk & Preference Alerts (default ON)
    ├── "order_monitor" — In-progress Order Monitoring (default OFF)
    └── "industry_evolution" — Industry Specialization Evolution Flywheel (default ON)
```

---

## Available Services

| Service Name | Default | Description |
|--------------|---------|-------------|
| `confirm_gate` | ON | Safety Confirmation Gate — requires explicit confirmation before destructive operations |
| `project_service` | ON | Project Namespace + Dependency Graph — auto-injects `project:<prefix>` tags and maintains object DAG |
| `harness` | OFF | L4 Verify/Recover Loop — runs verify + recover loops on every call result |
| `graph_persist` | OFF | Graph Persistence to File — saves object dependency graph to `~/.wowok/project-graph.json` |
| `semantic_rich` | ON | Semantic Layer Enrichment — adds semantic summary and next-action hints to responses |
| `experience_layer` | ON | Real-time Experience Layer — enhances user-facing response formatting |
| `customer_intelligence` | ON | Buyer Intelligence — injects risk and preference alerts into onchain_operations semantic output |
| `order_monitor` | OFF | In-progress Order Monitoring — tracks active orders and alerts on status changes |
| `industry_evolution` | ON | Industry Specialization Evolution — adapts behavior based on industry context |

> **Note**: Toggles persist for the MCP process lifetime. Set `WOWOK_RUNTIME_CONFIG_PERSIST=1` to persist across sessions to `~/.wowok/runtime-config.json`.

---

## Example 1: List All Services

### Feature Description

List all runtime services with their current enabled state and reminder text.

### Examples

#### Example 1.1: List All Services

**Prompt**: Show me all available runtime services and their current state.

```json
{
  "tool": "config_operation",
  "data": {
    "action": "list"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "action": "list",
        "services": [
          {
            "name": "confirm_gate",
            "enabled": true,
            "reminder": "Safety Confirmation Gate is active — destructive operations require explicit confirmation."
          },
          {
            "name": "project_service",
            "enabled": true,
            "reminder": "Project Namespace service is active — object tags are auto-injected."
          },
          {
            "name": "harness",
            "enabled": false,
            "reminder": "L4 Harness Verify/Recover Loop is disabled."
          },
          {
            "name": "semantic_rich",
            "enabled": true,
            "reminder": "Semantic Layer Enrichment is active — responses include semantic summaries."
          }
        ]
      }
    }
  },
  "schema": null
}
```

> **Note**: The list includes all 9 services with their current state. Services marked `enabled: true` are active.

---

## Example 2: Toggle a Service

### Feature Description

Toggle a service on/off. If the service is currently enabled, it will be disabled; if disabled, it will be enabled.

### Examples

#### Example 2.1: Toggle Harness On

**Prompt**: Enable the L4 Harness Verify/Recover Loop.

```json
{
  "tool": "config_operation",
  "data": {
    "action": "toggle",
    "service": "harness"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "action": "toggle",
        "service": "harness",
        "enabled": true,
        "reminder": "L4 Harness Verify/Recover Loop is now active — verify and recover loops will run on every call."
      }
    }
  },
  "schema": null
}
```

---

## Example 3: Enable/Disable a Service

### Feature Description

Explicitly enable or disable a specific service. Unlike toggle, this ensures the service reaches the desired state regardless of its current state.

### Examples

#### Example 3.1: Disable Semantic Enrichment

**Prompt**: Turn off the semantic layer enrichment to reduce response size.

```json
{
  "tool": "config_operation",
  "data": {
    "action": "disable",
    "service": "semantic_rich"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "action": "disable",
        "service": "semantic_rich",
        "enabled": false,
        "reminder": "Semantic Layer Enrichment is now disabled — responses will not include semantic summaries."
      }
    }
  },
  "schema": null
}
```

#### Example 3.2: Enable Graph Persistence

**Prompt**: Enable graph persistence so the object dependency graph is saved to file.

```json
{
  "tool": "config_operation",
  "data": {
    "action": "enable",
    "service": "graph_persist"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "action": "enable",
        "service": "graph_persist",
        "enabled": true,
        "reminder": "Graph Persistence is now active — graph will be saved to ~/.wowok/project-graph.json."
      }
    }
  },
  "schema": null
}
```

---

## Example 4: Reset a Service

### Feature Description

Reset a service to its default state. This is useful for undoing manual toggles.

### Examples

#### Example 4.1: Reset Harness to Default

**Prompt**: Reset the harness service to its default state.

```json
{
  "tool": "config_operation",
  "data": {
    "action": "reset",
    "service": "harness"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "action": "reset",
        "service": "harness",
        "enabled": false,
        "reset": true,
        "reminder": "L4 Harness Verify/Recover Loop has been reset to default (disabled)."
      }
    }
  },
  "schema": null
}
```

> **Note**: The `reset: true` field confirms a reset was performed. The `enabled` field reflects the default state.

---

## Example 5: Get Service Info

### Feature Description

Get detailed information about a specific service, including its current state and behavior description.

### Examples

#### Example 5.1: Get Project Service Info

**Prompt**: Tell me about the project_service — what does it do?

```json
{
  "tool": "config_operation",
  "data": {
    "action": "info",
    "service": "project_service"
  }
}
```

**Execution Result**:
```json
{
  "result": {
    "status": "success",
    "data": {
      "result": {
        "action": "info",
        "service": "project_service",
        "enabled": true,
        "reminder": "Project Namespace service is active — auto-injects project:<prefix> tags into object creation and maintains the object dependency graph."
      }
    }
  },
  "schema": null
}
```

---

## Important Notes

⚠️ **Session-level persistence**: Toggles persist for the MCP process lifetime. To persist across sessions, set `WOWOK_RUNTIME_CONFIG_PERSIST=1`.

⚠️ **Service names are case-sensitive**: Use the exact service name as shown in the list (e.g., `confirm_gate`, not `ConfirmGate`).

⚠️ **Disabling critical services**: Disabling `confirm_gate` or `project_service` may affect safety and traceability. Use with caution.

⚠️ **Unknown service error**: If you provide an unknown service name, the handler will throw an error. Use `action: "list"` to see all valid service names.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Project](project.md)** | Project-based deployment — uses `project_service` toggle |
| **[Response Format](response-format.md)** | Semantic layer enrichment — controlled by `semantic_rich` toggle |
| **[Schema Query](schema-query.md)** | Query tool schemas — use to get exact field definitions for `config_operation` |
