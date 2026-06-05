---
title: SSH on Windows — 配置与排坑
created: 2026-06-04
updated: 2026-06-04
type: concept
tags: [ssh, windows, powershell, port-forwarding]
---

# 💻 SSH on Windows — 配置与排坑

Windows 自带的 OpenSSH 跟 Linux/macOS 行为有些差异，主要是密钥和认证方式导致的连接问题。

## 📥 SSH 别名配置

在 `~/.ssh/config` 中配置别名，避免每次敲完整命令：

```text
Host fufu
    HostName 66.154.100.245
    User fluffiea
    LocalForward 9119 localhost:9119
    PreferredAuthentications password
    KbdInteractiveAuthentication yes
```

> [!tip] 配置文件位置
> Windows 路径：`C:\Users\<用户名>\.ssh\config`（没有后缀名，不是 `config.txt`）
> 如果文件不存在：`mkdir C:\Users\<用户名>\.ssh -Force` 建目录，然后用 `notepad` 创建

### ⌨️ 常用命令

```powershell
# 连服务器（自动带端口转发）
ssh fufu

# 不配别名时的完整命令
ssh -L 9119:localhost:9119 fluffiea@66.154.100.245

# 查看调试信息
ssh -vvv fluffiea@66.154.100.245
```

## 🐛 常见问题

### 连接卡住、没反应

**原因：** Windows OpenSSH 默认先试密钥认证，没有密钥就 silent 卡住，不弹密码框。

**解决：**

```powershell
# 强制走密码认证
ssh -o PreferredAuthentications=password fluffiea@66.154.100.245

# 或启用键盘交互认证
ssh -o KbdInteractiveAuthentication=yes fluffiea@66.154.100.245
```

> [!warning] 配置文件中也要写这两行
> ```
> PreferredAuthentications password
> KbdInteractiveAuthentication yes
> ```
> 否则默认仍然是 pubkey 优先，每次都要手动加参数。

### Connection refused / closed

```powershell
# 清掉 known_hosts（服务器重装或 IP 变化时）
Remove-Item ~/.ssh/known_hosts -Force

# 禁用 GSSAPI（Windows 上偶发的认证延迟）
ssh -o GSSAPIAuthentication=no fluffiea@66.154.100.245
```

### 端口转发（-L）

```powershell
# 手动转发
ssh -L 9119:localhost:9119 fluffiea@66.154.100.245

# 配置文件中已写 LocalForward，因此 ssh fufu 自动带转发
```

> [!tip] 端口转发不会返回 shell 提示符
> `ssh -L` 看起来像卡住了其实是正常的——它在后台保持连接。开浏览器访问 `http://localhost:9119` 就能用。退出按 `Ctrl+C`。

## 🔑 生成 SSH 密钥（可选）

如果不想每次都输密码，可以生成密钥对并传到服务器：

```powershell
# 生成密钥
ssh-keygen -t ed25519

# 传公钥到服务器（需要能用密码登录）
type C:\Users\<用户名>\.ssh\id_ed25519.pub | ssh fluffiea@66.154.100.245 "cat >> ~/.ssh/authorized_keys"
```

## 🚀 Hermes Dashboard 随系统启动

柚子（服务器）上的 dashboard 已配置为 systemd 用户服务，随开机自动启动：

```bash
# systemd 服务名
hermes-dashboard.service

# 查看状态
systemctl --user status hermes-dashboard

# 端口
http://localhost:9119
```

[[ssh]] — SSH 基础概念笔记
