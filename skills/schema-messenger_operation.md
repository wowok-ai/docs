# Schema: messenger_operation

> 💬 WoWok encrypted messenger operations: watch conversations, send messages/files, manage lists, generate/verify WTS (Witness Transfer Signature), and proof messages on-chain.

---

## Top-Level Structure

```
MessengerOperation
├── Exactly one operation type (see below)
└── env?: { account?, network?, no_cache?, permission_guard?, referrer? }
```

---

## Operations

### watch_conversations — Watch Conversations

```
{
  "watch_conversations": {
    "unread_only": true,              // Filter unread conversations (default: false)
    "preview_messages": 3             // Number of preview messages (optional)
  }
}
```

**Returns**: List of conversations with metadata and preview messages.

---

### send_message — Send Encrypted Message

```
{
  "send_message": {
    "conversation": "conversation_id",  // Target conversation (required)
    "content": "message text",          // Message content (required)
    "reply_to": "message_id"            // Reply to message (optional)
  }
}
```

---

### send_file — Send Encrypted File

```
{
  "send_file": {
    "conversation": "conversation_id",  // Target conversation (required)
    "file_path": "./document.pdf",      // File to send (required)
    "description": "document description" // File description (optional)
  }
}
```

---

### watch_messages — Watch Messages

```
{
  "watch_messages": {
    "conversation": "conversation_id",  // Conversation to watch (required)
    "viewed_status": "unread",          // Filter: "all", "unread", "read" (default: "all")
    "limit": 50,                        // Max messages (optional)
    "cursor": null                      // Pagination cursor (optional)
  }
}
```

---

### extract_zip_messages — Extract ZIP Messages

```
{
  "extract_zip_messages": {
    "conversation": "conversation_id",  // Source conversation (required)
    "output_directory": "./extracted"   // Output directory (required)
  }
}
```

---

### generate_wts — Generate WTS (Witness Transfer Signature)

```
{
  "generate_wts": {
    "conversation": "conversation_id",  // Source conversation (required)
    "message_ids": ["msg1", "msg2"],    // Messages to include (required)
    "output_file": "./evidence.wts"     // Output WTS file (required)
  }
}
```

**WTS**: Cryptographic proof of message existence and content without revealing the actual content.

---

### verify_wts — Verify WTS

```
{
  "verify_wts": {
    "wts_file": "./evidence.wts"       // WTS file to verify (required)
  }
}
```

**Returns**: Verification result confirming message authenticity.

---

### sign_wts — Sign WTS

```
{
  "sign_wts": {
    "wts_file": "./evidence.wts",       // WTS file to sign (required)
    "account": "signer_account"         // Signing account (optional)
  }
}
```

---

### wts_to_html — Convert WTS to HTML

```
{
  "wts_to_html": {
    "wts_file": "./evidence.wts",       // Source WTS file (required)
    "output_file": "./evidence.html"    // Output HTML file (required)
  }
}
```

---

### proof_message_onchain — Proof Message On-Chain

```
{
  "proof_message_onchain": {
    "conversation": "conversation_id",  // Source conversation (required)
    "message_id": "message_id",         // Message to proof (required)
    "guard": "guard_name"               // Guard for validation (optional)
  }
}
```

**Effect**: Creates an on-chain proof of message existence without revealing content.

---

### manage_blacklist — Manage Blacklist

```
{
  "manage_blacklist": {
    "op": "add",                        // "add" | "remove" | "clear"
    "addresses": ["0x..."]              // Addresses to add/remove (for add/remove)
  }
}
```

---

### manage_friendslist — Manage Friends List

```
{
  "manage_friendslist": {
    "op": "add",                        // "add" | "remove" | "clear"
    "addresses": ["0x..."]              // Addresses to add/remove (for add/remove)
  }
}
```

---

### manage_guardlist — Manage Guard List

```
{
  "manage_guardlist": {
    "op": "add",                        // "add" | "remove" | "clear"
    "guards": ["guard_name"]            // Guards to add/remove (for add/remove)
  }
}
```

---

### mark_messages_viewed — Mark Messages as Viewed

```
{
  "mark_messages_viewed": {
    "conversation": "conversation_id",  // Target conversation (required)
    "message_ids": ["msg1", "msg2"]     // Messages to mark (required)
  }
}
```

---

### mark_conversation_viewed — Mark Conversation as Viewed

```
{
  "mark_conversation_viewed": {
    "conversation": "conversation_id"   // Target conversation (required)
  }
}
```

---

### settings — Messenger Settings

```
{
  "settings": {
    "setting_key": "setting_value"      // Key-value settings (implementation-specific)
  }
}
```

---

## AI Planning Notes

1. **Privacy-first communication**: All messages are encrypted end-to-end. Only conversation participants can read content.
2. **WTS for evidence**: Use WTS generation when you need cryptographic proof of communication for arbitration or legal purposes.
3. **On-chain proof**: `proof_message_onchain` creates verifiable evidence without revealing message content.
4. **Integration with Service/Machine**: Messenger can be used for off-chain coordination while Machine tracks on-chain state transitions.
5. **List management**: Blacklist blocks unwanted contacts; Friendslist enables quick access; Guardlist restricts communication to verified identities.
6. **Conversation lifecycle**: Watch → Send/Receive → Mark viewed → Generate WTS (if needed) → Proof on-chain (if needed).
