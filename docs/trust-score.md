# Trust Score Component (🛡️ Service Risk & Trust Assessment)

---

> **💡 Call Format**: All WoWok operations go through a single unified `wowok` tool. Call `wowok({ tool: "trust_score", data: { service: "<service_id_or_name>", depth: "<depth>" } })`. If parameters don't match the schema, the response includes the correct schema for self-correction. See [Response Format](response-format.md) for details.

## Component Overview

The Trust Score component proactively queries the trust score and risk assessment of a Service object. It computes a 0-100 trust score across 5 dimensions (arbitration, reviews, fulfillment, fund_safety, transparency) and, at deeper evaluation levels, a 4-dimension risk score (workflow, fund, trust, behavior).

This is the standalone query form of the trust_score field that is otherwise only passively injected into `onchain_operations` semantic output. Use this tool when a user explicitly asks about service trustworthiness or risk.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Browse Trust** | Quick trust score check | Fast assessment of service trustworthiness | Provides 0-100 score with 5-dimension breakdown |
| **Evaluate Risk** | Full risk assessment | Pre-purchase due diligence | Adds 4-dimension risk score with red flags and advice |
| **Preorder Assessment** | Most thorough evaluation | Before placing a large order | Includes market context and behavior dimensions |

---

## Complete Tool Call Structure

```json
{
  "tool": "trust_score",
  "data": {
    "service": "service_id_or_name",
    "order_amount": 2000000000,
    "depth": "browse | evaluate | preorder",
    "network": "testnet | mainnet",
    "no_cache": false
  }
}
```

---

## Schema Tree

```
trust_score (Service Risk & Trust Assessment)
├── service (required) — Service object ID or local_mark name
├── order_amount (optional) — Order amount in smallest token unit (e.g. 2000000000 for 2 WOW)
│   └── Defaults to the service's first active sale price
├── depth (optional, default "evaluate")
│   ├── "browse" — Trust score only (fastest)
│   ├── "evaluate" — + risk assessment (4 dimensions)
│   └── "preorder" — + market context (most thorough)
├── network (optional) — Network override ("testnet", "mainnet")
└── no_cache (optional, boolean) — Skip cache, force fresh on-chain query
```

---

## Trust Score Dimensions (5)

| Dimension | Description | Score Range |
|-----------|-------------|-------------|
| **Arbitration** | Number and quality of arbitration entries attached to the service | 0-20 |
| **Reviews** | Customer feedback and rating history | 0-20 |
| **Fulfillment** | Order completion rate and delivery consistency | 0-20 |
| **Fund Safety** | Compensation fund balance relative to order amount | 0-20 |
| **Transparency** | Published state, Machine workflow, Guard, and Contact visibility | 0-20 |

Trust levels: `high_risk` (0-24), `caution` (25-49), `moderate` (50-74), `trusted` (75-100)

## Risk Score Dimensions (4)

Available when `depth >= "evaluate"`:

| Dimension | Description | Checks |
|-----------|-------------|--------|
| **Workflow** | Machine workflow completeness and node configuration | Has Machine, node count, forward rules |
| **Fund** | Compensation fund adequacy for the order amount | Fund balance vs order amount, lock duration |
| **Trust** | Arbitration coverage and buy guard presence | Has arbitration, has buy_guard |
| **Behavior** | Merchant operational signals (published, paused, sales) | Published state, pause state, active sales |

Risk levels: `low` (0-24), `medium_low` (25-49), `medium_high` (50-74), `high` (75-100)

---

## Example 1: Browse Trust Score

### Feature Description

Quick trust score check with 5-dimension breakdown. Fastest evaluation — only queries the Service object basics.

### Examples

#### Example 1.1: Quick Trust Check

**Prompt**: Is the service "my_shop_service" trustworthy? Just give me a quick assessment.

