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

### Navigation by Need
| I need to... | Go to section |
|--------------|---------------|
| Create new Demand | [Core Parameters → Account & Object](#1-account--object-identification) |
| Add reward funds | [Core Parameters → Bounty Operations](#3-bounty-operations) |
| Set time limits | [Core Parameters → Time Configuration](#4-time-configuration) |
| Accept recommendations | [Core Parameters → Service Recommendations](#5-service-recommendations) |
| Distribute rewards | [Core Parameters → Bounty Operations](#3-bounty-operations) |
| Reference tables | [Data Types & Formats](#data-types--formats) |

---

## Overview

### Definition
Demand is a blockchain object that enables posting service requests with attached reward pools, receiving service recommendations, and executing reward distribution based on selection criteria.

### Technical Capabilities
- **Request Publishing**: Create structured service requests with metadata
- **Reward Pool Management**: Add/distribute funds or tokens as incentives
- **Recommendation Collection**: Accept service proposals from providers
- **Time Control**: Set validity periods for request and reward phases
- **Guard Integration**: Apply verification rules for recommendation filtering
- **Permission Control**: Manage operation access through Permission objects

### Core Technical Constraints
> **Critical**: Bounty pool is additive-only (cannot reduce funds once added)
> **Critical**: Time expiry is mandatory (prevents permanent fund locking)
> **Critical**: Single winner model (entire pool goes to one recommender)
> **Critical**: Refund only available after expiry AND no reward distributed

### Core Operations
1. **Create**: Initialize Demand object with token type and permissions
2. **Configure**: Set description, location, and optional verification rules
3. **Fund**: Add rewards to bounty pool (additive only, cannot reduce)
4. **Accept**: Receive service recommendations from providers
5. **Distribute**: Execute reward payment to selected service recommender
6. **Refund**: Reclaim unused rewards after expiration (if no selection made)

**Example Usage**: Post "Logo design needed" request with 1000 SUI reward → Receive 5 service recommendations → Select best match → Reward automatically transfers to recommender

*Related Implementation*: [→ Errand Flower Delivery Case Study](./Errand-flower_delivery.md)

---

## Core Parameters

### 1. Account & Object Identification

> **Note**: All operations require `account` parameter to specify transaction signer. If omitted, current active account is used.

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

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type_parameter` | string | Required | Token/NFT type for rewards (must be Coin or NFT type) |
| `permission` | string/object | Required | Permission object controlling access |
| `name` | string | Optional | Human-readable identifier |
| `tags` | string[] | Optional | Categorization labels |
| `onChain` | boolean | Optional | Metadata blockchain visibility |
| `useAddressIfNameExist` | boolean | Optional | Name conflict resolution |

> **Technical Note**: `type_parameter` must match the actual token type you'll add to bounty pool. Common formats:
> - SUI tokens: `"0x2::coin::Coin<0x2::sui::SUI>"`
> - Custom tokens: `"0x2::coin::Coin<0xABC123::token::TOKEN>"`
> - NFTs: `"0xDEF456::nft::NFTType"`

---

### 2. Basic Configuration

```json
{
  "description": "Service requirements and specifications",
  "location": "Geographic or virtual location details"
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `description` | string | Detailed service requirements, qualifications, deliverables |
| `location` | string | Location specification or "remote" |

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

#### Distribute Reward to Selected Service
```json
{
  "bounty": {
    "op": "reward",
    "service": "service_object_address"
  }
}
```

#### Reclaim Unused Rewards
```json
{
  "bounty": {
    "op": "refund"
  }
}
```

| Operation | Purpose | Availability | Requirements |
|-----------|---------|--------------|--------------|
| `add` | Increase reward pool | Before expiry | Sufficient account balance |
| `reward` | Pay selected service recommender | Before expiry | Valid recommendation exists |
| `refund` | Reclaim unused funds | After expiry + no rewards distributed | Demand owner permissions |

> **Technical Constraint**: Bounty pool is additive-only. Cannot reduce or withdraw funds except through reward/refund operations.

> **Technical Note**: `reward` operation transfers entire bounty pool to the account that recommended the selected service. Only one service can receive rewards per Demand.

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

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `op` | string | Required | "duration" or "time" |
| `minutes` | number | For duration | Minutes from current time |
| `time` | number | For time | Unix timestamp |

> **Technical Requirement**: Time expiry is mandatory. Without expiry setting, funds remain permanently locked in Demand object.

---

### 5. Service Recommendations

#### Submit Recommendation
```json
{
  "present": {
    "service": "service_object_address_or_name",
    "recommend_words": "Recommendation explanation and value proposition"
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service` | string | Required | Service object address or name |
| `recommend_words` | string | Optional | Recommendation justification |

> **Technical Note**: The `service` parameter must reference an existing Service object. Each service can only be recommended once per Demand, but multiple parties can recommend different services.

---

### 6. Guard Integration

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

| Parameter | Type | Description |
|-----------|------|-------------|
| `guard` | string/null | Guard object for recommendation verification |
| `service_id_in_guard` | number (1-255) | Position ID where service address is provided as witness during verification |

> **Technical Note**: `service_id_in_guard` specifies the identifier position (1-255) in the Guard's verification table where the service address should be provided as witness data. This corresponds to the Guard's internal verification logic structure.

**Guard Function**: Guard objects contain verification logic that automatically checks conditions before allowing recommendations. Examples include portfolio requirements, location constraints, or certification verification.

---

### 7. Advanced Features

#### Guard Witness System
```json
{
  "witness": {
    "guards": ["guard_object_address"],
    "witness": [
      {
        "guard": "guard_object_address",
        "identifier": 1,
        "type": 101,
        "witness": "user_provided_proof_value"
      }
    ]
  }
}
```

**Technical Note**: Only modify the `witness` field with your proof value. All other parameters (guard, identifier, type) are system-generated based on Guard requirements.

#### Network Configuration
```json
{
  "session": {
    "network": "sui testnet",
    "retentive": "always"
  }
}
```

| Parameter | Options | Description |
|-----------|---------|-------------|
| `network` | `sui mainnet/testnet`, `wowok mainnet/testnet` | Target blockchain |
| `retentive` | `always`, `session` | Session persistence |

---

## Data Types & Formats

### Address Formats

#### Simple Address
```json
{
  "address": "0x123...abc"
}
```

#### Named Address
```json
{
  "address": {
    "local_mark_first": true,
    "name_or_address": "saved_name_or_0x123...abc"
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `local_mark_first` | boolean | Search local saved names first (true) or account names first (false) |
| `name_or_address` | string | Saved name or full address |

### Token Type Examples

| Type Category | Format | Example |
|---------------|--------|---------|
| **SUI Coin** | `0x2::coin::Coin<0x2::sui::SUI>` | Native SUI tokens |
| **Custom Coin** | `0x2::coin::Coin<0xPACKAGE::MODULE::TYPE>` | Custom fungible tokens |
| **NFT** | `0xPACKAGE::MODULE::TYPE` | Non-fungible tokens |

---

## Integration Patterns

### Cross-Object Dependencies
- **Demand → Permission**: Controls who can perform operations (create, add bounty, reward, refund)
- **Demand → Guard**: Filters recommendation quality through verification rules
- **Demand → Service**: Service objects can be recommended to fulfill Demand requirements
- **Guard → Repository**: Guards can query Repository data for verification logic

### Common Architecture Patterns
1. **Simple Request**: Demand + Permission (basic service request)
2. **Quality Filtered**: Demand + Permission + Guard (verified recommendations only)  
3. **Multi-Service**: Multiple Service objects competing for one Demand reward
4. **Referral Network**: Third parties recommending services they don't own

### Object Creation Sequence
1. Create Permission object (access control)
2. Create Guard object (optional, for recommendation filtering)
3. Create Demand object (references Permission and optional Guard)
4. Service objects (must exist before they can be recommended)

---

## Complete Examples

### Basic Demand Creation
```json
{
  "account": "my_account",
  "data": {
    "object": {
      "type_parameter": "0x2::coin::Coin<0x2::sui::SUI>",
      "permission": "my_permission_object"
    },
    "description": "Logo design for fintech startup",
    "time_expire": {
      "op": "duration", 
      "minutes": 2880
    },
    "bounty": {
      "op": "add",
      "object": {
        "balance": "500"
      }
    }
  }
}
```

### Submit Service Recommendation
```json
{
  "account": "recommender_account",
  "data": {
    "object": "logo_design_demand",
    "present": {
      "service": "design_agency_service",
      "recommend_words": "Specialized fintech design team with 15+ successful projects"
    }
  }
}
```

### Reward Selected Service
```json
{
  "account": "my_account",
  "data": {
    "object": "logo_design_demand",
    "bounty": {
      "op": "reward",
      "service": "design_agency_service"
    }
  }
}
```

**Expected Result**: 500 SUI transfers from Demand bounty pool to the account that recommended "design_agency_service".

---

## Common Issues & Troubleshooting

### Bounty Operation Failures
**Problem**: "Insufficient balance for bounty add operation"  
**Solutions**:
1. Verify account has sufficient balance of the token type specified in `type_parameter`
2. Check token type matches exactly (e.g., `0x2::coin::Coin<0x2::sui::SUI>` not `0x2::sui::SUI`)
3. Confirm account has permission to transfer tokens

### Time Configuration Errors  
**Problem**: "Cannot perform operation, Demand expired"  
**Solutions**:
1. Check current time against expiry time using `time_expire` settings
2. Use `refund` operation to reclaim unused rewards after expiry
3. Create new Demand if continued service discovery needed

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
