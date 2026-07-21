# Project Component (🗂️ 5-Stage Deployment & Object Graph)

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "project_operation", data: { action: "<action>", project: "<prefix>", version: "<version>", ... } })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The Project component manages the local object dependency graph (DAG) AND guides users through the 5-stage project deployment workflow. All data comes from local marks tagged `project:<prefix>` (auto-injected by the ProjectService when enabled, default ON).

The 5-stage workflow ensures safe, risk-calibrated, and topologically correct deployment of WoWok services:

1. **Project Naming** — Name the project using `project` + `version` params
2. **Business Puzzle** (analyze_intent) — Parse user intent into an Object Dependency Graph (ODG)
3. **Risk Calibration** (aggregate_risks) — Evaluate risks and determine if deployment can proceed
4. **Deployment Doc** (generate_deployment_doc) — Generate a deployment document with scanner checks
5. **Substep Trace** (trace_substeps) — Verify substep coherence and execute deployment

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Analyze Intent** | Parse business intent into ODG | Start of deployment workflow | Creates object dependency graph from natural language |
| **Aggregate Risks** | Evaluate deployment risks | Before generating deployment doc | Identifies CRITICAL/HIGH/MEDIUM/LOW risks |
| **Generate Deployment Doc** | Create deployment plan | After risk calibration passes | Produces markdown doc with D-01..D-18 scanner checks |
| **Trace Substeps** | Verify substep coherence | Before executing deployment | Checks D-10 substep linkage and coherence |
| **Get Project Status** | Query current stage | Anytime during workflow | Shows current stage (1-5) and next action |
| **List Projects** | List all discovered projects | Browse existing projects | Shows project prefixes with object counts |
| **List Objects** | List objects in a project | Inspect project contents | Shows all objects tagged with a project prefix |
| **Shareable Objects** | Find cross-project reusable objects | Reuse existing components | Common Permission, 3rd-party Arbitration |
| **Dependencies** | Trace forward dependencies | Impact analysis | BFS traversal + dangling reference detection |
| **Referenced By** | Reverse dependency query | Backward tracing | Who references this object? |
| **Pre-Publish Check** | Sanity check before publishing | Before publish operations | Dangling deps + cycle detection |
| **Cross-Project Refs** | Find cross-project edges | Boundary analysis | Edges crossing project boundaries |
| **Graph Stats** | Graph statistics | Overview | Node/edge counts, cycles, dangling deps |
| **Save/Load Graph** | Persist graph to/from file | Backup and restore | Save to ~/.wowok/project-graph.json |

---

## Complete Tool Call Structure

```json
{
  "tool": "project_operation",
  "data": {
    "action": "analyze_intent | aggregate_risks | generate_deployment_doc | trace_substeps | get_project_status | list_projects | list_objects | shareable | dependencies | referenced_by | pre_publish_check | cross_project_refs | graph_stats | save_graph | load_graph",
    "project": "myshop",
    "version": "v1",
    "user_intent": "I want to build an online retail shop...",
    "industry": "retail",
    "puzzles": { ... },
    "objects": [ ... ],
    "edges": [ ... ],
    "steps": [ ... ],
    "substeps": [ ... ],
    "network": "testnet"
  }
}
```

---

## Schema Tree

```
project_operation (5-Stage Deployment & Object Graph)
├── action (required)
│   ├── Graph Query (10 actions)
│   │   ├── "list_projects"
│   │   ├── "list_objects" (requires project)
│   │   ├── "shareable"
│   │   ├── "dependencies" (requires object)
│   │   ├── "referenced_by" (requires object)
│   │   ├── "pre_publish_check" (requires object)
│   │   ├── "cross_project_refs"
│   │   ├── "graph_stats"
│   │   ├── "save_graph"
│   │   └── "load_graph"
│   └── Deployment Workflow (5 actions)
│       ├── "analyze_intent" (Stage 2)
│       ├── "aggregate_risks" (Stage 3)
│       ├── "generate_deployment_doc" (Stage 4)
│       ├── "trace_substeps" (Stage 5)
│       └── "get_project_status"
├── project (optional) — Project prefix (e.g. "myshop")
├── version (optional) — Project version (e.g. "v1", regex: ^v\d+$)
├── object (optional) — Object name/address for dependencies/referenced_by
│
├── Stage 2: analyze_intent inputs
│   ├── user_intent (required for analyze_intent) — Natural language business intent (1-2000 chars)
│   ├── industry (optional) — "general" | "retail" | "service" | "rental" | "freelance" | "education" | "travel" | "subscription" | "custom"
│   └── target_objects (optional) — Explicit target object IDs or types
│
├── Stage 3: aggregate_risks inputs
│   ├── puzzles (required) — Per-object puzzle snapshots keyed by object_type
│   ├── severity_threshold (optional) — "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
│   └── user_confirmed_high_risks (optional) — IDs of confirmed HIGH risks to suppress
│
├── Stage 4: generate_deployment_doc inputs
│   ├── business_intent (required) — One-line description (1-500 chars)
│   ├── author (optional) — Author name for doc meta
│   ├── objects (required) — Deployment objects array
│   ├── edges (required) — Dependency graph edges array
│   ├── steps (required) — Topological execution plan
│   ├── scenarios (optional) — Business scenarios for §7
│   ├── risk_status (optional) — From aggregate_risks
│   ├── risk_critical_count (optional) — From aggregate_risks
│   ├── risk_high_count (optional) — From aggregate_risks
│   └── run_scanner (optional, default true) — Run deployment-scanner validation
│
├── Stage 5: trace_substeps inputs
│   ├── network (optional) — "testnet" | "mainnet"
│   └── substeps (required) — Substep records array
│
└── get_project_status inputs
    ├── project (required)
    └── version (required)
```