```json
{
  "tool": "trust_score",
  "data": {
    "service": "my_shop_service",
    "depth": "browse"
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
        "service_id": "0xabc123...def456",
        "service_name": "my_shop_service",
        "service_basics": {
          "bPublished": true,
          "bPaused": false,
          "sales_count": 3,
          "has_machine": true,
          "has_buy_guard": true,
          "has_um_contact": true,
          "arbitrations_count": 2
        },
        "trust_score": {
          "score": 72,
          "level": "moderate",
          "summary": "Service has reasonable trust signals with arbitration and guard coverage.",
          "warnings": [],
          "breakdown": [
            {
              "score": 16,
              "maxScore": 20,
              "description": "arbitration",
              "humanReadable": "2 arbitration entries attached — provides dispute resolution coverage."
            },
            {
              "score": 10,
              "maxScore": 20,
              "description": "reviews",
              "humanReadable": "No review data available — neutral score assigned."
            },
            {
              "score": 14,
              "maxScore": 20,
              "description": "fulfillment",
              "humanReadable": "Service is published with active sales — operational signals present."
            },
            {
              "score": 18,
              "maxScore": 20,
              "description": "fund_safety",
              "humanReadable": "Compensation fund balance covers the order amount."
            },
            {
              "score": 14,
              "maxScore": 20,
              "description": "transparency",
              "humanReadable": "Machine, buy_guard, and contact all configured."
            }
          ]
        },
        "order_amount": "1000000000",
        "depth": "browse"
      }
    }
  },
  "schema": null
}
```

> **Note**: `depth: "browse"` returns only the trust score and service basics. No risk assessment is included.

---

## Example 2: Evaluate Risk (Default Depth)

### Feature Description

Full risk assessment including 4-dimension risk score, red flags, and mitigation advice. This is the default depth.

### Examples

#### Example 2.1: Full Risk Assessment

**Prompt**: Should I buy from the service at 0xabc123...def456? I'm planning to order 2 WOW worth. Give me a full risk assessment.

```json
{
  "tool": "trust_score",
  "data": {
    "service": "0xabc123...def456",
    "order_amount": 2000000000,
    "depth": "evaluate"
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
        "service_id": "0xabc123...def456",
        "service_name": "premium_design_service",
        "service_basics": {
          "bPublished": true,
          "bPaused": false,
          "sales_count": 5,
          "has_machine": true,
          "has_buy_guard": true,
          "has_um_contact": false,
          "arbitrations_count": 3
        },
        "trust_score": {
          "score": 78,
          "level": "trusted",
          "summary": "Service demonstrates strong trust signals across multiple dimensions.",
          "warnings": [],
          "breakdown": [
            {
              "score": 18,
              "maxScore": 20,
              "description": "arbitration",
              "humanReadable": "3 arbitration entries — robust dispute resolution coverage."
            },
            {
              "score": 12,
              "maxScore": 20,
              "description": "reviews",
              "humanReadable": "Limited review data available."
            },
            {
              "score": 16,
              "maxScore": 20,
              "description": "fulfillment",
              "humanReadable": "5 active sales entries — strong operational signal."
            },
            {
              "score": 16,
              "maxScore": 20,
              "description": "fund_safety",
              "humanReadable": "Compensation fund covers 150% of order amount."
            },
            {
              "score": 16,
              "maxScore": 20,
              "description": "transparency",
              "humanReadable": "Machine and buy_guard configured. No contact (UM) set."
            }
          ]
        },
        "order_amount": "2000000000",
        "depth": "evaluate",
        "risk_score": {
          "total": 35,
          "level": "medium_low",
          "red_flags": [],
          "advice": [
            "Consider adding a Messenger contact for better communication channels.",
            "Monitor order fulfillment closely — no review history available."
          ],
          "dimensions": [
            {
              "name": "workflow",
              "score": 8,
              "max_score": 25,
              "checks": [
                {
                  "id": "has_machine",
                  "dimension": "workflow",
                  "description": "Service has a Machine workflow attached",
                  "weight": 40,
                  "passed": true
                },
                {
                  "id": "machine_nodes",
                  "dimension": "workflow",
                  "description": "Machine has sufficient nodes for order processing",
                  "weight": 30,
                  "passed": true
                },
                {
                  "id": "forward_rules",
                  "dimension": "workflow",
                  "description": "Machine has forward rules for order progression",
                  "weight": 30,
                  "passed": false,
                  "advice": "Configure forward rules to automate order progression."
                }
              ]
            },
            {
              "name": "fund",
              "score": 10,
              "max_score": 25,
              "checks": [
                {
                  "id": "fund_coverage",
                  "dimension": "fund",
                  "description": "Compensation fund covers the order amount",
                  "weight": 60,
                  "passed": true
                },
                {
                  "id": "fund_lock",
                  "dimension": "fund",
                  "description": "Compensation fund has lock duration configured",
                  "weight": 40,
                  "passed": true
                }
              ]
            },
            {
              "name": "trust",
              "score": 9,
              "max_score": 25,
              "checks": [
                {
                  "id": "has_arbitration",
                  "dimension": "trust",
                  "description": "Service has arbitration entries",
                  "weight": 50,
                  "passed": true
                },
                {
                  "id": "has_buy_guard",
                  "dimension": "trust",
                  "description": "Service has a buy guard configured",
                  "weight": 50,
                  "passed": true
                }
              ]
            },
            {
              "name": "behavior",
              "score": 8,
              "max_score": 25,
              "checks": [
                {
                  "id": "is_published",
                  "dimension": "behavior",
                  "description": "Service is published and open for orders",
                  "weight": 40,
                  "passed": true
                },
                {
                  "id": "not_paused",
                  "dimension": "behavior",
                  "description": "Service is not paused",
                  "weight": 30,
                  "passed": true
                },
                {
                  "id": "has_active_sales",
                  "dimension": "behavior",
                  "description": "Service has active sales entries",
                  "weight": 30,
                  "passed": true
                }
              ]
            }
          ]
        },
        "info_puzzle": {
          "completeness": 0.75,
          "gaps": [
            "No Messenger contact configured",
            "No customer review history available"
          ],
          "assembled_at": 1784673600000
        }
      }
    }
  },
  "schema": null
}
```

