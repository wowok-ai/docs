# Stage 6: Personal Services 👤

---

**[← Stage 5: Business Components](stage-05-business.md) | [Stage 7: Data Query →](stage-07-query.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about personal services in WoWok, including:

- How to use LocalInfo to manage local private information
- How to use Demand to post bounty requests
- How to use Personal to manage your personal on-chain portal

---

## 📚 Learning Content

### 6.1 LocalInfo (Private Information Management 🔒)

**Why do we need LocalInfo?**

Individuals need to manage private information. LocalInfo allows you to securely store sensitive information locally.

**Core Concepts:**
- 🔒 **Local Storage Only** - Will not be uploaded to the chain
- 📝 **Multiple Entries** - Can store multiple pieces of information
- ⭐ **Default Setting** - Can set default items
- 🗑️ **Deletable** - Can be deleted at any time

**Core Features:**
- ✅ Add information
- ✅ Remove information
- ✅ Set default
- ✅ Reset all

**Important Notes:**
- ⚠️ Only stored on local device!
- ⚠️ Will not be uploaded to the chain!
- ⚠️ Suitable for storing addresses, phone numbers, contacts, and other sensitive information!

**→ [View LocalInfo Detailed Documentation →](localinfo.md)**

---

### 6.2 Demand (Seeking Assistance 🙋)

**Why do we need Demand?**

Sometimes you need help from others. Demand allows you to post requests and set rewards.

**Core Concepts:**
- 📋 **Request Description** - Describe what help you need
- 💰 **Reward Pool** - Rewards that can be claimed upon completion
- 👥 **Submitters** - People who can submit solutions
- ✅ **Claim Reward** - Rewards can be claimed after the request is resolved

**Core Features:**
- ✅ Create Demand
- ✅ Inject reward funds
- ✅ Add submitters
- ✅ Claim rewards

**→ [View Demand Detailed Documentation →](demand.md)**

---

### 6.3 Personal (Personal On-Chain Portal 👤)

**Why do we need Personal?**

You need a public personal homepage. Personal allows you to manage your public profile and on-chain identity.

**Core Concepts:**
- 📝 **Description** — Personal description/bio
- 📎 **Information** — Public records (social handles, URLs, etc.) stored on-chain
- 🏷️ **Mark** — On-chain identity marks (public name and tags for addresses)
- 🔗 **Referrer** — Referrer ID for joining the on-chain network
- 🌐 **Public** — All information is public on the chain

**Core Features:**
- ✅ Set personal description
- ✅ Add/remove/clear public information records (social handles, URLs)
- ✅ Add/remove/clear/transfer/replace/destroy on-chain identity marks
- ✅ Set referrer

**Important Notes:**
- ⚠️ All information is public on the chain!
- ⚠️ Please be cautious when posting personal information!
- ⚠️ NEVER post phone numbers, addresses, or private keys on Personal!
- ⚠️ For private marks, use the `local` tool instead of on-chain Mark

**→ [View Personal Detailed Documentation →](personal.md)**

---

### 6.4 Payment (Direct Transfer 💸)

**Why do we need Payment?**

Sometimes you need to transfer funds directly to someone. Payment allows you to make direct token transfers.

**Core Features:**
- ✅ Direct transfer
- ✅ Support multiple tokens
- ✅ Optional memo

**→ [View Payment Detailed Documentation →](payment.md)**

---

## 🎓 Practice Exercises

### Exercise 1: Add Local Information

Add a shipping address

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": "shipping_address",
        "default": "123 Main St, New York, NY 10001",
        "contents": ["10001"]
      }
    ]
  }
}
```

---

### Exercise 2: Update Personal Profile

Set your public description

```json
{
  "operation_type": "personal",
  "data": {
    "description": "This is my personal bio. I am a blockchain developer."
  }
}
```

Add public information records (safe: social handles, URLs)

```json
{
  "operation_type": "personal",
  "data": {
    "information": {
      "op": "add",
      "data": [
        { "name": "github", "value_type": "String", "value": "https://github.com/alice" },
        { "name": "twitter", "value_type": "String", "value": "@alice_dev" }
      ]
    }
  }
}
```

Add an on-chain identity mark for another address

```json
{
  "operation_type": "personal",
  "data": {
    "mark": {
      "op": "add",
      "data": [
        { "address": "friend_address", "name": "Alice Smith", "tags": ["colleague", "dev"] }
      ]
    }
  }
}
```

---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood LocalInfo's local storage characteristics
- [ ] Added at least one piece of local information
- [ ] Understood Demand's bounty request mechanism
- [ ] Created at least one Demand
- [ ] Understood Personal's public characteristics
- [ ] Updated personal description
- [ ] Added/removed personal information records
- [ ] Managed on-chain identity marks (add/remove/clear/transfer)
- [ ] Used Payment for transfers

---

## 🎉 Congratulations!

You have completed Stage 6! Now you have mastered WoWok's personal services and are ready to move on to the final stage to learn about data query!

**[→ Go to Stage 7: Data Query 🔍 →](stage-07-query.md)**

---

**[← Return to Main Directory](../README.md)**
