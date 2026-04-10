# WIP Component (📄 Witness Immutable Promise)

---

## Component Overview

The WIP (Witness Immutable Promise) component is used to generate, verify, and sign WIP files, as well as convert them to HTML. WIP is a JSON file format for transmitting immutable commitment information over the network to AI.

---

## Complete Tool Call Structure

This is the complete top-level tool JSON structure; all sub-features below are part of this structure:

```json
{
  "type": "generate|verify|sign|wip2html",
  "options": {
    "markdown_text": "string",
    "images": [{
      "source": "string",
      "id": "string",
      "filename": "string"
    }],
    "account": "string",
    "title": "string",
    "theme": "light|dark",
    "outputPath": "string"
  },
  "outputPath": "string",
  "wipFilePath": "string",
  "hash_equal": "string",
  "account": "string",
  "wipPath": "string"
}
```

---

## Constraint Constants

| Constant Name | Value | Description |
|---------|-----|------|
| `maxImageSize` | 2MB | Maximum size for a single image |
| `maxTotalSize` | 10MB | Maximum total file size |
| `maxImageCount` | 10 | Maximum number of images |
| `maxTextLength` | 10000 | Maximum text length |
| `schemaUrl` | https://schema.wip.wowok.net/v1 | WIP Schema URL |
| `version` | 1.0.0 | WIP format version |

---

## Feature Tree

```
wip_file (WIP Operations)
├── type (operation type, discriminator)
│   ├── type: "generate" (Generate WIP file)
│   │   ├── options (WIP generation options)
│   │   │   ├── markdown_text (Markdown format text content)
│   │   │   ├── images (optional image list)
│   │   │   │   └── ImageSource[]
│   │   │   │       ├── source (image source path or URL)
│   │   │   │       ├── id (optional image ID)
│   │   │   │       └── filename (optional filename)
│   │   │   └── account (optional signing account)
│   │   └── outputPath (output file path)
│   ├── type: "verify" (Verify WIP file)
│   │   ├── wipFilePath (path to WIP file to verify)
│   │   └── hash_equal (optional expected hash value)
│   ├── type: "sign" (Sign WIP file)
│   │   ├── wipFilePath (path to WIP file to sign)
│   │   ├── account (optional signing account)
│   │   └── outputPath (optional output path)
│   └── type: "wip2html" (Convert to HTML)
│       ├── wipPath (WIP file path or directory path)
│       └── options (optional conversion options)
│           ├── title (optional HTML page title)
│           ├── theme (optional theme style: light/dark)
│           └── outputPath (optional output file path)
```

---

## Sub-feature 1: Generate WIP File (type: "generate")

### Feature Description

Generate a WIP file from Markdown text and optional images. Supports local file paths, network URLs, and Data URLs as image sources.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `type` | string | Yes | Operation type | Fixed value "generate" |
| `options.markdown_text` | string | Yes | Markdown format text content | Maximum length 10000 characters |
| `options.images` | array | No | Optional image list | Maximum 10 images |
| `options.images[].source` | string | Yes | Image source path or URL | Supports: 1) Local file path, 2) Network URL, 3) Data URL |
| `options.images[].id` | string | No | Optional image ID | Used to reference the image in WIP content; if not provided, auto-generated based on index (e.g., 'image_0', 'image_1') |
| `options.images[].filename` | string | No | Optional filename | If not provided, extracted from URL path or local filename |
| `options.account` | string | No | Optional signing account | Account name or address; if specified, uses Account module for signing |
| `outputPath` | string | Yes | Output file path (.wip file) | If file exists, it will be overwritten |

### Important Notes

⚠️ **Image Size Limit**: Single image maximum 2MB, total size not exceeding 10MB.

⚠️ **Supported Image Formats**: PNG, JPEG, GIF, WebP formats are supported.

⚠️ **Output Path**: Must end with .wip extension.

⚠️ **Auto-signing**: If account is specified, the generated WIP file will be automatically signed using that account.

### Return Result

Returns the result containing the generated WIP file path.

---

### Examples

#### Example 1.1: Minimal WIP (Markdown text only)

**Prompt**: Generate a simple WIP file containing Markdown text "# Hello World\n\nThis is a test document", save to d:/wowok/test.wip.

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Hello World\n\nThis is a test document"
  },
  "outputPath": "d:/wowok/test.wip"
}
```

---

#### Example 1.2: WIP with Local Image

**Prompt**: Generate a WIP file containing Markdown text and a local image. Image path is d:/wowok/image.png, image ID is "my_image", filename set to "photo.png".

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Document with Image\n\n![Image](my_image)",
    "images": [
      {
        "source": "d:/wowok/image.png",
        "id": "my_image",
        "filename": "photo.png"
      }
    ]
  },
  "outputPath": "d:/wowok/with_image.wip"
}
```

