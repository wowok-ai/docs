# Stage 3.5: Deep Dive into Messenger 💬

---

**[← Stage 3: Open Collaboration](stage-03-collaboration.md) | [Stage 4: Transaction Execution →](stage-04-transaction.md)**

---

## 🎯 Stage Objectives

In this stage, you will gain a deep understanding of WoWok Messenger, including:

- The triple-trust security model and core architectural principles
- Message delivery mechanisms (normal messages, stranger messages, guard messages)
- Anti-spam protection systems (blacklist, friends list, guard list)
- WTS (Witness Timestamped Sequence) evidence generation and verification
- Practical usage patterns for secure business communication

---

## 📚 Learning Content

### 3.5.1 Messenger Architecture & Trust Model 🔐

**Why is Messenger Secure?**

Messenger operates on a **triple-trust model** that ensures identity authenticity, message confidentiality, and sequence integrity:

| Trust Layer | Mechanism | What It Guarantees |
|-------------|-----------|--------------------|
| **Identity Trust** | Falcon512 signatures (post-quantum safe) | The sender is who they claim to be; each request is cryptographically signed |
| **Encryption Trust** | Signal Protocol double-ratchet (X25519 + ML-KEM-768) | Only the intended recipient can decrypt; forward secrecy protects past messages |
| **Sequence Trust** | Merkle Tree + server Falcon512 signature | Messages form a deterministic, tamper-proof sequence; no insertion or reordering possible |

**Key Design Principles:**

- **Off-Chain Privacy**: Messages are NOT stored on-chain for privacy and cost efficiency
- **Server Opacity**: The server cannot read message content; only endpoints hold decryption keys
- **Verifiable Order**: The server's Falcon512 signature on the Merkle tree proves message sequence
- **Optional Anchoring**: Message Merkle roots can be anchored to blockchain via on-chain proof

---

### 3.5.2 Message Lifecycle 📨

Understanding how messages flow through the system:

```
                    ┌──────────┐
                    │  Created  │  Client encrypts plaintext, signs request
                    └────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
         Normal Message        Guard Message
              │                     │
              ▼                     ▼
        ┌──────────┐          ┌──────────┐
        │ Confirmed │          │ Pending  │  Awaiting guard passport verification
        └────┬─────┘          └────┬─────┘
             │                     │
             │              ┌──────┴──────┐
             │              │             │
             │              ▼             ▼
             │        ┌──────────┐  ┌──────────┐
             │        │ Confirmed │  │ Rejected  │
             │        └────┬─────┘  └──────────┘
             │             │
             ▼             ▼
        ┌──────────┐
        │   Read    │  Recipient decrypts successfully
        └────┬─────┘
             │
             ▼
        ┌──────────┐
        │ ARK'd     │  Recipient signs cryptographic receipt (optional)
        └──────────┘
```

**Status Definitions:**

| Status | Meaning | Evidence Value |
|--------|---------|----------------|
| `pending` | Guard message awaiting verification | None — not yet confirmed |
| `confirmed` | Server signed into Merkle tree | Medium — server attests to existence |
| `decrypted` | Recipient successfully decrypted | High — proves recipient has session key |
| `rejected` | Guard passport validation failed | N/A — message blocked |
| `failed` | Delivery or processing error | N/A — not delivered |

---

### 3.5.3 Message Delivery Mechanisms 📬

#### Normal Message Flow

When sending without guard parameters:

1. **Client Encryption**: Signal Protocol encrypts plaintext → ciphertext + plaintext hash + `lastReceivedLeafIndex`
2. **Signed Request**: Falcon512 signature proves sender identity
3. **Spam Check**: Server evaluates against recipient's spam rules
4. **Merkle Insertion**: Server computes leaf hash, updates Merkle tree, signs new state
5. **Inbox Delivery**: Message ID pushed to recipient's Redis inbox
6. **Recipient Polling**: SDK polls, decrypts, updates session

#### Stranger Message Mechanism

A **stranger** is any address not in the recipient's friends list:

- **One-Message Limit**: Strangers can send exactly **one** message (Redis key with TTL, default 10 days)
- **Cool-Down Period**: Cannot send another until TTL expires or recipient replies
- **Auto Friend-Adding**: When recipient replies, stranger is automatically added to friends list
- **Opt-Out**: Recipients can set `allowStrangerMessages: false` to block all strangers

**Business Rationale**: Prevents spam while allowing legitimate first contact. The one-message limit forces quality opening messages.

#### Guard Message Flow (Spam-Bypass Path)

When recipient blocks strangers, use guard verification:

1. Provide `guardAddress` + `passportAddress` with message
2. Server validates addresses and checks pending queue limits
3. Message stored as `pending` with TTL
4. Background worker verifies passport against guard rules
5. **Confirmed**: Signed into Merkle tree, delivered
6. **Rejected**: Status updated, sender notified

