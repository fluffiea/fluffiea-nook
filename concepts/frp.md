---
title: frp — 内网穿透工具
created: 2026-06-03
updated: 2026-06-04
type: concept
tags: [frp, network, tunnel, linux]
---

# 🔧 frp — 内网穿透工具

## 概述

frp（Fast Reverse Proxy）是一个用 Go 编写的内网穿透工具，将内网服务通过一台公网服务器暴露到外网。

**架构：** `frps`（服务端，公网服务器）← `frpc`（客户端，内网机器）

## 下载选型

> [!warning] 下载选型
> 下载时**务必**选择对应操作系统的版本，否则无法执行。

| 平台 | 下载后缀 | 说明 |
|------|---------|------|
| Linux x86_64 | `linux_amd64.tar.gz` | ✅ 大多数 Linux 服务器/电脑 |
| macOS | `darwin_amd64.tar.gz` | ❌ 不是 Linux！ |

> [!tip] 相关文档
> [[CPU-架构对比]] 中解释了 amd64 和 arm64 的区别。

## 文件传输（Windows → Linux）

```powershell
# ❌ 不能直接传到 /opt/（权限不够）
scp frp_0.x.x_linux_amd64.tar.gz fluffiea@192.168.x.x:/opt/frp/
# → Permission denied

# ✅ 先传到 home，再 sudo 移过去
scp frp_0.x.x_linux_amd64.tar.gz fluffiea@192.168.x.x:~/
ssh fluffiea@192.168.x.x
sudo mv ~/frp_0.x.x_linux_amd64 /opt/frp/
```

> [!warning] 踩坑提醒
> 如果下载了 `darwin_amd64` 版本传到 Linux 上会报 `Exec format error`。

## 服务端配置（frps.toml）

跑在公网服务器上（如腾讯云）：

```toml
bindPort = 7000

auth.token = "your_token_here"

# Web 管理面板（可选）
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "your_password"
```

启动：

```bash
./frps -c frps.toml
```

## 客户端配置（frpc.toml）

跑在内网机器上，连接公网服务器的 frps：

```toml
serverAddr = "111.231.71.17"     # 公网服务器 IP
serverPort = 7000                # 跟 frps 的 bindPort 一致
auth.token = "your_token_here"   # 跟 frps 的 token 一致

# 穿透 SSH — 外网连 10000 端口 = 连内网机器的 22 端口
[[proxies]]
name = "ssh-tunnel"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 10000

# 穿透 HTTP 服务（如 Immich）— 外网连 10001 端口 = 连内网 2283
[[proxies]]
name = "immich"
type = "tcp"
localIP = "127.0.0.1"
localPort = 2283
remotePort = 10001
```

## 运行方式

### 临时运行

```bash
cd /opt/frp/
sudo ./frpc -c frpc.toml
```

按 `Ctrl+C` 停止。关掉 SSH 终端后进程也会消失。

### 后台运行（临时）

```bash
sudo nohup ./frpc -c frpc.toml &
```

关 SSH 也不断，想停就 `sudo killall frpc`。

### systemd 服务（推荐，开机自启）

```bash
sudo tee /etc/systemd/system/frpc.service > /dev/null <<'EOF'
[Unit]
Description=frp client
After=network.target

[Service]
ExecStart=/opt/frp/frpc -c /opt/frp/frpc.toml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now frpc
```

管理命令：

```bash
sudo systemctl status frpc    # 查看状态
sudo systemctl restart frpc   # 重启（改配置后用）
sudo systemctl stop frpc      # 停止
sudo systemctl disable frpc   # 取消开机自启
```

## 端口冲突处理

如果 frpc 报 `port already used`：

```bash
# 重启柚子的 frps，清除旧连接
ssh fluffiea@111.231.71.17
killall frps
nohup /path/to/frps -c /path/to/frps.toml > /dev/null 2>&1 &

# 然后重新启动本机的 frpc
```

## 云服务器安全组

腾讯云/阿里云/AWS 等云厂商除了服务器本身的防火墙，还有一层**安全组**。需要添加入站规则：

- **7000/tcp** — frp 控制连接
- **每个 remotePort**（如 10000、10001）— 穿透出去的端口都要放行

## 验证是否连通

```bash
# 从任意机器测试
curl -s -o /dev/null -w "%{http_code}" http://服务器IP:端口
# 返回 200 表示通了
```
