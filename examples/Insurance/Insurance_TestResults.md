# Insurance Service Example - Test Results

This document records the actual execution results of the Insurance example on the WoWok testnet.

## Test Environment
- **Network**: testnet
- **Test Date**: 2026-05-03
- **SDK Version**: WoWok TypeScript SDK (local build)

## Overview

This example demonstrates an outdoor accident insurance service with time-lock completion guards. The service uses a simple two-node workflow (Start -> Complete) where the completion requires a time-lock guard to prevent premature order finalization.

## Key Object Addresses

| Object Type | Name | Object Address |
|-------------|------|----------------|
| Permission | insurance_permission_v1 | 0x93221f078e5aff1bab5f6486f9a0922268c3734a1ed5a9535109439bb7dd17e4 |
| Guard (Complete) | insurance_complete_guard_v1 | 0x3c07695d6f01c875c718bef8fae78cdf9ee19bcb174a9b35bb6213c29816f200 |
| Guard (Withdraw) | insurance_withdraw_guard_v1 | 0xc736a8296bd502aeae7802aadaf9a8d194ce2d498f5a1ed8fe63c33981f523b3 |
| Machine | insurance_machine_v1 | 0xd66d95bc0ed855ba0c0a650368f025871f817ca2145d6ea09b9566a2f17f74b3 |
| Service | insurance_service_v1 | 0x161b4a7398dd2fca54559e924c7f1619169f88e81c36bbad06ebb2931f5f2e32 |
| Test Order | test_insurance_order_v1 | 0xf0809ed1ee30e4d7cf1e8fc91c00e70e2d219f6d447aaa633b28a8d83f9ea243 |
| Progress | - | 0x5d06b916e8d6ce8fb75ad2b46426335c297d890d60a99cdbc8c59c6616ab0f8c |

---

## Part 1: Merchant System Setup - Actual Execution Results

### Create Merchant Account and Get Test Tokens

**Create Account:**
```json
{
  "gen": {
    "name": "insurance_provider_v1",
    "replaceExistName": true
  }
}
```

**Execution Result:**
```json
{
  "gen": {
    "address": "0xda54ebfdbeecec5cae8ae8cdb2d0bf741dfc4e1051c0b4c7bb9968b441067e02",
    "name": "insurance_provider_v1"
  }
}
```

**Get Test Tokens:**
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "insurance_provider_v1"
  }
}
```

**Execution Result:** Successfully received 5 WOW tokens (5,000,000,000 MIST).

---

### Step 1: Create Permission Object

**Prompt:**
```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "insurance_permission_v1",
      "tags": ["insurance", "outdoor", "accident"],
      "replaceExistName": true
    },
    "description": "Permission for outdoor accident insurance service"
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Execution Result:**
- **Object Address**: 0x93221f078e5aff1bab5f6486f9a0922268c3734a1ed5a9535109439bb7dd17e4
- **Transaction**: 58gPUwgwM6npS7cs5XbpmCg7SVoTodE8PpTCMLYAMt6m
- **Status**: Success

---

### Step 2: Create Insurance Complete Guard (Time-Lock)

**Guard Definition** (`insurance_complete_guard_v1.json`):
```json
{
  "namedNew": {
    "name": "insurance_complete_guard_v1",
    "tags": ["insurance", "complete", "time-lock"],
    "replaceExistName": true
  },
  "description": "Time-lock guard for insurance claim completion",
  "table": [
    {
      "identifier": 0,
      "b_submission": true,
      "value_type": "Address",
      "name": "Order ID (submitted at runtime)"
    },
    {
      "identifier": 1,
      "b_submission": false,
      "value_type": "U64",
      "value": "1000",
      "name": "Time-lock duration in ms"
    }
  ],
  "root": {
    "type": "logic_as_u256_greater",
    "nodes": [
      {
        "type": "context",
        "context": "Clock"
      },
      {
        "type": "calc_number_add",
        "nodes": [
          {
            "type": "query",
            "query": "progress.current_time",
            "object": {
              "identifier": 0,
              "convert_witness": 100
            },
            "parameters": []
          },
          {
            "type": "identifier",
            "identifier": 1
          }
        ]
      }
    ]
  }
}
```

