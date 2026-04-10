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

You need a public personal homepage. Personal allows you to manage your public profile.

**Core Concepts:**
- 🏷️ **Name** - Your public name
- 📝 **Bio** - Personal introduction
- 🖼️ **Avatar** - Personal avatar
- 🌐 **Public** - All information is public on the chain

**Core Features:**
- ✅ Create/Update profile
- ✅ Set name
- ✅ Set bio
- ✅ Set avatar

**Important Notes:**
- ⚠️ All information is public on the chain!
- ⚠️ Please be cautious when posting personal information!

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
  "operation": "add",
  "name": "shipping_address",
  "default": true,
  "contents": ["123 Main St, New York, NY 10001", "10001"]
}
```

---

### Exercise 2: Create Personal Profile

Set up your public profile

```json
{
  "operation_type": "personal",
  "data": {
    "object": {
      "new": true
    },
    "set_name": "Alice Smith",
    "set_bio": "This is my personal bio. I am a blockchain developer.",
    "set_avatar": "avatar_image_hash_here"
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
- [ ] Created/Updated personal profile
- [ ] Used Payment for transfers

---

## 🎉 Congratulations!

You have completed Stage 6! Now you have mastered WoWok's personal services and are ready to move on to the final stage to learn about data query!

**[→ Go to Stage 7: Data Query 🔍 →](stage-07-query.md)**

---

**[← Return to Main Directory](../README.md)**
