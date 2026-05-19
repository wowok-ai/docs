# Schema: messenger_operation

> WoWok encrypted messenger operations: watch conversations (with unread filtering, preview messages), send message, send file, watch messages (with viewed status filtering), extract zip messages, generate WTS, verify WTS, sign WTS, WTS to HTML, proof message on-chain, manage blacklist, friendslist, guardlist, settings, mark messages as viewed, and mark conversation as viewed.

---

## Top-Level Structure

```typescript
MessengerOperation {
  operation: string;            // One of 16 operation types (see below)
  // Operation-specific fields
  ...
}
```

---

## Operation Types

### watch_conversations

Watch conversations with unread filtering and preview messages.

```typescript
WatchConversations {
  operation: "watch_conversations";
  filter?: ConversationsFilter;
}

ConversationsFilter {
  account?: string;             // Account name or address. Empty = default
  unreadOnly?: boolean;         // Only return conversations with unread messages
  startTime?: number;           // Filter by lastMessageAt >= value (ms)
  endTime?: number;             // Filter by lastMessageAt <= value (ms)
  previewMessageCount?: number; // Number of preview messages (default: 2)
  sortBy?: "lastMessageAt" | "unreadCount" | "messageCount";
  sortOrder?: "asc" | "desc";
  skipAutoMarkViewed?: boolean; // Don't auto-mark preview messages as viewed
}
```

**Result**:

```typescript
ConversationInfo[] {
  peerAddress: string;          // Peer address
  lastMessageAt: number;        // Last message time
  messageCount: number;         // Total message count
  unreadCount: number;          // Unviewed message count
  lastMessagePreview?: string;  // Last message preview text
  previewMessages?: Message[];  // Preview messages
}
```

---

### send_message

Send encrypted message to a peer.

```typescript
SendMessage {
  operation: "send_message";
  from?: string;                // Sender account. Empty = default
  to: string | { name_or_address?: string; local_mark_first?: boolean };
  content: string;              // Message content (max 10000 chars)
  options?: SendMessageOptions;
}

SendMessageOptions {
  guardAddress?: string;        // Guard address for verification
  passportAddress?: string;     // Passport address
  force?: boolean;              // Force send even with pending Guard messages
  new_messenger_name?: string;  // New messenger name for recipient
}
```

**Result**:

```typescript
SendMessageResult {
  messageId: string;
  status: "pending" | "confirmed" | "read" | "failed" | "rejected" | "decrypted" | "decrypt_failed";
  merkleData?: {
    leafIndex: number;
    prevRoot: string;
    newRoot: string;
    serverSignature: string;
    serverTimestamp: number;
    serverPublicKey: string;
  };
  guardList?: string[];         // Only on error
  lastReceivedLeafIndex?: number;
}
```

---

### send_file

Send file as encrypted ZIP message.

```typescript
SendFile {
  operation: "send_file";
  from?: string;                // Sender account. Empty = default
  to: string | { name_or_address?: string; local_mark_first?: boolean };
  filePath: string;             // Local file path
  options?: SendFileOptions;
}

SendFileOptions {
  fileName?: string;            // Custom file name
  contentType?: "wts" | "wip" | "zip";
  guardAddress?: string;
  passportAddress?: string;
  force?: boolean;
  new_messenger_name?: string;
}
```

**Result**: `SendMessageResult`

---

### watch_messages

Watch messages with viewed status filtering.