---

## 5-Stage Deployment Workflow

### Correct Object Creation Order (Topological)

```
Permission → Allocation → Guard → Machine → Service
```

All objects created as draft (`publish=false`) first; publish Machine before Service (last).

### Stage Flow

```
Stage 1: Project Naming (project + version params)
    ↓
Stage 2: analyze_intent → ODG + puzzles + next_action
    ↓ (fill missing fields if needed)
Stage 3: aggregate_risks → findings + can_proceed
    ↓ (fix CRITICAL risks if any)
Stage 4: generate_deployment_doc → markdown + D-checks + can_proceed
    ↓ (fix D-errors if any)
Stage 5: trace_substeps → coherence + D-10 + can_proceed
    ↓ (execute substeps via onchain_operations)
Done
```

Each stage's output includes `next_action` telling you which action to call next, and `can_proceed` indicating whether you can move to the next stage.

---

## Example 1: Analyze Intent (Stage 2)

### Feature Description

Parse natural-language business intent into an Object Dependency Graph (ODG). Produces per-object puzzles, completeness assessment, and recommended creation order.

### Examples

#### Example 1.1: Analyze Retail Shop Intent

**Prompt**: I want to build an online retail shop called "myshop". It should have a service for selling products, a machine workflow for order processing, and arbitration for dispute resolution. Use version v1.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "analyze_intent",
    "project": "myshop",
    "version": "v1",
    "user_intent": "Build an online retail shop with product selling service, order processing machine workflow, and dispute resolution arbitration",
    "industry": "retail"
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
        "next_action": "none",
        "warnings": []
      }
    }
  },
  "schema": null
}
```

> **Note**: `next_action: "none"` means you must fill missing fields before proceeding. Once all puzzles are complete, `next_action` will become `"aggregate_risks"`.

---

## Example 2: Aggregate Risks (Stage 3)

### Feature Description

Evaluate deployment risks from puzzle data. CRITICAL risks block deployment; HIGH/MEDIUM/LOW only warn.

### Examples

#### Example 2.1: Check Risks

**Prompt**: Run risk assessment for myshop v1. Here are the completed puzzles.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "aggregate_risks",
    "project": "myshop",
    "version": "v1",
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
        "warnings": [],
        "can_proceed": true,
        "next_action": "generate_deployment_doc",
        "user_action_required": "No CRITICAL risks found. You may proceed to generate the deployment document. Consider addressing the HIGH/MEDIUM findings for better safety."
      }
    }
  },
  "schema": null
}
```

> **Note**: `can_proceed: true` because there are 0 CRITICAL risks. The HIGH risk (no compensation fund) and MEDIUM risk (no arbitration) are warnings only. `next_action: "generate_deployment_doc"` indicates you can proceed to Stage 4.

---

## Example 3: Generate Deployment Doc (Stage 4)

### Feature Description

Generate a markdown deployment document with D-01..D-18 scanner checks. 0 D-errors required before Stage 5.

### Examples

#### Example 3.1: Generate Deployment Doc

