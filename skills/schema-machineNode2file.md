# Schema: machineNode2file

> ⚙️ 将链上Machine对象的节点定义导出到本地JSON或Markdown文件，便于查看、编辑和创建新Machine。

---

## 顶层结构

```
MachineNode2File_Input
├── machine: string — Machine对象ID或名称（必填）
├── file_path: string — 输出文件路径（必填）
├── format?: "json" \| "markdown" — 输出格式（默认"json"）
└── env?: { no_cache?: boolean, network?: "localnet" \| "testnet", account?: string }
```

---

## 输出结构

```
MachineNode2File_OutputWrapped
└── result: MachineNode2File_Output (discriminatedUnion by status)
    ├── status: "success" → data: { file_path, format, machine_object, node_count }
    └── status: "error" → error: string
```

---

## AI调用规划要点

1. **用途定位**：该工具是**只读导出**，不修改链上状态。用于：
   - 查看已有Machine的完整节点定义。
   - 基于已有Machine做模板修改后创建新Machine。
2. **与query_toolkit的区别**：
   - query_toolkit查询Machine返回的是运行时对象状态（ObjectMachine）。
   - machineNode2file导出的是节点定义（node tree），可直接用于创建新Machine。
3. **工作流程**：
   ```
   machineNode2file(已有MachineID) → 本地编辑文件 → onchain_operations(machine, node.type="file", node.file=编辑后的文件)
   ```
4. **format选择**：
   - json：机器友好，适合程序化编辑。
   - markdown：人类友好，适合手动编辑和阅读。
5. **NodeField的两种模式**：
   - 增量模式：直接传入node数组做增量修改。
   - 完整替换模式：传入json/markdown文件路径，系统从文件加载完整节点定义替换现有定义。
