# Demand Object: Your Smart Service Marketplace

> "Post what you need, set your reward, let providers compete to serve you better."

## Overview

### Definition

Personalized demand fulfillment through reward-based bounty, attracting services that meet specific requirements.

### Functionality

Enables users to post specific demands with bounty rewards, allowing service providers to present qualifying services, with automated bounty distribution upon service selection and Guard-based eligibility verification. Bounty-based service presentation system where service providers can present qualifying services for specific demands.

### Use Cases

Traditional travel planning projects involve multiple communications and comparisons, which is time-consuming and labor-intensive. By publishing requirements, travelers can put forward all their requirements at once, which greatly improves efficiency. The interaction between travelers and service providers becomes more direct and efficient, while providing a more fair and transparent trading environment for both parties.

**Traveler's needs launch:**

Tom wanted to experience the Great Migration in Africa and was looking for a relaxing safari with accommodation close to nature and a guide who could provide knowledge of the wildlife and natural environment.

### Key Features

- **Bounty-based reward system** — Incentivizes quality service recommendations
- **Service presentation and selection** — Providers compete to meet your requirements
- **Time-limited claim windows** — Creates urgency and efficient matching
- **Guard-based presenter qualification** — Ensures only qualified providers can respond

## What You'll Build (30 seconds)

By the end, you will understand buyer-driven marketplaces:

- **Basic Demand** — post detailed requirements, set rewards, get recommendations
- **Advanced Demand** — add provider verification and compare multiple options

**Prereqs**: You already created Personal, Permission, and Treasury objects. Network is `sui testnet`.

**Note**: Demand objects use Coin type `0x2::coin::Coin<0x2::sui::SUI>` (different from other objects that use Token type `0x2::sui::SUI`).

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and SUI balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (post and reward)

**Scenario**: You need a service but want providers to compete for your business.

**Your Mission**: Create your first Demand with a reward pool and attract service recommendations.

**Try This A** (create demand with reward):

```
"Create a Demand for website design services on sui testnet. I want to offer 0.2 SUI as reward and set it to expire in 24 hours. Lock the reward funds in the Demand object."
```

**Try This B** (submit service recommendation):

```
"Submit a service recommendation to my Demand. Recommend a website design service with description, portfolio link, timeline, and pricing. Show how recommendations are recorded."
```

**Try This C** (select winner and release reward):

```
"Select the best recommendation and release the 0.2 SUI reward to the chosen service provider. Show how the reward pool works and what happens to other recommendations."
```

**💡 If you get stuck**: Ask your AI "Help me create a Demand with reward pool" or "How do I submit service recommendations to Demand objects?"

**Success Looks Like**:

- ✅ You see Demand address and on-chain link
- ✅ Your balance decreases by 200 SUI (locked in reward pool)
- ✅ Service provider successfully submits recommendation with details
- ✅ You can select a winner and see 200 SUI transfer to their address
- ✅ **Fund flow is clear**: Money locked → recommendation → selection → reward release
- ✅ **Buyer power**: You control terms and let providers compete
- ✅ **Transparent process**: All recommendations and reasoning are visible

**Why This Matters**: Demand objects provide:

- **Buyer power**: You set the terms and let providers compete
- **Quality incentive**: Providers compete on value, not just price
- **Transparent process**: All recommendations and reasoning are visible
- **Automated rewards**: Best recommendations get rewarded automatically

This Demand puts you in control of the service discovery process.

---

## 🎯 Level 2 — Advanced (verification and comparison)

**Scenario**: You want to add verification requirements and compare multiple provider recommendations.

**Your Mission**: Create a Demand with provider verification and evaluate multiple proposals.

**Try This A** (create verified demand):

```
"Create a Demand for website development services on sui testnet. Offer 0.4 SUI reward, require providers to have minimum 0.1 SUI Treasury balance, and set detailed requirements: responsive design, 5 pages, contact form, 2-week delivery. Set it to expire in 48 hours."
```

**Try This B** (collect verified recommendations):

```
"Have 2-3 qualified providers (with sufficient Treasury balance) submit recommendations with different approaches: premium vs. standard design, different pricing, and varying timelines. Show how verification filters serious providers."
```

**Try This C** (compare and select):

```
"Compare the recommendations based on design approach, price, timeline, and provider credentials. Select the best value and release the 0.4 SUI reward to your chosen provider."
```

**Success Looks Like**:

- ✅ You see Demand address + on-chain link
- ✅ Only verified providers can submit recommendations
- ✅ Multiple qualified providers submit different approaches
- ✅ **Quality filtering working**: Verification ensures serious providers only

**Why This Matters**: Advanced Demands enable:

