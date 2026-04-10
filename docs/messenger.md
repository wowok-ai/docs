# Messenger Component (💬 Encrypted Messaging System)

---

## Component Overview

The Messenger component is used for WoWok encrypted message management, including conversation list viewing, sending messages/files, viewing message history, WTS (Witness Timestamped Snapshot) generation, verification, and signing, on-chain proof, blacklist/friendslist/guardlist management, etc.

---

## Complete Tool Call Structure

## Function Tree

```
messenger (Messenger Operations)
├── operation (operation type, discriminator)
│   ├── operation: "watch_conversations" (View conversation list)
│   │   └── account (optional account name or address)
│   ├── operation: "send_message" (Send text message)
│   │   ├── from (optional sender account)
│   │   ├── to (recipient address or account name object)
│   │   │   ├── name_or_address (optional, account name or address)
│   │   │   └── local_mark_first (optional, whether to search local marks first)
│   │   ├── content (message content text)
│   │   └── options (optional message settings)
│   │       ├── guardAddress (optional Guard address)
│   │       ├── passportAddress (optional Passport address)
│   │       ├── force (optional force send)
│   │       └── new_messenger_name (optional new messenger name)
│   ├── operation: "send_file" (Send file)
│   │   ├── from (optional sender account)
│   │   ├── to (recipient address or account name object)
│   │   │   ├── name_or_address (optional, account name or address)
│   │   │   └── local_mark_first (optional, whether to search local marks first)
│   │   ├── filePath (local file path)
│   │   └── options (optional file send settings)
│   │       ├── fileName (optional custom file name)
│   │       ├── contentType (optional content type hint: wts/wip/zip)
│   │       ├── guardAddress (optional Guard address)
│   │       ├── passportAddress (optional Passport address)
│   │       ├── force (optional force send)
│   │       └── new_messenger_name (optional new messenger name)
│   ├── operation: "watch_messages" (View messages)
│   │   └── filter (optional message filter options)
│   │       ├── direction (optional filter by message direction)
│   │       ├── status (optional filter by message status)
│   │       ├── peerAddress (optional filter by peer address object)
│   │       │   ├── name_or_address (optional, account name or address)
│   │       │   └── local_mark_first (optional, whether to search local marks first)
│   │       ├── msgType (optional filter by message type)
│   │       ├── contentType (optional filter by content type)
│   │       ├── decryptedOnly (optional only return decrypted messages)
│   │       ├── confirmedOnly (optional only return confirmed messages)
│   │       ├── keyword (optional search keyword)
│   │       ├── sortOrder (optional sort order: asc/desc)
│   │       ├── limit (optional return limit)
│   │       ├── offset (optional pagination offset)
│   │       ├── timeField (optional time filter field)
│   │       ├── startTime (optional start timestamp)
│   │       ├── endTime (optional end timestamp)
│   │       ├── createdAtStart (optional creation start time)
│   │       ├── createdAtEnd (optional creation end time)
│   │       ├── receivedAtStart (optional receive start time)
│   │       ├── receivedAtEnd (optional receive end time)
│   │       ├── serverTimestampStart (optional server timestamp start)
│   │       ├── serverTimestampEnd (optional server timestamp end)
│   │       ├── arkConfirmedOnly (optional only return ARK confirmed messages)
│   │       ├── arkTimestampStart (optional ARK timestamp start)
│   │       ├── arkTimestampEnd (optional ARK timestamp end)
│   │       ├── proofedOnly (optional only return proofed messages)
│   │       ├── hasLastReceivedIndexOnly (optional only return messages with lastReceivedIndex)
│   │       ├── lastReceivedIndexMin (optional minimum lastReceivedIndex)
│   │       ├── lastReceivedIndexMax (optional maximum lastReceivedIndex)
│   │       ├── listFilterMode (optional list filter mode: friends/guard/stranger/any)
│   │       ├── customListFilter (optional custom list filter)
│   │       │   ├── includeAddresses (optional include addresses)
│   │       │   ├── excludeAddresses (optional exclude addresses)
│   │       │   └── relation (optional address list relation: union/intersection)
│   │       └── account (optional account to filter messages)
│   ├── operation: "extract_zip_messages" (Extract ZIP messages)
│   │   ├── account (optional account name or address)
│   │   ├── messages (message objects or message ID array)
│   │   └── outputDir (output directory path)
│   ├── operation: "generate_wts" (Generate WTS)
│   │   └── params (WTS generation parameters)
│   │       ├── myAccount (my account name or address)
│   │       ├── peerAccount (peer account or address)
│   │       ├── range (optional range filter parameters)
│   │       │   ├── type (range type: time/messageId/seqIndex)
│   │       │   ├── start (start value)
│   │       │   └── end (end value)
│   │       ├── excludePlaintext (optional whether to exclude plaintext)
│   │       └── outputDir (output directory path)
│   ├── operation: "verify_wts" (Verify WTS)
│   │   └── wtsFilePath (WTS file path to verify)
│   ├── operation: "sign_wts" (Sign WTS)
│   │   ├── wtsFilePath (WTS file path to sign)
│   │   ├── account (optional signing account)
│   │   └── outputPath (optional output file path)
│   ├── operation: "wts2html" (WTS to HTML)
│   │   ├── wtsPath (WTS file path or directory)
│   │   └── options (optional conversion options)
│   │       ├── title (optional HTML document title)
│   │       ├── theme (optional HTML theme: light/dark)
│   │       └── outputPath (optional output file path)
│   ├── operation: "proof_message" (On-chain proof message)
│   │   ├── account (optional account name or address)
│   │   ├── messageId (message ID to proof)
│   │   └── network (optional network to use)
│   ├── operation: "blacklist" (Blacklist management)
│   │   ├── account (optional account name or address)
│   │   └── blacklist (blacklist management operations)
│   │       ├── op (operation type: add/remove/clear/get/exist)
│   │       └── users (users to add/remove/check)
│   ├── operation: "friendslist" (Friends list management)
│   │   ├── account (optional account name or address)
│   │   └── friendslist (friends list management operations)
│   │       ├── op (operation type: add/remove/clear/get/exist)
│   │       └── users (users to add/remove/check)
│   └── operation: "guardlist" (Guard list management)
│       ├── account (optional account name or address)
│       └── guardlist (Guard list management operations)
│           ├── op (operation type: add/remove/get)
│           └── guards (Guards to add/remove)
│               ├── guard (Guard address or name)
│               └── passportValiditySeconds (Passport validity in seconds)
```

