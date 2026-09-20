# Project Component (🗂️ 5-Stage Deployment & Object Graph)

---

> **⚠️ Migration Notice**: The `project_operation` tool has been REMOVED from the MCP. Its capabilities were redistributed:
>
> | Former capability | Where it lives now |
> |---|---|
> | `analyze_intent` (Stage 2) | `goal_operation` action=`analyze_intent` (C1) |
> | `aggregate_risks` (Stage 3) | `goal_operation` action=`aggregate_risks` (C2) |
> | `trace_substeps` (Stage 5) | `goal_operation` action=`trace_substeps` (C3) |
> | `get_project_status` | `goal_operation` action=`get` (+ `process_summary` for attached TaskProcesses) |
> | Graph / panorama queries (`list_projects`, `list_objects`, `shareable`, `dependencies`, `referenced_by`, `cross_project_refs`, `graph_stats`) | `query_toolkit` query types: `service_panorama`, `machine_panorama`, `object_panorama`, `onchain_topology`, `relationship_profile`, `reverse_map`, `participation_radar`, `review_pack`, `assemble_context`, `workspace_lists`, `marks_of_account` |
> | `save_graph` / `load_graph` | `workspace_operation` actions `write` / `read` |
> | `generate_deployment_doc` (D-01..D-18 scanner) | REMOVED — deployment-doc generation no longer exists; coherence is verified by C3 `trace_substeps` (D-10 verdict) and the Harness deploy-time checks |
>
> Call `goal_operation({ action: "analyze_intent", intent: "...", project: "<prefix>", version: "<version>" })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The Project component manages the deployment workflow for multi-object WoWok services: parse a business intent into an Object Dependency Graph (ODG), calibrate deployment risks, trace substep coherence, and execute the creation plan through `onchain_operations`. Pipeline state is keyed by a `project` prefix + `version` (stage cache), and deterministic planning outputs (puzzles, findings, topological order) feed each next stage.

---

## Deployment Workflow

### Correct Object Creation Order (Topological)

```
Permission → Allocation → Guard → Machine → Service
```

All objects created as draft (`publish=false`) first; publish Machine before Service (last).

### Stage Flow

```
Stage 1: Project Naming (project + version params)
    ↓
Stage 2: goal_operation analyze_intent (C1) → ODG + puzzles + creation order
    ↓ (fill missing fields if needed)
Stage 3: goal_operation aggregate_risks (C2) → findings + can_proceed
    ↓ (fix CRITICAL risks if any)
Stage 4: Execute the creation plan via onchain_operations
    ↓ (record each executed substep)
Stage 5: goal_operation trace_substeps (C3) → coherence + D-10 verdict
    ↓ (fix dangling inputs / cycles if any)
Done
```

The optional 10-step `merchant_guide` wizard covers the same ground from the merchant's perspective (intent → industry confirmation → module adoption → SemanticObjectGraph blueprint → evaluation preview → harness check → creation plan) — see below.

---

## Planning Pipeline Schema (goal_operation actions)

```
goal_operation (planning actions)
├── action: "analyze_intent" (C1)
│   ├── intent (optional) — business intent text, max 2000 chars
│   ├── project_name (optional) — business name (intent fallback)
│   ├── project_description (optional) — business description (intent fallback)
│   ├── project_industry (optional) — "general" | "retail" | "retail_d2c" | "service" | "rental" | "freelance" | "education" | "travel" | "subscription" | "custom"
│   ├── target_objects (optional) — explicit target entry_ids or object_type names
│   ├── project (optional) — project prefix (e.g. "myshop"); keys the stage cache
│   ├── version (optional) — project version (regex ^v\d+$, default "v1")
│   └── network (optional) — "testnet" | "mainnet"
│
├── action: "aggregate_risks" (C2)
│   ├── project (required in practice) — project prefix for the stage cache
│   ├── version (optional) — regex ^v\d+$, default "v1"
│   ├── puzzles (optional) — per-object snapshots { puzzle, completeness, missing_dimensions } keyed by object_type; pass UNCHANGED from C1
│   ├── intent / project_name / project_description / project_industry (optional) — when puzzles is omitted and intent is present, C1 runs automatically first (C1→C2 in one call)
│   ├── severity_threshold (optional) — "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" (default "HIGH")
│   ├── user_confirmed_high_risks (optional) — IDs of HIGH risks confirmed in a prior round
│   ├── planned_objects (optional) — [{ object_type, is_new, name? }] for the OBJECT_REUSE check
│   ├── planned_operations (optional) — [{ object_type, trigger: "create"|"publish", name? }] for the IMMUTABILITY check
│   └── network (optional) — "testnet" | "mainnet"
│
├── action: "trace_substeps" (C3)
│   ├── project (required in practice) — project prefix for the stage cache
│   ├── version (optional) — regex ^v\d+$, default "v1"
│   ├── substeps (required) — execution records: [{ step_id "T<step>.<sub>", parent_step "T<step>", object_type, entry_id, operation_type, network, input: { data, input_refs }, output?: { object_id?, tx_digest? }, timestamp, status: "PENDING"|"SUCCESS"|"FAILED"|"SKIPPED", failure_reason?, dependencies: { input_refs, output_refs: [{ substep_id, field_path }] }, retry_info? }]
│   ├── substep_edges (optional) — [{ source, target, field_path }]; derived from input_refs when omitted
│   └── network (optional) — "testnet" | "mainnet"
│
└── action: "merchant_guide"
    ├── intent / project_name / project_description / project_industry (optional)
    ├── guide_state (optional) — wizard state from a prior result; pass back UNCHANGED
    └── guide_confirm (optional) — merchant decisions for the current step (industry / currency / deliverables / payment / trust / adopted_module_ids)
