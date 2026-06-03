# Wiki Schema

## Domain
开发工具与工作流笔记 — Git 工具链、包管理器、版本管理工具的使用记录。

## Conventions
- 文件名：小写字母、连字符分隔（如 `git-commit-lint.md`）
- 每篇笔记以 YAML frontmatter 开头
- 使用 `[[wikilinks]]` 链接相关笔记（每篇至少 1 个出站链接）
- 新增/更新笔记时同步更新 `index.md` 和 `log.md`

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
- 工具: git, node, python, windows
- 类别: package-manager, version-manager, git-hooks, commit-lint
- 平台: windows, mac, linux

## Page Thresholds
- 一个工具/概念独立成一篇笔记
- 关联紧密的工具在笔记内通过 wikilinks 互链
- 超过 200 行考虑拆分子页面