---

## Sub-function 1: View Conversation List (operation: "watch_conversations")

### Function Description

View all conversation list, including peer address, last message time, total message count, unread message count, and last message preview.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "watch_conversations" |
| `account` | string | No | Account name or address | If not specified, use default account |

### Important Notes

⚠️ **Conversation list**: Sorted by last message time, newest conversations first.

⚠️ **Unread count**: Unread message count updates in real-time.

### Return Results

Returns conversation information array, each conversation contains:
- `peerAddress`: Peer address
- `lastMessageAt`: Last message time
- `messageCount`: Total message count
- `unreadCount`: Unread message count
- `lastMessagePreview`: Last message preview (optional)

---

### Examples

#### Example 1.1: View default account's conversation list

**Prompt**: View all conversation list for the current default account.

```json
{
  "operation": "watch_conversations"
}
```

---

#### Example 1.2: View specified account's conversation list

**Prompt**: View conversation list for account "my_account".

```json
{
  "operation": "watch_conversations",
  "account": "my_account"
}
```

---

## Sub-function 2: Send Text Message (operation: "send_message")

### Function Description

Send encrypted text message to specified recipient.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "send_message" |
| `from` | string | No | Sender account name or address | If not specified, use default account |
| `to` | object | Yes | Recipient address or account name object | Contains name_or_address and local_mark_first fields |
| `to.name_or_address` | string | No | Account name or address | If not specified, use default account |
| `to.local_mark_first` | boolean | No | Whether to search local marks first | true=local marks first, false=global marks first |
| `content` | string | Yes | Message content text | Max length 10000 characters |
| `options` | object | No | Optional message settings |  |
| `options.guardAddress` | string | No | Guard address or name |  |
| `options.passportAddress` | string | No | Passport address or name |  |
| `options.force` | boolean | No | Force send | Force send even if there are pending Guard messages |
| `options.new_messenger_name` | string | No | New messenger name | Set new messenger name for recipient |