```typescript
WatchMessages {
  operation: "watch_messages";
  filter?: MessageFilter;
}

MessageFilter {
  account?: string;             // Account to filter for
  direction?: "sent" | "received";
  status?: "pending" | "confirmed" | "read" | "failed" | "rejected" | "decrypted" | "decrypt_failed";
  peerAddress?: string | { name_or_address?: string; local_mark_first?: boolean };
  msgType?: 1 | 3;
  contentType?: "text" | "zip" | "wts" | "wip";
  decryptedOnly?: boolean;
  confirmedOnly?: boolean;
  keyword?: string;             // Search in plaintext
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  timeField?: "createdAt" | "receivedAt" | "serverTimestamp";
  startTime?: number;
  endTime?: number;
  createdAtStart?: number;
  createdAtEnd?: number;
  receivedAtStart?: number;
  receivedAtEnd?: number;
  serverTimestampStart?: number;
  serverTimestampEnd?: number;
  arkConfirmedOnly?: boolean;
  arkTimestampStart?: number;
  arkTimestampEnd?: number;
  proofedOnly?: boolean;
  hasLastReceivedIndexOnly?: boolean;
  lastReceivedIndexMin?: number;
  lastReceivedIndexMax?: number;
  listFilterMode?: "friends" | "guard" | "stranger" | "any";
  customListFilter?: {
    includeAddresses?: string[];
    excludeAddresses?: string[];
    relation?: "union" | "intersection";
  };
  viewed?: boolean;             // true = viewed only, false = unviewed only
  viewedAtStart?: number;
  viewedAtEnd?: number;
  skipAutoMarkViewed?: boolean;
}
```

**Result**:

```typescript
Message[] {
  messageId: string;
  fromAddress: string;
  toAddress: string;
  plaintextHash: string;
  plaintext?: string;           // Decrypted plaintext
  guardAddress?: string;
  passportAddress?: string;
  lastReceivedLeafIndex?: number;
  direction: "sent" | "received";
  status: "pending" | "confirmed" | "read" | "failed" | "rejected" | "decrypted" | "decrypt_failed";
  msgType: 1 | 3;
  leafIndex?: number;
  prevRoot?: string;
  newRoot?: string;
  serverSignature?: string;
  serverTimestamp?: number;
  serverPublicKey?: string;
  arkConfirmed?: {
    recipient: string;
    recipientPublicKey: string;
    signature: string;
    timestamp: number;
  };
  createdAt: number;
  receivedAt?: number;
  zipMetadata?: {
    fileName: string;
    fileSize: number;
    fileHash: string;
    contentType: "text" | "zip" | "wts" | "wip";
    localCachePath?: string;
    downloadedAt?: number;
  };
  proof?: string;               // On-chain proof object address
  decryptError?: string;
  decryptAttempts?: number;
  lastDecryptAttemptAt?: number;
  viewedAt?: number;            // Timestamp when viewed
}
```

---

### extract_zip_messages

Extract ZIP files from messages.

```typescript
ExtractZipMessages {
  operation: "extract_zip_messages";
  account?: string;             // Account. Empty = default
  messages: (string | Message)[]; // Message IDs or Message objects
  outputDir: string;            // Output directory path
}
```

**Result**: `string[]` (extracted file paths)

---

### generate_wts

Generate WTS (Witness Transcript) from message history.

```typescript
GenerateWts {
  operation: "generate_wts";
  params: {
    myAccount: string;          // My account name or address
    peerAccount: string | { name_or_address?: string; local_mark_first?: boolean };
    range?: WtsRange;
    excludePlaintext?: boolean;
    outputDir: string;
  };
}

WtsRange =
  | { type: "time"; start: number; end: number }
  | { type: "messageId"; start: string; end: string }
  | { type: "seqIndex"; start: number; end: number };
```

**Result**:

```typescript
WtsFileResult {
  files: string[];              // Generated WTS file paths
  totalMessageCount: number;
  timeRange: { start: number; end: number };
}
```

---

### verify_wts

Verify WTS file integrity and signatures.

```typescript
VerifyWts {
  operation: "verify_wts";
  wtsFilePath: string;          // WTS file path
}
```

**Result**:

```typescript
WtsVerificationResult {
  valid: boolean;
  error?: string;
  hashValid: boolean;
  hasSignature: boolean;
  signatureValid?: boolean;
  signatures?: {
    publicKey: string;
    address?: string;
    valid: boolean;
  }[];
}
```

---

### sign_wts

Sign WTS file.

```typescript
SignWts {
  operation: "sign_wts";
  wtsFilePath: string;
  account?: string;             // Signing account. Empty = default
  outputPath?: string;          // Output path (default: signed_*.wts)
}
```

**Result**: `string` (signed file path)

---

### wts2html

Convert WTS to HTML.

```typescript
Wts2Html {
  operation: "wts2html";
  wtsPath: string;              // WTS file or directory path
  options?: {
    title?: string;             // HTML page title
    theme?: "light" | "dark";
    outputPath?: string;        // Output file/directory path
  };
}
```

