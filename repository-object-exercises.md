# Repository Object: Your Shared Information Hub

> "Create organized information storage that multiple people can contribute to and reference - like a smart address book or community database that lives on the blockchain"

## What You'll Build (30 seconds)

By the end, you will have three information systems and understand collaborative data management:

- **Personal Information Hub** — your own structured records with organized categories
- **Community Shared Database** — collaborative information that multiple people contribute to
- **Business Verification System** — professional records that other services can reference

**Prereqs**: Network is `sui testnet`. Token type is `0x2::sui::SUI`.

**Pre-flight** (copy one line):

```
"On sui testnet, show my default account and balance; if low, guide me to the faucet and wait for funds."
```

---

## 🎯 Level 1 — Foundation (create personal information hub)

**Scenario**: You want to create your own organized information storage - like a smart address book that can store different types of information in an organized way.

**Your Mission**: Create your first Repository to store your personal information with clear categories and data types.

**Try This A** (create personal information hub):

```
"Create personal information Repository on sui testnet. First create a Permission object with Repository management rights for my default account, then create the Repository in strict mode for storing my information: name (text), phone (text), location (text), and rating (number). Set up the information structure definitions first, then add my personal data. Return: Repository address + on-chain link, Permission address + on-chain link, information structure confirmation."
```

**Try This B** (test information storage):

```
"Add a friend's contact info to my Repository using a different address (like 12345): name 'John Smith', phone '555-0123', location 'New York', rating 88. Show how the same Repository can store different people's information in the same organized categories."
```

**Try This C** (verify information organization):

```
"Return the Repository address + on-chain link so I can view the stored information directly on the blockchain. Explain how this organized Repository structure differs from simple text storage and why it's useful for other services to reference."
```

**Success Looks Like**:

- ✅ You see Repository address + on-chain link
- ✅ Repository contains organized information from multiple addresses
- ✅ **Information structure working**: Categories control what information can be stored
- ✅ **Multi-user storage confirmed**: Same Repository stores different people's information separately

**Why This Matters**:

- **Organized storage**: Your information in clear categories instead of random text
- **Service integration**: Other Wowok objects can reference and verify your information

---

## 🎯 Level 2 — Application (community shared database)

**Scenario**: You want to create a shared information system that multiple people can contribute to - like a local business directory where everyone can add their favorite places.

**Your Mission**: Build a Repository where different people can add their own information to shared categories.

**Try This A** (create community database):

```
"Create community business directory Repository on sui testnet. Use existing Permission objects, then create the Repository in strict mode for storing: business name (text), service type (text), contact info (text), and rating (number). Set up the information structure definitions first, then add sample data: 'Downtown Cafe' (restaurant, contact: 'Main St 123', rating: 90). Return: Repository address + on-chain link, community structure confirmation."
```

**Try This B** (test community contributions):

```
"Add more businesses from different contributors using addresses 12345 and 54321: address 12345 adds 'Coffee Corner' (restaurant, contact: 'cafe@example.com', rating: 92), address 54321 adds 'Tech Repair Shop' (service, contact: 'repair@example.com', rating: 85). Show how multiple people contribute while keeping their data separate."
```

**Try This C** (verify community collaboration):

```
"Return the Repository address + on-chain link so I can view all community contributions directly on the blockchain. Explain how this collaborative information system enables community-driven data collection and why it's valuable."
```

**Success Looks Like**:

- ✅ You see Repository address + on-chain link
- ✅ Multiple addresses have contributed information to the same system
- ✅ **Community collaboration working**: Different people can add information under shared categories
- ✅ **Collaborative database concept**: You understand how this creates shared knowledge systems

**Why This Matters**:

- **Shared knowledge**: Everyone contributes to build comprehensive information systems
- **Community value**: Collective information becomes more valuable than individual contributions

---

## 🎯 Level 3 — Integration (business verification system)

**Scenario**: You want to create a professional credentials system that other services can reference for automated verification - like a digital certificate system that proves qualifications.

**Your Mission**: Build a Repository that other Wowok objects can reference for automated verification and business processes.

**Try This A** (create verification system):

```
"Create professional credentials Repository on sui testnet for automated verification. Use existing Permission objects, create Repository in strict mode for storing: professional title (text), certification level (number), verification date (number for timestamp), and certifying authority (text). Set up information structure definitions first, then add sample data: 'Software Engineer' (level: 3, date: 1640995200, authority: 'Tech Institute'). Return: Repository address + on-chain link, verification system structure."
```

**Try This B** (test verification concept):

```
"Add more professional credentials using different addresses: address 12345 adds 'Data Scientist' (level: 4, date: 1672531200, authority: 'Data Academy'), address 54321 adds 'Project Manager' (level: 2, date: 1609459200, authority: 'Business School'). Show how this creates a verification source for automated qualification checking."
```

