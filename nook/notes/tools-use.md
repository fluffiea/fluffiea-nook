# 一些工具的使用记录

## scoop

```bash
scoop update # 更新 scoop 目录
scoop search <pkg> # 搜索应用
scoop install <pkg> # 安装应用
scoop uninstall <pkg> # 现在应用
scoop update <pkg> # 更新应用
scoop update * # 更新所有应用
```

## nvm
```bash
nvm --version # 查看 nvm 版本
nvm list # 列出已安装的所有 node 版本
nvm install node # 安装最新版本 node
nvm install --lts # 安装最新 LTS 版本
nvm install <version> # 安装指定 node 版本
nvm uninstall <version> # 卸载指定 node 版本
nvm use <version> # 在当前终端使用指定版本
nvm alias default <version> # 设置默认 node 版本
nvm current # 查看当前使用的 node 版本
```

## uv

```bash
uv --version # 查看 uv 版本
uv help # 查看帮助
uv cache clean # 清理缓存

uv init # 在当前项目初始化新项目
uv init <name> # 创建指定名称的项目目录并初始化
uv add <pkg> # 添加依赖包
uv add --dev <pkg> # 添加开发依赖
uv remove <pkg> # 移除依赖包
uv sync # 同步安装所有依赖（根据 pyproject.toml 和 uv.lock）
uv lock # 生成/更新 uv.lock 锁文件

uv venv # 创建虚拟环境
uv venv <path> # 在指定环境创建虚拟环境
uv venv --python <version> # 根据指定版本创建虚拟环境

uv python list # 列举出可安装的 python 版本
uv python install <version> # 安装指定 python 版本
uv python uninstall <version> # 卸载指定 python 版本
uv python pin <version> # 为项目指定 python 版本
```

