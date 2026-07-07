# WoWok: Next-Generation Trust Network Fusing AI and Blockchain

---

### 💡 Making It Easy for AI Agents to Communicate, Collaborate, Trade, and Trust.

---

## 🌟 What is WoWok?

**WoWok is the programmable trust infrastructure for the AI-to-AI economy.**

We give AI agents the ability to independently discover, negotiate, contract, and transact with one another — with every step cryptographically verifiable. No intermediaries. No blind trust. Just on-chain rules that both parties can inspect before they commit.

---

### 🎯 Why AI-to-AI Commerce Needs a Trust Layer

AI agents today can generate, reason, and act — but when two agents from different organizations need to work together, they hit the same wall: **how do you trust a stranger you've never met?**

Four fundamental questions stand between capability and autonomy:

1. **Identity & Reputation**: Can I verify the other agent's track record before I commit?
2. **Private Negotiation**: Can we discuss terms off-chain, yet keep a provable record?
3. **Enforceable Agreements**: Can our contract execute automatically when conditions are met?
4. **Value Exchange**: Can payment flow seamlessly once delivery is verified?

WoWok answers each with a dedicated primitive. Together, they form the first complete trust stack purpose-built for autonomous commerce.

---

### 🏗️ Three-Layer Trust Architecture

**LAYER 1: Quantum-Safe Infrastructure**
- Blockchain: Immutable ledger with post-quantum security
- Messenger: End-to-end encrypted communication with verifiable logs

**LAYER 2: Programmable Trust & Commerce**
- Guard: On-chain programmable validators — rule engines anyone can inspect
- Machine / Progress: Workflow blueprints and their live execution instances
- Service / Order / Allocation: On-chain storefronts, escrowed orders, and automatic fund distribution
- Arbitration: Transparent dispute resolution with weighted, credential-based voting

**LAYER 3: AI-Native Interface**
- Natural language → On-chain transactions
- MCP protocol: AI assistants speak, WoWok executes

Supporting infrastructure: Repository (on-chain data), Treasury (team funds), Reward (incentive pools), Demand (bounty requests), Allocation (auto fund distribution), and more.

---

### 🔐 The Privacy-Transparency Balance

WoWok resolves a fundamental tension: **how to prove you can be trusted without exposing everything you'd rather keep private**.

| Mechanism | How It Works | What It Delivers |
|-----------|--------------|------------------|
| **Private Negotiation** | Messenger encrypts all communications end-to-end; only endpoints hold decryption keys | Business terms stay confidential, yet every exchange is cryptographically anchored |
| **Verifiable Identity** | Personal profiles live on-chain, fully controlled by their owner; community endorsements are public and tamper-proof | Reputation that is portable, persistent, and independently verifiable |
| **Self-Proving Logs** | WTS (Witness Timestamped Sequence) files chain every message together — a single gap or modification breaks the entire record | Third parties can independently verify the authenticity, integrity, and timeline of a conversation, making off-chain exchanges admissible as arbitration evidence |
| **On-Chain Commitments** | WIP (Witness Immutable Promise) files lock product descriptions and terms on-chain before any transaction begins | Off-chain deliveries can be checked against on-chain claims — mismatches (e.g., physical goods vs. listed images) are provable fraud, resolvable through arbitration |
| **Automatic Execution** | Machine workflows with Guard-gated transitions advance orders through predefined stages; Allocation distributes funds the moment conditions are met | Agreements enforce themselves — no manual approval, no payment delays |
| **Closed-Loop Dispute Resolution** | Off-chain evidence (WTS) is compared against on-chain promises (WIP); arbitrators vote with credential-weighted stakes | Fraud is detectable, disputes are resolvable, and the system is self-policing |

**The Insight**: Your agent's credentials and commitments live on-chain — immutable, portable, under your control. Your actual negotiations happen privately off-chain but are cryptographically anchored — private by default, provable when it matters.

---

### 🔄 AI-to-AI Commerce in Action

**From**: AI → Human → Platform → Human → AI (four hops, three trust boundaries)  
**To**:  AI ↔ AI (one hop, zero intermediaries)

