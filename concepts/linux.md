---
title: Linux 常用命令学习
created: 2025-06-03
updated: 2025-06-03
type: concept
tags: [linux, guide]
---

# Linux 常用命令学习

从 [[Ubuntu-安装指南]] 的实战中提取，按场景分类，方便查询和学习。

---

## 一、文件与目录操作

```bash
ls                       # list — 列出当前目录的文件
ls -la                   # list all — 列出所有文件（含隐藏文件）及详细信息
cd <dir>                 # change directory — 切换目录
cd ..                    # 返回上级目录
mkdir -p <path>          # make directory — 创建目录（-p 父目录不存在时自动创建）
cp -r <src> <dest>       # copy — 复制文件/文件夹（-r recursive 递归复制整个目录）
rm -rf <path>            # remove — 删除文件/文件夹（-r 递归 -f 强制）
cat <file>               # concatenate — 查看文件全部内容
```

---

## 二、查看系统信息

```bash
df -h                    # disk free — 查看磁盘使用情况（-h human-readable 人性化显示）
lsblk                    # list block devices — 列出所有硬盘和分区
free -h                  # free memory — 查看内存使用
ps aux                   # process status — 查看所有进程
top                      # table of processes — 实时进程监控（按 q 退出）
htop                     # top 的美化增强版（需安装）
uname -a                 # unix name — 查看系统内核版本信息
hostname -I              # 查看本机 IP 地址
ip a                     # IP address — 查看网络配置和 IP
ping <host>              # 测试网络连通性
```

## 搜索文本

```bash
grep <pattern> <file>                # 在文件中搜索关键词
grep -i <pattern> <file>             # -i ignore case 忽略大小写
cat <file> | grep <pattern>          # 管道符，把 cat 的输出传给 grep 搜索
```

---

## 四、磁盘与分区

```bash
# 查看磁盘和分区情况
lsblk

# 清空分区表（擦除磁盘上的所有分区信息）
sudo sgdisk --zap-all /dev/sda
#  sgdisk = GPT 版分区工具
#  --zap-all = 清掉所有分区表信息（不是零填充）

# 新建 LVM 分区
sudo sgdisk -n 0:0:0 -t 0:8e00 /dev/sda
#  -n = new partition，0:0:0 表示用全部空间
#  -t = type，8e00 是 LVM 的分区类型代码

# 通知内核重读分区表
sudo partprobe /dev/sda

# 挂载/卸载设备
sudo mount /dev/sdb1 /mnt/usb        # mount — 把设备挂到目录上
sudo umount /mnt/usb                 # umount — 卸载设备（安全拔出前必须执行）
```

> 💡 **区分 `mount` 和 `umount`：** `mount` 是把 U 盘/硬盘"接入"到某个目录，`umount` 是断开连接。u**m**ount 少写一个 n，容易记错。

---

## 五、LVM 逻辑卷管理

```bash
# 创建物理卷（告诉 LVM 某块分区可以用来存数据）
sudo pvcreate /dev/sda1
#  pv = physical volume

# 扩展卷组（把物理卷加入 LVM 池子）
sudo vgextend ubuntu-vg /dev/sda1
#  vg = volume group

# 扩展逻辑卷（把池子里的空间分给根目录）
sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
#  lv = logical volume
#  -l +100%FREE = 把所有剩余空间都加上

# 调整文件系统大小（让系统知道空间变大了）
sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
```

> 💡 LVM 的关系链：**硬盘 → 分区 → 物理卷(pv) → 卷组(vg) → 逻辑卷(lv) → 文件系统**

---

## 六、系统服务管理

```bash
sudo systemctl restart <service>         # 重启服务
sudo systemctl start <service>           # 启动服务
sudo systemctl stop <service>            # 停止服务
sudo systemctl status <service>          # 查看服务状态
```

---

## 七、文件内容编辑（sed）

```bash
# 替换文件中的文本
sudo sed -i 's|<old>|<new>|' <file>
#  s = substitute 替换
#  -i = in-place 直接修改文件
#  | 是分隔符（也可以用 /）

# 示例：把注释掉的配置改为生效
sudo sed -i 's|#HandleLidSwitch=suspend|HandleLidSwitch=ignore|' /etc/systemd/logind.conf
```

---

## 八、Docker 管理

```bash
# 拉取镜像
sudo docker compose pull

# 启动容器
sudo docker compose up -d            # -d = detach 后台运行

# 查看容器状态
sudo docker compose ps

# 查看日志
sudo docker compose logs

# 停止容器
sudo docker compose down

# 重启容器
sudo docker compose restart
```

---

## 九、包管理器（apt）

```bash
sudo apt update                      # 更新软件源列表
sudo apt install <pkg>               # 安装软件
sudo apt remove <pkg>                # 卸载软件
sudo apt purge <pkg>                 # 彻底卸载（含配置文件）
sudo apt autoremove                  # 自动清理无用的依赖包
```

---

## 十、权限相关

```bash
sudo <command>                           # superuser do — 以 root 权限执行
sudo -i                                  # 切换到 root 用户

# 修改文件权限
chmod +x <file>                          # change mode — 给文件添加可执行权限
chmod 755 <file>                         # rwxr-xr-x 所有者可读写执行，其他人可读执行

# 修改文件所有者
sudo chown <user>:<group> <file>         # change owner
```

---

## 小知识：Linux 目录结构

| 路径 | 用途 |
|:----|:-----|
| `/` | 根目录，整个文件系统的起点 |
| `/home/` | 用户文件夹 |
| `/opt/` | 第三方软件 |
| `/etc/` | 系统配置文件 |
| `/var/log/` | 系统日志 |
| `/mnt/` | 临时挂载外部设备 |
| `/boot/` | 系统启动文件、内核 |

---

> 💡 **学习建议：** 不要死记硬背，在实际操作中遇到问题就用 `man <cmd>` 查手册，或者 `<cmd> --help` 看简版帮助。用多了自然就记住了！