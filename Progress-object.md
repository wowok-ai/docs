# Progress Object: Your Workflow Instance Executor

> "Create running instances of your Machine templates to track real project execution step-by-step."

## Overview

### Definition

Execution instance of a `Machine`, representing the real-time state, operator actions, and node transitions of a workflow.

### Functionality

Tracks the workflow state and operator actions at each node. Supports session-based progression, audit logging, deliverable submission, task binding, and interaction with collaborative consensus repositories. Enables parent-child progress hierarchies for composable workflows.

### Use Case

Tracking the individual execution flow of a service order within a multi-step supply chain agreement.

### Key Features

- **Stateful Node Execution & Audit Trail**
  Records each node transition and operator action through sessions and history, ensuring traceability and transparency in execution.

- **Dynamic Role Assignment**
  Allows runtime assignment and update of named operators per transition path, aligned with machine-level permission governance.

- **Composable Hierarchies & Deliverables Binding**
  Supports parent-child relationships between progresses and attaches deliverables or sub-progresses to specific transitions.

- **Integrated Collaborative Context**
  Connects with external `context_repositories` for data sharing, validation, and coordination during multi-party execution.

## What You'll Build (30 seconds)

By the end, you will understand workflow instance management:

- **Basic Progress** — understand how Progress is created from Orders and track project status
- **Advanced Progress** — advance workflow steps, submit information, and manage multiple project instances

**Prereqs**: You already created Machine objects. Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**💡 Pro Tip**: Progress objects are automatically created when customers purchase services that use Machine workflows. Think of Machine as the workflow blueprint and Progress as tracking the actual project execution. Each Order gets its own Progress instance to track work completion. If you get stuck, ask your AI assistant: "Help me understand how Progress tracks my project status" or "How do I advance Progress steps and submit deliverables?"

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and SUI balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (understand progress tracking)

**Scenario**: You have a Service with Machine workflow and want to understand how Progress tracks actual project execution when customers place orders.

**Your Mission**: Purchase a service to see how Progress is automatically created and learn to track project status.

**Try This A** (create progress through order):

```
"Purchase a service from my existing Service that uses Machine workflow on sui testnet. Buy a consulting service for 0.2 SUI and show how the system automatically creates a Progress instance to track the project execution. Return: Order address + on-chain link, Progress address + on-chain link."
```

**Try This B** (check progress status):

```
"Query my Progress instance to see current project status: which workflow step we're on, what's been completed, what's the next action needed, and who can perform it. Click the Progress on-chain link to view it directly."
```

**Success Looks Like**:

- ✅ You see Order address + on-chain link and Progress address + on-chain link
- ✅ Progress shows current workflow step and next actions
- ✅ You can click the links to view objects directly on-chain
- ✅ **Progress tracking working**: You understand how Progress tracks real project execution

**Why This Matters**: Progress tracking provides:

- **Automatic creation**: Progress is created when customers place orders
- **Real-time status**: Always know exactly where each project stands
- **Workflow structure**: Projects follow the Machine template steps
- **Clear accountability**: Track what's done and what's next

---

## 🎯 Level 2 — Advanced (advance steps and manage projects)

**Scenario**: You want to advance your project through workflow steps, submit deliverables, and understand how different people can work on different steps.

**Your Mission**: Advance Progress through workflow steps and test permission controls.

**Try This A** (advance workflow steps):

```
"Advance my Progress instance through the workflow steps. Complete the first step by submitting a deliverable message like 'Initial consultation completed, client requirements documented', then move to the next step. Show how Progress tracks each completion and updates current status."
```

**Try This B** (test permission controls):

```
"Try to advance the Progress using a different account (not the designated operator). Show how the system prevents unauthorized users from advancing workflow steps, demonstrating the permission control system."
```

**Try This C** (manage multiple projects):

```
"Create another Order from the same Service to generate a second Progress instance. Compare the two Progress instances: show how they're both based on the same Machine template but track different project executions independently."
```

**Success Looks Like**:

- ✅ Progress advances through workflow steps with submitted deliverables
- ✅ Permission controls prevent unauthorized step advancement
- ✅ Multiple Progress instances track different projects independently
- ✅ **Project management working**: You can manage multiple projects using the same workflow template

**Why This Matters**: Advanced Progress management enables:

- **Step-by-step execution**: Complete projects following proven workflow patterns
- **Permission control**: Only authorized people can advance specific steps
- **Multi-project tracking**: Manage multiple projects using the same template
- **Deliverable documentation**: Record what was completed at each step

---

## 💡 Mini Challenge — Project Portfolio Dashboard

**Goal**: Create multiple projects and track their different progress states like a real project manager.

**Try This**:

```
"Create a project portfolio on sui testnet. Purchase 3 different orders from your Service to generate 3 Progress instances for different 'clients': 'ABC Corp Strategy', 'XYZ Inc Analysis', and 'DEF Ltd Planning'. Advance each Progress to different stages: leave one at the initial step, advance another to the middle step, and complete the third one. Show how you can query each Progress to see where different projects stand and what actions are needed next."
```

**Success Looks Like**:

- ✅ Three Progress instances at different completion stages
- ✅ Each Progress shows different current steps and next actions
- ✅ You can easily see which projects need attention and which are completed
- ✅ **Portfolio management working**: You're managing multiple projects like a real project manager

**Creative Ideas**: Consulting projects, design work, development tasks, event planning.

**Share Your Creation**: Post about your project portfolio and how you're tracking multiple client projects!

---

## 🔧 Troubleshooting (friendly and fast)

**Progress stuck** → Check that required steps have been completed and approvals obtained.

**Can't advance** → Verify that the current user has permission to perform the next action.

**Missing history** → Ensure workflow steps are being completed with proper documentation.

**Service coordination fails** → Check that required services are completed and verified.

**Team coordination issues** → Verify that team members have appropriate permissions for their roles.

**Reset, without losing learning**:

- Note the Progress address and any valuable workflow data
- Create a new Progress instance from the same Machine
- Test basic workflow advancement before adding complexity
- Use lessons learned to improve your Machine design

**Common Use Cases**:

- **Project management**: Track deliverables across team members
- **Service delivery**: Monitor customer requests from intake to completion
- **Manufacturing**: Track orders through production and shipping
- **Event planning**: Coordinate vendors and timeline management

**Need help?**: The community has great examples of Progress patterns for different workflow types!

---

## ✅ Ready for More?

**You've Unlocked**:

- 📊 **Progress Tracking**: You understand how Progress automatically tracks project execution
- � **\*Step Advancement**: You can advance workflow steps and submit deliverables
- 🔒 **Permission Control**: You understand how only authorized users can advance steps
- 📈 **Multi-Project Management**: You can manage multiple projects with different progress states

**Next Up**: **Arbitration Objects** — learn how to handle disputes when projects go wrong!

**Quick Check**: Can you understand how Progress is created from Orders? Can you advance Progress steps and check project status? Can you manage multiple projects at different stages? If yes, you're ready to learn about dispute resolution!
