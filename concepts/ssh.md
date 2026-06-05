---
title: SSH 端口转发（隧道）
created: 2026-06-04
updated: 2026-06-04
type: concept
tags: [ssh, linux, network, remote]
---

# 🔌 SSH 端口转发（隧道）

## 🔍 概述

SSH 端口转发（也叫 SSH 隧道）可以在本地电脑和远程服务器之间建立一条加密通道，把服务器的某个端口"映射"到本地端口，让你像访问本地服务一样访问远程服务。

**适用场景：** 远程访问服务器上的 Web 管理界面（如 [[frp|Hermes Dashboard、Immich]]），但不想对外暴露端口。

> [!tip] 为什么不直接 --host 0.0.0.0？
> 直接绑定 `0.0.0.0` 会让服务暴露在公网上，没有加密和认证的话任何人都可能访问。SSH 隧道走加密通道，只对你本地开放，安全得多。

## 📡 工作原理

```
你的 Mac（本地）                 服务器（nest）
    │                               │
    ├── :9119 ── SSH 加密隧道 ──→ localhost:9119
    │        （数据全程加密）       （Hermes Dashboard）
    │
    浏览器打开 http://localhost:9119
```

就像在墙上打了一条专属秘密管道，只有你能用~

## 🚀 基本操作

### 第一步：建立隧道并登录

在 **本地终端** 执行：

```bash
ssh -L 9119:localhost:9119 fluffiea@66.154.100.245
```

| 参数 | 说明 |
|:----|:-----|
| `-L` | Local，做本地端口转发 |
| `9119` | 你 Mac 上用的本地端口 |
| `localhost:9119` | 要转发的目标（服务器上的端口） |
| `fluffiea@66.154.100.245` | SSH 登录信息 |

这条命令同时做了两件事：SSH 登录到服务器 + 打通端口隧道。

### 第二步：启动服务

SSH 登录进去后，在服务器上运行：

```bash
hermes dashboard
```

看到输出 `Hermes Web UI → http://127.0.0.1:9119` 就说明跑起来了。

### 第三步：本地访问

打开 Mac 浏览器，地址栏输入 `http://localhost:9119`，就能看到 Dashboard 了。

> [!tip] 端口号从哪里来？
> 不知道服务端口的话，先跑服务看它打印的输出，第一行通常会告诉你端口号。

## 🔗 多个端口同时转发

一个 SSH 命令可以转发多个端口：

```bash
ssh -L 9119:localhost:9119 -L 2283:localhost:2283 fluffiea@66.154.100.245
```

这样：
- `http://localhost:9119` → Hermes Dashboard
- `http://localhost:2283` → Immich

## ⏳ 后台运行（不进入交互式 Shell）

如果只想打隧道，不想在服务器上操作：

```bash
ssh -L 9119:localhost:9119 -N -f fluffiea@66.154.100.245
```

| 参数 | 说明 |
|:----|:-----|
| `-N` | 不执行远程命令（只打隧道） |
| `-f` | 后台运行 |

关闭后台隧道：

```bash
ps aux | grep "ssh -L"    # 找到进程
kill <PID>                 # 杀掉
```

## ⚡ 用 SSH Config 简化

如果经常要连，在 Mac 的 `~/.ssh/config` 里配个快捷方式：

```
Host nest
    HostName 66.154.100.245
    User fluffiea
    LocalForward 9119 localhost:9119
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

之后只需要 `ssh nest` 就能连上，隧道自动打好。多个端口也写在配置里：

```
Host nest
    HostName 66.154.100.245
    User fluffiea
    LocalForward 9119 localhost:9119
    LocalForward 2283 localhost:2283
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

> [!tip] ServerAliveInterval 是干嘛的？
> SSH 默认不发心跳包，中间网络设备会断开空闲连接（这就是为什么连两分钟就断）。设成 `30` 表示每 30 秒发一次心跳，保持连接活跃。

## 🛑 取消隧道

| 方式 | 操作 |
|:----|:-----|
| 关终端窗口 | 直接关掉 SSH 所在的窗口 |
| `Ctrl + C` | 退出当前 SSH 登录 |
| `Ctrl + D` | 退出当前 SSH 登录 |
| 杀进程 | `ps aux \| grep ssh` → `kill <PID>` |

隧道跟着 SSH 连接走，SSH 一断隧道就没了，不会有残留。

## 🐛 常见问题

### 打开 localhost:9119 显示无法连接？

1. 确认 SSH 隧道已建立（SSH 已登录成功）
2. 确认服务器上的服务已启动
3. 确认端口号对不对——先跑服务看输出
4. 检查 `-L` 格式：`-L 本地端口:localhost:服务器端口`

> [!warning] channel open failed: Connection refused
> 端口号不对。服务可能跑在别的端口上，先跑服务看它打印的端口号。

### 连接两分钟就断？

SSH 没发心跳包，中间网络设备把空闲连接掐了。在 Mac 的 `~/.ssh/config` 加上：

```
Host *
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

## 🌐 Host * 通配符

`Host *` 匹配所有 SSH 连接，后面的参数变成全局默认值。

```ini
Host *                             # 所有连接都适用
    ServerAliveInterval 30         # 每30秒发一次心跳
    ServerAliveCountMax 3          # 收不到3次心跳就断开
```

如果某个特定主机也写了同样的字段（比如 `Host fufu` 里也写 `ServerAliveInterval 30`），是多写但没坏处——`Host *` 已经覆盖了所有连接，子主机的重复字段效果一样。

### 多主机配置示例

```ini
Host git.yottabyte.cn
    HostName git.yottabyte.cn
    Port 29418
    User qin.xiaolong
    HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedKeyTypes +ssh-rsa

Host *
    ServerAliveInterval 30
    ServerAliveCountMax 3

Host fufu
    HostName 66.154.100.245
    User fluffiea

Host dashboard
    HostName 66.154.100.245
    User fluffiea
    LocalForward 9119 localhost:9119
```

| 命令 | 效果 |
|:----|:-----|
| `ssh fufu` | 登录到 nest，可在终端里跑 `hermes` 聊天 |
| `ssh dashboard` | 登录 + 自动打通 9119 隧道，浏览器开 `http://localhost:9119` |

### -L 0.0.0.0:9119:localhost:9119 是什么？

让局域网其他设备也能通过你 Mac 的 IP 访问隧道。注意安全风险。

## 📋 端口速查

| 服务 | 默认端口 | 说明 |
|:----|:--------|:-----|
| Hermes Dashboard | 9119 | Web 管理界面 |
| Immich | 2283 | 照片管理 |
| SSH | 22 | 远程登录 |
