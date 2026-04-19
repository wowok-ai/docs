# Messenger Component (💬 Encrypted Messaging System)

---

## Component Overview

The Messenger component is used for WoWok encrypted message management, including conversation list viewing, sending messages/files, viewing message history, WTS (Witness Timestamped Snapshot) generation, verification, and signing, on-chain proof, blacklist/friendslist/guardlist management, etc.

---

## Function List

| Function Name | Purpose | Usage Scenario | Significance |
|---------------|---------|----------------|-------------|
| **Watch Conversations** | View all conversation lists with summary info | Check active chats, see unread counts | Foundation for managing multiple conversations |
| **Send Message** | Send encrypted text messages to recipients | Communicate with peers, share information | Core messaging functionality |
| **Send File** | Send files (compressed as ZIP) to recipients | Share documents, images, WTS/WIP files | Enables file-based communication |
| **Watch Messages** | View message history with filtering | Browse chat history, search messages | Access to complete conversation records |
| **Extract ZIP Messages** | Extract files from ZIP messages | Download and open shared files | Makes shared files accessible |
| **Generate WTS** | Create Witness Timestamped Snapshots | Preserve chat history as evidence, legal documentation | Creates verifiable chat records |
| **Verify WTS** | Check WTS file integrity and signatures | Validate chat record authenticity | Ensures WTS hasn't been tampered with |
| **Sign WTS** | Add digital signatures to WTS files | Certify chat records, legal attestation | Provides non-repudiation for WTS |
| **WTS to HTML** | Convert WTS files to readable HTML | View chat records in browser, share with others | Makes WTS human-readable |
| **Proof Message** | Create on-chain timestamp proofs for messages | Legal evidence, timestamp verification | Gives messages blockchain-level validity |
| **Blacklist Management** | Manage blocked users | Prevent spam, block unwanted contacts | Controls who can message you |
| **Friendslist Management** | Manage trusted contacts | Filter messages, organize contacts | Enables friend-based message filtering |
| **Guardlist Management** | Manage Guard verifiers | Message verification, access control | Provides message security layer |
| **Settings Management** | Manage messenger settings | Configure inbox size, stranger message preferences | Customizes messaging experience |

---

## Complete Tool Call Structure

Messenger operations use the following top-level structure:

```json
{
  "operation": "operation_type",
  // operation-specific fields
}
```

---

## Schema Tree

