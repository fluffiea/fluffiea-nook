---
title: Lint-Staged
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [git, git-hooks]
---

# ✨ Lint-Staged

`lint-staged` 只针对 Git 暂存区的修改运行检查或格式化任务，无需对整个项目检查，大大提升效率。

需要搭配 [[husky]] 中的钩子来执行。

## 📥 安装

**npm：**
```bash
npm install --save-dev lint-staged
```

**pnpm：**
```bash
pnpm add --dev lint-staged
```
