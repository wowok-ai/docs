# Config Component (⚙️ Runtime Service Toggles)

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "config_operation", data: {<params>} })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The Config component provides runtime control over MCP services. It allows AI or users to toggle services on/off WITHOUT restarting the MCP server. This is the session-level switch mechanism for enabling/disabling features like the Safety Confirmation Gate, Harness Verify Loop, Experience Layer, and more.

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
    ├── "confirm_gate" — Security Confirmation Gate (default ON)
    ├── "harness" — L4 Harness Verify/Recover Loop, tiered off/lightweight/full (default ON, tier lightweight)
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
| `confirm_gate` | ON | Security Confirmation Gate — prompts user confirmation before amount, default account, publish, or irreversible operations |
| `harness` | ON | L4 Harness Verify/Recover Loop — automatically validates expected results around operations. Tiered: `off` / `lightweight` (Plan+Verify) / `full` (Plan+Expect+Verify+Recover); tier controlled by `WOWOK_HARNESS_TIER` or the harness API, default `lightweight` |
| `semantic_rich` | ON | Semantic Layer Enrichment — attaches extra reminder info such as service_status in responses |
| `experience_layer` | ON | Real-time Experience Layer — intent distillation + user profiling + experience reuse, gets smarter with usage |
| `customer_intelligence` | ON | Buyer Intelligence — attaches risk reminders, preference matching, and blocking alerts in `semantic.customer_advice` for order/query operations |
| `order_monitor` | OFF | In-progress Order Monitoring — detects Progress stalls / compensation balance changes / Messenger timeouts; must be actively enabled |
| `industry_evolution` | ON | Industry Specialization Evolution — AI-Human-WOW flywheel loop: captures industry signals + updates knowledge + injects evolution context |

> **Note**: Toggles persist for the MCP process lifetime. Set `WOWOK_RUNTIME_CONFIG_PERSIST=1` to persist across sessions to `~/.wow/mcp/runtime-config.json` (Windows: `%USERPROFILE%\.wow\mcp\`; override the directory with `WOWOK_CONFIG_DIR`).

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
            "reminder": "ConfirmGate is ON: prompts confirmation before amount, default account, publish, or irreversible operations. To disable, call config_operation toggle confirm_gate."
          },
          {
            "name": "harness",
            "enabled": true,
            "reminder": "Harness is ON (tier: lightweight): automatically validates expected results around operations. lightweight=Plan+Verify; full=Plan+Expect+Verify+Recover. To change tier, set WOWOK_HARNESS_TIER or call harness API. To disable, call config_operation toggle harness."
          },
          {
            "name": "semantic_rich",
            "enabled": true
          },
          {
            "name": "order_monitor",
            "enabled": false,
            "reminder": "Order monitor is OFF: will not actively detect order anomalies. To enable (recommended when there are active orders), call config_operation toggle order_monitor."
          }
        ]
      }
    }
  },
  "schema": null
}
```

> **Note**: The list includes all 7 services with their current state (output above is abridged). Services marked `enabled: true` are active. `semantic_rich` carries no reminder text.

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
        "reminder": "Harness is ON (tier: lightweight): automatically validates expected results around operations. lightweight=Plan+Verify; full=Plan+Expect+Verify+Recover. To change tier, set WOWOK_HARNESS_TIER or call harness API. To disable, call config_operation toggle harness."
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

#### Example 3.2: Enable Order Monitor

**Prompt**: Enable order monitoring so active orders are watched for stalls and anomalies.

```json
{
  "tool": "config_operation",
  "data": {
    "action": "enable",
    "service": "order_monitor"
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
        "service": "order_monitor",
        "enabled": true,
        "reminder": "Order monitor is ON: detects Progress stalls, compensation balance changes, and Messenger timeouts. To disable, call config_operation toggle order_monitor."
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
        "enabled": true,
        "reset": true,
        "reminder": "Harness is ON (tier: lightweight): automatically validates expected results around operations. lightweight=Plan+Verify; full=Plan+Expect+Verify+Recover. To change tier, set WOWOK_HARNESS_TIER or call harness API. To disable, call config_operation toggle harness."
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

#### Example 5.1: Get Harness Service Info

**Prompt**: Tell me about the harness service — what does it do?

```json
{
  "tool": "config_operation",
  "data": {
    "action": "info",
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
        "action": "info",
        "service": "harness",
        "enabled": true,
        "reminder": "Harness is ON (tier: lightweight): automatically validates expected results around operations. lightweight=Plan+Verify; full=Plan+Expect+Verify+Recover. To change tier, set WOWOK_HARNESS_TIER or call harness API. To disable, call config_operation toggle harness."
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

⚠️ **Disabling critical services**: Disabling `confirm_gate` or `harness` may affect safety and traceability. Use with caution.

⚠️ **Unknown service error**: If you provide an unknown service name, the handler will throw an error. Use `action: "list"` to see all valid service names.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Project](project.md)** | Planning pipeline (now via `goal_operation` C1-C3 actions — the legacy `project_service` toggle has been removed) |
| **[Response Format](response-format.md)** | Semantic layer enrichment — controlled by `semantic_rich` toggle |
| **[Schema Query](schema-query.md)** | Query tool schemas — use to get exact field definitions for `config_operation` |
