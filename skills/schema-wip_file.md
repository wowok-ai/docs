# Schema: wip_file

> 🤝 WIP（Witness Immutable Promise）文件操作：生成、验证、签名、转HTML。

---

## 顶层结构（Discriminated Union by type）

```
WipOperations
├── type: "generate" → options: WipGenerationOptions, outputPath: string
├── type: "verify" → wipFilePath: string, hash_equal?: string, requireSignature?: boolean
├── type: "sign" → wipFilePath: string, account?: string, outputPath?: string
└── type: "wip2html" → wipPath: string, options?: WipToHtmlOptions
```

---

## generate — 生成WIP文件

### WipGenerationOptions
```
├── markdown_text: string(max 10000) — Markdown格式文本内容
├── images?: ImageSource[] (max 10项) — 图片列表
└── account?: string — 签名账户（可选，指定则自动签名）
```

### ImageSource
```
├── source: string — 图片路径/URL/dataURL
├── id?: string — 图片引用ID（可选，未提供则按索引自动生成如image_0）
└── filename?: string — 文件名（可选）
```

**source支持格式**：
1. 本地路径：`/path/to/image.png`、`C:\Users\name\image.jpg`
2. 网络URL：`https://example.com/image.png`
3. Data URL：`data:image/png;base64,iVBORw0K...`

### 输出
```
{ result: { type: "generate", filePath: string } }
```

---

## verify — 验证WIP文件

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| wipFilePath | string | **是** | WIP文件路径/URL/dataURL |
| hash_equal | string | 否 | 预期hash值，提供则先比对hash |
| requireSignature | boolean | 否 | true时若无签名则验证失败 |

### 输出
```
{ result: { type: "verify", valid: boolean, error?: string, hashValid: boolean, signatureValid?: boolean, hasSignature: boolean, signatures?: WipSignatureVerification[] } }
```

---

## sign — 签名WIP文件

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| wipFilePath | string | **是** | WIP文件路径/URL |
| account | string | 否 | 签名账户，空为默认账户 |
| outputPath | string | 否 | 输出路径，未指定则加signed_前缀 |

### 输出
```
{ result: { type: "sign", filePath: string } }
```

---

## wip2html — 转换为HTML

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| wipPath | string | **是** | 单文件、目录或URL |
| options?.title | string | 否 | HTML页面标题 |
| options?.theme | "light" \| "dark" | 否 | 主题 |
| options?.outputPath | string | 否 | 输出路径 |

### 输出
```
{ result: { type: "wip2html", html?: string, filePath?: string, files?: string[] } }
```

---

## WIP文件内部结构

```
WipFile
├── wip: string — 根标识，值为schema URL
├── payload: WipPayload
│   ├── content: { text, format: "plain"|"markdown"|"html" }
│   └── media: WipMedia[]
│       └── { id, type: ImageMimeType, data: base64, filename? }
└── meta: WipMeta
    ├── type: "wip"
    ├── version: string
    ├── created: ISO 8601时间
    ├── hash: string (格式: sha256:hexString)
    ├── algorithm: "sha256"
    └── signature?: WipSignature | WipSignature[]
        └── { value, publicKey, algorithm: "Ed25519", address? }
```

---

## AI调用规划要点

1. **生成WIP前**：确认markdown_text不超过10000字符，图片不超过10张且每张不超过2MB，总大小不超过10MB。
2. **验证WIP时**：如需确保文件来自特定方，设requireSignature=true。
3. **签名与账户操作签名的区别**：wip_file(sign)是对WIP文件内容做数字签名；account_operation(signData)是对任意数据做签名。
4. **wip2html目录处理**：传入目录路径时，会转换目录下所有.wip文件。
