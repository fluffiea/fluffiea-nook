---
title: x86_64 / amd64 / arm64 架构对比
created: 2026-06-03
updated: 2026-06-04
type: comparison
tags: [linux, arch, cpu]
---

# 🖥️ x86_64 / amd64 / arm64 架构对比

下载软件时经常面临选择困难——选 `amd64`、`x86_64` 还是 `arm64`？

> [!tip] 不确定自己电脑是什么架构？
> 跑一条命令就知道：Linux/Mac 用 `uname -m`，Windows 用 `echo %PROCESSOR_ARCHITECTURE%`。详见 [[linux]] 笔记。

## 🔍 快速判断

| 系统 | 命令 |
|:----|:-----|
| Linux / macOS | `uname -m` |
| Windows | `echo %PROCESSOR_ARCHITECTURE%` |

## 📊 架构对比表

| | amd64 / x86_64 | arm64 (aarch64) | armv7 |
|:--|:---------------|:----------------|:------|
| **适用硬件** | Intel、AMD 桌面/笔记本 CPU | Apple M 系列、树莓派 4/5、手机 | 旧树莓派、旧安卓 |
| **位数** | 64 位 | 64 位 | 32 位 |
| **常见别名** | `x86_64`、`AMD64`、`Intel 64` | `ARM64`、`aarch64` | `arm`、`armv7l` |
| **起源** | AMD 2003 年发明，Intel 后来跟进 | ARM 公司的精简指令集 | ARM v7 旧标准 |

> [!warning] amd64 和 x86_64 是同一个东西
> Intel 和 AMD 的桌面 CPU 都是 `x86_64` 架构，**完全兼容**。名字不同只是因为历史原因——AMD 先搞出来叫 AMD64，Intel 后来跟进不好意思叫 AMD64 就改叫 x86_64。

## 💻 Intel 和 AMD 的架构是同一个

**可以混用。** Intel 和 AMD 的桌面 CPU 都是 `x86_64` 架构，完全兼容。

| 你的电脑 | 下载时选 |
|:---------|:---------|
| Intel 芯片 | ✅ `amd64` **或** `x86_64` |
| AMD 芯片 | ✅ `amd64` **或** `x86_64` |
| Apple M 系列 | ✅ `arm64` |
| 树莓派 4/5 | ✅ `arm64` |
| 旧树莓派 | ✅ `armv7` |

## 📖 为什么 amd64 和 x86_64 是两个名字？

历史上 AMD 先搞出了 64 位扩展，取名 **AMD64**；Intel 后来跟进但面子上过不去，改叫 **x86_64**。它俩是同一个东西。

> [!tip] 可以类比成「特斯拉交流电」和「交流电」
> AMD64 是发明者的名字，x86_64 是通用叫法。就像大家现在都叫「交流电」而不是「特斯拉交流电」。

## 🧪 实战示例

以 frp 下载页面为例：

```text
frp_0.61.0_linux_amd64.tar.gz     ← 小米笔记本 ✅
frp_0.61.0_linux_arm64.tar.gz     ← 树莓派
frp_0.61.0_darwin_amd64.tar.gz    ← Intel Mac
frp_0.61.0_darwin_arm64.tar.gz    ← Apple Silicon Mac
frp_0.61.0_windows_amd64.zip      ← Windows
```