> **Note**: `depth: "evaluate"` (default) includes both `trust_score` and `risk_score`. The `info_puzzle` section shows completeness and gaps. The `order_amount` is returned as a string (bigint-safe).

---

## Example 3: Preorder Assessment

### Feature Description

Most thorough evaluation including market context dimension. Use this before placing large or critical orders.

### Examples

#### Example 3.1: Pre-Order Full Assessment

**Prompt**: I'm about to place a large order (5 WOW) on service "enterprise_service". Run the most thorough trust and risk assessment before I proceed.

```json
{
  "tool": "trust_score",
  "data": {
    "service": "enterprise_service",
    "order_amount": 5000000000,
    "depth": "preorder",
    "no_cache": true
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
        "service_id": "0xdef789...abc012",
        "service_name": "enterprise_service",
        "service_basics": {
          "bPublished": true,
          "bPaused": false,
          "sales_count": 12,
          "has_machine": true,
          "has_buy_guard": true,
          "has_um_contact": true,
          "arbitrations_count": 5
        },
        "trust_score": {
          "score": 85,
          "level": "trusted",
          "summary": "Service demonstrates excellent trust signals across all dimensions.",
          "warnings": [],
          "breakdown": [
            {
              "score": 19,
              "maxScore": 20,
              "description": "arbitration",
              "humanReadable": "5 arbitration entries — comprehensive dispute resolution coverage."
            },
            {
              "score": 17,
              "maxScore": 20,
              "description": "reviews",
              "humanReadable": "Positive review history from previous customers."
            },
            {
              "score": 18,
              "maxScore": 20,
              "description": "fulfillment",
              "humanReadable": "12 active sales — strong operational track record."
            },
            {
              "score": 16,
              "maxScore": 20,
              "description": "fund_safety",
              "humanReadable": "Compensation fund covers 120% of the 5 WOW order amount."
            },
            {
              "score": 15,
              "maxScore": 20,
              "description": "transparency",
              "humanReadable": "Machine, buy_guard, and contact all configured."
            }
          ]
        },
        "order_amount": "5000000000",
        "depth": "preorder",
        "risk_score": {
          "total": 22,
          "level": "low",
          "red_flags": [],
          "advice": [
            "Service is well-configured. Proceed with confidence."
          ],
          "dimensions": [
            {
              "name": "workflow",
              "score": 6,
              "max_score": 25,
              "checks": [
                {
                  "id": "has_machine",
                  "dimension": "workflow",
                  "description": "Service has a Machine workflow attached",
                  "weight": 40,
                  "passed": true
                },
                {
                  "id": "machine_nodes",
                  "dimension": "workflow",
                  "description": "Machine has sufficient nodes for order processing",
                  "weight": 30,
                  "passed": true
                },
                {
                  "id": "forward_rules",
                  "dimension": "workflow",
                  "description": "Machine has forward rules for order progression",
                  "weight": 30,
                  "passed": true
                }
              ]
            },
            {
              "name": "fund",
              "score": 5,
              "max_score": 25,
              "checks": [
                {
                  "id": "fund_coverage",
                  "dimension": "fund",
                  "description": "Compensation fund covers the order amount",
                  "weight": 60,
                  "passed": true
                },
                {
                  "id": "fund_lock",
                  "dimension": "fund",
                  "description": "Compensation fund has lock duration configured",
                  "weight": 40,
                  "passed": true
                }
              ]
            },
            {
              "name": "trust",
              "score": 5,
              "max_score": 25,
              "checks": [
                {
                  "id": "has_arbitration",
                  "dimension": "trust",
                  "description": "Service has arbitration entries",
                  "weight": 50,
                  "passed": true
                },
                {
                  "id": "has_buy_guard",
                  "dimension": "trust",
                  "description": "Service has a buy guard configured",
                  "weight": 50,
                  "passed": true
                }
              ]
            },
            {
              "name": "behavior",
              "score": 6,
              "max_score": 25,
              "checks": [
                {
                  "id": "is_published",
                  "dimension": "behavior",
                  "description": "Service is published and open for orders",
                  "weight": 40,
                  "passed": true
                },
                {
                  "id": "not_paused",
                  "dimension": "behavior",
                  "description": "Service is not paused",
                  "weight": 30,
                  "passed": true
                },
                {
                  "id": "has_active_sales",
                  "dimension": "behavior",
                  "description": "Service has active sales entries",
                  "weight": 30,
                  "passed": true
                }
              ]
            }
          ]
        },
        "info_puzzle": {
          "completeness": 0.92,
          "gaps": [],
          "assembled_at": 1784673700000
        }
      }
    }
  },
  "schema": null
}
```

