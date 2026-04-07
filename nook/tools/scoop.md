# scoop

`scoop` 是一个 `Windows` 的软件安装工具，用户级别，几乎不会破坏系统环境

## 安装

使用管理员身份打开 `powershell`

```bash
# 设置一个用户级别的环境变量
# 这里是为了让 scoop 和 使用 scoop 安装的软件都下载到我们指定的路径之中
$env:SCOOP = 'D:\scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')

# 允许 powershell 执行脚本文件
# Windows 本身默认是不支持执行脚本文件的
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

使用非管理员打开 `powershell `去安装 `scoop`

```bash
# 使用非管理员身份安装是因为 scoop 本身设计就是用户级别的，使用管理员身份安装会报错
irm get.scoop.sh | iex
```

## 更换镜像

`scoop` 可以更换镜像来提升国内下载速度

更换主程序镜像，这可以加速 `scoop` 本身的更新和安装脚本的拉取

```bash
# 查看当前配置
scoop config

# 更换镜像
scoop config SCOOP_REPO <url>
# 这里的镜像源可以自己查一下，我目前使用的是 gitee 的镜像
# https://gitee.com/scoop-installer/scoop

# 更新配置
# 更换镜像执行更新配置以激活
scoop update

# 如果你的环境中没有 git 此时它可能提示你
# Scoop uses Git to update itself. Run 'scoop install git' and try again
# 按照提示安装一下就好了，安装完 git 之后重新执行一下 scoop update 即可
scoop install git
```

更换软件仓库镜像，可以加速 `scoop search` 和 `scoop install` 等命令对软件包的下载更新速度

```bash
# 修改镜像
scoop bucket add <bucket> <url>
# bucket 是你要添加的软件仓库
# url 是你添加的这个仓库的镜像地址

# 如果你要修改镜像的仓库已经存在了，则需要先删除再重新添加
scoop bucket list # 查看当前的仓库
scoop bucket rm <bucket> # 删除仓库
scoop bucket add <bucket> <url> # 修改镜像
# 这里列举我使用的镜像
# main: https://gitee.com/scoop-installer/Main
# extras: https://gitee.com/scoop-installer/Extras
# versions: https://gitee.com/scoop-installer/Versions
# java: https://gitee.com/scoop-installer/Java

# 更新镜像
scoop update
```

## 常用命令

```bash
scoop search <pkg> # 搜索应用
scoop install <pkg> # 安装应用
scoop uninstall <pkg> # 卸载应用

scoop update # 更新 scoop 目录
scoop update <pkg> # 更新应用
scoop update * # 更新所有应用

scoop bucket list # 查看添加的仓库
scoop bucket known # 列出官方已知的仓库
scoop bucket add <bucket> # 添加仓库
scoop bucket add <bucket> <url> # 添加指定镜像的仓库
scoop bucket rm <bucket> # 删除仓库
```