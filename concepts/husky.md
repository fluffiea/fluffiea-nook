---
title: Husky
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [git, git-hooks]
---

# 🐶 Husky

`husky` 是 Git 提交钩子工具，用于在执行 Git 操作时自动化检查提交信息、检查代码、运行测试等。

常与 [[lint-staged]] 搭配使用，也常用于 [[Git-提交规范]] 的校验流程。

## 📥 安装

**npm：**
```bash
npm install --save-dev husky
```

**pnpm：**
```bash
pnpm add --save-dev husky
```

## ⚙️ 初始化

**npm：**
```bash
npx husky init
```

**pnpm：**
```bash
pnpm exec husky init
```

初始化之后 `husky` 会做两件事：

1. 在项目根目录创建 `.husky/` 文件夹，内含 `pre-commit` 脚本
2. 更新 `package.json` 中的 `prepare` 脚本

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

> [!tip] prepare 的作用
> 别人执行 `npm install` 时会自动运行 `prepare` 脚本，将 Git 钩子目录指向 `.husky/`，这样才能在执行 Git 操作时正确触发钩子。