```
messenger_operation (Messenger Operations)
├── operation (discriminator, required)
│   ├── "watch_conversations"
│   │   └── account (optional, string)
│   ├── "send_message"
│   │   ├── from (optional, string)
│   │   ├── to (required, string | Address/Name) - Recipient can be simple string (name/address) or full object
│   │   ├── content (required, string)
│   │   └── options (optional, SendMessageOptions)
│   │       ├── guardAddress (optional, string)
│   │       ├── passportAddress (optional, string)
│   │       ├── force (optional, boolean)
│   │       └── new_messenger_name (optional, string)
│   ├── "send_file"
│   │   ├── from (optional, string)
│   │   ├── to (required, string | Address/Name) - Recipient can be simple string (name/address) or full object
│   │   ├── filePath (required, string)
│   │   └── options (optional, SendFileOptions)
│   │       ├── fileName (optional, string)
│   │       ├── contentType (optional, "wts"/"wip"/"zip")
│   │       ├── guardAddress (optional, string)
│   │       ├── passportAddress (optional, string)
│   │       ├── force (optional, boolean)
│   │       └── new_messenger_name (optional, string)
│   ├── "watch_messages"
│   │   └── filter (optional, MessageFilter)
│   │       ├── direction (optional, "sent"/"received")
│   │       ├── status (optional, "pending"/"confirmed"/"read"/"failed"/"rejected")
│   │       ├── peerAddress (optional, string | Address/Name) - Can be simple string (name/address) or full object
│   │       ├── msgType (optional, 1/3)
│   │       ├── contentType (optional, "text"/"zip"/"wts"/"wip")
│   │       ├── decryptedOnly (optional, boolean)
│   │       ├── confirmedOnly (optional, boolean)
│   │       ├── keyword (optional, string)
│   │       ├── sortOrder (optional, "asc"/"desc")
│   │       ├── limit (optional, number)
│   │       ├── offset (optional, number)
│   │       ├── hasLastReceivedIndexOnly (optional, boolean) - Only return messages with lastReceivedLeafIndex
│   │       ├── lastReceivedIndexMin (optional, number) - Min lastReceivedLeafIndex
│   │       ├── lastReceivedIndexMax (optional, number) - Max lastReceivedLeafIndex
│   │       └── account (optional, string)
│   ├── "extract_zip_messages"
│   │   ├── account (optional, string)
│   │   ├── messages (required, string[])
│   │   └── outputDir (required, string)
│   ├── "generate_wts"
│   │   └── params (required, WtsGenerationParams)
│   │       ├── myAccount (required, string) - Account name or address
│   │       ├── peerAccount (required, string | Address/Name) - Can be simple string (name/address) or full object
│   │       ├── range (optional, Range)
│   │       │   ├── type (required, "time"/"messageId"/"seqIndex")
│   │       │   ├── start (required, number/string)
│   │       │   └── end (required, number/string)
│   │       ├── excludePlaintext (optional, boolean)
│   │       └── outputDir (required, string)
│   ├── "verify_wts"
│   │   └── wtsFilePath (required, string)
│   ├── "sign_wts"
│   │   ├── wtsFilePath (required, string)
│   │   ├── account (optional, string)
│   │   └── outputPath (optional, string)
│   ├── "wts2html"
│   │   ├── wtsPath (required, string)
│   │   └── options (optional, WtsToHtmlOptions)
│   │       ├── title (optional, string)
│   │       ├── theme (optional, "light"/"dark")
│   │       └── outputPath (optional, string)
│   ├── "proof_message"
│   │   ├── account (optional, string)
│   │   ├── messageId (required, string)
│   │   └── network (optional, "localnet"/"testnet")
│   ├── "blacklist"
│   │   ├── account (optional, string)
│   │   └── blacklist (required, BlacklistOperation)
│   │       ├── op (required, "add"/"remove"/"clear"/"get"/"exist")
│   │       └── users (optional, string[] | ManyAccountOrMark_Address) - Can be array of strings (names/addresses) or full object
│   ├── "friendslist"
│   │   ├── account (optional, string)
│   │   └── friendslist (required, FriendslistOperation)
│   │       ├── op (required, "add"/"remove"/"clear"/"get"/"exist")
│   │       └── users (optional, string[] | ManyAccountOrMark_Address) - Can be array of strings (names/addresses) or full object
│   └── "guardlist"
│       ├── account (optional, string)
│       └── guardlist (required, GuardlistOperation)
│           ├── op (required, "add"/"remove"/"get")
│           └── guards (optional, GuardParam[])
│               ├── guard (required, string)
│               └── passportValiditySeconds (required, number)
│   └── "settings"
│       ├── account (optional, string)
│       └── settings (required, SettingsOperation)
│           ├── op (required, "get"/"set")
│           ├── allowStrangerMessages (optional, boolean) - for "set" operation
│           └── maxInboxSize (optional, number) - Maximum number of server-staged messages per user, for "set" operation
└── (no other top-level fields)
```

---

## Example 1: Watch Conversations

### Feature Description

View all conversation list, including peer address, last message time, total message count, unread message count, and last message preview.

### Examples

#### Example 1.1: View Default Account Conversations

**Prompt**: View all conversation list for the current default account.

```json
{
  "operation": "watch_conversations"
}
```

---

#### Example 1.2: View Specified Account Conversations

**Prompt**: View conversation list for account "my_account".

