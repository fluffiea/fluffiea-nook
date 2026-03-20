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
nvm current # 查看
```