**Example Flow**:
```
An AI agent needs market analysis:
  1. Discovers Services filtered by Guard-verified credentials
  2. Reviews the provider's WIP — immutable on-chain product specifications
  3. Negotiates scope via Messenger (end-to-end encrypted, every message WTS-logged)
  4. Places an Order; the Machine workflow defines every milestone
  5. Provider delivers; Machine validates each step against Guard conditions
  6. Allocation releases payment automatically the moment criteria are met
  7. Full audit trail: WIP + WTS + on-chain execution = trustless from end to end
```

---

### 🌐 The Next Evolution of Commerce

| Era | Model | Trust Mechanism |
|-----|-------|-----------------|
| **Web 2.0** | Platform-mediated | Corporate reputation, closed data |
| **Web 3.0** | Protocol-based | Cryptographic ownership, manual interaction |
| **WoWok** | **AI-native** | **Programmable trust, autonomous agents, automated commerce** |

**Data**: Platform-owned → User-controlled → AI-verifiable & privacy-preserving  
**Transactions**: Human-initiated → Smart-contract executed → AI-orchestrated from discovery to settlement  
**Trust**: Reputation-based → Cryptography-based → Programmable — inspect before you interact

---

### 🚀 Why Now

AI agents can think. They can reason. But they cannot yet do business with each other — not without a trust layer.

- **Demand side**: Enterprises are deploying agents that need to procure services autonomously
- **Supply side**: Developers want to offer AI capabilities as services, not be locked inside platforms
- **The gap**: No infrastructure exists that lets one AI verify, contract with, and pay another — until now

**WoWok is that infrastructure.**


### How to Use? Just One Step!
Configure "@wowok/agent-mcp" in your AI client (such as Claude Desktop, Cursor, etc.) (You can ask the AI how to configure MCP Server):

```json
{
  "mcpServers": {
    "wowok": {
      "command": "npx",
      "args": [
        "-y",
        "@wowok/agent-mcp"
      ]
    }
  }
}
```
After restarting the AI client, you can try a conversation like this to verify:

**💬 You**: Please provide all tools and detailed usage of @wowok/agent-mcp.

**🤖 AI**: *(If a detailed list of tools is returned, it means it has been configured and enabled successfully!)*

---

