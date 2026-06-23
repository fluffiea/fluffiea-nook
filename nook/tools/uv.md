# uv

`uv` 是一个 `python` 管理工具

## 📥 安装

你可以使用任何方式安装，这里列举我常用的两种方式

```bash
# Windows 上使用 scoop 安装
scoop install nvm

# Mac 上使用 brew 安装
brew install nvm
```



## 🖥️ 常用命令

```bash
uv --version                      # 查看 uv 版本
uv help                           # 查看帮助
uv cache clean                    # 清理缓存

uv init                           # 在当前项目初始化新项目
uv init <name>                    # 创建指定名称的项目目录并初始化
uv add <pkg>                      # 添加依赖包
uv add --dev <pkg>                # 添加开发依赖
uv remove <pkg>                   # 移除依赖包
uv sync                           # 同步安装所有依赖（根据 pyproject.toml 和 uv.lock）
uv lock                           # 生成/更新 uv.lock 锁文件

uv venv                           # 创建虚拟环境
uv venv <path>                    # 在指定环境创建虚拟环境
uv venv --python <version>        # 根据指定版本创建虚拟环境

uv python list                    # 列举出可安装的 python 版本
uv python install <version>       # 安装指定 python 版本
uv python uninstall <version>     # 卸载指定 python 版本
uv python pin <version>           # 为项目指定 python 版本
```