**Key Design Pattern**: Uses `convert_witness: 100` (WitnessType.TypeOrderProgress) to convert the submitted Order ID to access its associated Progress object's `current_time` field.

**Execution Result:**
- **Object Address**: 0x3c07695d6f01c875c718bef8fae78cdf9ee19bcb174a9b35bb6213c29816f200
- **Transaction**: Bi6ykn7kewLsAjhUGLMKeErVJ9J7yvm8UsW78Y7F9We1
- **Status**: Success

---

### Step 3: Create Insurance Withdraw Guard

**Guard Definition** (`insurance_withdraw_guard_v1.json`):
```json
{
  "namedNew": {
    "name": "insurance_withdraw_guard_v1",
    "tags": ["insurance", "withdraw"],
    "replaceExistName": true
  },
  "description": "Allow insurance provider to withdraw funds after order is completed.",
  "table": [
    {
      "identifier": 0,
      "b_submission": true,
      "value_type": "Address",
      "name": "order_id"
    },
    {
      "identifier": 1,
      "b_submission": false,
      "value_type": "String",
      "value": "Complete",
      "name": "complete_node"
    }
  ],
  "root": {
    "type": "logic_equal",
    "nodes": [
      {
        "type": "query",
        "query": "progress.current",
        "object": {
          "identifier": 0,
          "convert_witness": 100
        },
        "parameters": []
      },
      {
        "type": "identifier",
        "identifier": 1
      }
    ]
  }
}
```

**Execution Result:**
- **Object Address**: 0xc736a8296bd502aeae7802aadaf9a8d194ce2d498f5a1ed8fe63c33981f523b3
- **Transaction**: FrL3z1jExLrs652vFr12faL9Xb5XMzh9vT9hZWPdgJyz
- **Status**: Success

---

### Step 4: Create Insurance Machine