**Prompt**: Generate the deployment document for myshop v1.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "generate_deployment_doc",
    "project": "myshop",
    "version": "v1",
    "business_intent": "Online retail shop with product selling and order processing",
    "objects": [
      {
        "entry_id": "permission:myshop_perm",
        "object_type": "permission",
        "name": "myshop_perm",
        "publish_required": false
      },
      {
        "entry_id": "guard:myshop_guard",
        "object_type": "guard",
        "name": "myshop_guard",
        "publish_required": false
      },
      {
        "entry_id": "machine:myshop_workflow",
        "object_type": "machine",
        "name": "myshop_workflow",
        "publish_required": true
      },
      {
        "entry_id": "service:myshop_service",
        "object_type": "service",
        "name": "myshop_service",
        "publish_required": true
      }
    ],
    "edges": [
      {
        "from": "service:myshop_service",
        "to": "machine:myshop_workflow",
        "edge_kind": "machine",
        "field_path": "data.machine",
        "required_at_publish": true
      },
      {
        "from": "service:myshop_service",
        "to": "guard:myshop_guard",
        "edge_kind": "buy_guard",
        "field_path": "data.buy_guard",
        "required_at_publish": false
      }
    ],
    "steps": [
      {
        "step": 1,
        "object_type": "permission",
        "operation": "create permission myshop_perm",
        "substep_count": 1,
        "depends_on": [],
        "entry_id": "permission:myshop_perm",
        "network_phase": "testnet"
      },
      {
        "step": 2,
        "object_type": "guard",
        "operation": "create guard myshop_guard",
        "substep_count": 1,
        "depends_on": [1],
        "entry_id": "guard:myshop_guard",
        "network_phase": "testnet"
      },
      {
        "step": 3,
        "object_type": "machine",
        "operation": "create machine myshop_workflow",
        "substep_count": 3,
        "depends_on": [1],
        "entry_id": "machine:myshop_workflow",
        "network_phase": "testnet"
      },
      {
        "step": 4,
        "object_type": "service",
        "operation": "create service myshop_service",
        "substep_count": 2,
        "depends_on": [2, 3],
        "entry_id": "service:myshop_service",
        "network_phase": "testnet"
      }
    ],
    "risk_status": "RISK_PASSED",
    "risk_critical_count": 0,
    "risk_high_count": 1
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
        "action": "generate_deployment_doc",
        "markdown": "# Deployment Document: myshop v1\n\n## §0 Meta\n- Project: myshop\n- Version: v1\n- Generated: 2026-07-22T...\n- Objects: 4\n- Steps: 4\n\n## §1 Objects\n...\n## §2 Dependency Graph\n...\n## §3 Execution Plan\n...\n## §4 Risk Status\n...\n## §5 Scanner Checks\n...\n## §6 Gas Estimate\n...\n## §7 Scenarios\n...",
        "meta": {
          "project_prefix": "myshop",
          "version": "v1",
          "generated_at": "2026-07-22T12:00:00.000Z",
          "object_count": 4,
          "step_count": 4
        },
        "validation": {
          "valid": true,
          "checks": [
            {
              "check_id": "D-01",
              "description": "All required objects have names",
              "status": "PASS"
            },
            {
              "check_id": "D-02",
              "description": "All edges reference existing objects",
              "status": "PASS"
            },
            {
              "check_id": "D-10",
              "description": "Substep linkage is coherent",
              "status": "PASS"
            },
            {
              "check_id": "D-16",
              "description": "Risk status is not blocked",
              "status": "PASS",
              "notes": "RISK_PASSED with 0 CRITICAL, 1 HIGH"
            }
          ],
          "errors": []
        },
        "estimated_gas": {
          "total_gas_mist": 25000000,
          "per_object": [
            {
              "entry_id": "permission:myshop_perm",
              "object_type": "permission",
              "create_gas_mist": 3000000,
              "publish_gas_mist": 0
            },
            {
              "entry_id": "guard:myshop_guard",
              "object_type": "guard",
              "create_gas_mist": 5000000,
              "publish_gas_mist": 0
            },
            {
              "entry_id": "machine:myshop_workflow",
              "object_type": "machine",
              "create_gas_mist": 7000000,
              "publish_gas_mist": 2000000
            },
            {
              "entry_id": "service:myshop_service",
              "object_type": "service",
              "create_gas_mist": 6000000,
              "publish_gas_mist": 2000000
            }
          ],
          "publish_gas_mist": 4000000
        },
        "can_proceed": true,
        "next_action": "trace_substeps",
        "user_action_required": "Deployment doc generated with 0 D-errors. Proceed to trace substeps for execution verification."
      }
    }
  },
  "schema": null
}
```

> **Note**: `can_proceed: true` because there are 0 D-errors. The `estimated_gas` field shows gas cost estimates in MIST (1 WOW = 10^9 MIST). `next_action: "trace_substeps"` indicates you can proceed to Stage 5.

---

## Example 4: Get Project Status

### Feature Description

Query the current stage (1-5) of a project. Can be called anytime to check progress.

### Examples

#### Example 4.1: Check Project Status

**Prompt**: What stage is myshop v1 currently in?

```json
{
  "tool": "project_operation",
  "data": {
    "action": "get_project_status",
    "project": "myshop",
    "version": "v1"
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
        "action": "get_project_status",
        "project": "myshop",
        "version": "v1",
        "stage": 4,
        "stage_name": "Deployment Doc Generated",
        "stage_description": "Deployment document has been generated with 0 D-errors. Ready for substep tracing.",
        "next_action": "trace_substeps",
        "can_proceed": true,
        "last_updated": 1784673600000,
        "risk_status": "RISK_PASSED",
        "risk_can_proceed": true,
        "doc_generated": true,
        "trace_coherent": null
      }
    }
  },
  "schema": null
}
```

> **Note**: Stage 4 means the deployment doc has been generated. `trace_coherent: null` indicates Stage 5 has not been run yet.

---

## Example 5: Graph Query Actions

### Feature Description

Query the local object dependency graph for analysis and debugging.

### Examples

#### Example 5.1: List All Projects

**Prompt**: Show me all discovered projects.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "list_projects"
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
        "action": "list_projects",
        "items": [
          {
            "prefix": "myshop",
            "versions": ["v1"],
            "object_count": 4,
            "edge_count": 2
          },
          {
            "prefix": "marketplace",
            "versions": ["v1", "v2"],
            "object_count": 8,
            "edge_count": 5
          }
        ]
      }
    }
  },
  "schema": null
}
```

