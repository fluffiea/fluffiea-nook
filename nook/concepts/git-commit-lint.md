---
title: Git 提交规范配置指南
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [git, commit-lint, git-hooks]
---

# Git 提交规范配置指南

> Commitizen + Commitlint + Husky 一站式实现

## 创建项目

```bash
# 创建项目目录
mkdir project-name
cd project-name
# 添加 git 管理
git init
# 添加 npm 管理
npm init
```

## 安装依赖

**npm：**
```bash
npm install --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky
```

**pnpm：**
```bash
pnpm add --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky
```

## 在 package.json 中添加配置

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

## 初始化 Husky

```bash
npx husky init
```

详见 [[husky]]。

## 删除默认的 pre-commit

文件路径：`.husky/pre-commit`

## 创建 commit-msg

创建文件：`.husky/commit-msg`，内容：

```bash
npx commitlint --edit $1
```

如果该文件权限不够，需要为其添加可执行权限。

## 创建 commitlint 配置

创建文件：`commitlint.config.js`

**CommonJS：**
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

**ES Modules：**
```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never']
  }
};
```

## 使用

- 不规范的提交会失败
- `npm run commit` 使用交互式提交
- `npm run cm` 执行 `git add .` + `npm run commit`

## commitizen 关键词

### 核心关键词

| 关键词 | 使用场景 | 示例 |
| :----- | :------- | :--- |
| **`feat`** | 新功能、新特性 | `feat: 添加用户登录功能` |
| **`fix`** | 修复 bug | `fix: 修复按钮点击无效的问题` |
| **`docs`** | 文档更新 | `docs: 更新 API 文档` |

### 辅助关键词

| 关键词 | 使用场景 | 示例 |
| :----- | :------- | :--- |
| **`style`** | 代码风格调整（不影响逻辑） | `style: 调整代码缩进` |
| **`refactor`** | 代码重构（既不是新功能也不是修复） | `refactor: 重构用户验证逻辑` |
| **`test`** | 测试相关 | `test: 添加登录功能测试用例` |
| **`chore`** | 构建过程或辅助工具变动 | `chore: 更新 webpack 配置` |

### 特殊关键词

| 关键词 | 使用场景 | 示例 |
| :----- | :------- | :--- |
| **`perf`** | 性能优化 | `perf: 优化图片加载性能` |
| **`ci`** | CI 配置变更 | `ci: 添加 GitHub Actions 配置` |
| **`build`** | 构建系统或外部依赖变更 | `build: 升级 TypeScript 版本` |
| **`revert`** | 回退提交 | `revert: 回退某次错误提交` |