**Try This C** (verify integration readiness):

```
"Return the Repository address + on-chain link so I can view the professional credentials directly on the blockchain. Explain how this Repository could integrate with Service or Guard objects for automated verification workflows."
```

**Success Looks Like**:

- ✅ You see Repository address + on-chain link
- ✅ Repository contains structured professional information
- ✅ **Verification concept understood**: You understand how other services could reference this information
- ✅ **Integration potential clear**: Repository serves as foundational data layer for business processes

**Why This Matters**:

- **Automated verification**: Services can check credentials without manual review
- **Trust infrastructure**: Reliable professional information that multiple services can reference

---

## 💡 Mini Challenge: Community Knowledge Hub

**Creative Exercise**: Design a comprehensive community information system that demonstrates Repository integration with other Wowok objects.

**Try This** (as community organizer):

```
"Create community knowledge hub Repository system with integration potential:
1) Main Repository storing: business name, category (restaurant/service/shop), location, average rating, price range (number 1-5), and special features (text)
2) Set up community contribution structure so multiple people can add recommendations
3) Demonstrate integration concepts: show how this Repository could be referenced by Service objects (for booking services), Guard objects (for qualification checking), or Demand objects (for matching community requests)
4) Add diverse sample data showcasing different local businesses and community contributions
5) Return Repository address + on-chain link, community structure summary, integration potential explanation"
```

**Learning Focus**: This challenge teaches you how to:

- Create **comprehensive information structures** that serve multiple purposes
- Design **community contribution systems** where multiple people add value
- Understand **cross-object integration** where Repositories serve as information sources

**Success Looks Like**:

- ✅ You see Repository address + on-chain link
- ✅ **Multiple Contributors**: Different addresses adding valuable community information
- ✅ **Integration Ready**: Repository designed to be referenced by other services
- ✅ **Diverse Information**: Sample data showing different types of community knowledge

**Share Your Creation**: Post about your community knowledge hub and how Repository objects enable collaborative information systems!

---

## 🔧 Troubleshooting (friendly and fast)

**Information structure error** → Start with simple categories (name, phone); add complexity step by step.

**Repository creation fails** → Check that you have Permission objects created first with data management rights for your account. Also ensure sufficient test tokens for transaction fees.

**Information setup or storage fails** →

- **Most common**: Repository needs information structure definitions before storing data
- Verify information category names are unique and types are correct (text, number, address)
- Ensure your information matches the category types exactly (text vs number)
- Ask your AI to help create simple information categories first

**Information retrieval issues** →

- Ask for fresh information from the blockchain (not cached data)
- Use basic table listing instead of detailed queries if specific queries fail
- Check that you're using the correct address format for queries
- Focus on confirming data count and basic structure rather than detailed content verification

**Integration concept unclear** →

- Focus on understanding how other services could reference your Repository information
- Don't worry about implementing full automation - the concept understanding is key
- Ask your AI to explain how Guard or Service objects might query Repository data
- Start with simple integration examples before attempting complex workflows

**Need permission details?** → Ask your AI to check the built-in permissions for Repository management to get the correct access rights.

**Reset, without losing learning**:

- Note the Repository address and successful information categories
- Create a new Repository with simpler structure (name and phone only)
- Test basic information storage before adding professional features
- Gradually add complexity as you understand the information organization patterns

**Common Use Cases**:

- **Personal records**: Contact information, preferences, achievements
- **Community databases**: Local business directories, recommendations
- **Professional credentials**: Certifications, qualifications for verification

**Need help?**: The community has great examples of Repository patterns for different information types!

---

## ✅ Ready for More?

**You've Unlocked**:

- 📊 **Organized Information**: Create information systems with clear categories and data types
- 🤝 **Community Collaboration**: Multiple people can contribute to shared information collections
- 🔍 **Service Integration**: Your Repositories can be referenced by other services for automated processes
- 🏗️ **Information Infrastructure**: You understand how Repositories serve as foundational information layers

**Next Up**: **Service Objects** — learn how to create purchasable services that can reference your Repository information for automated verification and enhanced functionality!

**Quick Check**: Can you create a Repository with information categories and add organized data? Can you explain how other services might reference your Repository information? If yes, you're ready to start offering services!

---

## 🌟 What Makes Repository Objects Special?

Unlike traditional databases, Wowok Repository objects are:

1. **Multi-Contributor**: Different people can add information under the same organized structure
2. **Service-Referenceable**: Other Wowok services can query and verify Repository information
3. **Structure-Enforced**: Information categories ensure data consistency and prevent errors
4. **Blockchain-Secured**: All information is permanently recorded and verifiable

Repositories become the information backbone that powers sophisticated Wowok ecosystems!"