### Important Notes

⚠️ **Message encryption**: All messages are end-to-end encrypted.

⚠️ **Guard protection**: If guardAddress is set, messages need to pass Guard verification before sending.

⚠️ **Force send**: force=true skips pending Guard message checks.

### Return Results

Returns message send result, contains:
- `messageId`: Message ID
- `status`: Message status
- `merkleData`: Merkle Tree proof data (optional)
- `guardList`: Guard list (only returned on error)

---

### Examples

#### Example 2.1: Send simple text message

**Prompt**: Send message "Hello!" from default account to "friend_account".

```json
{
  "operation": "send_message",
  "to": {
    "name_or_address": "friend_account"
  },
  "content": "Hello!"
}
```

---

#### Example 2.2: Specify sender account

**Prompt**: Send message from "my_account" to "recipient_address".

```json
{
  "operation": "send_message",
  "from": "my_account",
  "to": {
    "name_or_address": "recipient_address"
  },
  "content": "This is a message"
}
```

---

#### Example 2.3: Message with Guard

**Prompt**: Send message requiring Guard verification, using "message_guard" Guard.

```json
{
  "operation": "send_message",
  "to": {
    "name_or_address": "recipient_address"
  },
  "content": "This is a protected message",
  "options": {
    "guardAddress": "message_guard"
  }
}
```

---

#### Example 2.4: Force send message

**Prompt**: Force send message, ignoring pending Guard messages.

```json
{
  "operation": "send_message",
  "to": {
    "name_or_address": "recipient_address"
  },
  "content": "Force sent message",
  "options": {
    "force": true
  }
}
```

---

#### Example 2.5: Message with full options

**Prompt**: Send message with Guard, Passport, and new messenger name.

```json
{
  "operation": "send_message",
  "from": "my_account",
  "to": {
    "name_or_address": "recipient_address",
    "local_mark_first": true
  },
  "content": "Message with full options",
  "options": {
    "guardAddress": "message_guard",
    "passportAddress": "my_passport",
    "new_messenger_name": "my_messenger_name"
  }
}
```

---

## Sub-function 3: Send File (operation: "send_file")

### Function Description

Send file to specified recipient. Files are compressed to ZIP format before sending.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "send_file" |
| `from` | string | No | Sender account name or address | If not specified, use default account |
| `to` | object | Yes | Recipient address or account name object | Contains name_or_address and local_mark_first fields |
| `to.name_or_address` | string | No | Account name or address | If not specified, use default account |
| `to.local_mark_first` | boolean | No | Whether to search local marks first | true=local marks first, false=global marks first |
| `filePath` | string | Yes | Local file path | File will be compressed to ZIP before sending |
| `options` | object | No | Optional file send settings |  |
| `options.fileName` | string | No | Custom file name |  |
| `options.contentType` | enum | No | Content type hint | "wts", "wip", or "zip" |
| `options.guardAddress` | string | No | Guard address or name |  |
| `options.passportAddress` | string | No | Passport address or name |  |
| `options.force` | boolean | No | Force send | Force send even if there are pending Guard messages |
| `options.new_messenger_name` | string | No | New messenger name | Set new messenger name for recipient |

### Important Notes

