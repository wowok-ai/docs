# Getting Started

Wowok is an AI-Driven Web3 collaboration protocol that enables programmable agreements through composable smart contract objects and natural language interaction.

Wowok provides a unified framework for transforming collaborative ideas and resources into self-executing contracts that handle workflows, payments, and dispute resolution. Using WoWok, you can deploy complex systems, establish transparent collaborations, and create customized solutions that adapt to specific requirements in just minutes.

Configure Wowok through MCP-supported AI assistants using the setup guide below.

## Quick setup

### Kiro Configuration

<details>
<summary>Click to expand</summary>

1. Click the gear icon in the bottom left corner to open Settings or use the shortcut "Ctrl+,"
   <img width="536" height="411" alt="kiro1" src="https://github.com/user-attachments/assets/1e9e4f58-cc14-4e59-ac4a-88944c0b999f" />

2. Search for "MCP" in the search bar
   <img width="1280" height="604" alt="image" src="https://github.com/user-attachments/assets/b836e77e-b384-44d5-8e26-a75abe050d1a" />

3. Open either of the two JSON files (User MCP Config recommended)
   <img width="1280" height="312" alt="image" src="https://github.com/user-attachments/assets/44f49d53-73ef-413c-939e-af71368eb5c5" />

4. Copy and paste the following content, it includes all tools preseted in Wowok:

```json
{
  "mcpServers": {
    "wowok_arbitration": {
      "command": "npx",
      "args": ["-y", "wowok_arbitration_mcp_server"]
    },
    "wowok_demand": {
      "command": "npx",
      "args": ["-y", "wowok_demand_mcp_server"]
    },
    "wowok_guard": {
      "command": "npx",
      "args": ["-y", "wowok_guard_mcp_server"]
    },
    "wowok_machine": {
      "command": "npx",
      "args": ["-y", "wowok_machine_mcp_server"]
    },
    "wowok_permission": {
      "command": "npx",
      "args": ["-y", "wowok_permission_mcp_server"]
    },
    "wowok_personal": {
      "command": "npx",
      "args": ["-y", "wowok_personal_mcp_server"]
    },
    "wowok_query": {
      "command": "npx",
      "args": ["-y", "wowok_query_mcp_server"]
    },
    "wowok_repository": {
      "command": "npx",
      "args": ["-y", "wowok_repository_mcp_server"]
    },
    "wowok_service": {
      "command": "npx",
      "args": ["-y", "wowok_service_mcp_server"]
    },
    "wowok_treasury": {
      "command": "npx",
      "args": ["-y", "wowok_treasury_mcp_server"]
    }
  }
}
```

5. Use the shortcut Ctrl+L to enter the chat interface and start using
   <img width="1280" height="963" alt="image" src="https://github.com/user-attachments/assets/8002e40f-859a-4a63-afdb-bda5107fe334" />

</details>

### Cursor Configuration

<details>
<summary>Click to expand</summary>

1. Click the gear icon in the top right corner to open Settings
   <img width="645" height="288" alt="image" src="https://github.com/user-attachments/assets/201dfe14-548f-4186-a448-cdf7e8b5bc64" />

2. Find the Tools & Integrations section in the left sidebar, click New MCP Server
   <img width="1280" height="850" alt="image" src="https://github.com/user-attachments/assets/f9f3c458-f8be-49da-bab7-3475e535311d" />

3. Copy and paste the following content into the expanded JSON file:

```json
{
  "mcpServers": {
    "wowok_arbitration": {
      "command": "npx",
      "args": ["-y", "wowok_arbitration_mcp_server"]
    },
    "wowok_demand": {
      "command": "npx",
      "args": ["-y", "wowok_demand_mcp_server"]
    },
    "wowok_guard": {
      "command": "npx",
      "args": ["-y", "wowok_guard_mcp_server"]
    },
    "wowok_machine": {
      "command": "npx",
      "args": ["-y", "wowok_machine_mcp_server"]
    },
    "wowok_permission": {
      "command": "npx",
      "args": ["-y", "wowok_permission_mcp_server"]
    },
    "wowok_personal": {
      "command": "npx",
      "args": ["-y", "wowok_personal_mcp_server"]
    },
    "wowok_query": {
      "command": "npx",
      "args": ["-y", "wowok_query_mcp_server"]
    },
    "wowok_repository": {
      "command": "npx",
      "args": ["-y", "wowok_repository_mcp_server"]
    },
    "wowok_service": {
      "command": "npx",
      "args": ["-y", "wowok_service_mcp_server"]
    },
    "wowok_treasury": {
      "command": "npx",
      "args": ["-y", "wowok_treasury_mcp_server"]
    }
  }
}
```