**Prompt:**
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "insurance_machine_v1",
      "permission": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Insurance claim processing workflow: Start -> Complete (with time-lock guard)",
    "node": {
      "op": "add",
      "data": [
        {
          "name": "Start",
          "pairs": [
            {
              "prev_node": "",
              "forwards": [
                {
                  "name": "claim",
                  "guard": [],
                  "next_node_name": "Complete"
                }
              ]
            }
          ]
        },
        {
          "name": "Complete",
          "pairs": [
            {
              "prev_node": "Start",
              "forwards": [
                {
                  "name": "complete_claim",
                  "guard": ["insurance_complete_guard_v1"],
                  "next_node_name": ""
                }
              ]
            }
          ]
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Execution Result:**
- **Object Address**: 0xd66d95bc0ed855ba0c0a650368f025871f817ca2145d6ea09b9566a2f17f74b3
- **Transaction**: BBjtFHkZQc7ag4uHziGNmB719g9w4vMNRX4j1AB4EQMq
- **Status**: Success
- **Node Count**: 2
- **Published**: Yes

---

### Step 5: Create Insurance Service

**Prompt:**
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "insurance_service_v1",
      "permission": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Outdoor accident insurance for Iceland travel. Provides coverage for ice scooting and other outdoor activities.",
    "machine": "insurance_machine_v1",
    "sales": [
      {
        "name": "Outdoor Accident Insurance",
        "price": "100000000",
        "stock": "999"
      }
    ],
    "order_allocators": {
      "description": "Insurance order revenue allocation",
      "threshold": "0",
      "allocators": [
        {
          "guard": "insurance_withdraw_guard_v1",
          "sharing": [
            {
              "who": "Signer",
              "sharing": "10000",
              "mode": 1
            }
          ],
          "fix": "0",
          "max": null
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Execution Result:**
- **Object Address**: 0x161b4a7398dd2fca54559e924c7f1619169f88e81c36bbad06ebb2931f5f2e32
- **Transaction**: ju5K75sakrHsWnSLDv42kNTE37Q9LKF3Ue9ML9c2taT
- **Status**: Success
- **Published**: Yes
- **Paused**: No

---

### Step 6: Unpause Service

The service was already unpaused after creation. Verified configuration:
- **Service Status**: Active
- **Machine Bound**: insurance_machine_v1
- **Sales**: 1 item available
- **Order Allocators**: 1 allocator configured

---

## Part 2: Order Workflow Test

### Test Order Creation

**Prompt:**
```json
{
  "operation_type": "order",
  "data": {
    "object": {
      "name": "test_insurance_order_v1",
      "replaceExistName": true
    },
    "service": "insurance_service_v1",
    "item": {
      "name": "Outdoor Accident Insurance",
      "price": "100000000",
      "quantity": 1
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Execution Result:**
- **Order Address**: 0xf0809ed1ee30e4d7cf1e8fc91c00e70e2d219f6d447aaa633b28a8d83f9ea243
- **Progress Address**: 0x5d06b916e8d6ce8fb75ad2b46426335c297d890d60a99cdbc8c59c6616ab0f8c
- **Transaction**: ju5K75sakrHsWnSLDv42kNTE37Q9LKF3Ue9ML9c2taT
- **Amount**: 100,000,000 MIST (0.1 WOW)

---

### Progress Workflow Test

#### Initial -> Start
**Prompt:**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_insurance_order_v1",
    "operate": {
      "operation": {
        "next_node_name": "Start",
        "forward": "claim"
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Result**: Success - Progress moved from "" to "Start"

#### Start -> Complete (Time-Lock Test)

**Attempt 1 (Immediate - Should Fail):**
```json
{
  "operation_type": "progress",
  "data": {
    "object": "test_insurance_order_v1",
    "operate": {
      "operation": {
        "next_node_name": "Complete",
        "forward": "complete_claim"
      }
    }
  },
  "submission": {
    "type": "submission",
    "guard": [{"object": "insurance_complete_guard_v1", "impack": true}],
    "submission": [{
      "guard": "insurance_complete_guard_v1",
      "submission": [{
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "value": "0xf0809ed1ee30e4d7cf1e8fc91c00e70e2d219f6d447aaa633b28a8d83f9ea243"
      }]
    }]
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Result**: Guard validation failed - Time-lock not yet expired (expected behavior)

**Attempt 2 (After 1.5s - Should Succeed):**

Waited 1.5 seconds and retried the same operation.

**Result**: Success - Progress moved from "Start" to "Complete"
- **Transaction**: mqLXfDYKwGwJPg3jytvzC9NnPeykSkioV6nKqKgvmFt
- **Current Node**: Complete
- **History Count**: 2

---

## Summary

### Test Results

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Account Creation | Success | Success | ✅ |
| Permission Creation | Success | Success | ✅ |
| Guard Creation (Complete) | Success | Success | ✅ |
| Guard Creation (Withdraw) | Success | Success | ✅ |
| Machine Creation | Success | Success | ✅ |
| Service Creation | Success | Success | ✅ |
| Order Creation | Success | Success | ✅ |
| Progress: Initial -> Start | Success | Success | ✅ |
| Progress: Start -> Complete (Immediate) | Fail (Time-Lock) | Failed as expected | ✅ |
| Progress: Start -> Complete (After 1.5s) | Success | Success | ✅ |

### Key Learnings

1. **Time-Lock Implementation**: The `convert_witness: 100` (TypeOrderProgress) is essential for accessing Progress data from an Order ID submission.

2. **Guard Submission Schema**: Guard submissions require `b_submission` and `value_type` fields to be explicitly specified.

3. **Machine Node Structure**: The `prev_node: ""` (empty string) defines the entry point from the initial Progress state.

4. **Submission Parameter Location**: Guard submissions must be passed as a top-level `submission` parameter, not nested within `data.operate`.

---