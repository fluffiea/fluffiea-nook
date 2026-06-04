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
- 需要长期保持端口转发（如本地 9119 口连远程服务）
- 服务器重启后自动重建隧道

> [!tip] 什么时候用哪种？
> **短时任务**直接用 `ssh` 即可；**需要长期保持的连接**（端口转发、远程开发）才用 autossh。

## 📥 安装

**macOS：**
```bash
brew install autossh
```

**Linux（Debian/Ubuntu）：**
```bash
sudo apt install autossh
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

> [!warning] `-M` 参数说明
> 旧版 autossh 用 `-M <port>` 开启独立监控端口（需要远端也开放端口）；新版推荐 `-M 0`，直接复用 SSH 自身的 `ServerAliveInterval` 心跳检测。**大部分场景用 `-M 0` 就够了。**

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

> [!tip] SSH Config 的好处
> 把连接参数写进 config 后，autossh 命令简洁很多，而且 `ssh nest`、`scp file nest:~/` 也都用同一套配置。

### 结合 tmux

在服务器上用 tmux 跑 autossh，断开重登还能看到日志：

```bash
ssh fluffiea@66.154.100.245
tmux new -s tunnel
autossh -M 0 -L 9119:localhost:9119 localhost
```

## ⚙️ 开机自启（Linux — systemd）

创建 systemd 服务：

```bash
sudo tee /etc/systemd/system/autossh-tunnel.service > /dev/null <<'EOF'
[Unit]
Description=AutoSSH tunnel for kanban
After=network-online.target
Wants=network-online.target

[Service]
Environment="AUTOSSH_GATETIME=0"
ExecStart=/usr/bin/autossh -M 0 -L 9119:localhost:9119 fluffiea@66.154.100.245 -N
Restart=always
RestartSec=10
User=fluffiea

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now autossh-tunnel
```

管理命令：

```bash
sudo systemctl status autossh-tunnel    # 查看状态
sudo systemctl restart autossh-tunnel   # 重启
sudo systemctl stop autossh-tunnel      # 停止
sudo journalctl -u autossh-tunnel -f    # 查看日志
```

> [!tip] AUTOSSH_GATETIME=0 的作用
> 默认 autossh 会等待第一个 SSH 连接稳定后才开始监控（约 30 秒的 gate 时间）。设 `AUTOSSH_GATETIME=0` 可以**立即开始重连检测**，适合开机自启场景——网卡起来就立刻连，失败了马上重试。

## ⚙️ 开机自启（macOS — launchd）

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

## ✅ 验证是否正常工作

```bash
# 检查进程是否在跑
pgrep -la autossh

# 检查端口是否在监听
ss -tlnp | grep 9119
# 或 macOS 用
lsof -i :9119
```

> [!warning] 端口占用
> 如果 autossh 报 `port already in use`，说明本地端口已被占用。先 `fuser -k 9119/tcp`（Linux）或 `kill $(lsof -ti :9119)`（macOS）杀掉旧进程，再启动。

## 💡 原理说明

autossh 启动一个 SSH 子进程，再用另一个连接定期 ping 远端，确认隧道还活着。发现 ping 不通就杀掉旧进程、重建新连接。对用户来说，本地的转发端口几乎感觉不到断连。

> 相比 SSH 自身的 `ServerAliveInterval`（被动保活），autossh 是**主动检测断开后重连**。