⚠️ **File compression**: All files are compressed to ZIP format before sending.

⚠️ **Content type**: contentType is just a hint, does not affect actual file format.

⚠️ **Guard protection**: Same as text messages, supports Guard verification.

### Return Results

Same return result format as sending text messages.

---

### Examples

#### Example 3.1: Send simple file

**Prompt**: Send file document.pdf to "friend_account".

```json
{
  "operation": "send_file",
  "to": {
    "name_or_address": "friend_account"
  },
  "filePath": ".../document.pdf"
}
```

---

#### Example 3.2: Custom file name

**Prompt**: Send file with custom file name "my_report.zip".

```json
{
  "operation": "send_file",
  "to": {
    "name_or_address": "friend_account"
  },
  "filePath": ".../document.pdf",
  "options": {
    "fileName": "my_report.zip"
  }
}
```

---

#### Example 3.3: Send WIP file

**Prompt**: Send WIP file, specify content type as "wip".

```json
{
  "operation": "send_file",
  "to": {
    "name_or_address": "friend_account"
  },
  "filePath": ".../document.wip",
  "options": {
    "contentType": "wip"
  }
}
```

---

#### Example 3.4: File with Guard

**Prompt**: Send Guard-protected file.

```json
{
  "operation": "send_file",
  "to": {
    "name_or_address": "recipient_address"
  },
  "filePath": ".../secret.doc",
  "options": {
    "guardAddress": "file_guard",
    "force": false
  }
}
```

---

## Sub-function 4: View Messages (operation: "watch_messages")

### Function Description

View message history, supporting various filter conditions.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "watch_messages" |
| `filter` | object | No | Message filter options |  |
| `filter.direction` | enum | No | Filter by message direction | "sent" or "received" |
| `filter.status` | enum | No | Filter by message status | "pending", "confirmed", "read", "failed", "rejected" |
| `filter.peerAddress` | object | No | Filter by peer address object | Contains name_or_address and local_mark_first fields |
| `filter.peerAddress.name_or_address` | string | No | Account name or address | If not specified, use default account |
| `filter.peerAddress.local_mark_first` | boolean | No | Whether to search local marks first | true=local marks first, false=global marks first |
| `filter.msgType` | enum | No | Filter by message type | 1 or 3 |
| `filter.contentType` | enum | No | Filter by content type | "text", "zip", "wts", "wip" |
| `filter.decryptedOnly` | boolean | No | Only return decrypted messages |  |
| `filter.confirmedOnly` | boolean | No | Only return confirmed messages |  |
| `filter.keyword` | string | No | Search keyword | Search in plaintext |
| `filter.sortOrder` | enum | No | Sort order | "asc" or "desc" |
| `filter.limit` | number | No | Return limit |  |
| `filter.offset` | number | No | Pagination offset |  |
| `filter.timeField` | enum | No | Time filter field | "createdAt", "receivedAt", "serverTimestamp" |
| `filter.startTime` | number | No | Start timestamp (milliseconds) |  |
| `filter.endTime` | number | No | End timestamp (milliseconds) |  |
| `filter.createdAtStart` | number | No | Creation start time |  |
| `filter.createdAtEnd` | number | No | Creation end time |  |
| `filter.receivedAtStart` | number | No | Receive start time |  |
| `filter.receivedAtEnd` | number | No | Receive end time |  |
| `filter.serverTimestampStart` | number | No | Server timestamp start |  |
| `filter.serverTimestampEnd` | number | No | Server timestamp end |  |
| `filter.arkConfirmedOnly` | boolean | No | Only return ARK confirmed messages |  |
| `filter.arkTimestampStart` | number | No | ARK timestamp start |  |
| `filter.arkTimestampEnd` | number | No | ARK timestamp end |  |
| `filter.proofedOnly` | boolean | No | Only return proofed messages |  |
| `filter.hasLastReceivedIndexOnly` | boolean | No | Only return messages with lastReceivedIndex |  |
| `filter.lastReceivedIndexMin` | number | No | Minimum lastReceivedIndex |  |
| `filter.lastReceivedIndexMax` | number | No | Maximum lastReceivedIndex |  |
| `filter.listFilterMode` | enum | No | List filter mode | "friends", "guard", "stranger", "any" |
| `filter.customListFilter` | object | No | Custom list filter |  |
| `filter.customListFilter.includeAddresses` | array | No | Include addresses |  |
| `filter.customListFilter.excludeAddresses` | array | No | Exclude addresses |  |
| `filter.customListFilter.relation` | enum | No | Address list relation | "union" or "intersection" |
| `filter.account` | string | No | Account to filter messages |  |