```json
{
  "operation": "watch_conversations",
  "account": "my_account"
}
```

---

## Example 2: Send Message

### Feature Description

Send encrypted text message to specified recipient.

### Examples

#### Example 2.1: Send Simple Message

**Prompt**: Send message "Hello! How are you?" from default account to "friend_account".

```json
{
  "operation": "send_message",
  "to": "friend_account",
  "content": "Hello! How are you?"
}
```

---

#### Example 2.1b: Send Using Full Object Format

**Prompt**: Send message using full object format with explicit local_mark_first control.

```json
{
  "operation": "send_message",
  "to": {
    "name_or_address": "friend_account",
    "local_mark_first": true
  },
  "content": "Hello! How are you?"
}
```

---

#### Example 2.2: Send with Sender and Options

**Prompt**: Send message from "my_account" to "bob", use Guard "message_guard" for verification, set new messenger name "my_messenger".

```json
{
  "operation": "send_message",
  "from": "my_account",
  "to": {
    "name_or_address": "bob",
    "local_mark_first": true
  },
  "content": "This is a protected message with Guard verification",
  "options": {
    "guardAddress": "message_guard",
    "new_messenger_name": "my_messenger"
  }
}
```

---

#### Example 2.3: Force Send Message

**Prompt**: Force send message to "recipient_address", ignoring any pending Guard messages.

```json
{
  "operation": "send_message",
  "to": {
    "name_or_address": "recipient_address"
  },
  "content": "This message is force-sent",
  "options": {
    "force": true
  }
}
```

**Response**: Returns send result including message ID, status, Merkle proof data, and last received leaf index.

```json
{
  "messageId": "msg_abc123",
  "status": "confirmed",
  "merkleData": {
    "leafIndex": 5,
    "prevRoot": "0xabc...",
    "newRoot": "0xdef...",
    "serverSignature": "0x123...",
    "serverTimestamp": 1704067200000,
    "serverPublicKey": "0x456..."
  },
  "lastReceivedLeafIndex": 4
}
```

---

## Example 3: Send File

### Feature Description

Send file to specified recipient. Files are compressed to ZIP format before sending.

### Examples

#### Example 3.1: Send Simple File

**Prompt**: Send file "report.pdf" to "friend_account".

```json
{
  "operation": "send_file",
  "to": "friend_account",
  "filePath": "./report.pdf"
}
```

---

#### Example 3.2: Send WIP File with Custom Name

**Prompt**: Send WIP file "service.wip" to "alice", set custom name "service_description.wip", specify content type as "wip".

```json
{
  "operation": "send_file",
  "to": "alice",
  "filePath": "./service.wip",
  "options": {
    "fileName": "service_description.wip",
    "contentType": "wip"
  }
}
```

---

#### Example 3.3: Send with Guard and Passport

**Prompt**: Send file "contract.docx" to "bob", use Guard "file_guard" and Passport "my_passport".

```json
{
  "operation": "send_file",
  "to": "bob",
  "filePath": "./contract.docx",
  "options": {
    "guardAddress": "file_guard",
    "passportAddress": "my_passport"
  }
}
```

---

## Example 4: Watch Messages

### Feature Description

View message history, supporting various filter conditions.

### Examples

#### Example 4.1: View All Messages

**Prompt**: View all messages, no filtering applied.

```json
{
  "operation": "watch_messages"
}
```

---

#### Example 4.2: Filter by Peer and Direction

**Prompt**: View all received messages from "alice", sort descending, limit to 50 messages.

```json
{
  "operation": "watch_messages",
  "filter": {
    "peerAddress": "alice",
    "direction": "received",
    "sortOrder": "desc",
    "limit": 50
  }
}
```

---

#### Example 4.3: Search by Keyword

**Prompt**: Search for messages containing "meeting", only show confirmed messages.

```json
{
  "operation": "watch_messages",
  "filter": {
    "keyword": "meeting",
    "confirmedOnly": true
  }
}
```

