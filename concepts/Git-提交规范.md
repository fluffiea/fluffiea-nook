---
title: Git 提交规范配置指南
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [git, commit-lint, git-hooks]
---

# 🔧 Git 提交规范配置指南

> Commitizen + Commitlint + Husky 一站式实现

## 📦 安装依赖

**npm：**
```bash
npm install --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky
```

**pnpm：**
```bash
pnpm add --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky
```

## ⚙️ package.json 配置

```json
{
  "scripts": {
    "prepare": "husky",
    "commit": "git-cz",
    "cm": "git add . && npm run commit"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

## 🔧 初始化 Husky

```bash
npx husky init
```

详见 [[husky]]。

删除默认的 `pre-commit` 钩子（路径：`.husky/pre-commit`），然后创建 `commit-msg` 文件：

```bash
npx commitlint --edit $1
```

> [!tip] 权限问题
> 如果该文件权限不够，需要为其添加可执行权限。

## 📝 创建 commitlint 配置

创建文件 `commitlint.config.js`：

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never']
  }
};
```

## 🚀 使用

- 不规范的提交会失败
- `npm run commit` 使用交互式提交
- `npm run cm` 执行 `git add .` + `npm run commit`

## 📋 commitizen 关键词速查

### 核心关键词

| 关键词 | 使用场景 | 示例 |
| :----- | :------- | :--- |
| **`feat`** | 新功能上线 | `feat: 添加用户登录功能` |
| **`fix`** | 修复 bug | `fix: 修复按钮点击无效的问题` |
| **`docs`** | 纯文档变更（README、注释、文档站） | `docs: 补充 README 使用说明` |

### 辅助关键词

| 关键词 | 使用场景 | 示例 |
| :----- | :------- | :--- |
| **`style`** | 代码格式调整（空格、缩进、分号等），**不是 CSS/UI 样式** | `style: 修正代码缩进` |
| **`refactor`** | 代码重构，不改变外部行为 | `refactor: 重构用户验证逻辑` |
| **`test`** | 测试相关（增补、修改、重构测试） | `test: 添加登录功能测试用例` |
| **`chore`** | 杂项维护（非构建相关的配置变更） | `chore: 更新 .gitignore 规则` |

### 专项关键词

| 关键词 | 使用场景 | 示例 |
| :----- | :------- | :--- |
| **`perf`** | 性能优化 | `perf: 优化图片加载性能` |
| **`ci`** | CI/CD 配置变更 | `ci: 添加 GitHub Actions 配置` |
| **`build`** | 构建系统或外部依赖变更 | `build: 升级 TypeScript 版本` |
| **`revert`** | 回退提交 | `revert: 回退某次错误提交` |

### ⚠️ 常见混淆点

| 容易搞混的 | 区别说明 |
| :--------- | :------- |
| **`style` ≠ CSS 样式** | `style` 只管代码格式（缩进、空格、分号），改 CSS/Less/Tailwind 里的样式属于 `feat` 或 `refactor` |
| **`chore` ≠ `build`** | `chore` 是杂项维护（`.gitignore`、`.editorconfig` 等非构建配置）；涉及构建系统、依赖升级、Webpack/Vite 配置变更属于 `build` |
| **`refactor` ≠ `perf`** | `refactor` 是整理代码结构，不改行为；`perf` 专门针对性能提升 |