### Important Notes

⚠️ **Multi-condition filtering**: Can use multiple filter conditions simultaneously, they have AND relationship.

⚠️ **Pagination support**: Use limit and offset for paginated queries.

⚠️ **Time filtering**: Can use startTime/endTime with timeField, or use specific time field filtering.

### Return Results

Returns message object array, each message contains complete message information.

---

### Examples

#### Example 4.1: View all messages

**Prompt**: View all messages, no filtering.

```json
{
  "operation": "watch_messages"
}
```

---

#### Example 4.2: View messages with specific user

**Prompt**: View all messages with "friend_address".

```json
{
  "operation": "watch_messages",
  "filter": {
    "peerAddress": {
      "name_or_address": "friend_address"
    }
  }
}
```

---

#### Example 4.3: View received messages

**Prompt**: Only view received messages.

```json
{
  "operation": "watch_messages",
  "filter": {
    "direction": "received"
  }
}
```

---

#### Example 4.4: Search keyword

**Prompt**: Search for messages containing "hello".

```json
{
  "operation": "watch_messages",
  "filter": {
    "keyword": "hello"
  }
}
```

---

#### Example 4.5: Paginated query

**Prompt**: Query the most recent 50 messages, sorted by time descending.

```json
{
  "operation": "watch_messages",
  "filter": {
    "sortOrder": "desc",
    "limit": 50,
    "offset": 0
  }
}
```

---

#### Example 4.6: Time range filter

**Prompt**: View messages between January 1, 2024 and January 31, 2024.

```json
{
  "operation": "watch_messages",
  "filter": {
    "timeField": "createdAt",
    "startTime": 1704067200000,
    "endTime": 1706745600000
  }
}
```

---

#### Example 4.7: Only view friends' messages

**Prompt**: Only view messages from users in friends list.

```json
{
  "operation": "watch_messages",
  "filter": {
    "listFilterMode": "friends"
  }
}
```

---

#### Example 4.8: Custom list filter

**Prompt**: View messages from specific addresses while excluding certain addresses.

```json
{
  "operation": "watch_messages",
  "filter": {
    "customListFilter": {
      "includeAddresses": ["friend1", "friend2"],
      "excludeAddresses": ["blocked_user"],
      "relation": "union"
    }
  }
}
```

---

## Sub-function 5: Extract ZIP Messages (operation: "extract_zip_messages")

### Function Description

Extract and decompress ZIP format message files.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "extract_zip_messages" |
| `account` | string | No | Account name or address | If not specified, use default account |
| `messages` | array/object | Yes | Message objects or message ID array |  |
| `outputDir` | string | Yes | Output directory path |  |

### Return Results

Returns extraction result, contains:
- `extractedFiles`: List of extracted file paths
- `totalSize`: Total extracted size

---

### Examples

#### Example 5.1: Extract single message

**Prompt**: Extract ZIP file from message "msg_123".

```json
{
  "operation": "extract_zip_messages",
  "messages": ["msg_123"],
  "outputDir": "./extracted/"
}
```

---

#### Example 5.2: Extract multiple messages

**Prompt**: Extract ZIP files from multiple messages.

