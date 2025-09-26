# Demand Object: Your Service Request & Reward System

> "Post service requests with reward pools, receive recommendations, control reward distribution"

**MCP Tool**: `mcp_wowok_demand_demand_operations`

## How to Use This Documentation

### Document Structure
- **[Overview](#overview)**: Core functionality and technical capabilities
- **[Core Parameters](#core-parameters)**: All configuration options organized by operation type
- **[Data Types & Formats](#data-types--formats)**: Technical reference for addresses and types
- **[Integration Patterns](#integration-patterns)**: How Demand works with other objects
- **[Complete Examples](#complete-examples)**: Working configurations with expected results
- **[Query Capabilities](#query-capabilities)**: What you can query and how to access Demand data

### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Create new Demand | [Core Parameters → Account & Object](#1-account--object-identification) |
| Add reward funds | [Core Parameters → Bounty Operations](#3-bounty-operations) |
| Set time limits | [Core Parameters → Time Configuration](#4-time-configuration) |
| Accept recommendations | [Core Parameters → Service Recommendations](#5-service-recommendations) |
| Distribute rewards | [Core Parameters → Bounty Operations](#3-bounty-operations) |
| Reference tables | [Data Types & Formats](#data-types--formats) |
| Query demand data | [Query Capabilities](#query-capabilities) |

---

## Overview

### Definition
Demand is an on-chain object that enables posting service requests with attached reward pools, receiving service recommendations, and executing reward distribution based on selection criteria.

### Core Capabilities
- **Post Requests**: Describe what you need and set rewards
- **Collect Recommendations**: Let service providers pitch their solutions
- **Reward Winners**: Automatically pay the best recommendation

### Important Notes
- Bounty pool is additive-only (cannot reduce funds once added)
- Single winner model (entire pool goes to one recommender)
- Refund only available after expiry AND no reward distributed
- No time expiry = no refund option (funds stay locked)

### Core Workflow
1. **Create**: Initialize Demand object with [token type and permissions](#1-account--object-identification)
2. **Configure**: Set [description, location](#2-basic-configuration), and optional [verification rules](#6-guard-integration)
3. **Fund**: Add rewards to [bounty pool](#3-bounty-operations) (additive only, cannot reduce)
4. **Accept**: Receive [service recommendations](#5-service-recommendations) from providers
5. **Distribute**: Execute [reward payment](#3-bounty-operations) to selected service recommender
6. **Refund**: Reclaim unused rewards after [expiration](#4-time-configuration) (if no selection made)

**Note**: Once funds are added to bounty pool, they cannot be withdrawn until reward distribution or post-expiration refund operations. **Setting expiration time (`time_expire`) is strongly recommended to enable refund operations if no suitable service is found. Default: 7 days if not specified.**

**Example Usage**: 
1. Post "Bakery website needed" request with 200 SUI reward
2. Receive 3 web designer recommendations  
3. Select best match
4. Reward automatically transfers to recommender

*Related Implementation*: [→ Errand Flower Delivery Case Study](./Errand-flower_delivery.md)

---

## Core Parameters

### 1. Account & Object Identification

**Account Parameter**: All operations require `account` parameter to specify the transaction signer address or account name. If omitted, the currently active account is used automatically.

#### Object Reference (Existing)
```json
{
  "object": "existing_demand_name_or_address"
}
```

#### Object Creation (New)
```json
{
  "object": {
    "type_parameter": "0x2::coin::Coin<0x2::sui::SUI>",
    "permission": "permission_object_reference",
    "name": "demand_identifier",
    "tags": ["category1", "category2"],
    "onChain": true,
    "useAddressIfNameExist": false
  }
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type_parameter` | string | Required | - | Coin/NFT type for rewards (must be Coin or NFT type) |
| `permission` | string/object | Optional | Auto-created | Permission object controlling access (if omitted, creates new permission) |
| `name` | string | Optional | Auto-generated | Human-readable identifier |
| `tags` | string[] | Optional | `[]` | Categorization labels |
| `onChain` | boolean | Optional | `false` | Metadata blockchain visibility |
| `useAddressIfNameExist` | boolean | Optional | `false` | Name conflict resolution |

**Important Format Difference**: Demand uses Coin wrapper format (`"0x2::coin::Coin<0x2::sui::SUI>"`) for rewards, different from Treasury/Service Token format (`"0x2::sui::SUI"`). This is by design - Demand handles coins as reward objects.

**Technical Note**: `type_parameter` must match the actual token type you'll add to bounty pool. Common formats:
- SUI tokens: `"0x2::coin::Coin<0x2::sui::SUI>"`
- Custom tokens: `"0x2::coin::Coin<0xABC123::token::TOKEN>"`
- NFTs: `"0xDEF456::nft::NFTType"`

---

### 2. Basic Configuration

```json
{
  "description": "Service requirements and specifications",
  // description: "I'm starting a small bakery and really need a simple website where customers can see our daily menu and maybe order online. Nothing fancy, just something that feels warm and shows off our homemade bread. Would love to work with someone who gets what small local businesses need, not just another corporate template. Budget is tight but this could really help us grow."
  "location": "Geographic or virtual location details"
  // location: "Local preferred (Portland area) but open to remote if you understand small business"
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `description` | string | Required | - | Detailed service requirements, qualifications, deliverables |
| `location` | string | Optional | `"remote"` | Location specification or "remote" |

---

### 3. Bounty Operations

#### Add Rewards (from account balance)
```json
{
  "bounty": {
    "op": "add",
    "object": {
      "balance": "1000"
    }
  }
}
```

#### Add Specific Objects (NFTs or existing coins)
```json
{
  "bounty": {
    "op": "add",
    "object": {
      "address": "0x123...abc"
    }
  }
}
```

#### Distribute Reward to Selected Service Recommender
```json
{
  "bounty": {
    "op": "reward",
    "service": "service_object_address"
  }
}
```

**Why Service Address**: The reward goes to whoever recommended this specific Service object. If the service owner recommended their own service, they get the reward. If a third party recommended it, the third party gets the reward.

#### Reclaim Unused Rewards
```json
{
  "bounty": {
    "op": "refund"
  }
}
```

| Operation | Purpose | When Available | Requirements |
|-----------|---------|----------------|--------------|
| `add` | Increase reward pool | Before expiry | Sufficient account balance |
| `reward` | Pay selected service recommender | Before expiry | Valid recommendation exists |
| `refund` | Reclaim unused funds | After expiry + no rewards distributed | Demand owner permissions |

**Technical Constraint**: Bounty pool is additive-only. Cannot reduce or withdraw funds except through reward/refund operations.

**Technical Note**: `reward` operation transfers entire bounty pool to the account that recommended the selected service. Only one recommender can receive rewards per Demand.

---

### 4. Time Configuration

#### Duration-based (recommended)
```json
{
  "time_expire": {
    "op": "duration",
    "minutes": 1440
  }
}
```

#### Absolute timestamp
```json
{
  "time_expire": {
    "op": "time",
    "time": 1703923200
  }
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `op` | string | Required | - | "duration" or "time" |
| `minutes` | number | For duration | `10080` (7 days) | Minutes from current time |
| `time` | number | For time | - | Unix timestamp |

**Best Practice**: Set time expiry to enable refunds. No expiry = no way to get unused funds back.

---

### 5. Service Recommendations

#### Submit Recommendation
```json
{
  "present": {
    "service": "service_object_address_or_name",
    // service: "sarah_localweb_studio"
    "recommend_words": "Recommendation explanation and value proposition"
    // recommend_words: "I know exactly the right bakery website designer! Sarah from LocalWeb Studio has built 5+ bakery sites in Portland and really understands the cozy, artisanal feel you want. Her work for Sunrise Bakery increased their online orders by 200%. She's affordable and local too."
  }
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `service` | string | Required | - | Service object address or name |
| `recommend_words` | string | Optional | `""` | Recommendation justification |

**Technical Note**: The `service` parameter must reference an existing Service object. Each service can only be recommended once per Demand, but different services can be recommended by multiple parties to the same Demand.

---

### 6. Guard Integration

For complete Guard configuration and verification logic, see [Guard Documentation](./Guard.md).

#### Set Recommendation Filter
```json
{
  "guard": {
    "guard": "guard_object_address",
    "service_id_in_guard": 1
  }
}
```

#### Remove Filter
```json
{
  "guard": {
    "guard": null
  }
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `guard` | string/null | Optional | `null` | Guard object that checks recommendation quality |
| `service_id_in_guard` | number (1-255) | Optional | `1` | Position in Guard's verification list |

**Demand-specific Guard Usage**: Guard checks if service providers meet your requirements before they can recommend their services. For example, only designers from Portland State University, or who worked at Nike, or built 10+ restaurant websites, or have Google UX certification.

---

### 7. Advanced Features

#### Network Configuration
```json
{
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `network` | string | Optional | `"sui testnet"` | Target blockchain (`sui mainnet/testnet`, `wowok mainnet/testnet`) |
| `retentive` | string | Optional | `"always"` | Session persistence (`always`, `session`) |

---

## Data Types & Formats

### Address Formats

Demand supports both blockchain addresses and saved local names. For complete address format options and Local Marks explanation, see [Service Documentation - Address Format Options section].

**Demand-specific examples**:
```json
"service": "0x1234abcd5678ef90..."
// or
"service": "sarah_web_studio"
```

### Token Type Examples

For complete Wowok data types reference (100-122), see [Guard Documentation - Data Types section].

**Demand-specific token formats** (note the Coin wrapper requirement):
- **SUI Coin**: `0x2::coin::Coin<0x2::sui::SUI>`
- **Custom Coin**: `0x2::coin::Coin<0xPACKAGE::MODULE::TYPE>`
- **NFT**: `0xPACKAGE::MODULE::TYPE`

---

## Complete Examples

### Basic Demand Creation
```json
{
  "account": "bakery_owner",
  "data": {
    "object": {
      "type_parameter": "0x2::coin::Coin<0x2::sui::SUI>",
      "permission": "bakery_permission"
    },
    "description": "I'm starting a small bakery and really need a simple website where customers can see our daily menu and maybe order online. Nothing fancy, just something that feels warm and shows off our homemade bread.",
    "time_expire": {
      "op": "duration", 
      "minutes": 10080
    },
    "bounty": {
      "op": "add",
      "object": {
        "balance": "200"
      }
    }
  }
}
```

### Submit Service Recommendation
```json
{
  "account": "web_designer",
  "data": {
    "object": "bakery_website_demand",
    "present": {
      "service": "sarah_web_studio",
      "recommend_words": "I know exactly the right bakery website designer! Sarah from LocalWeb Studio has built 5+ bakery sites in Portland and really understands the cozy, artisanal feel you want. Her work for Sunrise Bakery increased their online orders by 200%. She's affordable and local too."
    }
  }
}
```

### Reward Selected Service
```json
{
  "account": "bakery_owner",
  "data": {
    "object": "bakery_website_demand",
    "bounty": {
      "op": "reward",
      "service": "sarah_web_studio"
    }
  }
}
```

**Expected Result**: 200 SUI transfers from Demand bounty pool to the account that recommended "sarah_web_studio".

---

## Common Issues & Troubleshooting

### Bounty Operation Failures
**Problem**: "Insufficient balance for bounty add operation"  
**Solutions**:
1. Verify account has sufficient balance of the token type specified in `type_parameter`
2. Check coin type matches exactly (e.g., `0x2::coin::Coin<0x2::sui::SUI>` not `0x2::sui::SUI`)
3. Confirm account has permission to transfer tokens

### Time Configuration Errors  
**Problem**: "Cannot perform operation, Demand expired"  
**Solutions**:
1. Check current time against expiry time using `time_expire` settings
2. Use `refund` operation to reclaim unused rewards after expiry
3. Create new Demand if continued service discovery needed

**Problem**: "Cannot refund, no expiry time set"  
**Solutions**:
1. Set time expiry to enable refunds (default: 7 days if not specified)
2. Create new Demand with expiry time if you need fund recovery option

### Guard Verification Issues
**Problem**: "Guard verification failed for recommendation"  
**Solutions**:
1. Verify the service/recommender meets all Guard requirements
2. Check witness data format matches Guard expectations exactly
3. Ensure Guard object exists and is properly configured
4. Test Guard verification independently before integrating with Demand

### Service Recommendation Problems
**Problem**: "Service object not found" or "Service already recommended"  
**Solutions**:
1. Verify Service object exists and is accessible
2. Each service can only be recommended once per Demand (but multiple services can be recommended to one Demand)
3. Service name/address must match exactly with existing Service object

---

## Query Capabilities

Demand objects provide comprehensive service discovery and recommendation tracking for analyzing market demand, monitoring service presentations, and understanding recommendation patterns.

**What You Can Query:**
- **Complete demand configuration** - including requirements, guard settings, reward pool information, and expiration times
- **All service recommendations** - submitted by potential service providers with timestamps and recommender details
- **Specific recommendation details** - including presentation content and service provider information
- **Service presentation events** - recommendation activity tracking across the entire system

**Quick Query Examples:**
- "Show me the complete demand configuration including bounty pool and guard requirements"
- "List all services recommended to demand_addr to see available options"
- "Get the recommendation details for service_addr in demand_addr to understand the presentation"
- "Review the bounty pool and reward settings for this demand to understand incentives"

**Detailed Query Reference:** See the complete [Demand Object Query Capabilities](./Query_Reference.md#demand-object-query-capabilities) in the Wowok Query Technical Reference for field specifications, query operations, and advanced usage patterns.

---