4. Turn on the wowok mcp servers to use by clicking the button.(Recommand to turn them on all at once)
   <img width="1259" height="594" alt="image" src="https://github.com/user-attachments/assets/923dfbeb-59b7-4ddc-ae6a-0444dbdc7f57" />

5. Use the shortcut Ctrl+L to enter the chat interface and start using
   <img width="1280" height="858" alt="image" src="https://github.com/user-attachments/assets/3d5227eb-7ff2-476f-9562-7445c4f80e9b" />

</details>

### Trae Configuration

<details>
<summary>Click to expand</summary>

1. Click the gear icon in the top right corner to open "Settings" (if there is no chat interface, you can press Ctrl+U to open it)
   <img width="902" height="211" alt="image" src="https://github.com/user-attachments/assets/c11a1918-e6be-47f2-a39c-de7588e96650" />

2. At the top of the chat box, find the "MCP" section, click "Add", then select "Manual Add"
   <img width="808" height="308" alt="image" src="https://github.com/user-attachments/assets/ea439a7a-6ac7-4fa8-9f46-afa7f3606cd1" />
   <img width="793" height="393" alt="image" src="https://github.com/user-attachments/assets/31462ba5-2974-47f4-b36d-c32248e186ef" />

3. Copy and paste the following content into the expanded JSON file:

```json
{
  "mcpServers": {
    "wowok_arbitration": {
      "command": "npx",
      "args": ["-y", "wowok_arbitration_mcp_server"]
    },
    "wowok_demand": {
      "command": "npx",
      "args": ["-y", "wowok_demand_mcp_server"]
    },
    "wowok_guard": {
      "command": "npx",
      "args": ["-y", "wowok_guard_mcp_server"]
    },
    "wowok_machine": {
      "command": "npx",
      "args": ["-y", "wowok_machine_mcp_server"]
    },
    "wowok_permission": {
      "command": "npx",
      "args": ["-y", "wowok_permission_mcp_server"]
    },
    "wowok_personal": {
      "command": "npx",
      "args": ["-y", "wowok_personal_mcp_server"]
    },
    "wowok_query": {
      "command": "npx",
      "args": ["-y", "wowok_query_mcp_server"]
    },
    "wowok_repository": {
      "command": "npx",
      "args": ["-y", "wowok_repository_mcp_server"]
    },
    "wowok_service": {
      "command": "npx",
      "args": ["-y", "wowok_service_mcp_server"]
    },
    "wowok_treasury": {
      "command": "npx",
      "args": ["-y", "wowok_treasury_mcp_server"]
    }
  }
}
```

4. At the top of the chat box, find the "Agent" label and click "+Create"
   <img width="820" height="421" alt="image" src="https://github.com/user-attachments/assets/a36a57a2-9119-4e54-bb55-2100b1c9b197" />
5. Select all MCP tools with "wowok" in their names, as well as any additional MCP tools you need (if any). You can also configure system prompts as needed for better results.
   <img width="827" height="1366" alt="image" src="https://github.com/user-attachments/assets/99269d65-e792-4b47-b17c-53ba8ee21bad" />
6. Return to the conversation, select the agent you just created to start chatting. It is recommended to use the most advanced model.
   <img width="820" height="1057" alt="image" src="https://github.com/user-attachments/assets/33cc6e4c-d72d-45b7-bb79-9a49f3da8558" />

</details>

# About WoWok

## The Challenge

Traditional business collaboration faces significant barriers:

- High trust-building costs
- Inefficient multi-party coordination
- Expensive contract enforcement
- Data silos limiting innovation

## The WoWok Solution

To address these challenges, WoWok aims to empower trust and collaboration among agents (including humans) through true data ownership and an open‑source digital collaboration framework, bringing more effective supply‑demand matching and transaction efficiency, so that everyone’s personalized needs can be better fulfilled.

