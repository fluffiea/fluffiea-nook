# Git 提交规范配置指南
> Commitizen + Commitlint + Husky 一站式实现

## 创建项目
```bash
# 创建项目目录
mkdir project-name
# 进入到项目目录中
cd project-name
# 添加 git 管理
git init
# 添加 npm 管理
npm init
```

## 安装依赖

:::tabs

== npm
```bash
npm install --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky
```

== pnpm
```bash
pnpm add --save-dev commitizen cz-conventional-changelog @commitlint/cli @commitlint/config-conventional husky
```
:::


## 在 package.json 中添加配置
```json
{
  // 添加脚本
  "scripts": {
    "prepare": "husky",
    "commit": "git-cz",
    "cm": "git add . && npm run commit"
  },
  //添加 commitizen 配置
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

## 初始化 Husky
```bash
npm husky init
```

## 删除默认的 pre-commit
文件路径：`.husky/pre-commit`

## 创建 commit-msg
创建文件：`.husky/commit-msg`

文件内容：

```bash
npx commitlint --edit $1
```

如果该文件权限不够，需要为其添加可执行权限

## 创建 commitlint 配置
创建文件：`commitlint.config.js`

文件内容：

:::tabs

== CommonJS
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

== ES Modules
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

:::


## 替换 git 提交 commit

- 不规范的提交会失败
- `npm run commit` 可以使用交互式提交
- `npm run cm` 可以执行 `git add .` 和 `npm run commit` 两个命令


## commitizen 关键词使用场景

### **核心关键词**：

| 关键词     | 使用场景       | 示例                          |
| :--------- | :------------- | :---------------------------- |
| **`feat`** | 新功能、新特性 | `feat: 添加用户登录功能`      |
| **`fix`**  | 修复 bug       | `fix: 修复按钮点击无效的问题` |
| **`docs`** | 文档更新       | `docs: 更新 API 文档`         |

### **辅助关键词**：

| 关键词         | 使用场景                           | 示例                         |
| :------------- | :--------------------------------- | :--------------------------- |
| **`style`**    | 代码风格调整（不影响逻辑）         | `style: 调整代码缩进`        |
| **`refactor`** | 代码重构（既不是新功能也不是修复） | `refactor: 重构用户验证逻辑` |
| **`test`**     | 测试相关                           | `test: 添加登录功能测试用例` |
| **`chore`**    | 构建过程或辅助工具变动             | `chore: 更新 webpack 配置`   |

### **特殊关键词**：

| 关键词       | 使用场景               | 示例                           |
| :----------- | :--------------------- | :----------------------------- |
| **`perf`**   | 性能优化               | `perf: 优化图片加载性能`       |
| **`ci`**     | CI 配置变更            | `ci: 添加 GitHub Actions 配置` |
| **`build`**  | 构建系统或外部依赖变更 | `build: 升级 TypeScript 版本`  |
| **`revert`** | 回退提交               | `revert: 回退某次错误提交`     |