```

> **Note**: `analyze_intent` without `project` is a pure analysis call (no stage-cache state). C2 and C3 key their stage cache by `project:version` and warn when called out of sequence (e.g. `aggregate_risks` before `analyze_intent`).

---

## Example 1: Analyze Intent (Stage 2, C1)

### Feature Description

Parse natural-language business intent into an Object Dependency Graph (ODG). Produces per-object puzzles, completeness assessment, and recommended creation order.

### Examples

#### Example 1.1: Analyze Retail Shop Intent

**Prompt**: I want to build an online retail shop called "myshop". It should have a service for selling products, a machine workflow for order processing, and arbitration for dispute resolution. Use version v1.

```json
{
  "tool": "goal_operation",
  "data": {
    "action": "analyze_intent",
    "project": "myshop",
    "version": "v1",
    "intent": "Build an online retail shop with product selling service, order processing machine workflow, and dispute resolution arbitration",
    "project_industry": "retail"
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
        "action": "analyze_intent",
        "intent_parsed": {
          "primary_object": "service",
          "secondary_objects": ["machine", "arbitration", "permission", "guard"],
          "detected_scenes": [
            {
              "object": "service",
              "scene_id": "retail_shop"
            }
          ],
          "industry": "retail",
          "keyword_matches": [
            {
              "keyword": "service",
              "category": "core",
              "matched_objects": ["service"],
              "required_level": "R",
              "match_count": 1
            },
            {
              "keyword": "machine",
              "category": "workflow",
              "matched_objects": ["machine"],
              "required_level": "R",
              "match_count": 1
            },
            {
              "keyword": "arbitration",
              "category": "trust",
              "matched_objects": ["arb"],
              "required_level": "C",
              "match_count": 1
            }
          ]
        },
        "puzzles": {
          "service": {
            "puzzle": {
              "name": "myshop_service",
              "description": "Online retail shop service",
              "sales": "pending",
              "machine": "pending",
              "buy_guard": "pending"
            },
            "completeness": {
              "name": true,
              "description": true,
              "sales": false,
              "machine": false,
              "buy_guard": false
            },
            "missing_dimensions": ["sales", "machine", "buy_guard"]
          },
          "machine": {
            "puzzle": {
              "name": "myshop_workflow",
              "nodes": "pending"
            },
            "completeness": {
              "name": true,
              "nodes": false
            },
            "missing_dimensions": ["nodes"]
          }
        },
        "overall_completeness": "partial",
        "next_step": "Fill missing fields: service.sales, service.machine, service.buy_guard, machine.nodes",
        "recommended_creation_order": ["permission", "guard", "machine", "service", "arb"],
        "warnings": []
      }
    }
  },
  "schema": null
}
```

> **Note**: Pass the `puzzles` object UNCHANGED to `aggregate_risks` in the next stage. Fill missing fields before proceeding so risk calibration sees complete puzzles.

---

## Example 2: Aggregate Risks (Stage 3, C2)

### Feature Description

Evaluate deployment risks from puzzle data. CRITICAL risks (or risks at/above `severity_threshold`) block deployment (status `RISK_BLOCKED`); HIGH risks without confirmation yield `RISK_PENDING_CONFIRM`; lower severities only warn.

### Examples

#### Example 2.1: Check Risks (C1→C2 in one call)

**Prompt**: Run risk assessment for myshop v1. Here are the completed puzzles.

```json
{
  "tool": "goal_operation",
  "data": {
    "action": "aggregate_risks",
    "project": "myshop",
    "version": "v1",
    "project_industry": "retail",
    "puzzles": {
      "service": {
        "puzzle": { "name": "myshop_service", "sales": [{"price": "1000000000"}], "machine": "myshop_workflow", "buy_guard": "myshop_guard" },
        "completeness": { "name": true, "sales": true, "machine": true, "buy_guard": true },
        "missing_dimensions": []
      },
      "machine": {
        "puzzle": { "name": "myshop_workflow", "nodes": [{"name": "start"}, {"name": "processing"}, {"name": "delivery"}] },
        "completeness": { "name": true, "nodes": true },
        "missing_dimensions": []
      }
    },
    "severity_threshold": "MEDIUM"
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
        "action": "aggregate_risks",
        "namespace": {
          "prefix": "myshop",
          "version": "v1",
          "industry": "retail"
        },
        "findings": [
          {
            "risk_rule_id": "R-FUND-001",
            "object_type": "service",
            "entry_id": "service:myshop_service",
            "severity": "HIGH",
            "message": "No compensation fund configured for the service.",
            "fix_suggestion": "Deposit funds to the service compensation fund to cover potential disputes.",
            "details": {
              "field_path": "compensation_fund",
              "rule_source": "fund-safety-rules"
            }
          },
          {
            "risk_rule_id": "R-ARB-001",
            "object_type": "service",
            "entry_id": "service:myshop_service",
            "severity": "MEDIUM",
            "message": "No arbitration attached to the service.",
            "fix_suggestion": "Bind an arbitration object to the service for dispute resolution.",
            "details": {
              "field_path": "arbitrations",
              "rule_source": "trust-rules"
            }
          }
        ],
        "severity_summary": {
          "CRITICAL": 0,
          "HIGH": 1,
          "MEDIUM": 1,
          "LOW": 0,
          "INFO": 0
        },
        "status": "RISK_PASSED",
        "fix_suggestions_grouped": {
          "service": [
            {
              "risk_rule_id": "R-FUND-001",
              "severity": "HIGH",
              "message": "No compensation fund configured for the service.",
              "fix_suggestion": "Deposit funds to the service compensation fund to cover potential disputes.",
              "entry_id": "service:myshop_service"
            },
            {
              "risk_rule_id": "R-ARB-001",
              "severity": "MEDIUM",
              "message": "No arbitration attached to the service.",
              "fix_suggestion": "Bind an arbitration object to the service for dispute resolution.",
              "entry_id": "service:myshop_service"
            }
          ]
        },
        "calibrated_at": 1784673600000,
        "warnings": []
      }
    }
  },
  "schema": null
}
```

> **Note**: `status: "RISK_PASSED"` because no risk reached the MEDIUM threshold as blocking (0 CRITICAL). Address the HIGH/MEDIUM findings for better safety. A `RISK_PENDING_CONFIRM` status lists `pending_confirmations` — resolve them via `user_confirmed_high_risks` on a follow-up call.

---

## Example 3: Trace Substeps (Stage 5, C3)

### Feature Description

Verify substep execution coherence after deployment: dangling inputs, circular references, missing outputs, cross-step breaks, topological order, and the D-10 substep-linkage verdict.

### Examples

#### Example 3.1: Trace a Completed Deployment

**Prompt**: Verify substep coherence for myshop v1 — these are the executed substeps.

```json
{
  "tool": "goal_operation",
  "data": {
    "action": "trace_substeps",
    "project": "myshop",
    "version": "v1",
    "network": "testnet",
    "substeps": [
      {
        "step_id": "T1.1",
        "parent_step": "T1",
        "object_type": "permission",
        "entry_id": "permission:myshop_perm",
        "operation_type": "permission",
        "network": "testnet",
        "input": { "data": { "object": { "name": "myshop_perm" } }, "input_refs": [] },
        "output": { "object_id": "0x…" },
        "timestamp": 1784673600000,
        "status": "SUCCESS",
        "dependencies": { "input_refs": [], "output_refs": [{ "substep_id": "T2.1", "field_path": "permission_address" }] }
      },
      {
        "step_id": "T2.1",
        "parent_step": "T2",
        "object_type": "service",
        "entry_id": "service:myshop_service",
        "operation_type": "service",
        "network": "testnet",
        "input": { "data": { "object": { "name": "myshop_service" }, "permission": "0x…" }, "input_refs": ["T1.1"] },
        "output": { "object_id": "0x…" },
        "timestamp": 1784673700000,
        "status": "SUCCESS",
        "dependencies": { "input_refs": ["T1.1"], "output_refs": [] }
      }
    ]
  }
}
```

**Response highlights**:
```json
{
  "result": {
    "action": "trace_substeps",
    "namespace": { "prefix": "myshop", "version": "v1" },
    "network": "testnet",
    "coherent": true,
    "dangling_inputs": [],
    "circular_refs": [],
    "missing_outputs": [],
    "cross_step_breaks": [],
    "topological_order": ["T1.1", "T2.1"],
    "d10_check": { "check_id": "D-10", "description": "Substep linkage completeness", "status": "PASS", "notes": [] }
  }
}
```

> **Note**: `coherent: true` + `D-10: PASS` means the execution trace is deployment-ready. Fix `dangling_inputs` / `circular_refs` / `missing_outputs` / `cross_step_breaks` before publishing.

---

## Example 4: Merchant Onboarding Wizard (Optional Path)

### Feature Description

`goal_operation` action=`merchant_guide` is a stateless 10-step wizard: intent text → BusinessIntent → industry confirmation → module adoption → SemanticObjectGraph blueprint → evaluation preview → harness check → creation plan. It NEVER executes on-chain operations; materialize the plan via `onchain_operations`.

### Examples

#### Example 4.1: Start the Wizard

**Prompt**: I rent cameras to photographers with a deposit and damage inspection. Guide me through building this service.

```json
{
  "tool": "goal_operation",
  "data": {
    "action": "merchant_guide",
    "intent": "I rent cameras to photographers with deposit and damage inspection"
  }
}
```

Pass the returned `guide_state` back UNCHANGED on every subsequent call, adding `guide_confirm` decisions (industry → deliverables → currency/payment → trust → module adoption) until `current_step` reaches 10 and `creation_plan` is returned.

---

## Graph & Business-Intelligence Queries (query_toolkit)

The former graph-query actions are served by `query_toolkit` query types. All are read-only and accept `context_network` ("testnet" | "mainnet" | "localnet"):

| query_type | Purpose |
|---|---|
| `service_panorama` | ONE-CALL full Service BI context (base data + workflow graph + guards + supply chain + trust + BusinessReport + recent orders) |
| `machine_panorama` | Machine counterpart (head + fields + workflow graph + Progress list) |
| `object_panorama` | Detail-page panorama for Progress / Demand / Order / Arb / Repository |
| `onchain_topology` | Expand the object graph outward from a seed address/name with semantic intents (full_map, fund_flow, workflow, counterparty, supply_chain, …) + analyzer findings (risk/arbitrage/opportunity/game) — replaces dependencies/referenced_by/graph_stats |
| `relationship_profile` | ONE account's full relationship web (employment, agency, supply, arbitration delegation, value flows, contact membership) |
| `reverse_map` | Deterministic L4→L1 business report from on-chain objects |
| `participation_radar` | In-flight order participation analysis for ONE account |
| `review_pack` | Typed ReviewPack for generic detail renderers |
| `assemble_context` | Semantic context assembly from on-chain objects |
| `workspace_lists` | ONE-CALL workspace object lists for one account (or all local accounts) |
| `marks_of_account` | LocalMark registry entries (registrar votes) keyed by account |

#### Example: Service Panorama

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "service_panorama",
    "service_address": "myshop_service",
    "context_network": "testnet"
  }
}
```

