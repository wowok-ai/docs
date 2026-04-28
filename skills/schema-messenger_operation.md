# Schema: messenger_operation

> 💬 WoWok加密消息操作：会话管理、消息收发、文件传输、WTS证据、列表管理、上链证明等14种子操作。

---

## 顶层结构（Discriminated Union by operation）

```
MessengerOperationInput
├── operation: "watch_conversations" → filter?: ConversationsFilter
├── operation: "send_message" → from: string, to: AccountOrMark_AddressAI, content: string, options?: SendMessageOptions
├── operation: "send_file" → from: string, to: AccountOrMark_AddressAI, filePath: string, options?: SendFileOptions
├── operation: "watch_messages" → filter?: MessageFilter
├── operation: "extract_zip_messages" → account?: string, messages: string[], outputDir: string
├── operation: "generate_wts" → params: WtsGenerationParams
├── operation: "verify_wts" → wtsFilePath: string
├── operation: "sign_wts" → wtsFilePath: string, account?: string, outputPath?: string
├── operation: "wts2html" → wtsPath: string, options?: WtsToHtmlOptions
├── operation: "proof_message" → account?: string, messageId: string, network?: Entrypoint
├── operation: "blacklist" → account?: string, blacklist: BlacklistOperation
├── operation: "friendslist" → account?: string, friendslist: FriendslistOperation
├── operation: "guardlist" → account?: string, guardlist: GuardlistOperation
├── operation: "settings" → account?: string, settings: SettingsOperation
├── operation: "mark_messages_as_viewed" → account?: string, messageIds: string[]
└── operation: "mark_conversation_as_viewed" → account?: string, peerAddress: AccountOrMark_AddressAI
```

---

## 消息通信操作

### watch_conversations — 查看会话列表

**ConversationsFilter**：
```
├── account?: string — 账户名称/地址（空为默认）
├── unreadOnly?: boolean — true只返回有未读消息的会话
├── startTime?: number — 按lastMessageAt过滤起始时间
├── endTime?: number — 按lastMessageAt过滤结束时间
├── previewMessageCount?: number — 每个会话预览消息数（默认2，0禁用）
├── sortBy?: "lastMessageAt" | "unreadCount" | "messageCount"
├── sortOrder?: "asc" | "desc"
└── skipAutoMarkViewed?: boolean — true时预览消息不自动标记为已读
```

**返回**：ConversationInfo[]

**ConversationInfo**：
```
{ peerAddress, lastMessageAt, messageCount, unreadCount, lastMessagePreview?, previewMessages?: Message[] }
```

### send_message — 发送加密消息

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | **是** | 发送方账户 |
| to | string \| AccountOrMark_Address | **是** | 接收方（字符串简写或完整对象） |
| content | string | **是** | 消息内容 |
| options?.guardAddress | string | 否 | Guard地址 |
| options?.passportAddress | string | 否 | Passport地址 |
| options?.force | boolean | 否 | 强制发送（即使有pending Guard消息） |
| options?.new_messenger_name | string | 否 | 为接收方设置messenger名称 |

**返回**：SendMessageResult
```
{ messageId, status, merkleData?: { leafIndex, prevRoot, newRoot, serverSignature, serverTimestamp, serverPublicKey }, guardList?, lastReceivedLeafIndex? }
```

### send_file — 发送加密文件

参数与send_message类似，将content替换为filePath（本地文件路径）。
options额外支持：
- fileName?: string — 自定义文件名
- contentType?: "wts" | "wip" | "zip" — 内容类型提示

### watch_messages — 查看消息

**MessageFilter**（关键字段）：
```
├── account?: string
├── direction?: "sent" | "received"
├── status?: "pending" | "confirmed" | "read" | "failed" | "rejected" | "decrypted" | "decrypt_failed"
├── peerAddress?: string | AccountOrMark_Address
├── msgType?: 1 | 3
├── contentType?: "text" | "zip" | "wts" | "wip"
├── decryptedOnly?: boolean
├── confirmedOnly?: boolean
├── keyword?: string — 明文关键词搜索
├── limit?: number
├── offset?: number
├── timeField?: "createdAt" | "receivedAt" | "serverTimestamp"
├── startTime? / endTime?: number
├── arkConfirmedOnly?: boolean
├── proofedOnly?: boolean
├── listFilterMode?: "friends" | "guard" | "stranger" | "any"
├── customListFilter?: { includeAddresses?, excludeAddresses?, relation?: "union" | "intersection" }
├── viewed?: boolean — true=只看已读, false=只看未读
├── viewedAtStart? / viewedAtEnd?: number
└── skipAutoMarkViewed?: boolean
```

