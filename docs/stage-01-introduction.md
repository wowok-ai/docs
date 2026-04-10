# Stage 1: Getting Started ⭐

---

**[← Return to Main Directory](../README.md) | [Stage 2: Trust Management →](stage-02-trust.md)**

---

## 📚 Learning Content

### 1.1 Account 🔐

**Why do we need Account?**

In WoWok, all on-chain operations need to be signed and initiated through Account. Account is the foundation of your digital identity.

> **📢 Important Notice:** WoWok will never expose your private key to AI under any circumstances. You can use WoWok as a regular hot wallet. We recommend keeping significant assets in your cold wallet.

**Core Features:**
- ✅ Generate new wallet accounts
- ✅ Get test coins (for test network)
- ✅ Suspend and resume accounts
- ✅ Transfer between accounts
- ✅ Query account information
- ✅ Sign data


**→ [View Account Detailed Documentation →](account.md)**

---

### 1.2 LocalMark (Local Address Book 📇)

**Why do we need LocalMark?**

Blockchain addresses are usually long strings of characters that are hard to remember. LocalMark allows you to give these addresses memorable names and tags.

**Core Features:**
- ✅ Add address marks (name + tags)
- ✅ Filter addresses by tags, names, and recent usage
- ✅ Remove address marks
- ✅ Clear all marks

**Important Notes:**
- ⚠️ Only stored on local device!
- ⚠️ Will not be uploaded to the chain!
- ⚠️ Can be modified and deleted at will!

**→ [View LocalMark Detailed Documentation →](localmark.md)**

---

## 🎓 Practice Exercises

### Exercise 1: Create Your First Account

**💬 You**: Generate a new account named "my_first_account".

---

**🤖 AI Generated Request JSON:**

```json
{
  "gen": {
    "name": "my_first_account"
  }
}
```

**✅ Execution Successful:**

```
Account successfully generated!
```

**📤 Return Result:**

```json
{
  "gen": {
    "address": "...",
    "name": "my_first_account"
  }
}
```

---

### Exercise 2: Get Test Coins

**💬 You**: Please claim faucet test tokens for my_first_account from testnet.

---

**🤖 AI Generated Request JSON:**

```json
{
  "faucet": {
    "name_or_address": "my_first_account",
    "network": "testnet"
  }
}
```

**✅ Execution Successful:**

```
Successfully claimed test tokens from testnet!
```

**📤 Return Result:**

```json
{
  "faucet": {
    "name_or_address": "my_first_account",
    "result": [...]
  }
}
```
---

### Exercise 3: Add Address Mark

**💬 You**: Add a mark to my_first_account named "Chat Account" with tag "Chat".

---

**🤖 AI Generated Request JSON:**

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "Chat Account" },
        "address": "...",
        "tags": ["Chat"]
      }
    ]
  }
}
```

**✅ Execution Successful:**

```
Successfully added mark for my_first_account!
```

**📤 Return Result:**

```json
{
  "add": [
    {
      "name": "Chat Account",
      "address": "...",
      "tags": ["Chat"],
      "createdAt": ...,
      "updatedAt": ...
    }
  ]
}
```

---

### Exercise 4: Add a Friend Address

**💬 You**: Name the address "0x731f779a62d5f7a883e1111586fe260cb9fa558911e4223d073ff8c49347d4aa" as "Alice" with tag: "My Friend".

---

**🤖 AI Generated Request JSON:**

```json
{
  "add": {
    "op": "add",
    "data": [
      {
        "name": { "value": "Alice" },
        "address": "0x731f779a62d5f7a883e1111586fe260cb9fa558911e4223d073ff8c49347d4aa",
        "tags": ["My Friend"]
      }
    ]
  }
}
```

**✅ Execution Successful:**

```
Done! Successfully added mark for this address.
```

**📤 Return Result:**

```json
{
  "add": [
    {
      "name": "Alice",
      "address": "0x731f779a62d5f7a883e1111586fe260cb9fa558911e4223d073ff8c49347d4aa",
      "tags": ["My Friend"],
      "createdAt": ...,
      "updatedAt": ...
    }
  ]
}
```

---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood WoWok's core concepts
- [ ] Learned about WoWok's system architecture
- [ ] Understood the six pillars of the trust network
- [ ] Configured AI client
- [ ] Verified successful installation
- [ ] Successfully created at least one account
- [ ] Obtained test coins on test network
- [ ] Added several address marks
- [ ] Understood the difference between local operations and on-chain operations

---

## 🎉 Congratulations!

You have completed Stage 1! Now you have mastered WoWok's basic operations and can move on to the next stage to learn about trust management!

**[→ Go to Stage 2: Trust Management 🔐 →](stage-02-trust.md)**

---

**[← Return to Main Directory](../README.md)**
