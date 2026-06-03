---
title: UV
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [python, package-manager, version-manager]
---

# 🐍 UV

`uv` 是一个 Python 包与项目管理工具，由 Rust 编写，速度极快。

> [!tip] 为什么用 uv？
> 传统 `pip` + `venv` 的速度比较慢，uv 用 Rust 重写后快 10~100 倍，且完全兼容 pip 的生态。

## 📥 安装

```bash
# Windows 上使用 scoop 安装
scoop install uv

# Mac 上使用 brew 安装
brew install uv
```

也可通过 [[scoop]] 一键安装。

## ⚙️ 常用命令

```bash
uv --version                     # 查看 uv 版本
uv help                          # 查看帮助
uv cache clean                   # 清理缓存

uv init                          # 在当前目录初始化项目
uv init <name>                   # 创建指定名称的项目目录并初始化
uv add <pkg>                     # 添加依赖包
uv add --dev <pkg>               # 添加开发依赖
uv remove <pkg>                  # 移除依赖包
uv sync                          # 同步安装所有依赖
uv lock                          # 生成/更新 uv.lock 锁文件

uv venv                          # 创建虚拟环境
uv venv <path>                   # 在指定路径创建虚拟环境
uv venv --python <version>       # 根据指定版本创建虚拟环境

uv python list                   # 列出可安装的 python 版本
uv python install <version>      # 安装指定 python 版本
uv python uninstall <version>    # 卸载指定 python 版本
uv python pin <version>          # 为项目指定 python 版本
```
