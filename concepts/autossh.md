---
title: autossh — SSH 隧道自动重连工具
created: 2026-06-04
updated: 2026-06-04
type: concept
tags: [ssh, tunnel, networking, mac, linux]
---

# 🔄 autossh — SSH 隧道自动重连工具

`autossh` 是一个自动重启 SSH 会话的工具，连接断了自动重连，用户无感。常用于 VPN/代理不稳定的场景。

关联笔记：[[ssh]]

## 🎯 适用场景

- 挂 VPN / 代理时 SSH 频繁断连
- 需要长期保持端口转发（如本地 9119 口连远程 Kanban）
- 服务器重启后自动重建隧道

## 📥 安装

**macOS：**
```bash
brew install autossh
```

**Linux（Debian/Ubuntu）：**
```bash
apt install autossh
```

## 🚀 基本用法

### 端口转发隧道

```bash
autossh -M 0 -L 9119:localhost:9119 fluffiea@66.154.100.245
```

| 参数 | 说明 |
|:----|:-----|
| `-M 0` | 不另开监控端口，用 SSH 自身心跳 |
| `-L` | 端口转发，格式 `本地端口:目标:远程端口` |

支持所有 SSH 标准参数（`-N` 不执行命令、`-f` 后台运行等）。

### 搭配 SSH Config

在 `~/.ssh/config` 中配好主机别名：

```
Host nest
    HostName 66.154.100.245
    User fluffiea
    ServerAliveInterval 30
    ServerAliveCountMax 5
```

然后：

```bash
autossh -M 0 -L 9119:localhost:9119 nest
```

### 结合 tmux

在服务器上用 tmux 跑 autossh，断开重登还能看到日志：

```bash
ssh fluffiea@66.154.100.245
tmux new -s tunnel
autossh -M 0 -L 9119:localhost:9119 localhost
```

## ⚙️ macOS 开机自启

保存 plist 到 `~/Library/LaunchAgents/com.autossh.kanban-tunnel.plist`：

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

加载：

```bash
launchctl load ~/Library/LaunchAgents/com.autossh.kanban-tunnel.plist
```

## 💡 原理说明

autossh 启动一个 SSH 子进程，再用另一个连接定期 ping 远端，确认隧道还活着。发现 ping 不通就杀掉旧进程、重建新连接。对用户来说，本地的转发端口几乎感觉不到断连。

> 相比 SSH 自身的 `ServerAliveInterval`（被动保活），autossh 是**主动检测断开后重连**。
