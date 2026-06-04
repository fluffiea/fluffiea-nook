# Wiki Log

> 按时间顺序记录所有 Wiki 操作。仅追加。

## 2026-06-04

### restructure
- [[autossh]] — 补充 Linux systemd 服务示例、AUTOSSH_GATETIME 说明、验证方法、端口排查；添加 `> [!tip]` 和 `> [!warning]` callout 补齐 nook-wiki-standard 规范

### create
- [[ssh]] — SSH 端口转发：隧道原理、操作方法、SSH Config、常见问题排查
- [[autossh]] — SSH 隧道自动重连神器：安装、用法、macOS 开机自启、对比普通 ssh keepalive 的区别

### restructure
- [[autossh]] — 统一风格：H1 加 emoji `🔄`、精简结构、对齐 ssh/frp 行文风格
- [[frp]] — 9 个 H2 全部补 emoji（🔍📥📤⚙️⚙️🚀🔧☁️✅）
- [[ssh]] — `## 概述` → `## 🔍 概述`
- [[autossh]] — `## 适用场景` → `## 🎯 适用场景`
- SCHEMA.md — H2 风格规范对齐 skill：**所有二级标题必须加 emoji**，新增完整 emoji 对照表
- [[CPU-架构对比]] — 加 emoji 小节标题、加 callout、代码块加语言标签
- [[Ubuntu-安装指南]] — 二级标题去掉中文数字序号（一、二、三…十）
- [[nvm]] — 加设置默认版本的 tip callout
- [[lint-staged]] — 加配合 husky 的 tip callout

## 2026-06-03

### create
- [[frp]] — frp 内网穿透工具笔记：下载选型、scp 传输、frpc/frps 配置、systemd 服务
- [[linux]] — 从安装实践中提取的 Linux 命令分类汇总
- [[Ubuntu-安装指南]] — 小米笔记本 Linux 安装踩坑文档
- Wiki 初始化：SCHEMA.md、index.md、log.md，迁移 6 篇笔记至 concepts/
- 修复 uv.md 安装命令错误

### restructure
- [[frp]] — 修复 `!>` 语法为 Obsidian 标准 callout，添加 H1 标题 emoji
- `comparisons/` 目录激活，写入 SCHEMA.md
- `CPU-架构选型` → `comparisons/CPU-架构对比`（更适合放在对比目录）
- `Linux-目录规范` 合并入 `linux.md`（扩展目录结构章节），删除单独文件
