# WIP File Tool Schema

> **Tool Name**: `wip_file`
> **Description**: Generate, verify, sign, or convert WIP (Witness Immutable Promise) files to HTML.

---

## Tool Schema

```typescript
wip_file: {
  operation: "generate" | "verify" | "sign" | "wip2html",
  params: GenerateWip_Input | VerifyWip_Input | SignWip_Input | Wip2Html_Input
}
```

---

## Operation: generate

Generate a WIP file from markdown text and optional images.

### Input Schema

```typescript
GenerateWip_Input {
  options: WipGenerationOptions,  // REQUIRED - WIP generation options
  outputPath: string              // REQUIRED - Output file path (.wip file)
}
```

### Sub Schemas

```typescript
WipGenerationOptions {
  markdown_text: string,          // REQUIRED - Markdown formatted text content (max 10000 chars)
  images?: ImageSource[],         // OPTIONAL - Image list (max 10 images)
  account?: string                // OPTIONAL - Signing account (account name or address)
}

ImageSource {
  source: string,                 // REQUIRED - Image source path or URL
                                  // Supports: 1) Local file path (e.g., '/path/to/image.png', 'C:\Users\name\image.jpg')
                                  //           2) Network URL (e.g., 'https://example.com/image.png')
                                  //           3) Data URL (e.g., 'data:image/png;base64,iVBORw0K...')
  id?: string,                    // OPTIONAL - Image ID for reference in WIP content
  filename?: string               // OPTIONAL - File name (auto-extracted if not provided)
}
```

### Output Schema

```typescript
GenerateWip_Output {
  filePath: string                // Generated WIP file path
}
```

---

## Operation: verify

Verify the integrity and signature of a WIP file.

### Input Schema

```typescript
VerifyWip_Input {
  wipFilePath: string,            // REQUIRED - WIP file path to verify
                                  // Supports: 1) Local file path
                                  //           2) Network URL
                                  //           3) Data URL
  hash_equal?: string,            // OPTIONAL - Expected hash value for verification
  requireSignature?: boolean      // OPTIONAL - Require digital signature (fails if no signature)
}
```

### Output Schema

```typescript
VerifyWip_Output = WipVerificationResult

WipVerificationResult {
  valid: boolean,                 // Whether verification passed
  error?: string,                 // Error message (when verification fails)
  hashValid: boolean,             // Whether hash verification passed
  signatureValid?: boolean,       // Whether signature verification passed (when signature exists)
  hasSignature: boolean,          // Whether signature exists
  signatures?: WipSignatureVerification[]  // Signature verification details list
}

WipSignatureVerification {
  publicKey: string,              // Signature public key
  address?: string,               // Address derived from public key
  valid: boolean                  // Whether signature is valid
}
```

---

## Operation: sign

Sign an existing WIP file with the specified account.

### Input Schema

```typescript
SignWip_Input {
  wipFilePath: string,            // REQUIRED - WIP file path to sign
                                  // Supports: 1) Local file path
                                  //           2) Network URL
  account?: string,               // OPTIONAL - Signing account (defaults to default account)
  outputPath?: string             // OPTIONAL - Output file path (defaults to 'signed_' prefix)
}
```

### Output Schema

```typescript
SignWip_Output {
  filePath: string                // Signed WIP file path
}
```

---

## Operation: wip2html

Convert WIP file(s) to HTML format.

### Input Schema

```typescript
Wip2Html_Input {
  wipPath: string,                // REQUIRED - WIP file path or directory path
                                  // Supports: 1) Single WIP file (e.g., '/path/to/file.wip')
                                  //           2) Directory containing .wip files
                                  //           3) Network URL
  options?: WipToHtmlOptions      // OPTIONAL - Conversion options
}

WipToHtmlOptions {
  title?: string,                 // OPTIONAL - HTML page title
  theme?: "light" | "dark",       // OPTIONAL - Theme style
  outputPath?: string             // OPTIONAL - Output file path or directory
}
```

### Output Schema

```typescript
Wip2Html_Output {
  html?: string,                  // HTML string content (single file without outputPath)
  filePath?: string,              // Output file path (when outputPath is specified)
  files?: string[]                // Converted file path array (when processing directory)
}
```

---

## Complete WIP File Structure

```typescript
WipFile {
  wip: string,                    // Root identifier (schema URL)
  payload: WipPayload,            // Content payload
  meta: WipMeta                   // Metadata
}

WipPayload {
  content: WipContent,            // Text content
  media: WipMedia[]               // Media file array (max 10)
}

WipContent {
  text: string,                   // Text content (max 10000 chars)
  format: "plain" | "markdown" | "html"  // Text format
}

WipMedia {
  id: string,                     // Unique media file identifier
  type: "image/png" | "image/jpeg" | "image/gif" | "image/webp",  // MIME type
  data: string,                   // Base64 encoded file data
  filename?: string               // Optional file name
}

WipMeta {
  type: "wip",                    // File type identifier (fixed)
  version: string,                // Format version number
  created: string,                // Creation time (ISO 8601 format)
  hash: string,                   // SHA-256 hash of payload (format: sha256:hexString)
  algorithm: "sha256",            // Hash algorithm (fixed)
  signature?: WipSignature | WipSignature[]  // Optional digital signature(s)
}

WipSignature {
  value: string,                  // Base64 encoded signature value
  publicKey: string,              // Verification public key (Base64 32 bytes) or DID
  algorithm: "Ed25519",           // Signature algorithm (fixed)
  address?: string                // Signer address
}
```

---

## Constraints

| Constraint | Value |
|------------|-------|
| Max image size | 2MB per image |
| Max total size | 10MB |
| Max image count | 10 images |
| Max text length | 10000 characters |
| Schema URL | https://schema.wip.wowok.net/v1 |
| Version | 1.0.0 |

---

## WIP Operation Output (Discriminated Union)

```typescript
WipOperationOutput =
  | { type: "generate"; filePath: string }
  | {
      type: "verify";
      valid: boolean;
      error?: string;
      hashValid: boolean;
      signatureValid?: boolean;
      hasSignature: boolean;
      signatures?: any[];
    }
  | { type: "sign"; filePath: string }
  | {
      type: "wip2html";
      html?: string;
      filePath?: string;
      files?: string[];
    }
```