**When to Use**: When rejected due to stranger settings, obtain a passport from recipient's guard list and retry.

---

### 3.5.4 Anti-Spam Protection System 🛡️

#### Three-Tier Protection Model

```
Incoming Message
       │
       ▼
┌─ Blacklist Check ─────────────────────────────────────────────┐
│  Is sender in recipient's blacklist?                          │
│  YES → Reject immediately                                     │
│  NO  → Continue                                               │
└───────────────────────────────────────────────────────────────┘
       │
       ▼
┌─ Friends List Check ──────────────────────────────────────────┐
│  Is sender in recipient's friends list?                       │
│  YES → Accept immediately (bypass all checks)                 │
│  NO  → Continue                                               │
└───────────────────────────────────────────────────────────────┘
       │
       ▼
┌─ Guard Message Check ─────────────────────────────────────────┐
│  Did sender provide guardAddress + passportAddress?           │
│  YES → Route to guard verification queue                      │
│  NO  → Continue                                               │
└───────────────────────────────────────────────────────────────┘
       │
       ▼
┌─ Stranger Message Check ──────────────────────────────────────┐
│  Is allowStrangerMessages enabled?                            │
│  NO  → Reject with guard_list (enables guard retry)           │
│  YES → Has sender already sent a stranger message?            │
│        YES → Reject ("one stranger message only")             │
│        NO  → Accept, set stranger key with TTL                │
└───────────────────────────────────────────────────────────────┘
```

#### List Management

| List | Purpose | Operations |
|------|---------|------------|
| **Blacklist** | Block addresses completely | `add`, `remove`, `clear`, `get`, `exist` |
| **Friends List** | Trusted contacts bypass checks | `add`, `remove`, `clear`, `get`, `exist` |
| **Guard List** | Guards that can verify strangers | `add`, `remove`, `get` |

**Guard List Configuration:**
- `guard`: On-chain Guard object ID or name (defines validation rules)
- `passportValiditySeconds`: How long passports remain valid (typically 60s to 7 days)

#### Settings Control

- **`allowStrangerMessages`**: Toggle stranger message acceptance
- **`maxInboxSize`**: Maximum server-staged messages (FIFO eviction)

---

### 3.5.5 WTS (Witness Timestamped Sequence) 📜

#### What is WTS?

A **tamper-proof, self-verifying export** of a conversation containing:

- All messages with Merkle proofs
- Merkle chain continuity verification
- Server signatures on every root
- Content hash for integrity detection
- Optional participant signatures

#### The Reciprocity Principle

> **Only messages that the other party has replied to have evidentiary value.**

- One-sided claims prove nothing
- A reply's `lastReceivedLeafIndex` references the message being responded to
- WTS shows full context: who said what, who acknowledged what
- Arbitration requires **confirmed**, reciprocated evidence

#### Deterministic Message Sequence

- **leaf_index**: Strictly sequential (0, 1, 2, ...) per conversation
- **Merkle Chain**: Each message linked to previous via cryptographic hash
- **No Gaps Possible**: Missing indices are detected as discontinuity
- **No Tampering**: Any change breaks the chain and final hash

#### WTS Workflow

1. **Generate WTS**: Export conversation range (by time, message ID, or sequence index)
2. **Verify WTS**: Check integrity, signatures, and chain continuity
3. **Sign WTS**: Add cryptographic endorsement
4. **Convert to HTML**: Human-readable view with acknowledgment tracking
5. **On-Chain Proof**: Anchor message Merkle root to blockchain

Anyone can use a WTS file to verify the authenticity, continuity, and integrity of the conversation content.
---

### 3.5.6 Session and Message Sequence 🔗

Every conversation has a deterministic session ID: `sorted(addrA, addrB)`

- **Merkle Tree State**: Per-session `(leaf_index, prev_root, new_root)`
- **leaf_index**: Monotonically increasing from 0
- **lastReceivedLeafIndex**: Tracks what the sender has received from recipient
- **Concurrent Handling**: Per-session mutex ensures serialized updates
- **Verification**: Anyone can verify completeness by checking `prev_root` chain

---

## 🎓 Practice Exercises

### Exercise 1: Send a Simple Encrypted Message

**💬 You**: Send message "Hello, I'd like to discuss a project" to "bob".

**🤖 AI Generated Request:**

```json
{
  "operation": "send_message",
  "to": "bob",
  "content": "Hello, I'd like to discuss a project"
}
```

**Note**: The `to` field can also be an object with `name_or_address` and optional `local_mark_first` flag.

---

### Exercise 2: View Conversation List

**💬 You**: View all my conversations with unread messages only.

**🤖 AI Generated Request:**

```json
{
  "operation": "watch_conversations",
  "filter": {
    "unreadOnly": true
  }
}
```

