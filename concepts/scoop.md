---
title: Scoop
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [windows, package-manager]
---

# 🍦 Scoop

`scoop` 是一个 Windows 用户级别的软件安装工具，几乎不会破坏系统环境。

## 📥 安装

以管理员身份打开 PowerShell：

```powershell
# 设置用户级别的环境变量（指定安装路径）
$env:SCOOP = 'D:\scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')

# 允许 PowerShell 执行脚本
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

以**非管理员**身份打开 PowerShell 安装 scoop：

```powershell
# scoop 本身设计就是用户级别的，管理员身份安装会报错
irm get.scoop.sh | iex
```

## 🔄 更换镜像

scoop 可以更换镜像来提升国内下载速度。

**更换主程序镜像**（加速 scoop 本身更新）：

```bash
scoop config SCOOP_REPO <url>
# 例如：https://gitee.com/scoop-installer/scoop
scoop update
```

如果环境中没有 git，此时会提示：
```
Scoop uses Git to update itself. Run 'scoop install git' and try again
```
按提示安装 git，再重新 `scoop update` 即可：

```bash
scoop install git
```

**更换软件仓库镜像**（加速软件包下载）：

```bash
scoop bucket list
scoop bucket rm <bucket>
scoop bucket add <bucket> <url>

# 常用镜像：
# main:     https://gitee.com/scoop-installer/Main
# extras:   https://gitee.com/scoop-installer/Extras
# versions: https://gitee.com/scoop-installer/Versions
# java:     https://gitee.com/scoop-installer/Java

scoop update
```

**使用 scoop-cn 一站式加速：**

```bash
scoop bucket add scoop-cn https://gh-proxy.com/https://github.com/duzyn/scoop-cn.git

# 安装时加前缀
scoop install scoop-cn/<pkg>

# 也可以替代官方 bucket
scoop bucket rm main
scoop bucket add main https://gh-proxy.com/https://github.com/duzyn/scoop-cn.git
```

> [!tip] scoop-cn 是什么？
> 官方包的国内整合版，每日同步数据，对国内网络比较友好。

## ⚡ 加速搜索

安装 `scoop-search` 加速搜索命令：

```bash
scoop install scoop-search
```

单独使用：

```bash
scoop-search <pkg>
```

**无痛替换 `scoop search`：**

编辑 PowerShell 配置文件：

```bash
notepad $PROFILE
```

添加以下内容：

```powershell
Set-Alias -Name scoop-search-orig -Value scoop-search.exe -Option AllScope
function scoop { if ($args[0] -eq "search") { scoop-search-orig @($args | Select-Object -Skip 1) } else { scoop.ps1 @args } }
```

保存后关闭，之后 `scoop search <pkg>` 自动使用 `scoop-search`。

> [!warning] 适用条件
> 此方案仅针对 **PowerShell** 生效，在 `cmd` 中并不适用。

## ⚙️ 常用命令

```bash
scoop search <pkg>            # 搜索应用
scoop install <pkg>           # 安装应用
scoop uninstall <pkg>         # 卸载应用
scoop update                  # 更新 scoop 目录
scoop update <pkg>            # 更新应用
scoop update *                # 更新所有应用
scoop bucket list             # 查看添加的仓库
scoop bucket known            # 列出官方已知仓库
scoop bucket add <b>          # 添加仓库
scoop bucket add <b> <url>    # 添加指定镜像的仓库
scoop bucket rm <b>           # 删除仓库
```