- **Quality control**: Verification requirements filter serious providers
- **Better comparisons**: Multiple qualified options to choose from
- **Detailed specification**: Describe what you want with more specificity
- **Provider competition**: Qualified suppliers compete on value and approach

---

## 💡 Mini Challenge — Ultra-Detailed Demand Creation

**Goal**: Experience Demand's most powerful feature - the ability to describe your needs in extreme detail, letting providers organize their own solutions.

**The Demand Advantage**: Unlike traditional "I need a website" requests, you can specify many details upfront, reducing guesswork and back-and-forth communication.

**Try This**:

```
"Create an Ultra-Detailed Demand for a complete brand identity project on sui testnet. Offer 1.0 SUI reward and specify comprehensive requirements: Logo design (3 concepts, vector format, color and B&W versions), Brand guidelines (typography, color palette, usage rules), Business card design (front/back, print-ready), Letterhead template, Social media kit (Facebook, Instagram, LinkedIn covers), Website mockup (homepage design), Brand story copywriting (200 words), Delivery timeline (2 weeks), File formats (AI, PNG, PDF, JPG), Revision rounds (2 rounds included), Brand personality (modern, trustworthy, innovative), Target audience (tech startups), Industry (SaaS), Budget considerations (premium quality expected). Let providers organize their own teams and workflows to meet these detailed specifications."
```

**Success Looks Like**:

- ✅ Extremely detailed Demand with comprehensive specifications
- ✅ Providers understand exactly what's needed without clarification
- ✅ Different providers organize their own solutions (solo designer vs. agency team)
- ✅ **Clearer requirements**: Your detailed description reduces guesswork
- ✅ **Provider self-organization**: Suppliers figure out how to deliver your exact requirements

**💡 Pro Tip**: The more detailed your Demand, the better the proposals you'll receive. Don't hold back - describe everything you want!

**Creative Ideas**: Software development with detailed specs, content creation with style guides, event planning with venue requirements, marketing campaigns with target demographics.

**Share Your Creation**: Post your detailed Demand and how it attracted better proposals!

---

## 🔧 Troubleshooting (friendly and fast)

**Schema error** → Create a minimal Demand first; add qualification criteria step by step.

**No recommendations** → Check if your requirements are too restrictive or reward too low.

**Wrong token type** → Use Coin type (0x2::coin::Coin<0x2::sui::SUI>) not Token type for Demands.

**Guard blocking everyone** → Verify Guard conditions aren't too strict; check specific error messages like "experience requirement not met".

**Reward not distributed** → Check if time_expire is set and conditions are met.

**Fund flow confusion**:

- **Reward pool**: Your SUI is locked in the Demand when created, not in a separate Treasury
- **Selection process**: You manually select winners, or automatic distribution happens at expiry
- **Refund mechanism**: Unused rewards return to your address if no qualified responses

**Reset, without losing learning**:

- Note the Demand address and any good recommendations received
- Create a new Demand with adjusted requirements or rewards
- Test with simpler qualification criteria first
- Gradually add complexity as you understand the dynamics

**Common Use Cases**:

- **Freelance projects**: Detailed proposals with portfolio requirements
- **Professional services**: Credential verification and experience matching
- **Creative work**: Portfolio-based evaluation with style preferences
- **Technical consulting**: Skill-based matching with complexity assessment

**Need help?**: The community has great examples of Demand patterns for different industries!

---

## ✅ Ready for More?

**You've Unlocked**:

- 🎯 **Detailed Requirements**: You can specify what you need with comprehensive detail
- 🔍 **Provider Verification**: Basic qualification systems that filter serious providers
- 📊 **Comparison Skills**: Ability to evaluate multiple proposals and choose the best
- 💰 **Reward Systems**: Incentive structures that attract quality service providers

**Next Up**: **Order Objects** — learn how individual transactions work when customers purchase services!

**Quick Check**: Can you create a Demand that attracts qualified recommendations and explain how the reward system works? If yes, you're ready to orchestrate complex workflows!

---

## 🌟 What Makes Demand Objects Special?

Unlike traditional service marketplaces, Wowok Demand objects are:

1. **Ultra-Detailed Requirements**: Describe your needs in comprehensive detail, eliminating guesswork
2. **Provider Self-Organization**: Suppliers organize their own teams and workflows to meet your specifications
3. **Clearer Communication**: Detailed descriptions can reduce communication overhead and misunderstandings
4. **Quality-Driven**: Reward systems incentivize better proposals, not just lower prices
5. **Transparent Process**: All recommendations and evaluation criteria are visible on-chain
6. **Composable**: Can integrate with Guard objects for verification and other Wowok components

Demand objects offer a different approach to buying services - instead of vague requests that often require clarification, you can specify what you want in detail and let providers compete to meet your requirements.