#### Example: Topology from a Service Seed

```json
{
  "tool": "query_toolkit",
  "data": {
    "query_type": "onchain_topology",
    "focus": "myshop_service",
    "intent": "full_map",
    "context_network": "testnet"
  }
}
```

---

## Graph Persistence (workspace_operation)

`save_graph` / `load_graph` are replaced by explicit workspace files:

```json
{
  "tool": "workspace_operation",
  "data": {
    "action": "write",
    "path": "myshop-v1-graph.json",
    "content": "{ ... serialized object graph ... }"
  }
}
```

Read it back with `action: "read"` and the same `path`. List workspace files with `action: "list"`.

---

## Important Notes

⚠️ **`project_operation` no longer exists** — calls to it fail at tool dispatch. Use the mapping table at the top of this document.

⚠️ **Stage sequencing is enforced by advisory warnings** — C2/C3 key the stage cache by `project:version` and recommend completing prior stages first, but never block.

⚠️ **Planning actions are deterministic and read-only** — no LLM in the compute path, no chain mutation. Execution happens only through `onchain_operations`.

---

## Related Components

- [Service](service.md) — the primary publishable object of most projects
- [Machine](machine.md) — workflow definition consumed by Service
- [Guard](guard.md) — verification conditions (buy_guard, usage_guard)
- [Permission](permission.md) — operation authority, created first in the topology
- [Arbitration](arbitration.md) — dispute resolution attached to services
- [Query](query.md) — query_toolkit reference for the BI query types above
