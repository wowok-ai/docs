# Repository Object: Your Shared Data Vault

> "Create structured databases that multiple parties can contribute to and reference - from personal records to community knowledge bases"

## What You'll Build (30 seconds)

You'll create **Repository objects** that act as structured, on-chain databases where multiple parties can store and access data. Think of them as smart spreadsheets that live on the blockchain - with defined schemas, access controls, and the ability to be referenced by other Wowok objects. Perfect for everything from personal records to community-driven data collections.

---

## 🎯 Level 1: Personal Data Storage

**The Challenge**: You want to create a personal database to store your own information - like contact details, preferences, or achievements - in a structured way that other Wowok objects can reference.

**Your Mission**: Create a Repository that stores your personal information with proper data types and structure.

**Try This**:

```
"Help me create a personal Repository object for storing my information. I want to store: my name (string), phone number (string), location (string), and a rating/score (number). Set up the complete flow: first create a Permission object with proper rights (1001, 1002) if I don't have one suitable for Repository operations, then create the Repository with policy definitions, and finally add my personal data. Use 'default' as the account name."
```

**Success Looks Like**:

- ✅ You have a Repository object with a defined policy (schema)
- ✅ Your Repository contains structured data with proper types (string, number)
- ✅ You understand how policy definitions control what data can be stored
- ✅ You can query your data back and see it's properly structured

**Why This Matters**: Personal Repositories enable:

- **Structured identity**: Your information in a format other objects can use
- **Data portability**: Your records that you control and can reference anywhere
- **Type safety**: Guaranteed data formats that prevent errors
- **Access control**: You decide who can read or modify your information

---

## 🎯 Level 2: Community Shared Repository

**The Challenge**: Create a Repository that multiple people can contribute to - like a local business directory, community recommendations, or shared knowledge base.

**Your Mission**: Build a Repository where different addresses can add their own data to shared categories.

**Try This**:

```
"Now I want to create a community Repository for local service providers. Create a Repository that can store: business name (string), service type (string), contact info (string), and rating (number). Set it up so multiple people can add their own business information using different addresses. Add sample data for at least 2-3 different businesses using different address formats (account names and integer addresses like 12345, 54321)."
```

**Success Looks Like**:

- ✅ Multiple addresses have contributed data to the same Repository
- ✅ You understand how different addresses can store data under the same schema
- ✅ You can query data by specific addresses to see individual contributions
- ✅ You see how this creates a collaborative database structure

**Pro Tip**: Community Repositories become powerful when combined with Guard objects for data validation and Service objects for monetizing access!

---

## 🎯 Level 3: Business Credential Verification System

**The Challenge**: Create a sophisticated Repository system that can be used by other Wowok objects for automated verification - like professional credentials, certifications, or business qualifications.

**Your Mission**: Build a Repository that demonstrates advanced features like data validation, cross-object integration, and automated verification workflows.

**Try This**:

```
"I want to create an advanced Repository for professional credentials that other Wowok objects can reference for verification. Create a Repository that stores: professional title (string), certification level (number), verification date (number for timestamp), and certifying authority (string). Set up the Repository so it can be referenced by Guard objects for automated qualification checking. Add sample data for different professionals and show how a Guard object could query this Repository to verify someone's credentials."
```

**Success Looks Like**:

- ✅ Your Repository is designed to be referenced by other Wowok objects
- ✅ You understand how Repositories can serve as data sources for automated verification
- ✅ You can demonstrate how Guard objects might query Repository data
- ✅ You see the power of Repositories as foundational infrastructure for complex systems

**Level Up**: You now understand how Repositories can serve as the data backbone for entire Wowok ecosystems, enabling automated verification and complex business logic!

---

## 💡 Mini Challenge: Local Recommendations Database

**Creative Exercise**: Design a Repository system that powers a local recommendations platform.

**Try This**:

```
"Help me design a comprehensive local recommendations Repository system. Create a Repository that can store: business name, category (restaurant/service/shop), location, average rating, price range (number 1-5), and special features (string). Set it up so community members can add recommendations, and show how this Repository could be used by Service objects (for booking), Guard objects (for qualification checking), or Demand objects (for matching requests). Add diverse sample data that showcases different types of local businesses."
```

**Share Your Creation**: Post about your local recommendations system and how you're using Repository objects for community data!

---

## 🔧 Troubleshooting

**Common Issues**:

**If Repository creation fails**:

- Ensure you created the Permission object first with proper rights (1001, 1002)
- Check that your account has the necessary permissions in the Permission object
- Verify the Repository name doesn't conflict with existing objects
- Make sure you're using the correct Permission object reference

**If policy setting fails**:

- Verify your data type codes are correct (204=string, 202=number, 200=address, etc.)
- Check that field names (keys) are unique within the policy
- Ensure you're using "add" operation for new policies
- Make sure the Repository object exists before setting policy

**If data addition fails**:

- Confirm the policy is set before trying to add data
- Check that your data type matches the policy definition exactly
- Verify you're using "add_by_key" operation format correctly
- Ensure the field name exists in the policy

**If queries return empty results**:

- Use `no_cache: true` parameter to get fresh data
- Check that you're using the correct address format for queries
- Verify the field name matches exactly what's in the policy
- Confirm data was actually added successfully

**Alternative Approaches**:

- **Simpler version**: "Create a Repository that only stores name and phone number"
- **Different focus**: "Create a Repository for storing simple key-value pairs"

**Need help?**: The community has great examples of Repository patterns for different use cases!

---

## ✅ Ready for More?

**You've Unlocked**:

- 📊 **Structured Data**: You can create databases with defined schemas and data types
- 🤝 **Collaborative Storage**: Multiple parties can contribute to shared data collections
- 🔍 **Cross-Object Integration**: Your Repositories can be referenced by Guards, Services, and other objects
- 🏗️ **Data Infrastructure**: You understand how Repositories serve as foundational data layers

**Next Up**: **Service Objects** - Learn how to create purchasable services that can reference your Repository data for automated verification and enhanced functionality!

**Quick Check**: Can you create a Repository with a policy and add structured data? Can you explain how other objects might reference your Repository data? If yes, you're ready to start offering services!

---

## 🌟 What Makes Repository Objects Special?

Unlike traditional databases, Wowok Repository objects are:

1. **Blockchain-Native**: All data is stored on-chain with cryptographic guarantees
2. **Schema-Enforced**: Policy definitions ensure data consistency and type safety
3. **Multi-Contributor**: Different addresses can add data under the same structure
4. **Cross-Object Referenceable**: Other Wowok objects can query and verify Repository data
5. **Permission-Controlled**: Fine-grained access control for reading and writing data
6. **Immutable History**: All data changes are permanently recorded on the blockchain

Repositories become the data backbone that powers sophisticated Wowok ecosystems, enabling everything from identity verification to community knowledge sharing!"