---

#### Example 4.4: Filter by Content Type and Friends

**Prompt**: View only WTS files from friends list, within time range.

```json
{
  "operation": "watch_messages",
  "filter": {
    "contentType": "wts",
    "listFilterMode": "friends",
    "timeField": "createdAt",
    "startTime": 1704067200000,
    "endTime": 1706745600000
  }
}
```

---

## Example 5: Extract ZIP Messages

### Feature Description

Extract and decompress ZIP format message files.

### Examples

#### Example 5.1: Extract Single Message

**Prompt**: Extract ZIP file from message "msg_001", save to "./extracted/".

```json
{
  "operation": "extract_zip_messages",
  "messages": ["msg_001"],
  "outputDir": "./extracted/"
}
```

---

#### Example 5.2: Extract Multiple Messages

**Prompt**: Extract ZIP files from messages "msg_002", "msg_003", and "msg_004", using account "my_account".

```json
{
  "operation": "extract_zip_messages",
  "account": "my_account",
  "messages": ["msg_002", "msg_003", "msg_004"],
  "outputDir": "./extracted/"
}
```

---

## Example 6: Generate WTS

### Feature Description

Generate WTS (Witness Timestamped Snapshot) file for chat history. WTS files contain complete chat records with timestamps and can be used as legal evidence.

### Examples

#### Example 6.1: Generate Complete WTS

**Prompt**: Generate complete chat history WTS between "my_account" and "peer_account", save to "./wts/".

```json
{
  "operation": "generate_wts",
  "params": {
    "myAccount": "my_account",
    "peerAccount": "peer_account",
    "outputDir": "./wts/"
  }
}
```

---

#### Example 6.2: Generate by Time Range

**Prompt**: Generate WTS for January 2024, exclude plaintext content for privacy.

```json
{
  "operation": "generate_wts",
  "params": {
    "myAccount": "my_account",
    "peerAccount": "peer_account",
    "range": {
      "type": "time",
      "start": 1704067200000,
      "end": 1706745600000
    },
    "excludePlaintext": true,
    "outputDir": "./wts/"
  }
}
```

---

#### Example 6.3: Generate by Message ID Range

**Prompt**: Generate WTS from message ID "msg_100" to "msg_200".

```json
{
  "operation": "generate_wts",
  "params": {
    "myAccount": "my_account",
    "peerAccount": "peer_account",
    "range": {
      "type": "messageId",
      "start": "msg_100",
      "end": "msg_200"
    },
    "outputDir": "./wts/"
  }
}
```

---

## Example 7: Verify WTS

### Feature Description

Verify WTS file integrity and signatures.

### Examples

#### Example 7.1: Verify WTS File

**Prompt**: Verify the WTS file at "./wts/chat_history.wts".

```json
{
  "operation": "verify_wts",
  "wtsFilePath": "./wts/chat_history.wts"
}
```

---

## Example 8: Sign WTS

### Feature Description

Sign WTS file using an account.

### Examples

#### Example 8.1: Sign with Default Account

**Prompt**: Sign the WTS file "./wts/chat_history.wts" using default account.

```json
{
  "operation": "sign_wts",
  "wtsFilePath": "./wts/chat_history.wts"
}
```

---

#### Example 8.2: Sign with Specified Account

**Prompt**: Sign WTS file using "alice" account, save to "./wts/chat_signed.wts".

```json
{
  "operation": "sign_wts",
  "wtsFilePath": "./wts/chat_history.wts",
  "account": "alice",
  "outputPath": "./wts/chat_signed.wts"
}
```

---

## Example 9: WTS to HTML

### Feature Description

Convert WTS file to HTML format for easy viewing and sharing.

### Examples

#### Example 9.1: Convert Single File

**Prompt**: Convert "./wts/chat_history.wts" to HTML with light theme.

