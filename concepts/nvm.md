---
title: NVM
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [node, version-manager]
---

# NVM

`nvm` 是一个 Node.js 版本管理工具。

## 安装

```bash
# Windows 上使用 scoop 安装
scoop install nvm

# Mac 上使用 brew 安装
brew install nvm
```

也可通过 [[scoop]] 一键安装。

## 常用命令

```bash
nvm --version                # 查看 nvm 版本
nvm list                     # 列出已安装的所有 node 版本
nvm install node             # 安装最新版本 node
nvm install --lts            # 安装最新 LTS 版本
nvm install <version>        # 安装指定 node 版本
nvm uninstall <version>      # 卸载指定 node 版本
nvm use <version>            # 在当前终端使用指定版本
nvm alias default <version>   # 设置默认 node 版本
nvm current                  # 查看当前使用的 node 版本
```