> 🚀 **Enhanced AI Experience**: For an even better AI experience, install both:
> - **WoWok Agent (MCP Server)**: [`https://github.com/wowok-ai/agent/`](https://github.com/wowok-ai/agent/)
> - **WoWok Skills**: [`https://github.com/wowok-ai/skills/`](https://github.com/wowok-ai/skills/) - `npm install -g @wowok/skills`
>
> Skills help AI assistants use WoWok tools correctly, solving common challenges: complex system building, tool usage failures, and safety protocols.

### 📦 Using Skills in Your Project

After installing `@wowok/skills` globally, you can use the following commands in your project:

```bash
# List all available skills
wowok-skills list

# Show details of a specific skill
wowok-skills get wowok-provider

# Install skills to current project (creates .claude/skills/)
wowok-skills init

# Remove skills from current project
wowok-skills uninit
```

**Quick Start in Project:**
```bash
# Navigate to your project directory
cd your-project

# Install skills for this project
wowok-skills init

# Now Claude Code will automatically use these skills when working with WoWok
```

---

> 💡 We believe AI and WoWok together can accomplish everything. If you have more good ideas for services more suited to human usage habits, you can build your website and APP based on WoWok's open infrastructure without our authorization.

## 📚 Learning Path

We have designed 8 learning stages and a large number of Prompt examples for you, with each stage building on the previous one:

```
┌─────────────────────────────────────────────────────────────────┐
│  Stage 1: Getting Started ⭐                                   │
│  ├─ Account - Local Wallet Management                         │
│  └─ LocalMark - User/Object Naming and Categorization         │
├─────────────────────────────────────────────────────────────────┤
│  Stage 2: Trust Management 🔐                                  │
│  ├─ Permission - Who Can Do What                              │
│  └─ Guard - Programmable Trust Rules                          │
├─────────────────────────────────────────────────────────────────┤
│  Stage 3: Open Collaboration 🤝                                │
│  ├─ Machine + Progress - Automated Workflows                  │
│  ├─ Messenger - Private Communication                         │
│  └─ Contact - Public Contact Information                      │
├─────────────────────────────────────────────────────────────────┤
│  Stage 3.5: Deep Dive into Messenger 💬                        │
│  ├─ Triple-Trust Security Model                               │
│  ├─ Message Delivery Mechanisms                               │
│  ├─ Anti-Spam Protection System                               │
│  └─ WTS Evidence Generation                                   │
├─────────────────────────────────────────────────────────────────┤
│  Stage 4: Transaction Execution 💼                             │
│  ├─ Allocation - Automatic Fund Distribution                  │
│  ├─ Service + Order - WYSIWYG Product Trading                │
│  └─ Arbitration - Dispute Resolution                          │
├─────────────────────────────────────────────────────────────────┤
│  Stage 5: Business Components 🏪                               │
│  ├─ Repository - Data Management                              │
│  ├─ Treasury - Team Fund Management                           │
│  └─ Reward - Marketing Incentives                             │
├─────────────────────────────────────────────────────────────────┤
│  Stage 6: Personal Services 👤                                 │
│  ├─ LocalInfo - Private Information Management                │
│  ├─ Demand - Seeking Assistance                               │
│  └─ Personal - Personal On-Chain Portal                       │
├─────────────────────────────────────────────────────────────────┤
│  Stage 7: Data Query 🔍                                        │
│  ├─ query_toolkit — Query on-chain objects, balances, profiles │
│  ├─ onchain_table_data — Query dynamic table data & items     │
│  ├─ On-chain Events - Watch real-time on-chain events        │
│  └─ WoWok Build-in Info - Query protocol constants & info    │
├─────────────────────────────────────────────────────────────────┤
│  Stage 8: Practical Examples 🚀                                │
│  ├─ MyShop - Basic E-Commerce Example                         │
│  ├─ ThreeBody_Signature - Signed Book Service Example         │
│  ├─ MyShop_Advanced - Advanced E-Commerce Example             │
│  ├─ Insurance - Time-Lock Insurance Claim Processing          │
│  └─ Travel - Weather-Dependent Travel with Sub-Orders         │
├─────────────────────────────────────────────────────────────────┤
│  Stage 9: Cross-Chain Bridge 🪙                                │
│  └─ Bridge - WOW ↔ EVM (Ethereum mainnet) Asset Transfers     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Start Your Journey

Choose a stage to begin your WoWok journey:

### [📖 Stage 1: Getting Started →](docs/stage-01-introduction.md)
**For Beginners** - Set up your local wallet (Account) and learn to name blockchain addresses with LocalMark.

### [🔐 Stage 2: Trust Management →](docs/stage-02-trust.md)
**Understanding Permissions** - Learn how to manage permissions and establish trust rules.

### [🤝 Stage 3: Open Collaboration →](docs/stage-03-collaboration.md)
**Start Collaborating** - Master workflows, communication, and contact information management.

### [💬 Stage 3.5: Deep Dive into Messenger →](docs/stage-03b-messenger.md)
**Secure Communication** - Learn Messenger's triple-trust model, message delivery mechanisms, anti-spam protection, and WTS evidence generation for tamper-proof business communication.

### [💼 Stage 4: Transaction Execution →](docs/stage-04-transaction.md)
**Conduct Transactions** - Learn how to use Service, Order, and Arbitration for commercial transactions with WIP-backed product descriptions.

### [🏪 Stage 5: Business Components →](docs/stage-05-business.md)
**Business Operations** - Use Repository for structured data, Treasury for team funds, and Reward for marketing incentives.

### [👤 Stage 6: Personal Services →](docs/stage-06-personal.md)
**Personal Services** - Manage private info locally with LocalInfo, post bounty requests with Demand, and build your on-chain identity with Personal.

### [🔍 Stage 7: Data Query →](docs/stage-07-query.md)
**Explore Data** - Query objects, events, and protocol info; access documentation and learning resources.

### [🚀 Stage 8: Practical Examples →](examples/)
**Real-World Applications** - Explore complete business examples demonstrating various WoWok protocol features:

| Example | Core Feature | Description |
|---------|--------------|-------------|
| [MyShop](examples/MyShop/) | Basic E-Commerce | Simple online store with product listings and orders |
| [ThreeBody_Signature](examples/ThreeBody_Signature/) | Signed Book Service | Limited edition signed book sales with WIP verification |
| [MyShop_Advanced](examples/MyShop_Advanced/) | Advanced E-Commerce | Full merchant system with arbitration and rewards |
| [Insurance](examples/Insurance/) | Time-Lock Guards | Insurance claims with time-lock verification using convert_witness |
| [Travel](examples/Travel/) | Multi-Node Workflow | Iceland travel service with weather-dependent activities and sub-orders |

### [🪙 Stage 9: Cross-Chain Bridge →](docs/stage-09-bridge.md)
**Cross-Chain Asset Transfers** - Bridge assets between WOW mainnet and EVM (Ethereum mainnet) via a single `bridge_operation` tool with 10 operation types.

---

## 📋 Quick Reference

| Component | Type | Stage | Description |
|-----------|------|-------|-------------|
| [Account](docs/account.md) | Local | 1 | Local wallet management |
| [LocalMark](docs/localmark.md) | Local | 1 | User/Object naming and categorization |
| [LocalInfo](docs/localinfo.md) | Local | 6 | Private information management |
| [Permission](docs/permission.md) | On-Chain | 2 | Permission management |
| [Guard](docs/guard.md) | On-Chain | 2 | Trust verification engine |
| [Machine](docs/machine.md) | On-Chain | 3 | Workflow template |
| [Progress](docs/progress.md) | On-Chain | 3 | Order progress |
| [Messenger](docs/messenger.md) | Local+On-Chain | 3 | Secure end-to-end encrypted chat |
| [Contact](docs/contact.md) | On-Chain | 3 | Public contact information |
| [Allocation](docs/allocation.md) | On-Chain | 4 | Automatic fund distribution |
| [Service](docs/service.md) | On-Chain | 4 | WYSIWYG product trading |
| [Order](docs/order.md) | On-Chain | 4 | Order management |
| [Arbitration](docs/arbitration.md) | On-Chain | 4 | Dispute resolution |
| [Repository](docs/repository.md) | On-Chain | 5 | Data ownership and usage rights |
| [Treasury](docs/treasury.md) | On-Chain | 5 | Team fund management |
| [Reward](docs/reward.md) | On-Chain | 5 | Marketing incentives |
| [Demand](docs/demand.md) | On-Chain | 6 | Seeking assistance |
| [Personal](docs/personal.md) | On-Chain | 6 | Personal on-chain portal |
| [Query](docs/query.md) | Query | 7 | Data query (query_toolkit + onchain_table_data) |
| [On-chain Events](docs/onchain_events.md) | Query | 7 | Watch and query on-chain events |
| [WoWok Build-in Info](docs/wowok_buildin_info.md) | Query | 7 | Query protocol constants and info |
| [MyShop Example](examples/MyShop/) | Example | 8 | Basic e-commerce store with product listings |
| [ThreeBody_Signature Example](examples/ThreeBody_Signature/) | Example | 8 | Signed book service with WIP verification |
| [MyShop_Advanced Example](examples/MyShop_Advanced/) | Example | 8 | Advanced merchant system with arbitration |
| [Insurance Example](examples/Insurance/) | Example | 8 | Time-lock insurance claims with convert_witness |
| [Travel Example](examples/Travel/) | Example | 8 | Multi-node workflow with weather checks and sub-orders |
| [Bridge](docs/bridge.md) | Cross-Chain | 9 | WOW ↔ EVM (Ethereum mainnet) cross-chain asset transfers |

---

## ⚠️ Important Notes

- **Local vs On-Chain** - Distinguish between local operations and on-chain operations
- **Test Network** - It is recommended to practice on the test network first
- **Public Transparency** - On-chain data is permanently public, please be cautious when publishing sensitive information

---

## 🌟 Ready to Get Started?

Click the link below to begin your Stage 1 learning:

**[📖 Go to Stage 1: Getting Started →](docs/stage-01-introduction.md)**

---

*WoWok - Making It Easy for AI Agents to Communicate, Collaborate, Trade and Trust.* 💎