**Result**: `string | string[]` (HTML string or file paths)

---

### proof_message

Proof message on-chain.

```typescript
ProofMessage {
  operation: "proof_message";
  account?: string;             // Account. Empty = default
  messageId: string;            // Message ID to proof
  network?: "localnet" | "testnet";
}
```

**Result**:

```typescript
{
  proofAddress: string;         // Proof object address on blockchain
}
```

---

### blacklist

Manage blacklist.

```typescript
BlacklistOperation {
  operation: "blacklist";
  account?: string;             // Account. Empty = default
  blacklist: {
    op: "add" | "remove" | "clear" | "get" | "exist";
    users?: (string | { name_or_address?: string; local_mark_first?: boolean })[];
  };
}
```

**Result**:

```typescript
BlacklistResult {
  success: boolean;
  operation: "add" | "remove" | "clear" | "get" | "exist";
  modifiedCount: number;
  currentCount: number;
  maxCount: number;
  invalidAddresses?: string[];
  existResults?: { address: string; exists: boolean }[];
  message?: string;
  currentList?: string[];
}
```

---

### friendslist

Manage friends list.

```typescript
FriendslistOperation {
  operation: "friendslist";
  account?: string;             // Account. Empty = default
  friendslist: {
    op: "add" | "remove" | "clear" | "get" | "exist";
    users?: (string | { name_or_address?: string; local_mark_first?: boolean })[];
  };
}
```

**Result**:

```typescript
FriendslistResult {
  success: boolean;
  operation: "add" | "remove" | "clear" | "get" | "exist";
  modifiedCount: number;
  currentCount: number;
  maxCount: number;
  invalidAddresses?: string[];
  existResults?: { address: string; exists: boolean }[];
  message?: string;
  currentList?: string[];
}
```

---

### guardlist

Manage guard list.

```typescript
GuardlistOperation {
  operation: "guardlist";
  account?: string;             // Account. Empty = default
  guardlist: {
    op: "add" | "remove" | "get";
    guards?: GuardParam[];      // For add op (1-10 items)
  };
}

GuardParam {
  guard: string;                // Guard address or name
  passportValiditySeconds: number; // 10s to 10 years
}
```

**Result**:

```typescript
GuardlistResult {
  success: boolean;
  operation: "add" | "remove" | "get";
  modifiedCount: number;
  currentCount: number;
  maxCount: number;
  invalidAddresses?: string[];
  existResults?: { address: string; exists: boolean }[];
  message?: string;
  currentGuardList?: {
    guardAddress: string;
    passportValiditySeconds: number;
  }[];
}
```

---

### settings

Manage messenger settings.

```typescript
SettingsOperation {
  operation: "settings";
  account?: string;             // Account. Empty = default
  settings: {
    op: "get" | "set";
    allowStrangerMessages?: boolean;
    maxInboxSize?: number;      // Minimum 1
  };
}
```

**Result**:

```typescript
SettingsResult =
  | {                          // For "get" operation
      allowStrangerMessages?: boolean;
      maxInboxSize?: number;
      minUserInboxSize: number;
      maxUserInboxSize: number;
      defaultAllowStrangerMessages: boolean;
    }
  | boolean;                   // For "set" operation
```

---

### mark_messages_as_viewed

Mark specific messages as viewed.

```typescript
MarkMessagesAsViewed {
  operation: "mark_messages_as_viewed";
  account?: string;             // Account. Empty = default
  messageIds: string[];         // 1-1000 message IDs
}
```

**Result**: `number` (count of messages marked as viewed)

---

### mark_conversation_as_viewed

Mark all messages in a conversation as viewed.

```typescript
MarkConversationAsViewed {
  operation: "mark_conversation_as_viewed";
  account?: string;             // Account. Empty = default
  peerAddress: string | { name_or_address?: string; local_mark_first?: boolean };
}
```

**Result**: `number` (count of messages marked as viewed)

---

## Output Structure

```typescript
MessengerOperationOutput {
  result: {
    operation: string;          // The operation type
    result: OperationResult;    // Operation-specific result
  };
}
```