**Note**: The `filter` is optional. Without it, all conversations are returned with default settings (previewMessageCount: 2, sorted by lastMessageAt desc).

---

### Exercise 3: Manage Blacklist

**💬 You**: Add "spammer_address" to my blacklist.

**🤖 AI Generated Request:**

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "add",
    "users": ["spammer_address"]
  }
}
```

**Note**: Blacklist operations: `add`, `remove`, `clear`, `get`, `exist`. The `users` field accepts either an array of strings (names/addresses) or a full object with `names_or_addresses` and optional flags.

---

### Exercise 4: Manage Friends List

**💬 You**: Add "alice" to my friends list.

**🤖 AI Generated Request:**

```json
{
  "operation": "friendslist",
  "friendslist": {
    "op": "add",
    "users": ["alice"]
  }
}
```

**Note**: Friends list operations: `add`, `remove`, `clear`, `get`, `exist`. The `users` field accepts either an array of strings (names/addresses) or a full object with `names_or_addresses` and optional flags.

---

### Exercise 5: Configure Guard List

**💬 You**: Add guard "identity_verifier" with 1-hour passport validity to my guard list.

**🤖 AI Generated Request:**

```json
{
  "operation": "guardlist",
  "guardlist": {
    "op": "add",
    "guards": [
      {
        "guard": "identity_verifier",
        "passportValiditySeconds": 3600
      }
    ]
  }
}
```

**Note**: The `guards` array for `add` operation requires objects with `guard` (address/name) and `passportValiditySeconds` (10s to 10 years). For `remove` operation, `guards` is an array of strings (addresses/names). Available operations: `add`, `remove`, `get`.

---

### Exercise 6: Generate WTS Evidence

**💬 You**: Generate WTS for conversation with "bob" from the last 7 days.

**🤖 AI Generated Request:**

```json
{
  "operation": "generate_wts",
  "params": {
    "myAccount": "my_account",
    "peerAccount": "bob",
    "range": {
      "type": "time",
      "start": 1704067200000,
      "end": 1704672000000
    },
    "outputDir": "./evidence"
  }
}
```

**Note**: The `range` is optional — without it, all messages are included. Range types: `time` (timestamps), `messageId` (message ID strings), `seqIndex` (leaf indices). Set `excludePlaintext: true` to omit message content from the WTS file.

---

### Exercise 7: Verify WTS Integrity

**💬 You**: Verify the WTS file "conversation_bob_20240101.wts".

**🤖 AI Generated Request:**

```json
{
  "operation": "verify_wts",
  "wtsFilePath": "./evidence/conversation_bob_20240101.wts"
}
```

**Note**: Verification checks: (1) content hash integrity, (2) Merkle chain continuity, (3) server signatures, (4) participant signatures (if present). Returns `valid`, `hashValid`, `signatureValid`, and detailed signature verification results.

---

### Exercise 8: Send File with Guard Verification

**💬 You**: Send file "contract.pdf" to "stranger_address" using guard "business_guard" and passport "my_passport".

**🤖 AI Generated Request:**

```json
{
  "operation": "send_file",
  "to": "stranger_address",
  "filePath": "./contract.pdf",
  "options": {
    "guardAddress": "business_guard",
    "passportAddress": "my_passport"
  }
}
```

**Note**: File is automatically compressed as ZIP before sending. Options include: `fileName` (custom name), `contentType` ("wts"/"wip"/"zip" hint), `guardAddress`, `passportAddress`, `force` (bypass pending checks), `new_messenger_name` (for recipient).

---

### Exercise 9: Configure Messenger Settings

**💬 You**: Disable stranger messages and set max inbox size to 500.

**🤖 AI Generated Request:**

```json
{
  "operation": "settings",
  "settings": {
    "op": "set",
    "allowStrangerMessages": false,
    "maxInboxSize": 500
  }
}
```

**Note**: Settings operations: `get` (no additional fields) returns current settings including server limits; `set` allows modifying `allowStrangerMessages` and/or `maxInboxSize` (within server-defined bounds).

---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood the triple-trust security model
- [ ] Understood message lifecycle and status meanings
- [ ] Sent encrypted messages to friends
- [ ] Understood stranger message limitations
- [ ] Managed blacklist, friends list, and guard list
- [ ] Generated WTS evidence files
- [ ] Verified WTS integrity
- [ ] Understood the reciprocity principle for evidence
- [ ] Configured messenger settings

---

## 🎉 Congratulations!

You have completed Stage 3.5! Now you have a deep understanding of WoWok Messenger's architecture, security model, and evidence mechanisms. You can securely communicate and generate tamper-proof chat records for business and arbitration purposes.

> 📚 **For detailed API documentation and more examples, see [Messenger Component Documentation →](messenger.md)**

**[→ Go to Stage 4: Transaction Execution 💼 →](stage-04-transaction.md)**

---

**[← Return to Main Directory](../README.md)**