## What is WoWok?

Wowok is an AI-Driven Web3 collaboration protocol that enables programmable agreements through composable smart contract objects and natural language interaction.

Wowok provides a unified framework for transforming collaborative ideas and resources into self-executing contracts that handle workflows, payments, and dispute resolution. Using WoWok, you can rapidly deploy complex systems, establish transparent collaborations, and create customized solutions that adapt to specific requirements.

Composed of on‑chain protocols and data, real‑world oracles, open‑source SDKs, and local agents, WoWok is designed to:

- Ensure data ownership, immutable consensus, and transparent interactions.
- Ensure rich dimensions and accessibility of real‑world data.
- Ensure seamless integration of large language models and low‑cost participation for agents.
- Ensure privacy and security of sensitive information.

## What can I use WoWok for?

### Creation

WoWok Protocol fosters innovation by supporting novel business models and collaborative services. Through its core modules, users can:

- Express personalized demands paired with conditional incentives to stimulate precise market responses ([Demand](#demand)).
- Publish supply offerings with a single click, embedding immutable commitments for service milestones and transaction terms ([Service](#service)).
- Execute transactions at designated milestones through verifiable proof of existing and anticipated on-chain data ([Guard](#guard)).
- Seamlessly combine multiple available services, unlocking endless possibilities for composability and innovation.

### Collaboration

WoWok Protocol empowers collaboration across an ecosystem of super individuals—whether human or AI-driven—to achieve their collective objectives.

- Super individuals can define and publish data to open-chain repositories, enabling cross-organizational referencing, resource sharing, and significantly reduced collaboration friction ([Repository](#repository)).
- Service progress can be dynamically orchestrated to meet evolving market demands, ensuring controlled collaboration pacing, consistent quality, and sustainable supply satisfaction ([Machine](#machine)).
- Suppliers can seamlessly integrate their offerings into interconnected service networks via dynamic linking mechanisms, rapidly adapting to diverse and shifting customer requirements ([Service](#service)).
- The completion of one progress milestone can automatically trigger subsequent milestones, facilitating fluid, cross-organizational, and cross-service workflows to fulfill comprehensive customer needs ([Progress](#progress)).
- Treasury management supports flexible allocation and governance of funds within complex collaborative workflows, enabling rapid adaptation to changing business conditions ([Treasury](#treasury)).
- WoWok Protocol leverages AI-tagged data, designed for efficient recognition and interpretation by intelligent agents, enhancing precision in personalized demand-supply matching.

## WoWok Object Learning Path

WoWok abstracts collaboration into composable on-chain objects. Through hands-on exercises, you'll master each object's functionality, use cases, and best practices.

### Learning Structure

Each object includes:
- **Concept Introduction** — Understand core functionality and design principles
- **Hands-on Exercises** — Three levels from basic to advanced practical training
- **Real-world Scenarios** — Business use cases based on actual requirements
- **Composition Patterns** — Learn how to combine multiple objects effectively

### Recommended Learning Order

1. **Foundation Layer** → Personal → Permission → Treasury
2. **Core Layer** → Guard → Repository → Service  
3. **Advanced Layer** → Machine → Order → Integrated Projects

---

### Object Directory

- ([Demand](./Demand-object.md)) — Personalized demand expressions with optional incentives.

- ([Service](./Service-object.md)) — Supply definitions with immutable commitments and terms.

- ([Guard](./Guard-object.md)) — Data verification for current/future states and conditional settlements.

- ([Repository](./Repository-object.md)) — Referenceable, cross-organizational data registries.

- ([Machine](./Machine-object.md)) — Orchestration of progress pacing and quality toward market fit.

- ([Progress](./Progress-object.md)) — Event/milestone objects; can trigger chained workflows.

- ([Treasury](./Treasury-object.md)) — Funds custody, allocation, and programmable payouts.

- ([Permission](./Permission-object.md)) — Fine-grained access/ownership control over entities and objects.

- ([Personal](./Personal-object.md)) — User/agent profile and preferences for personalization.

- ([Order](./Order-object.md)) — Transactional objects that coordinate purchase lifecycle.

- ([Arbitration](#arbitration)) — Dispute handling and resolution pathways.