```json
{
  "operation": "extract_zip_messages",
  "messages": ["msg_001", "msg_002", "msg_003"],
  "outputDir": "./extracted/"
}
```

---

## Sub-function 6: Generate WTS (operation: "generate_wts")

### Function Description

Generate WTS (Witness Timestamped Snapshot) file for chat history. WTS files contain complete chat records with timestamps and can be used as legal evidence.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "generate_wts" |
| `params` | object | Yes | WTS generation parameters |  |
| `params.myAccount` | string | Yes | My account name or address |  |
| `params.peerAccount` | string | Yes | Peer account or address |  |
| `params.range` | object | No | Range filter parameters |  |
| `params.range.type` | enum | Yes | Range type | "time", "messageId", or "seqIndex" |
| `params.range.start` | number/string | Yes | Start value | Type varies based on type |
| `params.range.end` | number/string | Yes | End value | Type varies based on type |
| `params.excludePlaintext` | boolean | No | Whether to exclude plaintext |  |
| `params.outputDir` | string | Yes | Output directory path |  |

### Important Notes

⚠️ **Range types**:
- `time`: By timestamp range (milliseconds)
- `messageId`: By message ID range
- `seqIndex`: By sequence index range

⚠️ **Exclude plaintext**: When excludePlaintext=true, WTS does not contain message plaintext content.

### Return Results

Returns WTS file generation result, contains:
- `files`: Array of generated WTS file paths
- `totalMessageCount`: Total message count
- `timeRange`: Time range

---

### Examples

#### Example 6.1: Generate complete WTS

**Prompt**: Generate complete chat history WTS with "peer_account".

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

#### Example 6.2: Generate by time range

