---
title: autossh — 自动重连的 SSH 隧道利器
created: 2026-06-04
updated: 2026-06-04
type: concept
tags: [ssh, tunnel, networking, mac, linux]
---

> autossh 是一个自动重启 SSH 会话的工具，专为不稳定的网络环境设计——隧道断了自动重连，用户无感。

## 适用场景

- 挂 VPN / 代理时 SSH 频繁断连
- 需要长期保持端口转发（如本地 `9119` 口连远程 Kanban）
- 服务器重启后自动重建隧道

## 安装

**macOS（Homebrew）**
```bash
brew install autossh
```

**Linux（Debian/Ubuntu）**
```bash
apt install autossh
```

## 基本用法

### 端口转发隧道

```bash
autossh -M 0 -L 9119:localhost:9119 fluffiea@66.154.100.245
```

- `-M 0` — 不另开监控端口，使用 SSH 自身的心跳保活
- `-L 本地端口:目标地址:远程端口 用户@主机` — 端口转发规则

支持所有 SSH 标准参数（`-N` 不执行命令、`-f` 后台运行等）。

### 搭配 SSH Config

在 `~/.ssh/config` 中：

```
Host kanban-server
    HostName 66.154.100.245
    User fluffiea
    ServerAliveInterval 30
    ServerAliveCountMax 5
```

然后：
```bash
autossh -M 0 -L 9119:localhost:9119 kanban-server
```

### 结合 tmux 使用

在服务器上用 tmux 跑 autossh，断开后重登还能看到日志：

```bash
# 登录服务器
ssh fluffiea@66.154.100.245

# 建一个 tmux 会话
tmux new -s tunnel

# 在里面跑 autossh（因为是服务器本地，转发到 localhost）
autossh -M 0 -L 9119:localhost:9119 localhost
```

## macOS：配置开机自启（launchctl）

如果希望 macOS 启动后自动建立隧道，可以配一个 `launchd` plist：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.autossh.kanban-tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/autossh</string>
        <string>-M</string>
        <string>0</string>
        <string>-L</string>
        <string>9119:localhost:9119</string>
        <string>fluffiea@66.154.100.245</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/autossh-tunnel.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/autossh-tunnel.log</string>
</dict>
</plist>
```

保存到 `~/Library/LaunchAgents/com.autossh.kanban-tunnel.plist`，然后加载：

```bash
launchctl load ~/Library/LaunchAgents/com.autossh.kanban-tunnel.plist
```

## 原理

autossh 会启动一个 SSH 子进程，然后用另一个连接定期 ping 远端，确认隧道还活着。如果发现 ping 不通，就杀掉旧的 SSH 进程，重新建一个。对用户来说，本地的转发端口几乎不会感觉到断连。

> 相比单纯的 SSH `ServerAliveInterval`，autossh 是**真的检测到断开后主动重连**，而不是靠 TCP keepalive 让连接晚断一会儿。

## 相关笔记

- [[ssh]] — SSH 端口转发与基础用法
