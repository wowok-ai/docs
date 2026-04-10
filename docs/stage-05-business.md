# Stage 5: Business Components 🏪

---

**[← Stage 4: Transaction Execution](stage-04-transaction.md) | [Stage 6: Personal Services →](stage-06-personal.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about business components in WoWok, including:

- How to use Repository to manage on-chain data
- How to use Treasury to manage team funds
- How to use Reward for marketing incentives

---

## 📚 Learning Content

### 5.1 Repository (Data Management 🗄️)

**Why do we need Repository?**

Business requires data storage. Repository provides structured consensus data storage.

**Core Concepts:**
- 📦 **Object Container** - Store and manage objects
- 🔑 **Key-Value Pairs** - Access data by name
- 🔐 **Access Control** - Can set read/write permissions

**Core Features:**
- ✅ Create Repository
- ✅ Add/Remove data items
- ✅ Manage read/write permissions
- ✅ Link Guard verification

**→ [View Repository Detailed Documentation →](repository.md)**

---

### 5.2 Treasury (Financial Management 💰)

**Why do we need Treasury?**

Teams need fund management. Treasury allows you to create and manage team fund pools.

**Core Concepts:**
- 🏦 **Fund Pool** - Team's shared funds
- 👥 **Managers** - People who can manage funds
- 💵 **Deposit/Withdraw** - Deposit or withdraw from the fund pool
- 📝 **Transaction Records** - All operations are recorded

**Core Features:**
- ✅ Create Treasury
- ✅ Deposit funds
- ✅ Withdraw funds
- ✅ Add/Remove managers

**→ [View Treasury Detailed Documentation →](treasury.md)**

---

### 5.3 Reward (Marketing Incentives 🎁)

**Why do we need Reward?**

Business needs incentives. Reward allows you to create reward pools and incentive mechanisms.

**Core Concepts:**
- 🎁 **Reward Pool** - Fund pool for rewards
- 🎯 **Reward Items** - Specific reward definitions
- 🛡️ **Guard Verification** - Can bind Guard to verify claim conditions
- 📋 **Claim Records** - Record who claimed what rewards

**Core Features:**
- ✅ Create Reward
- ✅ Inject funds
- ✅ Set reward items
- ✅ Bind Guard verification
- ✅ Claim rewards

**→ [View Reward Detailed Documentation →](reward.md)**

---

## 🎓 Practice Exercises

### Exercise 1: Create a Repository

Create a data repository and add some data

```json
{
  "operation_type": "repository",
  "data": {
    "object": {
      "new": true
    },
    "namedNew": {
      "name": "my_data_repo"
    },
    "data_add": [
      {
        "name": "config",
        "value": "my_config_value"
      }
    ]
  }
}
```

---

### Exercise 2: Create a Treasury

Create a team fund pool

```json
{
  "operation_type": "treasury",
  "data": {
    "object": {
      "new": true
    },
    "namedNew": {
      "name": "team_treasury"
    },
    "manager_add": ["manager1_address", "manager2_address"]
  }
}
```

---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood Repository's data storage mechanism
- [ ] Created at least one Repository
- [ ] Added data to Repository
- [ ] Understood Treasury's fund management
- [ ] Created at least one Treasury
- [ ] Understood Reward's incentive mechanism
- [ ] Created at least one Reward

---

## 🎉 Congratulations!

You have completed Stage 5! Now you have mastered WoWok's business components and are ready to move on to the next stage to learn about personal services!

**[→ Go to Stage 6: Personal Services 👤 →](stage-06-personal.md)**

---

**[← Return to Main Directory](../README.md)**