**返回**：Message[]

---

## WTS操作（Witness Timestamp Signature）

### generate_wts — 生成WTS证据文件

**WtsGenerationParams**：
```
├── myAccount: string — 己方账户
├── peerAccount: string | AccountOrMark_Address — 对方账户
├── range?: WtsRange — 范围过滤
│   ├── type: "time" → start: number, end: number
│   ├── type: "messageId" → start: string, end: string
│   └── type: "seqIndex" → start: number, end: number
├── excludePlaintext?: boolean — 是否排除明文
└── outputDir: string — 输出目录
```

**返回**：{ files: string[], totalMessageCount, timeRange: {start, end} }

### verify_wts / sign_wts / wts2html
- verify_wts: 验证WTS文件完整性，返回WtsVerificationResult。
- sign_wts: 对WTS文件签名，返回签名后的文件路径。
- wts2html: 将WTS转为HTML，返回HTML字符串或文件路径。

---

## 列表管理操作

### blacklist — 黑名单管理

**BlacklistOperation**（discriminatedUnion by op）：
```
├── op: "add" → users: string[] | ManyAccountOrMark_Address
├── op: "remove" → users: string[] | ManyAccountOrMark_Address
├── op: "clear"
├── op: "get"
└── op: "exist" → users: string[] | ManyAccountOrMark_Address
```

### friendslist — 好友列表管理
结构与blacklist相同，操作：add/remove/clear/get/exist。

### guardlist — Guard列表管理

**GuardlistOperation**（discriminatedUnion by op）：
```
├── op: "add" → guards: GuardParam[] (1-10项)
│   └── GuardParam: { guard: string, passportValiditySeconds: number (10-315360000) }
├── op: "remove" → guards: string[] (1-10项, Guard地址)
└── op: "get"
```

### settings — 设置管理

**SettingsOperation**：
```
├── op: "get"
└── op: "set" → allowStrangerMessages?: boolean, maxInboxSize?: number (min 1)
```

**GetSettingsResponse**：
```
{ allowStrangerMessages?, maxInboxSize?, minUserInboxSize, maxUserInboxSize, defaultAllowStrangerMessages }
```

---

## 状态标记操作

### mark_messages_as_viewed — 标记消息已读
- **messageIds**: string[] (1-1000项)
- **返回**：number（成功标记的数量）

### mark_conversation_as_viewed — 标记会话已读
- **peerAddress**: string | AccountOrMark_Address
- **返回**：number（该会话中成功标记为已读的消息数）

---

## 上链证明操作

### proof_message — 消息上链证明
- **messageId**: 消息ID
- **network**: 网络
- **返回**：{ proofAddress: string }（链上证明对象地址）

---

## AI调用规划要点

1. **发送消息前**：确认收发双方账户都已启用messenger（account_operation中m字段）。
2. **to/peerAddress的简写**：支持直接传字符串（名称/地址），系统按local_mark_first策略解析。
3. **未读消息处理流程**：
   ```
   watch_conversations(unreadOnly=true) → 定位未读会话 → watch_messages(viewed=false) → 阅读内容 → mark_messages_as_viewed / mark_conversation_as_viewed
   ```
4. **WTS证据链**：generate_wts → sign_wts → wts2html → proof_message（可选上链）。
5. **Guardlist与Blacklist/Friendslist的区别**：guardlist存储的是Guard地址+passport有效期，用于加密通信时的身份验证策略。

## Messenger在业务系统中的使用经验（从示例中提取）

### 隐私保护物流模式
在电商等业务场景中，Messenger可用于保护隐私的物流信息交换：
1. **客户发送收货地址**：客户通过Messenger将phone、email、shipping_address发送给商家。
2. **商家发送运单号**：商家发货后通过Messenger将tracking number发送给客户。
3. **仅Merkle Root上链**：实际物流信息不直接上链，只将Messenger通信的Merkle Root作为证明提交到Progress。
4. **责任追溯**：遵循"谁完成关键动作，谁提交证明"原则，由完成动作的一方提交Merkle Root。

### Merkle Root提交流程
```
商家发货 → 商家发送运单号给客户(Messenger) → 商家提交Merkle Root到Progress
客户退货 → 客户发送退货运单号给商家(Messenger) → 客户提交Merkle Root到Progress
```

### 与Progress的协作
Messenger通信本身不直接触发Progress状态变更，但通信产生的Merkle Root可作为Guard验证的输入，从而驱动Progress向前推进。
