# husky

`husky` 是 `git` 提交钩子，用于在执行 `git`操作的时候，自动化检查提交信息，检查代码，运行测试等等

## 📥 安装

::: tabs

== npm

```bash
npm install --save-dev husky
```

== pnpm

```bash
pnpm add --save-dev husky
```

:::

## ⚙️ 初始化

::: tabs

== npm

```bash
npx husky init
```

== pnpm

```bash
pnpm exec husky init
```

:::

初始化结束之后，`husky` 会做这些事：

- 会在项目根目录下创建一个 `.husky` 的文件夹，并在在里面创建一个 `pre-commit` 脚本

- 会更新 `package.json` 中的 `prepare` 脚本

  ```json
  {
    "scripts": {
      "prepare": "husky",
      // 当别人执行 npm install 这些初始化操作的时候，这里的 prepare 脚本会自动运行
      // 这里的 husky 脚本执行会让 git 钩子目录执行 .husky 目录，也就是只有执行了这里的 husky 方法，才能在执行 git 操作的时候正确触发 .husky 里的钩子
    },
  }
  ```

- 将 `git` 的钩子目录执行 `.husky` 目录