#### Example 5.2: List Objects in a Project

**Prompt**: Show me all objects in the myshop project.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "list_objects",
    "project": "myshop"
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
        "action": "list_objects",
        "items": [
          {
            "entry_id": "permission:myshop_perm",
            "object_type": "permission",
            "name": "myshop_perm",
            "address": "0xabc123...def"
          },
          {
            "entry_id": "guard:myshop_guard",
            "object_type": "guard",
            "name": "myshop_guard",
            "address": "0xghi456...jkl"
          },
          {
            "entry_id": "machine:myshop_workflow",
            "object_type": "machine",
            "name": "myshop_workflow",
            "address": "0xmno789...pqr"
          },
          {
            "entry_id": "service:myshop_service",
            "object_type": "service",
            "name": "myshop_service",
            "address": null
          }
        ]
      }
    }
  },
  "schema": null
}
```

#### Example 5.3: Graph Statistics

**Prompt**: Give me statistics about the object dependency graph.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "graph_stats"
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
        "action": "graph_stats",
        "stats": {
          "total_nodes": 12,
          "total_edges": 7,
          "projects": 2,
          "cycles": 0,
          "dangling_deps": 1,
          "published_objects": 3,
          "draft_objects": 9
        }
      }
    }
  },
  "schema": null
}
```

#### Example 5.4: Pre-Publish Check

**Prompt**: Run a pre-publish sanity check on the myshop_service object.

```json
{
  "tool": "project_operation",
  "data": {
    "action": "pre_publish_check",
    "object": "myshop_service"
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
        "action": "pre_publish_check",
        "warnings": [
          "Service depends on machine 'myshop_workflow' which is not yet published."
        ]
      }
    }
  },
  "schema": null
}
```

> **Note**: Empty `warnings` array means no issues detected. Non-empty array lists specific problems to fix before publishing.

---

## Important Notes

⚠️ **5-stage workflow must be followed in order**: Stage 1 → 2 → 3 → 4 → 5. Each stage's `next_action` field tells you the next step.

⚠️ **CRITICAL risks block deployment**: Only CRITICAL severity risks prevent proceeding from Stage 3 to Stage 4. HIGH/MEDIUM/LOW are warnings only.

⚠️ **0 D-errors required**: The deployment doc scanner (D-01..D-18) must have 0 errors before proceeding to Stage 5. Warnings (WARN) are acceptable.

⚠️ **Version format**: Must match `^v\d+$` (e.g., `v1`, `v2`, `v10`). Not `version1` or `v1.0`.

⚠️ **Object creation order**: Always follow topological order — Permission → Allocation → Guard → Machine → Service. All objects created as draft first; publish Machine before Service.

⚠️ **Graph queries are read-only**: The 10 graph query actions do not modify state. Only C1-C4 deployment actions (Stages 2-5) and save_graph/load_graph modify state.

⚠️ **ProjectService must be enabled**: The `project_service` config toggle must be ON (default) for auto-tagging and graph maintenance. Use [config_operation](config.md) to check/toggle.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | Service objects — typically the primary object in a deployment |
| **[Machine](machine.md)** | Machine workflow — order processing automation |
| **[Permission](permission.md)** | Permission — access control for all objects |
| **[Guard](guard.md)** | Guard — trust verification rules |
| **[Config](config.md)** | Runtime toggles — controls ProjectService enable/disable |
| **[Response Format](response-format.md)** | Response structure for all WoWok operations |
