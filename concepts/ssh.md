---
title: SSH 端口转发（隧道）
created: 2026-06-04
updated: 2026-06-04
type: concept
tags: [ssh, linux, network, remote]
---

# SSH 端口转发（隧道）

## 场景
远程访问服务器上的本地服务（如 Hermes Dashboard、[[frp|内网穿透]]的服务等 Web UI），但不想对外暴露端口（`--host 0.0.0.0` 不安全）。

## 原理
在本地电脑和服务器之间建立一条加密的 SSH 通道，把服务器上的某个端口"映射"到本地端口。

```
你的 Mac（天津）
    │
    ├── 浏览器打开 http://localhost:9119
    │
    ├── SSH 客户端
    │   └── 本地 9119 端口
    │       │
    │       ├── SSH 加密隧道（互联网）
    │       │   ├── 数据全程加密，中间节点无法偷看
    │       │   └── 走 22 端口，防火墙一般不拦
    │       │
    │       └── 服务器 nest（海外）
    │           └── localhost:9119（Hermes Dashboard）
    │
    就像在墙上打了一条专属秘密管道~
```

## 基本用法

### 第一步：建立隧道并 SSH 登录
在 **本地终端** 执行：
```bash
ssh -L 本地端口:localhost:服务器端口 用户名@服务器IP
```

**参数解释：**
- `-L` = Local，做本地端口转发
- `本地端口` = 你 Mac 上用来访问的端口（随便选，只要没被占用）
- `localhost:服务器端口` = 要转发的目标（服务器上的服务端口）
- `用户名@服务器IP` = SSH 登录信息

**示例（Hermes Dashboard）：**
```bash
ssh -L 9119:localhost:9119 fluffiea@66.154.100.245
```
这条命令做了两件事：
1. SSH 登录到服务器
2. 同时把服务器的 9119 端口映射到你 Mac 的 9119 端口

### 第二步：在服务器上启动服务
SSH 登录进去后，在服务器终端运行：
```bash
hermes dashboard
```
看到输出 `Hermes Web UI → http://127.0.0.1:9119` 就说明跑起来了。

### 第三步：本地浏览器访问
打开 Mac 浏览器，地址栏输入：
```
http://localhost:9119
```
就能看到 Hermes Dashboard 了。

---

## 多个端口同时转发

一个 SSH 命令可以转发多个端口，用多个 `-L` 就行：
```bash
ssh -L 9119:localhost:9119 -L 2283:localhost:2283 fluffiea@66.154.100.245
```
这样：
- `http://localhost:9119` → Hermes Dashboard
- `http://localhost:2283` → Immich（如果服务器上跑了）

---

## 后台运行（不进入交互式 Shell）

有时候只想打隧道，不想在服务器上操作，可以用：
```bash
ssh -L 9119:localhost:9119 -N -f fluffiea@66.154.100.245
```

**参数解释：**
- `-N` = 不执行远程命令（只打隧道，不进 Shell）
- `-f` = 后台运行（SSH 在后台跑，终端可以继续干别的）

**关闭后台隧道：**
```bash
# 找到 SSH 进程
ps aux | grep "ssh -L"
# 干掉它
kill <进程ID>
```
或者直接重启 Mac 也行。

---

## 用 SSH Config 简化命令

如果经常要连，可以在 Mac 的 `~/.ssh/config` 里配个"快捷方式"：

```
Host nest
    HostName 66.154.100.245
    User fluffiea
    LocalForward 9119 localhost:9119
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

然后每次只需要：
```bash
ssh nest
```
连上后直接 `hermes dashboard`，隧道自动就打了。

### 多条转发也写在配置里：
```
Host nest
    HostName 66.154.100.245
    User fluffiea
    LocalForward 9119 localhost:9119
    LocalForward 2283 localhost:2283
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

---

## 取消隧道

| 方式 | 操作 |
|:---|:-----|
| 关终端窗口 | 直接关掉 SSH 所在的窗口 |
| Ctrl + C | 退出当前 SSH 登录 |
| Ctrl + D | 退出当前 SSH 登录 |
| 杀进程 | `ps aux \| grep ssh` 找到 PID 后 `kill <PID>` |
| 后台隧道 | `kill` 杀掉对应进程 |

隧道跟着 SSH 连接走，SSH 一断隧道就没了，**不会有残留**。

---

## 常见问题

### Q：打开 `http://localhost:9119` 显示无法连接？
**排查步骤：**
1. 确认 SSH 隧道已经建立（SSH 已登录成功）
2. 确认服务器上的服务已经启动（`hermes dashboard` 已运行）
3. 确认端口号对不对——先跑服务看它打印的端口号
4. 检查 `-L` 参数格式：`-L 本地端口:localhost:服务器端口`

### Q：`channel open failed: Connection refused`？
端口号不对。服务可能跑在别的端口上，先跑服务看输出。

### Q：连接两分钟就断？
SSH 没有发心跳包，中间网络设备把空闲连接掐了。在 Mac 的 `~/.ssh/config` 加上：
```
Host *
    ServerAliveInterval 30
    ServerAliveCountMax 3
```
或者只在针对这个服务器：
```
Host 66.154.100.245
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

### Q：`-L 0.0.0.0:9119:localhost:9119` 是什么意思？
让局域网其他设备也能通过你 Mac 的 IP 访问隧道。但要注意安全，别人连到你 Mac 也能访问服务器服务。

---

## 常用端口速查

| 服务 | 默认端口 | 说明 |
|:---|:--------|:-----|
| Hermes Dashboard | 9119 | Hermes 的 Web 管理界面 |
| Immich | 2283 | 照片管理 |
| SSH 本身 | 22 | 远程登录 |

---

## 补充：`--insecure` 快捷方式

如果嫌隧道麻烦，且服务器只有你自己用，可以直接：
```bash
hermes dashboard --host 0.0.0.0 --insecure
```
然后在浏览器打开 `http://服务器IP:9119`。
**但这样没有加密，其他人如果知道 IP 也能访问。**