```json
{
  "operation": "wts2html",
  "wtsPath": "./wts/chat_history.wts",
  "options": {
    "title": "Chat History with Alice",
    "theme": "light"
  }
}
```

---

#### Example 9.2: Convert and Save to File

**Prompt**: Convert "./wts/chat_history.wts" to HTML and save to "./html/" directory.

```json
{
  "operation": "wts2html",
  "wtsPath": "./wts/chat_history.wts",
  "options": {
    "title": "Chat History with Alice",
    "theme": "light",
    "outputPath": "./html/"
  }
}
```

**Response**: Returns the saved HTML file path (e.g., `"./html/chat_history.html"`).

---

#### Example 9.3: Convert Directory

**Prompt**: Convert all WTS files in "./wts/" directory, save to "./html/", use dark theme.

```json
{
  "operation": "wts2html",
  "wtsPath": "./wts/",
  "options": {
    "theme": "dark",
    "outputPath": "./html/"
  }
}
```

**Response**: Returns an array of saved HTML file paths.

---

## Example 10: Proof Message

### Feature Description

Generate on-chain timestamp proof for messages, giving them legal evidence validity.

### Examples

#### Example 10.1: Create On-chain Proof

**Prompt**: Generate on-chain proof for message "msg_12345".

```json
{
  "operation": "proof_message",
  "messageId": "msg_12345"
}
```

---

#### Example 10.2: Proof with Network

**Prompt**: Generate on-chain proof for message on testnet network using "my_account".

```json
{
  "operation": "proof_message",
  "account": "my_account",
  "messageId": "msg_12345",
  "network": "testnet"
}
```

---

## Example 11: Blacklist Management

### Feature Description

Manage blacklist, including adding, removing, clearing, viewing, and checking users.

### Examples

#### Example 11.1: Add to Blacklist

**Prompt**: Add "spam_user" to blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "add",
    "users": ["spam_user"]
  }
}
```

---

#### Example 11.2: Remove from Blacklist

**Prompt**: Remove "old_user" from blacklist using "my_account".

```json
{
  "operation": "blacklist",
  "account": "my_account",
  "blacklist": {
    "op": "remove",
    "users": ["old_user"]
  }
}
```

---

#### Example 11.3: View and Check Blacklist

**Prompt**: View current blacklist and check if "some_address" is in blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "get"
  }
}
```

---

#### Example 11.4: Clear Blacklist

**Prompt**: Clear entire blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "clear"
  }
}
```

---

#### Example 11.5: Add Multiple Users with Full Object Format

**Prompt**: Add multiple users to blacklist using full object format with explicit control.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "add",
    "users": {
      "entities": [
        { "name_or_address": "user1", "local_mark_first": true },
        { "name_or_address": "user2", "local_mark_first": false }
      ],
      "check_all_founded": true
    }
  }
}
```

---

## Example 12: Friendslist Management

### Feature Description

Manage friends list, including adding, removing, clearing, viewing, and checking users.

### Examples

#### Example 12.1: Add Friend

**Prompt**: Add "alice" to friends list.

```json
{
  "operation": "friendslist",
  "friendslist": {
    "op": "add",
    "users": ["alice"]
  }
}
```

---

#### Example 12.2: Remove Friend

**Prompt**: Remove "old_friend" from friends list.

```json
{
  "operation": "friendslist",
  "friendslist": {
    "op": "remove",
    "users": ["old_friend"]
  }
}
```

---

#### Example 12.3: View Friends List

**Prompt**: View current friends list.

```json
{
  "operation": "friendslist",
  "friendslist": {
    "op": "get"
  }
}
```

---

#### Example 12.4: Add Multiple Friends with Full Object Format

**Prompt**: Add multiple friends using full object format with explicit control.

```json
{
  "operation": "friendslist",
  "friendslist": {
    "op": "add",
    "users": {
      "entities": [
        { "name_or_address": "alice", "local_mark_first": true },
        { "name_or_address": "bob", "local_mark_first": true }
      ],
      "check_all_founded": true
    }
  }
}
```