---

#### Example 1.3: WIP with Network Image

**Prompt**: Generate a WIP file using a network URL as the image source.

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Network Image Document\n\n![Network Image](image_0)",
    "images": [
      {
        "source": "https://example.com/image.jpg"
      }
    ]
  },
  "outputPath": "d:/wowok/with_web_image.wip"
}
```

---

#### Example 1.4: WIP with Multiple Images

**Prompt**: Generate a WIP file containing 3 images, demonstrating different image source types.

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Multi-Image Document\n\nImage 1: ![Image1](img1)\nImage 2: ![Image2](img2)\nImage 3: ![Image3](img3)",
    "images": [
      {
        "source": "d:/wowok/img1.png",
        "id": "img1"
      },
      {
        "source": "https://example.com/img2.jpg",
        "id": "img2"
      },
      {
        "source": "d:/wowok/img3.gif",
        "id": "img3",
        "filename": "animation.gif"
      }
    ]
  },
  "outputPath": "d:/wowok/multi_image.wip"
}
```

---

#### Example 1.5: Auto-signed WIP

**Prompt**: Generate a WIP file and automatically sign it using the default account.

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Signed Document\n\nThis document will be automatically signed",
    "account": ""
  },
  "outputPath": "d:/wowok/signed_doc.wip"
}
```

---

## Sub-feature 2: Verify WIP File (type: "verify")

### Feature Description

Verify the integrity and signature of a WIP file. Supports local file paths, network URLs, and Data URLs.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `type` | string | Yes | Operation type | Fixed value "verify" |
| `wipFilePath` | string | Yes | Path to WIP file to verify | Supports: 1) Local file path, 2) Network URL, 3) Data URL |
| `hash_equal` | string | No | Optional expected hash value | If provided, the function will first verify if the file hash matches this value; if not, returns hash mismatch error |

### Important Notes

⚠️ **Hash Verification Priority**: If hash_equal is provided, hash verification is performed first; if hash doesn't match, returns error directly.

⚠️ **Verification Content**: Verification includes hash verification and signature verification (if signature exists).

⚠️ **Network Files**: Supports direct verification of WIP files on network URLs.

### Return Result

Returns an object containing verification results, including:
- `valid`: Whether overall verification passed
- `hashValid`: Whether hash verification passed
- `signatureValid`: Whether signature verification passed (if signature exists)
- `hasSignature`: Whether signature exists
- `signatures`: Signature verification details list (if signature exists)
- `error`: Error message (when verification fails)

---

### Examples

#### Example 2.1: Verify Local WIP File

**Prompt**: Verify the integrity of d:/wowok/test.wip file.

```json
{
  "type": "verify",
  "wipFilePath": "d:/wowok/test.wip"
}
```

---

#### Example 2.2: Verify Network WIP File

**Prompt**: Verify the WIP file at network URL https://example.com/doc.wip.

```json
{
  "type": "verify",
  "wipFilePath": "https://example.com/doc.wip"
}
```

---

#### Example 2.3: Verify with Expected Hash

**Prompt**: Verify WIP file and check if hash matches expected value.

```json
{
  "type": "verify",
  "wipFilePath": "d:/wowok/test.wip",
  "hash_equal": "sha256:abcdef1234567890..."
}
```

---

## Sub-feature 3: Sign WIP File (type: "sign")

### Feature Description

Sign a WIP file using an account. The file will be loaded, verified, and then signed.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `type` | string | Yes | Operation type | Fixed value "sign" |
| `wipFilePath` | string | Yes | Path to WIP file to sign | Supports: 1) Local file path, 2) Network URL |
| `account` | string | No | Signing account | Account name or address; if not specified, uses default account |
| `outputPath` | string | No | Output file path | If not specified, adds 'signed_' prefix to original filename (e.g., 'doc.wip' becomes 'signed_doc.wip') |

### Important Notes

⚠️ **Verify Before Sign**: File is verified before signing; if verification fails, cannot sign.

⚠️ **Multi-signature Support**: WIP supports multiple signatures, can be signed multiple times.

⚠️ **Output Path**: If outputPath is specified, saves to that path; otherwise auto-generates filename with 'signed_' prefix.

### Return Result

Returns the result containing the signed WIP file path.

---

### Examples

#### Example 3.1: Sign with Default Account

**Prompt**: Sign d:/wowok/test.wip file using default account, auto-generate output filename.

```json
{
  "type": "sign",
  "wipFilePath": "d:/wowok/test.wip"
}
```

---

#### Example 3.2: Sign with Specified Account

**Prompt**: Sign WIP file using account "my_account".

```json
{
  "type": "sign",
  "wipFilePath": "d:/wowok/test.wip",
  "account": "my_account"
}
```

---

#### Example 3.3: Specify Output Path

**Prompt**: Sign WIP file and save to specified output path.

```json
{
  "type": "sign",
  "wipFilePath": "d:/wowok/test.wip",
  "account": "my_account",
  "outputPath": "d:/wowok/my_signed_doc.wip"
}
```

---

#### Example 3.4: Sign Network File

**Prompt**: Sign WIP file from network and save to local.

```json
{
  "type": "sign",
  "wipFilePath": "https://example.com/doc.wip",
  "outputPath": "d:/wowok/signed_from_web.wip"
}
```

---

## Sub-feature 4: Convert to HTML (type: "wip2html")

### Feature Description

Convert WIP file to HTML format. Supports single file, directory, or network URL.

### Parameter Description

| Parameter Path | Type | Required | Description | Constraints |
|---------|------|------|------|------|
| `type` | string | Yes | Operation type | Fixed value "wip2html" |
| `wipPath` | string | Yes | WIP file path or directory path | Supports: 1) Single WIP file, 2) Directory containing .wip files, 3) Network URL. When directory is provided, all .wip files in the directory will be converted to HTML |
| `options` | object | No | Conversion options |  |
| `options.title` | string | No | HTML page title |  |
| `options.theme` | enum | No | Theme style | "light" or "dark" |
| `options.outputPath` | string | No | Output file path | Single file: save HTML to this path; Directory: save all converted HTML files to this directory |

### Important Notes

⚠️ **Directory Handling**: If wipPath is a directory, all .wip files in the directory will be converted.

⚠️ **Output Path**: For single file conversion, outputPath is a single file path; for directory conversion, outputPath is a directory path.

⚠️ **Theme Selection**: Supports light and dark themes.

### Return Result

Returns different results based on input type:
- Single file conversion without outputPath: returns HTML string
- Single file conversion with outputPath: returns output file path
- Directory conversion: returns array of converted file paths

---

### Examples

#### Example 4.1: Convert Single WIP File

**Prompt**: Convert d:/wowok/test.wip to HTML, return HTML string.

```json
{
  "type": "wip2html",
  "wipPath": "d:/wowok/test.wip"
}
```

---

#### Example 4.2: Convert and Save to File

**Prompt**: Convert WIP file and save to specified path.

```json
{
  "type": "wip2html",
  "wipPath": "d:/wowok/test.wip",
  "options": {
    "outputPath": "d:/wowok/test.html"
  }
}
```

---

#### Example 4.3: Convert with Title and Theme

**Prompt**: Convert WIP file, set HTML title to "My Document", use dark theme.

```json
{
  "type": "wip2html",
  "wipPath": "d:/wowok/test.wip",
  "options": {
    "title": "My Document",
    "theme": "dark",
    "outputPath": "d:/wowok/test_dark.html"
  }
}
```

---

#### Example 4.4: Convert Entire Directory

**Prompt**: Convert all WIP files in d:/wowok/wips/ directory, save to d:/wowok/htmls/ directory.

```json
{
  "type": "wip2html",
  "wipPath": "d:/wowok/wips/",
  "options": {
    "outputPath": "d:/wowok/htmls/"
  }
}
```

---

#### Example 4.5: Convert Network File

**Prompt**: Convert WIP file from network URL https://example.com/doc.wip.

```json
{
  "type": "wip2html",
  "wipPath": "https://example.com/doc.wip",
  "options": {
    "outputPath": "d:/wowok/from_web.html"
  }
}
```

---

## Complete Workflow Example

### Complete Workflow: From Generation to HTML

Let's demonstrate a complete WIP workflow:

#### Step 1: Generate WIP File

```json
{
  "type": "generate",
  "options": {
    "markdown_text": "# Complete Workflow Example\n\nThis is a document demonstrating the complete WIP workflow.\n\n## Features\n\n- Immutable content\n- Verifiable hash\n- Signature support\n- Convertible to HTML",
    "images": [
      {
        "source": "d:/wowok/workflow.png",
        "id": "workflow_diagram"
      }
    ]
  },
  "outputPath": "d:/wowok/workflow.wip"
}
```

#### Step 2: Verify WIP File

```json
{
  "type": "verify",
  "wipFilePath": "d:/wowok/workflow.wip"
}
```

#### Step 3: Sign WIP File

```json
{
  "type": "sign",
  "wipFilePath": "d:/wowok/workflow.wip",
  "account": "my_account",
  "outputPath": "d:/wowok/workflow_signed.wip"
}
```

#### Step 4: Convert to HTML

```json
{
  "type": "wip2html",
  "wipPath": "d:/wowok/workflow_signed.wip",
  "options": {
    "title": "WIP Complete Workflow",
    "theme": "light",
    "outputPath": "d:/wowok/workflow.html"
  }
}
```

---

## Related Components

- **Messenger**: Messaging system - can send WIP files
- **WatchQuery**: Data query
