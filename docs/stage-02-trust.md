# Stage 2: Trust Management 🔐

---

**[← Stage 1: Getting Started](stage-01-introduction.md) | [Stage 3: Open Collaboration →](stage-03-collaboration.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about trust management mechanisms in WoWok, including:

- How to manage who can do what through Permission
- How to create programmable trust rules through Guard
- Understanding WoWok's permission index system

---

## 📚 Learning Content

### 2.1 Permission (Permission Management 🔑)

**Why do we need Permission?**

In a decentralized world, we need to clearly define: **who can perform what operations on what objects**. Permission is WoWok's permission management system.

**Core Concepts:**
- 👤 **Subject (Who)** - Who (account address or Guard ID)
- 📦 **Object (What)** - On-chain objects (all objects that have set this Permission)
- 🎯 **Action (How)** - What to do (permission index)

> **📢 Notice:** Users can perform operations with specified permissions on specified objects through their account or by completing specified Guard verification.

**Built-in Permission Indexes:**
```
SERVICE_NEW = 300      - Create service
SERVICE_DESCRIPTION = 301  - Modify service description
MACHINE_NEW = 500      - Create workflow
REPOSITORY_NEW = 700    - Create data repository
... etc
```

**Core Features:**
- ✅ Add/Remove permissions
- ✅ Remove permissions for accounts or Guard IDs
- ✅ Exchange, copy, and transfer permissions
- ✅ Query built-in permissions

**→ [View Permission Detailed Documentation →](permission.md)**

---

### 2.2 Guard (Trust Verification Engine 🛡️)

**Why do we need Guard?**

Permission is like permission management for specific groups and internal organization personnel, while Guard acts like a "guard" that can verify and authorize operations for unknown crowds, such as:
- If you have purchased a certain service before a certain time, you can claim $20 reward from the Reward object
- If you recommend a service approved by the user to their Demand, you can get $40 reward
- If a courier's delivery time in a certain process is less than 20 minutes, they can get 10 points
- etc.

**Core Concepts:**
- Guard can be defined in Markdown or JSON format
- Supports complex conditional verification logic
- Can interact with Reward, Machine, and other components

**Core Features:**
- ✅ Create Guard (Markdown format)
- ✅ Create Guard (JSON format)
- ✅ Query built-in Guard instructions
- ✅ Link Guard to other objects

**→ [View Guard Detailed Documentation →](guard.md)**

---

## 🎓 Practice Exercises

### Exercise 1: Create a Permission

**💬 You**: On testnet, using my_first_account, create a new Permission object. And:
1. Add description: "Test Permission";
2. Add permissions for alice: create Service, and all permissions related to Machine;
3. Name this new object P1

---

**🤖 AI Generated Request JSON:**

```json
{
  "data": {
    "description": "Test Permission",
    "object": {
      "name": "P1"
    },
    "table": {
      "op": "add perm by entity",
      "entity": {
        "name_or_address": "alice"
      },
      "index": [
        300,
        200,
        201,
        203,
        204,
        205,
        206,
        207,
        208
      ]
    }
  },
  "operation_type": "permission",
  "env": {
    "account": "my_first_account",
    "network": "testnet"
  }
}
```

**✅ Transaction executed successfully:**

```
Transaction completed successfully...
```

**📤 Return Result:**

```json
[
  {
    "type": "Permission",
    "type_raw": "0x2::permission::Permission",
    "object": "...",
    "version": "149",
    "owner": {
      "Shared": {
        "initial_shared_version": 149
      }
    },
    "change": "created"
  }
]
```

### Exercise 2: Create a Guard that Anyone Can Pass

**💬 You**: Create a Guard named "simple_guard": "Anyone can pass the verification".

---

**🤖 AI Generated Request JSON:**

```json
{
  "data": {
    "description": "Anyone can pass the verification",
    "namedNew": {
      "name": "simple_guard"
    },
    "table": [
      {
        "b_submission": false,
        "identifier": 0,
        "value": true,
        "value_type": 0
      }
    ],
    "root": {
      "node": {
        "type": "identifier",
        "identifier": 0
      },
      "type": "node"
    }
  },
  "operation_type": "guard"
}
```


**✅ Transaction executed successfully:**

```
Transaction completed successfully
[
  {
    "type": "Guard",
    "type_raw": "0x2::guard::Guard",
    "object": "...",
    "version": "12687712",
    "owner": "Immutable",
    "change": "created"
  }
]
```


---

### Exercise 3: Create a Guard that Only User alice Can Pass

**💬 You**: Create a new Guard object named G1 (mandatory). It needs to verify:
The signer has permission to create service objects in P1 object.

---

**🤖 AI Generated Request JSON:**

```json
{
  "data": {
    "description": "Verify that the signer has permission to create service in P1 object",
    "namedNew": {
      "name": "G1",
      "replaceExistName": true
    },
    "table": [
      {
        "identifier": 0,
        "b_submission": false,
        "value_type": 1,
        "value": "P1"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": 4,
        "value": 300
      }
    ],
    "root": {
      "type": "node",
      "node": {
        "query": "permission.entity.perm has",
        "type": "query",
        "object": {
          "identifier": 0
        },
        "parameters": [
          {
            "context": "Signer",
            "type": "context"
          },
          {
            "identifier": 1,
            "type": "identifier"
          }
        ]
      }
    }
  },
  "operation_type": "guard"
}
```


**✅ Transaction executed successfully:**

```
Transaction completed successfully

[
  {
    "type": "Guard",
    "type_raw": "0x2::guard::Guard",
    "object": "...",
    "version": "12685347",
    "owner": "Immutable",
    "change": "created"
  }
]
```


---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood the three core elements of Permission (Who, What, How)
- [ ] Know how to query built-in permission indexes
- [ ] Created at least one Permission
- [ ] Understood the role of Guard
- [ ] Created at least one Guard
- [ ] Understood the combined use of Permission and Guard

---

## 🎉 Congratulations!

You have completed Stage 2! Now you have mastered WoWok's trust management mechanisms and can move on to the next stage to learn about open collaboration!

**[→ Go to Stage 3: Open Collaboration 🤝 →](stage-03-collaboration.md)**

---

**[← Return to Main Directory](../README.md)**