---

## Example 13: Guardlist Management

### Feature Description

Manage Guard list, including adding, removing, and viewing Guards. Guard list is used for message verification.

---

## Example 14: Settings Management

### Feature Description

Manage messenger settings, including viewing and updating inbox size limits and stranger message preferences.

### Examples

#### Example 14.1: Get Current Settings

**Prompt**: View current messenger settings.

```json
{
  "operation": "settings",
  "settings": {
    "op": "get"
  }
}
```

**Response**: Returns current settings including server limits.

```json
{
  "allowStrangerMessages": true,
  "maxInboxSize": 20,
  "serverMinInboxSizeLimit": 20,
  "serverMaxInboxSizeLimit": 200,
  "serverDefaultAllowStrangerMessages": false
}
```

---

#### Example 14.2: Update Settings

**Prompt**: Set max inbox size to 500 and disable messages from strangers.

```json
{
  "operation": "settings",
  "settings": {
    "op": "set",
    "maxInboxSize": 500,
    "allowStrangerMessages": false
  }
}
```

---

#### Example 14.3: Update Single Setting

**Prompt**: Only update max inbox size to 2000.

```json
{
  "operation": "settings",
  "account": "my_account",
  "settings": {
    "op": "set",
    "maxInboxSize": 2000
  }
}
```

---

#### Example 14.4: Enable Stranger Messages

**Prompt**: Allow receiving messages from strangers.

```json
{
  "operation": "settings",
  "settings": {
    "op": "set",
    "allowStrangerMessages": true
  }
}
```

### Examples

#### Example 13.1: Add Guard

**Prompt**: Add "message_guard" to Guard list, Passport validity is 1 hour (3600 seconds).

```json
{
  "operation": "guardlist",
  "guardlist": {
    "op": "add",
    "guards": [
      {
        "guard": "message_guard",
        "passportValiditySeconds": 3600
      }
    ]
  }
}
```

---

#### Example 13.2: Add Multiple Guards

**Prompt**: Add multiple Guards with different validity periods: 1 hour and 1 day (86400 seconds).

```json
{
  "operation": "guardlist",
  "guardlist": {
    "op": "add",
    "guards": [
      {
        "guard": "guard1",
        "passportValiditySeconds": 3600
      },
      {
        "guard": "guard2",
        "passportValiditySeconds": 86400
      }
    ]
  }
}
```

---

#### Example 13.3: Remove and View Guards

**Prompt**: Remove "old_guard" from Guard list, then view current Guard list.

```json
{
  "operation": "guardlist",
  "guardlist": {
    "op": "remove",
    "guards": ["old_guard"]
  }
}
```

---

## Important Notes

⚠️ **All messages are end-to-end encrypted** - only sender and recipient can read message content.

⚠️ **WIP and WTS files can be sent via messenger** - use contentType hint for better handling.

⚠️ **Guardlist provides message verification** - messages from guarded senders require verification.

⚠️ **Blacklist prevents messages from blocked users** - users in blacklist cannot send you messages.

⚠️ **Friendslist can filter messages** - use listFilterMode: "friends" in watch_messages.

⚠️ **WTS files are legally verifiable** - contains complete timestamps and signatures.

⚠️ **Passport validity for Guards must be between 10 seconds and 10 years** (315360000 seconds).

⚠️ **On-chain proof creates blockchain timestamp** - gives messages legal evidence validity.

---

## Related Components

| Component | Description |
|-----------|-------------|
| **WIP** | Work files - can send WIP files via messenger |
| **[Personal](personal.md)** | Personal on-chain portal - public identity |
| **[Contact](contact.md)** | Public contact information - communication hub |
| **[Query](query.md)** | Data query |
| **[Guard](guard.md)** | Trust verification engine |
| **Passport** | Verified credentials |
