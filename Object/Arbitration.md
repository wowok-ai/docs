# Arbitration Object: Your Dispute Resolution Engine

> "Resolve order disputes through transparent arbitration services that provide impartial evaluation, weighted voting decisions, and automated compensation execution for fair dispute settlement"

**MCP Tool**: [`wowok_arbitration_mcp_server`](https://www.npmjs.com/package/wowok_arbitration_mcp_server)

## How to Use This Documentation

### Document Structure

- **[Overview](#overview)**: Arbitration capabilities and dispute workflow
- **[Core Parameters](#core-parameters)**: All configuration options organized by operation type
- **[Data Types & Formats](#data-types--formats)**: Technical reference for permissions and witness types
- **[Query Capabilities](#query-capabilities)**: What you can query and how to access Arbitration data

### Navigation by Need

| I need to...                   | Go to section                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Create new Arbitration service | [Core Parameters → Object Management](#2-object-management--session-configuration) |
| Configure fees and Treasury    | [Core Parameters → Fee Management](#fee-management)                                |
| Set up voting system           | [Core Parameters → Voting System](#voting-system)                                  |
| Handle dispute cases           | [Core Parameters → Arbitration Workflow](#arbitration-workflow-operations)         |
| Create dispute request         | [Core Parameters → Create Dispute Case](#create-dispute-case-arb_new)              |
| Vote on disputes               | [Core Parameters → Submit Vote](#submit-vote-arb_vote)                             |
| Issue final decision           | [Core Parameters → Issue Decision](#issue-decision-arb_arbitration)                |
| Extract service fees           | [Core Parameters → Extract Service Fee](#extract-service-fee-arb_withdraw_fee)     |
| Reference permission indexes   | [Data Types & Formats → Built-in Permission Indexes](#built-in-permission-indexes) |
| Query arbitration data         | [Query Capabilities](#query-capabilities)                                         |

## Overview

### Definition

Arbitration objects create on-chain dispute resolution services that handle order conflicts between payer and payee through weighted voting systems. Multiple arbitrators evaluate evidence and cast weighted votes, triggering automatic compensation execution based on the consensus decision. Arbitration decisions are only binding on Services that explicitly reference the Arbitration object.

### Core Capabilities

- **Weighted Voting Decisions**: Multiple arbitrators vote on dispute propositions with configurable influence levels based on expertise and qualifications
- **Automated Fee Management**: Collect arbitration fees (if applicable) into the Arbitration's Treasury during dispute creation for operational costs. Fee distribution is managed through Treasury operations. Arbitration services can also be offered for free.
- **Conditional Access Control**: Guard integration verifies arbitrator qualifications and dispute eligibility before participation

- **Proposition-based voting**: Consumer submits specific claims about what went wrong and how they want to solve it, and arbitrators vote to support or reject each proposition, with compensation determined by which claims receive consensus approval.

### Important Notes

- **Creation Dependencies**: Treasury and Guard objects required, Permission object optional (auto-created with basic access if omitted)
- **Token Type Alignment**: Arbitration `type_parameter` must exactly match Treasury `type_parameter` for fee collection compatibility
- **Single Decision Model**: Each Arb (dispute case) receives one final decision affecting Order compensation, but decisions remain modifiable until compensation withdrawal occurs
- **Transparent voting records**: All voting activities, arbitrator identities, and weight allocations are permanently recorded on-chain, providing full auditability of the decision-making process.

### Core Workflow

1. **Service Setup**: Initialize Arbitration with [token type, permissions, and voting structure](#2-object-management--session-configuration)
2. **Configure Access**: Set [fee structure with Treasury integration](#fee-management) plus [arbitrator qualifications](#voting-system)
3. **Accept Disputes**: Users create [Arb objects for specific Order disputes](#create-dispute-case-arb_new) with fee payment
4. **Collect Votes**: Qualified arbitrators [submit weighted votes](#submit-vote-arb_vote) on dispute propositions
5. **Issue Decisions**: Arbitration service [finalizes outcomes](#issue-decision-arb_arbitration) with compensation amounts
6. **Distribute Payments**: Arbitrators [extract earned fees](#extract-service-fee-arb_withdraw_fee) and customers receive Order compensation

_Related Implementation_: → Integration with Order objects for compensation and Service objects for automated dispute triggers

---

## Core Parameters

### 1. Top-Level Structure Parameters

**Note**: All Arbitration operations require these four top-level parameters to define transaction context and execution environment.

```json
{
  "account": "arbitration_operator",
  // account: Transaction signer - specifies who executes this operation
  "data": {
    // data: Core arbitration configuration and operations
  },
  "session": {
    // session: Network and persistence settings
  },
  "witness": {
    // witness: Guard verification system for conditional operations
  }
}
```

| Parameter | Type   | Required | Default                                               | Description                                                                                                                                                                                                                       |
| --------- | ------ | -------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account` | string | Optional | Default account                                       | Transaction signer account name or address. If omitted, the system uses the current active account.                                                                                                                               |
| `data`    | object | Required | -                                                     | Core arbitration configuration and operations.                                                                                                                                                                                    |
| `session` | object | Optional | `{ "network": "sui testnet", "retentive": "always" }` | Network and session persistence settings. `network` specifies the target blockchain (`"sui mainnet"`, `"sui testnet"`, `"wowok mainnet"`, `"wowok testnet"`). `retentive` controls session persistence (`"always"`, `"session"`). |
| `witness` | object | Optional | - | User-proof data for verification. See [Guard Documentation - Witness System section](./Guard.md#witness-system). |

**Note**: All Arbitration operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

### 2. Object Management & Session Configuration

#### Object Reference (Existing Arbitration)

```json
{
  "object": "professional_arbitration_service"
  // object: Reference existing Arbitration by name or address
}
```

#### Object Creation (New Arbitration)

```json
{
  "object": {
    "name": "dispute_arbitration",
    // name: Human-readable identifier for easy reference
    "onChain": true,
    // onChain: Whether metadata visible on blockchain
    "type_parameter": "0x2::sui::SUI",
    // type_parameter: Token type for arbitration fees and payments
    "permission": "arbitration_permission",
    // permission: Permission object controlling access rights
    "tags": ["professional", "dispute-resolution"],
    // tags: Categorization labels for organization
    "useAddressIfNameExist": false
    // useAddressIfNameExist: Name conflict resolution strategy
  }
}
```

#### Combined Parameters Table

| Parameter                 | Type          | Required | Default        | Description                                                                           |
| ------------------------- | ------------- | -------- | -------------- | ------------------------------------------------------------------------------------- |
| **Object Reference**      |
| `object`                  | string        | Required | -              | Existing Arbitration name or address                                                  |
| **Object Creation**       |
| `name`                    | string        | Optional | Auto-generated | Human-readable identifier                                                             |
| `onChain`                 | boolean       | Optional | `false`        | Metadata blockchain visibility                                                        |
| `type_parameter`          | string        | Required | -              | **Critical**: Arbitration uses Token format (`"0x2::sui::SUI"`), NOT Coin format. This must exactly match the Treasury's token type for fee collection compatibility. |
| `permission`              | string/object | Required | -              | Permission object reference or inline creation                                        |
| `tags`                    | string[]      | Optional | `[]`           | Organizational labels                                                                 |
| `useAddressIfNameExist`   | boolean       | Optional | `false`        | Name conflict resolution                                                              |
| **Session Configuration** |
| `network`                 | string        | Required | -              | `"sui mainnet"`, `"sui testnet"`, `"wowok mainnet"`, `"wowok testnet"`                |
| `retentive`               | string        | Optional | `"always"`     | Session persistence: `"always"`, `"session"`                                          |

#### Address Format Options

All address fields support both simple string format and named address format with local mark resolution. For detailed address format options, see [Service Documentation - Address Format Options section](./Service.md#address-format-options).

**Arbitration-Specific Address Examples**:

```json
{
  "permission": "arbitration_permission_address",
  "fee_treasury": "arbitration_revenue_treasury"
}
```

### Technical Requirements

- **Token Format**: Use native token format `"0x2::sui::SUI"`, not Coin wrapper format `"0x2::coin::Coin<0x2::sui::SUI>"`. Must match exactly across Arbitration and Treasury objects for fee collection compatibility.
- **Permission Reference**: See [Permission Object documentation](./Permission.md) for detailed configuration. If omitted, the system creates a new Permission with administrator access rights.
- **Retentive Mode**: `"always"` affects all device sessions, `"session"` affects only current program execution.

### 3. Guard Verification System

```json
{
  "witness": {
    "guards": ["dynamic_verification_guard"],
    // guards: List of Guard objects requiring verification
    "witness": [
      {
        "guard": "dynamic_verification_guard",
        // guard: Specific Guard object address
        "identifier": 1,
        // identifier: Reference position in Guard's verification table
        "type": 101,
        // type: Wowok data type code for witness value
        "witness": "emergency_arbitration_confirmed",
        // witness: USER-PROVIDED proof value (only field to modify)
        "cmd": [],
        // cmd: System-managed query commands
        "cited": 1,
        // cited: System-managed reference count
        "witnessTypes": []
        // witnessTypes: System-managed type information
      }
    ]
  }
}
```

The witness system provides real-time proof for Guard verification. Users only need to provide the `witness` field value. For complete witness configuration and types (34-38 for arbitration), see [Guard Documentation - Witness System section](./Guard.md#witness-system).

## Data Internal Organization

### Basic Service Configuration

```json
{
  "description": "Professional e-commerce dispute arbitration with expertise in product quality and delivery issues",
  "location": "New York City, Manhattan District",
  "bPaused": false,
  "guard": "verified_buyer_seller_guard",
  // guard: Only verified buyers/sellers can request arbitration
  "endpoint": "https://api.arbitration.com/dispute"
  // endpoint: External system integration point
}
```

| Parameter     | Type        | Required | Default | Description                                                              |
| ------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------ |
| `description` | string      | Optional | -       | Service capabilities and specialization areas                            |
| `location`    | string      | Optional | -       | Geographic jurisdiction, coordinates, or "remote"                        |
| `bPaused`     | boolean     | Optional | `false` | Service availability: `true`=temporarily closed, `false`=accepting cases |
| `guard`       | string/null | Optional | `null`  | Guard verification required for creating arbitration requests            |
| `endpoint`    | string/null | Optional | `null`  | HTTPS URL with format `?&arbitration={arbitration_id}&arb={arb_id}`      |

**Key Considerations**:

- Description should clarify expertise areas (product quality, delivery, pricing disputes) to help users select appropriate arbitrators
- Guards verify eligibility before arbitration requests, while endpoints enable external system integration for large-scale dispute handling
- Guard example: Verify users have completed at least 5 transactions before allowing arbitration requests, preventing frivolous disputes from new accounts

### Fee Management

Arbitration services can be free or charge fees to cover dispute resolution costs. Fee Treasury collects payments and enables arbitrator compensation distribution.

#### Basic Fee Configuration

```json
{
  "fee": "1000",(unit of Mist)
  // fee: 1000 base units (e.g., 0.001 SUI) per arbitration request
  "fee_treasury": "arbitration_revenue_treasury"
  // fee_treasury: Collects fees, enables arbitrator payments
}
```

**Fee Flow Example**: Customer pays 1000 units → Treasury collects → Arbitrator withdraws earned portion after case resolution.

#### Treasury Integration Options

**Critical Requirements**: Treasury `type_parameter` must exactly match Arbitration `type_parameter` for fee collection to work. Fees collected during `arb_new`, extracted via `arb_withdraw_fee`.

##### Reference Existing Treasury

```json
{
  "fee_treasury": "arbitration_revenue_treasury"
  // fee_treasury: Reference existing Treasury by name or address
}
```

##### Inline Treasury Creation

```json
{
  "fee_treasury": {
    "type_parameter": "0x2::sui::SUI",
    // type_parameter: Must exactly match Arbitration object's token type
    "permission": "arbitration_permission",
    // permission: Same Permission object controlling Arbitration access
    "name": "arbitration_revenue_fund",
    // name: Treasury identifier for financial management
    "onChain": true,
    // onChain: Whether object metadata visible on blockchain
    "tags": ["revenue", "arbitration-fees"],
    // tags: Categorization for Treasury management
    "useAddressIfNameExist": false
    // useAddressIfNameExist: Name conflict resolution strategy
  }
}
```

**AI Prompt Tip**: "Create inline Treasury for arbitration fees with [token_type] and [permission_name] for revenue management."

### Voting System

**Concept**: Multiple arbitrators vote on dispute propositions with weighted influence. Like jury systems, different arbitrator types (expert vs community) have different decision power.

```json
{
  "voting_guard": {
    "op": "add",
    "data": [
      {
        "guard": "certified_arbitrator_guard",
        "voting_weight": 10
      },
      {
        "guard": "community_arbitrator_guard",
        "voting_weight": 3
      }
    ]
  }
}
```

**Voting Example**: Certified arbitrator vote (weight 10) equals ~3 community arbitrator votes (weight 3), ensuring expert opinions carry more influence while maintaining community participation.

**Operation Types**:

| Operation     | Purpose                   | Required Parameters                   |
| ------------- | ------------------------- | ------------------------------------- |
| `"add"`       | Append new voting Guards  | `data` array with guard/voting_weight |
| `"set"`       | Replace all voting Guards | `data` array with guard/voting_weight |
| `"remove"`    | Remove specific Guards    | `guards` array with Guard addresses   |
| `"removeall"` | Clear all voting Guards   | -                                     |

**AI Prompt Tip**: "Configure voting system for [arbitration type] with [expert level] arbitrators having [weight] influence and [community level] having [weight] influence."

### Arbitration Workflow Operations

**Concept**: Four-stage workflow: Request creation (arb_new) → Voting (arb_vote) → Decision (arb_arbitration) → Payment (arb_withdraw_fee). Each Arb object represents one specific dispute case.

#### Create Dispute Case (arb_new)

**Purpose**: Submit new dispute case for arbitration with detailed complaint and proposition statements for arbitrator voting.

```json
{
  "arb_new": {
    "data": {
      "order": "disputed_order_address",
      // order: Order object address where dispute occurred
      "description": "Product received damaged, seller refuses replacement despite warranty terms",
      // description: Detailed dispute explanation including events and evidence
      "votable_proposition": [
        "Product was damaged during shipping",
        "Seller responsible for replacement under warranty",
        "Full refund appropriate given circumstances"
      ],
      // votable_proposition: Specific statements arbitrators can vote to support
      "max_fee": "2000"
      // max_fee: Maximum willing to pay, excess automatically refunded
    },
    "namedNew": {
      "name": "order_complaint_2024_001",
      // name: Systematic case identifier for tracking
      "onChain": true,
      // onChain: Public case visibility for transparency
      "tags": ["product-quality", "refund-request", "urgent"],
      // tags: Case categorization for arbitrator assignment
      "useAddressIfNameExist": false
      // useAddressIfNameExist: Name conflict resolution strategy
    }
  }
}
```

| Parameter               | Type          | Required                  | Description                                |
| ----------------------- | ------------- | ------------------------- | ------------------------------------------ |
| `order`                 | string        | Required                  | Order object address or name under dispute |
| `description`           | string        | Required                  | Detailed dispute explanation and evidence  |
| `votable_proposition`   | string[]      | Required                  | Statements arbitrators can vote to support |
| `max_fee`               | string/number | Optional                  | Maximum arbitration fee willing to pay     |
| `name`                  | string        | Optional                  | Case reference identifier                  |
| `onChain`               | boolean       | Optional (default: false) | Public case visibility                     |
| `tags`                  | string[]      | Optional                  | Case categorization labels                 |
| `useAddressIfNameExist` | boolean       | Optional (default: false) | Name conflict resolution                   |

#### Submit Vote (arb_vote)

```json
{
  "arb_vote": {
    "arb": "order_complaint_2024_001",
    // arb: Specific Arb object to vote on
    "voting_guard": "certified_arbitrator_guard",
    // voting_guard: Guard that qualifies this voter and determines weight
    "agrees": [0, 1]
    // agrees: Index numbers of supported propositions (0-based array)
  }
}
```

| Parameter      | Type     | Required | Description                                         |
| -------------- | -------- | -------- | --------------------------------------------------- |
| `arb`          | string   | Required | Arb object address or name to vote on               |
| `voting_guard` | string   | Required | Guard object that validates voter qualifications    |
| `agrees`       | number[] | Required | Array of proposition indices (0-255) voter supports |

**Voting Logic**: Index 0 = first proposition, index 1 = second proposition. Empty array means no support for any propositions.

#### Issue Decision (arb_arbitration)

**Purpose**: Arbitration service issues final binding decision with compensation determination based on voting results.

```json
{
  "arb_arbitration": {
    "arb": "order_complaint_2024_001",
    // arb: Arb object to finalize with decision
    "feedback": "After reviewing evidence and voting results, damage confirmed during shipping. Seller must provide replacement per warranty terms.",
    // feedback: Official arbitration decision explanation and reasoning
    "indemnity": "1500"
    // indemnity: Compensation amount customer can extract from Order object
  }
}
```

| Parameter   | Type               | Required | Description                                 |
| ----------- | ------------------ | -------- | ------------------------------------------- |
| `arb`       | string             | Required | Arb object address or name to finalize      |
| `feedback`  | string             | Required | Official decision explanation and reasoning |
| `indemnity` | string/number/null | Optional | Compensation amount extractable from Order  |

**Compensation Mechanism**: If indemnity specified, Order object holder can extract that amount. Setting null means no compensation awarded.

#### Extract Service Fee (arb_withdraw_fee)

**Purpose**: Arbitration service withdraws earned fees from completed cases to Treasury for revenue distribution.

```json
{
  "arb_withdraw_fee": {
    "arb": "order_complaint_2024_001",
    // arb: Completed Arb object to extract fees from
    "data": {
      "remark": "Arbitration service fee for case #2024-001 - complex product quality dispute resolution",
      // remark: Payment description for accounting records and audit trails
      "index": "2024001",
      // index: Business reference number for internal tracking systems
      "for_object": "arbitration_service_contract",
      // for_object: Related business object or service agreement address
      "for_guard": "fee_approval_guard"
      // for_guard: Guard verification for authorized fee extraction
    }
  }
}
```

| Parameter    | Type          | Required | Default | Description                                   |
| ------------ | ------------- | -------- | ------- | --------------------------------------------- |
| `arb`        | string        | Required | -       | Completed Arb object to extract fees from     |
| `remark`     | string        | Required | -       | Payment description for accounting            |
| `index`      | string/number | Optional | 0       | Business reference number                     |
| `for_object` | string        | Optional | -       | Related business object address or name       |
| `for_guard`  | string        | Optional | -       | Guard object address or name for verification |

**Workflow Dependencies**: Order object must exist → Arbitration service configured → Dispute case created → Votes collected → Decision issued → Fees distributed → Consumer extracts compensation from Order object.

**AI Prompt Tip**: "Create arbitration request for Order [order_id] with dispute about [issue_type], seeking [resolution_type] with maximum fee of [amount]."

---

## Data Types & Formats

### Built-in Permission Indexes

For complete permission index list across all modules, see [Permission Documentation - Built-in Permission Indexes section](./Permission.md#built-in-permission-indexes).

**Arbitration-Specific Permission Indexes (800-811)**:

| Index   | Permission        | Description                                 |
| ------- | ----------------- | ------------------------------------------- |
| **800** | Launch            | Create Arbitration object                   |
| **801** | Description       | Modify service description                  |
| **802** | Fee               | Configure arbitration fees                  |
| **803** | Voting Guard      | Add/remove voting Guard permissions         |
| **804** | Endpoint          | Configure service endpoint URL              |
| **805** | Application Guard | Set Guard verification for dispute requests |
| **806** | Pause Control     | Enable/disable new Arb creation             |
| **807** | Vote              | Submit votes on arbitration cases           |
| **808** | Arbitrate         | Issue final arbitration decisions           |
| **809** | Withdraw Fee      | Extract arbitration service fees            |
| **810** | Fee Treasury      | Set fee collection Treasury                 |
| **811** | Location          | Set arbitration service location            |

### Arbitration Witness Types

| Code   | Relationship      | Description                             |
| ------ | ----------------- | --------------------------------------- |
| **34** | Arb → Order       | Order address under dispute             |
| **35** | Arb → Arbitration | Arbitration service address             |
| **36** | Arb → Progress    | Progress address related to arbitration |
| **37** | Arb → Machine     | Machine address related to arbitration  |
| **38** | Arb → Service     | Service address related to arbitration  |

**Permission Usage**: Different roles require different permission combinations - service creators need 800-806, arbitrators need 807-808, administrators need 809-811.

**Witness Usage**: Types 34-35 are most common for basic dispute resolution. Types 36-38 handle complex workflow-integrated disputes. See [Guard Object documentation](./Guard.md) for complete witness configuration.

---

## Query Capabilities

Arbitration objects provide comprehensive dispute resolution monitoring and voting transparency for analyzing arbitration performance, tracking dispute patterns, and ensuring fair resolution processes.

**What You Can Query:**
- **Complete arbitration configuration** - including fee structures, voting guard requirements, treasury settings, and pause status
- **Arb instance creation events** - dispute resolution activity tracking and system usage monitoring
- **Guard query definitions** - specific to arbitration processes for verification requirements
- **Arbitrator permissions** - voting weights and verification requirements for transparency

**Quick Query Examples:**
- "Show me the fee structure and treasury settings for this arbitration service"
- "List all Arb instances created from arbitration_addr to see dispute activity"
- "Check the voting guard configuration and arbitrator requirements"
- "Track dispute creation patterns to understand arbitration system usage"

**Detailed Query Reference:** See the complete [Arbitration Object Query Capabilities](./Query_Reference.md#arbitration-object-query-capabilities) in the Wowok Query Technical Reference for field specifications, query operations, and advanced usage patterns.

---