**Prompt**: Generate chat history WTS for January 2024.

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
    "outputDir": "./wts/"
  }
}
```

---

#### Example 6.3: Generate by message ID range

**Prompt**: Generate WTS from message ID "msg_001" to "msg_100".

```json
{
  "operation": "generate_wts",
  "params": {
    "myAccount": "my_account",
    "peerAccount": "peer_account",
    "range": {
      "type": "messageId",
      "start": "msg_001",
      "end": "msg_100"
    },
    "outputDir": "./wts/"
  }
}
```

---

#### Example 6.4: Exclude plaintext

**Prompt**: Generate WTS but do not include message plaintext content.

```json
{
  "operation": "generate_wts",
  "params": {
    "myAccount": "my_account",
    "peerAccount": "peer_account",
    "excludePlaintext": true,
    "outputDir": "./wts/"
  }
}
```

---

## Sub-function 7: Verify WTS (operation: "verify_wts")

### Function Description

Verify WTS file integrity and signatures.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "verify_wts" |
| `wtsFilePath` | string | Yes | WTS file path to verify |  |

### Important Notes

⚠️ **Verification content**: Includes hash verification and signature verification (if signatures exist).

### Return Results

Returns WTS verification result, contains:
- `valid`: Whether overall verification passed
- `error`: Error message (when verification fails)
- `hashValid`: Whether hash verification passed (optional)
- `hasSignature`: Whether has signature (optional)
- `signatureValid`: Whether signature verification passed (optional)
- `signatures`: Signature verification details list (optional)

---

### Examples

#### Example 7.1: Verify WTS file

**Prompt**: Verify wts/chat.wts file.

```json
{
  "operation": "verify_wts",
  "wtsFilePath": "./wts/chat.wts"
}
```

---

## Sub-function 8: Sign WTS (operation: "sign_wts")

### Function Description

Sign WTS file using an account.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "sign_wts" |
| `wtsFilePath` | string | Yes | WTS file path to sign |  |
| `account` | string | No | Signing account | Account name or address, if not specified, use default account |
| `outputPath` | string | No | Output file path | If not specified, save as signed_*.wts |

### Important Notes

⚠️ **Verify before sign**: Files are verified before signing.

⚠️ **Multi-signature support**: WTS supports multiple signatures.

### Return Results

Returns signed WTS file path.

---

### Examples

#### Example 8.1: Sign with default account

**Prompt**: Sign WTS file using default account.

```json
{
  "operation": "sign_wts",
  "wtsFilePath": "./wts/chat.wts"
}
```

---

#### Example 8.2: Specify account and output path

**Prompt**: Sign WTS using "my_account", save to specified path.

```json
{
  "operation": "sign_wts",
  "wtsFilePath": "./wts/chat.wts",
  "account": "my_account",
  "outputPath": "./wts/chat_signed.wts"
}
```

---

## Sub-function 9: WTS to HTML (operation: "wts2html")

### Function Description

Convert WTS file to HTML format for easy viewing and sharing.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "wts2html" |
| `wtsPath` | string | Yes | WTS file path or directory | Supports single file or directory containing WTS files |
| `options` | object | No | Conversion options |  |
| `options.title` | string | No | HTML document title |  |
| `options.theme` | enum | No | HTML theme | "light" or "dark" |
| `options.outputPath` | string | No | Output file path |  |

### Important Notes

⚠️ **Directory handling**: If wtsPath is a directory, all WTS files in the directory will be converted.

### Return Results

Single file conversion returns HTML string or file path; directory conversion returns file path array.

---

### Examples

#### Example 9.1: Convert single WTS file

**Prompt**: Convert wts/chat.wts to HTML.

```json
{
  "operation": "wts2html",
  "wtsPath": "./wts/chat.wts"
}
```

---

#### Example 9.2: Convert and save

**Prompt**: Convert WTS and save to specified path, set title and theme.

```json
{
  "operation": "wts2html",
  "wtsPath": "./wts/chat.wts",
  "options": {
    "title": "Chat History",
    "theme": "light",
    "outputPath": "./wts/chat.html"
  }
}
```

---

#### Example 9.3: Convert entire directory

**Prompt**: Convert all WTS files in wts/ directory.

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

---

## Sub-function 10: On-chain Proof Message (operation: "proof_message")

### Function Description

Generate on-chain timestamp proof for messages, giving them legal evidence validity.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "proof_message" |
| `account` | string | No | Account name or address | If not specified, use default account |
| `messageId` | string | Yes | Message ID to proof |  |
| `network` | enum | No | Network to use | "localnet" or "testnet" |

### Important Notes

⚠️ **On-chain operation**: This operation creates a proof object on the blockchain, requiring network fees.

⚠️ **Immutable**: Once on-chain proof is created, it cannot be tampered with.

### Return Results

Returns on-chain proof result, contains:
- `proofAddress`: On-chain proof object address

---

### Examples

#### Example 10.1: Generate on-chain proof

**Prompt**: Generate on-chain proof for message "msg_12345".

```json
{
  "operation": "proof_message",
  "messageId": "msg_12345"
}
```

---

#### Example 10.2: Specify network

**Prompt**: Generate on-chain proof for message on testnet network.

```json
{
  "operation": "proof_message",
  "account": "my_account",
  "messageId": "msg_12345",
  "network": "testnet"
}
```

---

## Sub-function 11: Blacklist Management (operation: "blacklist")

### Function Description

Manage blacklist, including adding, removing, clearing, viewing, and checking users.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "blacklist" |
| `account` | string | No | Account name or address | If not specified, use default account |
| `blacklist` | object | Yes | Blacklist management operations |  |
| `blacklist.op` | enum | Yes | Operation type | "add", "remove", "clear", "get", "exist" |
| `blacklist.users` | array | No | Users to add/remove/check | Required when op is add/remove/exist |

### Important Notes

⚠️ **Blacklist effect**: Users in blacklist cannot send messages to you.

⚠️ **Operation types**:
- `add`: Add user to blacklist
- `remove`: Remove user from blacklist
- `clear`: Clear blacklist
- `get`: Get blacklist
- `exist`: Check if user is in blacklist

### Return Results

Returns list operation response, contains success status, operation type, modified count, etc.

---

### Examples

#### Example 11.1: Add user to blacklist

**Prompt**: Add "spam_address" to blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "add",
    "users": ["spam_address"]
  }
}
```

