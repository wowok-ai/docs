# Stage 3: Open Collaboration 🤝

---

**[← Stage 2: Trust Management](stage-02-trust.md) | [Stage 4: Transaction Execution →](stage-04-transaction.md)**

---

## 🎯 Stage Objectives

In this stage, you will learn about open collaboration mechanisms in WoWok, including:

- How to use Machine and Progress to define and execute workflows
- How to use Messenger for secure private communication
- How to use Contact to manage public contact information

---

## 📚 Learning Content

### 3.1 Machine + Progress (Workflow Engine ⚙️)

**Why do we need Machine and Progress?**

Collaboration needs to be process-oriented. Machine is the workflow template (defining what to do), and Progress is the workflow instance (tracking execution progress).

**Core Concepts:**
- 📋 **Machine** - Workflow template, defines nodes and transition rules
- 🔄 **Progress** - Workflow instance, tracks execution status
- 🎯 **Nodes** - Steps in the workflow (states)
- 🔗 **Transitions** - Operation rules from one node to another

**Core Features:**

**Machine Features:**
- ✅ Create Machine (define nodes and transition rules)
- ✅ Add/Modify nodes (modifiable before publishing)
- ✅ Publish Machine (lock nodes, ready for use)
- ✅ Create Progress (launch workflow instance)
- ✅ Manage Repository (bind data storage)

**Progress Features:**
- ✅ Advance Progress (execute node transitions)
- ✅ Manage named operators (dynamic permission assignment)
- ✅ Set Task ID (associate objects)
- ✅ Manage context Repository

**→ [View Machine Detailed Documentation →](machine.md)**
**→ [View Progress Detailed Documentation →](progress.md)**

---

### 3.2 Messenger (Private Communication 🔒)

**Why do we need Messenger?**

Collaboration requires communication. Messenger provides end-to-end encrypted secure communication, supporting WTS verifiable chat records.

**Core Concepts:**
- 🔒 **End-to-End Encryption** - Only communication parties can see the content
- 📝 **WTS** - Witness Timestamped Signature, verifiable chat records (can be used as legal evidence)
- 📎 **File Transfer** - Securely send files
- ⏰ **On-Chain Proof** - Generate on-chain timestamp proof for messages

**Core Features:**
- ✅ View conversation list
- ✅ Send text messages (end-to-end encrypted)
- ✅ Send files
- ✅ View message history
- ✅ Generate WTS proof
- ✅ Verify WTS signature
- ✅ On-chain proof messages
- ✅ Manage blacklist/friends list/Guard list

**→ [View Messenger Detailed Documentation →](messenger.md)**

---

### 3.3 Contact (Service Window 📇)

**Why do we need Contact?**

Collaboration requires contact information. Contact manages public contact information and can be bound to Service.

**Core Features:**
- ✅ Create Contact (set name, description, location)
- ✅ Manage IM contact list (add/remove/clear)
- ✅ Set personal status
- ✅ Receive objects sent to Contact
- ✅ Bind to Service and other objects (as service contact)

**Important Notes:**
- ⚠️ It is recommended to only place public contact information

**→ [View Contact Detailed Documentation →](contact.md)**

---

## 🎓 Practice Exercises

### Exercise 1: Create a Simple Workflow Machine

**💬 You**: Create a Machine named "design_workflow" for design service process.

**🤖 AI Generated Request:**

```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "design_workflow"
    },
    "description": "Design service workflow - complete process from order creation to delivery"
  }
}
```

**✅ After successful execution, add nodes:**

**💬 You**: Add three nodes to "design_workflow": created (initial node), designing, completed (terminal node).

**🤖 AI Generated Request:**

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "created",
          "pairs": []
        },
        {
          "name": "designing",
          "pairs": [
            {
              "prev_node": "created",
              "threshold": 1,
              "forwards": [
                {
                  "name": "start_design",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "completed",
          "pairs": [
            {
              "prev_node": "designing",
              "threshold": 1,
              "forwards": [
                {
                  "name": "complete_design",
                  "permissionIndex": 1001,
                  "weight": 1
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

**✅ After successful execution, publish Machine:**

**💬 You**: Publish "design_workflow" Machine.

**🤖 AI Generated Request:**

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "publish": true
  }
}
```

---

### Exercise 2: Create and Advance Progress

**💬 You**: Create a Progress based on "design_workflow", named "my_first_progress".

**🤖 AI Generated Request:**

```json
{
  "operation_type": "machine",
  "data": {
    "object": "design_workflow",
    "progress_new": {
      "namedNew": {
        "name": "my_first_progress"
      }
    }
  }
}
```

**✅ After successful execution, advance Progress:**

**💬 You**: Advance "my_first_progress" from created node to designing node by executing "start_design" operation.

**🤖 AI Generated Request:**

```json
{
  "operation_type": "progress",
  "data": {
    "object": "my_first_progress",
    "operate": {
      "operation": {
        "next_node_name": "designing",
        "forward": "start_design"
      },
      "hold": false,
      "message": "Start design work"
    }
  }
}
```

---

### Exercise 3: Send Encrypted Message

**💬 You**: Send an encrypted message "Hello, I would like to inquire about design services" to "alice".

**🤖 AI Generated Request:**

```json
{
  "operation": "send_message",
  "to": {
    "name_or_address": "alice"
  },
  "content": "Hello, I would like to inquire about design services"
}
```

---

### Exercise 4: View Conversation List

**💬 You**: View all my conversation lists.

**🤖 AI Generated Request:**

```json
{
  "operation": "watch_conversations"
}
```

---

### Exercise 5: Create Contact

**💬 You**: Create a Contact named "design_service_contact" with description "Design service contact information".

**🤖 AI Generated Request:**

```json
{
  "operation_type": "contact",
  "data": {
    "object": {
      "name": "design_service_contact"
    },
    "description": "Design service contact - 24/7 online support",
    "location": "Online service",
    "ims": {
      "op": "clear"
    }
  }
}
```

---

### Exercise 6: Manage Messenger Blacklist

**💬 You**: Add address "0x1234...abcd" to my blacklist.

**🤖 AI Generated Request:**

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "add",
    "users": ["0x1234abcd5678efgh9012ijkl3456mnop7890qrst"]
  }
}
```

---

## 🏆 Stage Checklist

Before moving to the next stage, please confirm that you have:

- [ ] Understood the difference between Machine and Progress
- [ ] Created at least one Machine
- [ ] Added nodes and transition rules to Machine
- [ ] Published Machine
- [ ] Created at least one Progress
- [ ] Advanced Progress nodes
- [ ] Sent encrypted messages
- [ ] Viewed conversation list
- [ ] Created Contact
- [ ] Managed IM contacts

---

## 🎉 Congratulations!

You have completed Stage 3! Now you have mastered WoWok's open collaboration mechanisms and can move on to the next stage to learn about transaction execution!

**[→ Go to Stage 4: Transaction Execution 💼 →](stage-04-transaction.md)**

---

**[← Return to Main Directory](../README.md)**
