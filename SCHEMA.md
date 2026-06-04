# Wiki Schema

## Domain
开发工具与工作流笔记 — Git 工具链、包管理器、版本管理工具、SSH/网络工具的使用记录。

## Conventions
- 文件名：小写字母、连字符分隔（如 `git-commit-lint.md`）
- 每篇笔记以 YAML frontmatter 开头
- 使用 `[[wikilinks]]` 链接相关笔记（每篇至少 1 个出站链接）
- 新增/更新笔记时同步更新 `index.md` 和 `log.md`

## 风格规范

### H1 标题
格式：`# <emoji> <标题>`，emoji 放在最前面，跟标题之间空一格。

```
# 🔧 frp — 内网穿透工具
# 🔌 SSH 端口转发（隧道）
# 🐶 Husky
# 🐧 Linux 常用命令学习
```

### 二级标题
- **概述** — 不加 emoji，直接 `## 概述`
- **操作类**（安装、用法、配置等）— 加 emoji，如 `## 📥 安装` `## 🚀 基本用法` `## ⚙️ 初始化`
- **参考类**（常见问题、参数表等）— 加 emoji，如 `## 🐛 常见问题` `## 📋 端口速查`

常用 emoji 对照：

| 小节 | emoji |
|:----|:------|
| 概述 / 概念介绍 | 不加 emoji |
| 安装 | 📥 |
| 用法/基本操作 | 🚀 |
| 配置/初始化 | ⚙️ |
| 常见问题 | 🐛 |
| 快捷键/速查 | 📋 |
| 原理 | 💡 |

### 表格
使用 Markdown 管道表（pipe table），左对齐：

```
| 参数 | 说明 |
|:----|:-----|
| `-L` | Local，本地端口转发 |
```

### Callout（提示框）
使用 Obsidian 标准 callout：

```
> [!tip] 标题
> 内容正文
> 更多内容

> [!warning] 标题
> 警告内容
```

### 代码块
- 始终指定语言标签（`bash`、`toml`、`xml`、`json` 等）
- 命令示例用 `bash`

### 正文风格
- 简洁直接，不啰嗦
- 用中文写正文，英文/命令保持原样
- 适当使用 `（中文括号）` 对命令参数做中文注释说明
- 对话感弱化，偏向工具文档风格
- 每条命令/配置附带使用场景说明

## Frontmatter
```yaml
---
title: 笔记标题
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: concept
tags: [标签1, 标签2]
---
```

## Tag Taxonomy
- 工具: git, node, python, windows, ssh, frp, network
- 类别: package-manager, version-manager, git-hooks, commit-lint, guide
- 平台: windows, mac, linux

## Page Thresholds
- 一个工具/概念独立成一篇笔记
- 关联紧密的工具在笔记内通过 wikilinks 互链
- 超过 200 行考虑拆分子页面

## Directory Layout
- `concepts/` — 概念说明、使用指南、踩坑记录
- `comparisons/` — 工具/方案之间的横向对比分析，每个对比独立一篇