> **Note**: `depth: "preorder"` is the most thorough assessment. The `no_cache: true` flag forces a fresh on-chain query, bypassing any cached data.

---

## Important Notes

⚠️ **Service type required**: The `service` parameter must reference an existing Service object. Non-Service objects will cause an error.

⚠️ **order_amount is in smallest token unit**: For WOW tokens, 1 WOW = 1,000,000,000 (10^9) smallest units. For bridged tokens, use the token's WOW-side decimals.

⚠️ **Risk score is optional**: The `risk_score` and `info_puzzle` fields are only present when `depth >= "evaluate"`. Use `depth: "browse"` for a quick trust-only check.

⚠️ **Cache behavior**: By default, on-chain queries use cache. Set `no_cache: true` to force a fresh query — useful when the service state may have changed recently.

⚠️ **Trust score vs. risk score**: Trust score (0-100, higher = better) measures positive signals. Risk score (0-100, higher = riskier) measures negative signals. They are complementary but not inverse.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **[Service](service.md)** | Service objects — the evaluation target for trust_score |
| **[Arbitration](arbitration.md)** | Arbitration entries — contribute to the arbitration trust dimension |
| **[Machine](machine.md)** | Machine workflow — contributes to the workflow risk dimension |
| **[Guard](guard.md)** | Buy guard — contributes to the trust risk dimension |
| **[Config](config.md)** | Runtime toggles — `customer_intelligence` service controls passive trust score injection |