---

#### Example 11.2: Remove user from blacklist

**Prompt**: Remove "old_address" from blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "remove",
    "users": ["old_address"]
  }
}
```

---

#### Example 11.3: View blacklist

**Prompt**: View current blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "get"
  }
}
```

---

#### Example 11.4: Check if user is in blacklist

**Prompt**: Check if "some_address" is in blacklist.

```json
{
  "operation": "blacklist",
  "blacklist": {
    "op": "exist",
    "users": ["some_address"]
  }
}
```

---

#### Example 11.5: Clear blacklist

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

#### Example 11.6: Batch operations

**Prompt**: Batch add multiple users to blacklist.

```json
{
  "operation": "blacklist",
  "account": "my_account",
  "blacklist": {
    "op": "add",
    "users": ["spam1", "spam2", "spam3"]
  }
}
```

---

## Sub-function 12: Friends List Management (operation: "friendslist")

### Function Description

Manage friends list, including adding, removing, clearing, viewing, and checking users.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "friendslist" |
| `account` | string | No | Account name or address | If not specified, use default account |
| `friendslist` | object | Yes | Friends list management operations |  |
| `friendslist.op` | enum | Yes | Operation type | "add", "remove", "clear", "get", "exist" |
| `friendslist.users` | array | No | Users to add/remove/check | Required when op is add/remove/exist |

### Important Notes

⚠️ **Friends list**: Can be used to filter messages (listFilterMode: "friends").

⚠️ **Operation types**: Same as blacklist.

### Return Results

Same return result format as blacklist operations.

---

### Examples

#### Example 12.1: Add friend

**Prompt**: Add "friend_address" to friends list.

```json
{
  "operation": "friendslist",
  "friendslist": {
    "op": "add",
    "users": ["friend_address"]
  }
}
```

---

#### Example 12.2: Remove friend

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

#### Example 12.3: View friends list

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

## Sub-function 13: Guard List Management (operation: "guardlist")

### Function Description

Manage Guard list, including adding, removing, and viewing Guards. Guard list is used for message verification.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `operation` | string | Yes | Operation type | Fixed value "guardlist" |
| `account` | string | No | Account name or address | If not specified, use default account |
| `guardlist` | object | Yes | Guard list management operations |  |
| `guardlist.op` | enum | Yes | Operation type | "add", "remove", "get" |
| `guardlist.guards` | array | No | Guards to add/remove | Required when op is add/remove |
| `guardlist.guards[].guard` | string | Yes | Guard address or name |  |
| `guardlist.guards[].passportValiditySeconds` | number | Yes | Passport validity in seconds | 10 seconds to 10 years (315360000 seconds) |

### Important Notes

⚠️ **Guard list**: Guards in the Guard list are used to verify received messages.

⚠️ **Passport validity**: Must specify Passport validity when adding Guard.

⚠️ **Operation types**:
- `add`: Add Guard to list
- `remove`: Remove Guard from list
- `get`: Get Guard list

### Return Results

Returns list operation response, contains Guard list details.

---

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

#### Example 13.2: Add multiple Guards

**Prompt**: Add multiple Guards, set different validity periods.

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

#### Example 13.3: Remove Guard

**Prompt**: Remove "old_guard" from Guard list.

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

#### Example 13.4: View Guard list

**Prompt**: View current Guard list.

```json
{
  "operation": "guardlist",
  "guardlist": {
    "op": "get"
  }
}
```

---

## Related Components

- **WIP**: Work files - can send WIP files
- **Personal**: Public identity
- **Contact**: Communication hub
- **WatchQuery**: Data query
