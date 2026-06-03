---
title: CPU 架构选型指南
created: 2026-06-03
updated: 2026-06-03
type: concept
tags: [linux, arch, cpu]
---

# 🖥️ CPU 架构选型指南

下载软件时经常不知道该选哪个包——`amd64`？`x86_64`？`arm64`？看完这篇就不会再选错了。

## 快速判断

在终端跑一条命令就知道（详见 [[linux]]）：

| 系统 | 命令 |
|:----|:-----|
| Linux / macOS | `uname -m` |
| Windows | `echo %PROCESSOR_ARCHITECTURE%` |

## 结果对照表

| `uname -m` 输出 | Windows 版 | 对应下载 | 说明 |
|:---------------|:-----------|:---------|:-----|
| `x86_64` | `AMD64` | `linux_amd64` / `win64` | ✅ **最常见**，Intel/AMD 桌面电脑和笔记本 |
| `aarch64` | `ARM64` | `linux_arm64` / `darwin-arm64` | Apple M 系列芯片、树莓派 4/5、手机 |
| `armv7l` | `ARM` | `linux_arm` / `armv7` | 旧树莓派、旧安卓设备 |
| `i686` / `i386` | `x86` | `linux_386` / `win32` | 古董电脑（基本绝迹） |

## Intel 和 AMD 可以混用吗？

**可以。** Intel 和 AMD 的桌面/笔记本 CPU 是同一个架构：`x86_64`。

| 你的电脑 | 下载时选 |
|:---------|:---------|
| Intel 芯片 | ✅ `amd64` **或** `x86_64` |
| AMD 芯片 | ✅ `amd64` **或** `x86_64` |
| Apple M 系列 | ✅ `arm64` |
| 树莓派 | ✅ `arm64` 或 `armv7` |

记住一句话：**凡是你买得到的桌面/笔记本（除了 Mac M 系列），全选 `amd64`，不可能选错。**

## 为什么有两个名字？

历史上 AMD 先搞出了 64 位扩展技术，取名叫 **AMD64**。Intel 后来跟进了同样的标准，但面子上过不去，就改叫 **Intel 64** 或 **x86_64**。

| 名字 | 谁起的 |
|:----|:------|
| `amd64` | AMD 率先搞出来的技术 |
| `x86_64` | Linux 社区用的通用叫法（不想偏袒任何一家） |

它俩是**同一个东西**，随便选。

## 举例

去 GitHub Releases 页面下载 frp，看到这些文件：

```
frp_0.61.0_linux_amd64.tar.gz     ← 小米笔记本（x86_64）✅
frp_0.61.0_linux_arm64.tar.gz     ← 树莓派或 Apple M 系列
frp_0.61.0_darwin_amd64.tar.gz    ← Intel 芯片的 Mac
frp_0.61.0_darwin_arm64.tar.gz    ← Apple Silicon 的 Mac
frp_0.61.0_windows_amd64.zip      ← Windows 电脑
```

一目了然。
