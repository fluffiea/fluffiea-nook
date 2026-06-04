1|---
2|title: 小米笔记本 Ubuntu 安装全记录
3|created: 2026-06-02
4|updated: 2026-06-03
5|type: concept
6|tags: [linux, ubuntu, guide]
7|---
8|
9|# 🐧 小米笔记本 Air 13.3 Ubuntu 安装全记录
10|
11|> **机型：** 小米 Air 13.3（i7-8550U, 8GB 内存）
12|> **硬盘：** TOSHIBA 512GB (NVMe) + Lenovo 128GB (SATA)
13|> **系统：** Ubuntu Server 24.04 LTS
14|> **日期：** 2026-06-02
15|
16|---
17|
18|## 🔧 BIOS 设置
19|
20|### 进 BIOS
21|- 开机按 **F2** 进入 BIOS
22|
23|### 关闭 SecureBoot
24|1. 切换到 **Security** 选项卡
25|2. **Set Supervisor Password** → 设为 `123456`
26|   > 小米笔记本必须设密码后才能修改安全设置
27|3. **Secure Boot Mode** → 设为 **Disabled**
28|4. **F10** 保存退出（必须用 F10 保存，不是直接 Esc）
29|
30|### 其他 BIOS 要点
31|- 启动模式：**UEFI Only**（不能切 Legacy）
32|- **左 USB 口**才能启动，右口不行（硬件限制）
33|- 合盖不息屏：安装完系统后配置（见第七节）
34|
35|---
36|
37|## 💿 制作启动 U 盘
38|
39|### 工具推荐
40|- **Rufus**（推荐，比 Ventoy 稳定）
41|- 下载地址：https://rufus.ie/
42|
43|### Rufus 设置
44|| 项目 | 选择 | 说明 |
45||:---|:------|:-----|
46|| 设备 | U 盘 | 你要写到的那个 U 盘 |
47|| 引导类型 | Ubuntu Server 24.04 LTS ISO | 你下载的 ISO 镜像文件 |
48|| 分区类型 | **GPT** | UEFI 模式强制要求 GPT，不能用 MBR |
49|| 目标系统 | **UEFI (非 CSM)** | 跟 BIOS 的启动模式保持一致 |
50|| 文件系统 | FAT32 | UEFI 只认识 FAT32 |
51|
52|> [!warning] Ventoy 踩坑记录
53|> 之前用 Ventoy 成功进了安装界面一次，重启后 U 盘再也不被 BIOS 识别。换 Rufus 直接写 ISO 后一次成功。推测是杂牌 U 盘兼容性问题。
54|
55|### ISO 下载
56|- 官方下载：https://ubuntu.com/download/server
57|- 选 Ubuntu Server 24.04 LTS（长期支持版）
58|
59|---
60|
61|## 🚀 安装 Ubuntu Server
62|
63|### 启动安装
64|1. U 盘插 **左 USB 口**
65|2. 开机 → 自动从 U 盘启动
66|3. 出现 GRUB 菜单后选 **Try or Install Ubuntu Server**（第一项）
67|
68|### 安装步骤详解
69|
70|| 步骤 | 操作 | 说明 |
71||:---|:------|:-----|
72|| 语言 | 默认 English | 装了系统之后也能再调中文 |
73|| 安装类型 | **Ubuntu Server** | Minimized 会少很多常用工具 |
74|| 网络 | 连 WiFi **netself** | 系统装好后 IP 为 `192.168.205.17` |
75|| 代理设置 | 空白 → Done | 国内不需要代理 |
76|| 镜像源 | 自动选 **清华 tuna** | 国内最快，会自动测速选最优 |
77|| 安装器更新 | **Skip for now** | 只是安装器本身的 bug 修复 |
78|| **存储** | **GPT + LVM** | ⭐ 关键步骤 |
79|| 确认 | **Continue** | 盘已清空，没有回头路 |
80|| 用户 | `fluffiea` / `fluffiea-home` | 用户名 / 主机名 |
81|| Ubuntu Pro | **Skip** | 收费企业服务，个人不用 |
82|| **SSH** | **✅ 安装 OpenSSH** | ⭐ 一定要装！以后远程连靠这个 |
83|| Snaps | 全不选 | 类似手机 App 商店，用不上 |
84|
85|#### 关于存储的说明
86|```
87|TOSHIBA 512GB 的分配方案：
88|├─ /boot/efi   1G   ← UEFI 启动必须的分区
89|├─ /boot       2G   ← Linux 内核放这里
90|├─ / (根目录) 100G   ← 系统、软件
91|└─ LVM 剩余  373G   ← 安装后手动扩给 /
92|```
93|
94|选择的含义：
95|- **Use an entire disk** → 用整块 TOSHIBA 盘装系统
96|- **Set up as LVM group** → 启用逻辑卷管理，方便以后扩缩分区
97|- **不加密** → 笔记本没必要，徒增麻烦
98|
99|### 安装完成
100|- 进度跑完后选 **Reboot Now**
101|- **屏幕变黑后立即拔出 U 盘**（不然又从 U 盘启动）
102|- 重启后看到 `fluffiea-home login:` 就成功了
103|
104|---
105|
106|## 📏 扩容根目录（LVM）
107|
108|安装时只分了 100G 给 `/`，剩下的 373G 还在 LVM 池子里没分配。
109|
110|### 4.1 先看看磁盘情况
111|```bash
112|lsblk    # list block devices，列出所有硬盘和分区
113|```
114|
115|```
116|NAME                        SIZE TYPE
117|nvme0n1p3                 473.9G part    ← TOSHIBA 盘全部在 LVM 池
118|└─ubuntu--vg-ubuntu--lv     100G lvm  /  ← 但只分了 100G 给根目录
119|```
120|
121|### 4.2 把剩下的全部分给根目录
122|```bash
123|sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
124|#  (extend)  用所有剩余空间  指定要扩的逻辑卷
125|#  意思：把 LVM 池子里所有剩余空间都加到根目录
126|
127|sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
128|#  (resize filesystem)  调整文件系统大小
129|#  扩了逻辑卷之后，文件系统还不知道空间变大了，需要这个命令让它知道
130|```
131|
132|验证：
133|```bash
134|df -h    # disk free - human readable，查看磁盘使用情况
135|```
136|应该显示 `/` 从 98G → 466G
137|
138|---
139|
140|## 🔗 合并第二块硬盘到 LVM
141|
142|Lenovo 128GB 之前是 Windows 盘，清掉后加入 LVM 合并使用。
143|
144|### 5.1 清空旧分区表
145|```bash
146|sudo sgdisk --zap-all /dev/sda
147|```
148|- `sgdisk` = 分区工具（GPT 版 fdisk）
149|- `--zap-all` = 把所有分区信息清掉（只是清分区表，不是零填充）
150|- `/dev/sda` = Lenovo 128GB 的**设备名**
151|
152|### 5.2 新建 LVM 分区
153|```bash
154|sudo sgdisk -n 0:0:0 -t 0:8e00 /dev/sda
155|#           新建分区 用全部空间  类型 8e00 = Linux LVM
156|#   -n = new partition, 0:0:0 表示用全部可用空间
157|#   -t = type, 8e00 是 LVM 的分区类型代码
158|
159|sudo partprobe /dev/sda    # 通知内核重读分区表（让系统知道分区变了）
160|```
161|
162|### 5.3 加入 LVM 组
163|```bash
164|sudo pvcreate /dev/sda1
165|#  (physical volume create)  创建物理卷
166|#  告诉 LVM：这块分区可以用来存数据
167|
168|sudo vgextend ubuntu-vg /dev/sda1
169|#  (volume group extend)  扩展卷组
170|#  把新的物理卷加到 ubuntu-vg 这个池子里
171|```
172|
173|### 5.4 扩容根目录（跟之前一样）
174|```bash
175|sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
176|sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
177|```
178|
179|最终 `df -h` 显示 `/` 约 **585G**（512 + 128 = 640，减去系统和格式开销）
180|
181|---
182|
183|## 🐳 安装 Docker
184|
185|### 一键安装
186|```bash
187|curl -fsSL https://get.docker.com | sudo sh -s -- --mirror Aliyun
188|```
189|- `curl` = 下载工具
190|- `-fsSL` = 静默模式（-f 失败时不出错提示，-s 安静，-S 显示错误，-L 跟随重定向）
191|- `|` = 管道符，把前面的输出传给后面的命令
192|- `sudo sh` = 用 root 权限执行脚本
193|- `--mirror Aliyun` = 从阿里云镜像下载（在国内不用这个会很慢）
194|
195|### 不用 sudo 也能用 Docker
196|```bash
197|sudo usermod -aG docker $USER
198|#  (user modify)  修改用户
199|#  -aG = append to group，把用户加到 docker 组里
200|#  这样以后 docker 命令不用加 sudo 了（需要重新登录生效）
201|```
202|
203|### Docker 是什么？
204|Docker 就像个**轻量级虚拟机**，但比虚拟机快得多：
205|- 你把应用（比如 Immich）打包成一个「镜像」
206|- Docker 运行这个镜像就成了一个「容器」
207|- 容器之间互相隔离，互不影响
208|- 一句话：**装软件再也不怕依赖冲突，拉个镜像就跑**
209|
210|### 国内拉 ghcr.io 镜像加速
211|Immich 的镜像存在 GitHub 的容器仓库 `ghcr.io`，国内访问很慢。用南京大学的镜像站代替：
212|```bash
213|sudo sed -i "s/ghcr.io\/immich-app/ghcr.nju.edu.cn\/immich-app/g" docker-compose.yml
214|#  (stream editor)  文本替换
215|#  -i = 直接修改文件（in-place）
216|#  s/old/new/g = 把文件里所有 old 替换成 new
217|```
218|
219|---
220|
221|## 💤 合盖设置（合盖不关机）
222|
223|### 查看当前设置
224|```bash
225|cat /etc/systemd/logind.conf | grep -i "handlelid"
226|#  (concatenate)  查看文件内容
227|#  grep = 搜索文本，-i = 忽略大小写
228|```
229|
230|### 修改为合盖不做任何操作
231|```bash
232|sudo sed -i 's|#HandleLidSwitch=suspend|HandleLidSwitch=ignore|' /etc/systemd/logind.conf
233|#  把注释掉的 #HandleLidSwitch=suspend 改成 HandleLidSwitch=ignore
234|
235|sudo systemctl restart systemd-logind
236|#  重启登录管理服务（让设置立即生效，不用重启电脑）
237|```
238|
239|---
240|
241|## 📸 部署 Immich
242|
243|### 从移动硬盘复制
244|```bash
245|# 1. 建一个空目录当"挂载点"
246|sudo mkdir -p /mnt/usb
247|#  mkdir = make directory, -p = 父目录不存在时自动创建
248|
249|# 2. 挂载移动硬盘
250|sudo mount /dev/sdb1 /mnt/usb
251|#  mount = 把设备（移动硬盘）挂到目录（/mnt/usb）上
252|#  之后访问 /mnt/usb 就等于访问移动硬盘
253|
254|# 3. 复制到本地
255|sudo cp -r /mnt/usb/immich /opt/
256|#  cp = copy, -r = recursive（递归复制整个文件夹）
257|
258|# 4. 安全卸载
259|sudo umount /mnt/usb
260|#  umount = 卸载，移除了才能安全拔出
261|```
262|
263|### 启动 Immich
264|
265|```bash
266|cd /opt/immich
267|#  (change directory)  进入 Immich 目录
268|
269|sudo docker compose up -d
270|#  docker compose = 按配置文件启动多个容器
271|#  up = 启动，-d = detach（后台运行，不占用终端）
272|```
273|
274|### 访问
275|浏览器打开：`http://192.168.205.17:2283`
276|- 首次注册的用户自动成为管理员
277|- 2283 是 Immich 的默认端口
278|
279|### Docker 常用管理命令
280|```bash
281|sudo docker compose ps         # 查看所有容器状态（是否在运行）
282|sudo docker compose logs       # 查看日志（排查问题）
283|sudo docker compose down       # 停止并删除所有容器
284|sudo docker compose restart    # 重启所有容器
285|sudo docker compose pull       # 拉取最新镜像
286|```
287|
288|---
289|
290|---
291|
292|## 📋 Linux 命令速查
293|
294|| 命令 | 全称 | 作用 |
295||:---|:-----|:-----|
296|| `ls` | list | 列出当前目录的文件 |
297|| `lsblk` | list block devices | 列出所有硬盘/分区 |
298|| `df -h` | disk free | 查看磁盘空间（-h 人性化显示） |
299|| `free -h` | free memory | 查看内存使用 |
300|| `ps aux` | process status | 查看所有进程 |
301|| `top` | table of processes | 实时进程监控（按 q 退出） |
302|| `htop` | - | top 的美化增强版 |
303|| `cat` | concatenate | 查看文件内容 |
304|| `grep` | - | 搜索文本 |
305|| `sudo` | superuser do | 以 root 权限执行命令 |
306|| `apt` | advanced package tool | Ubuntu 的包管理器 |
307|| `systemctl` | system control | 管理系统服务 |
308|| `ip a` | IP address | 查看网络配置和 IP |
309|| `ping` | - | 测试网络连通性 |
310|
311|### 文件路径小知识
312|| 路径 | 用途 |
313||:---|:-----|
314|| `/` | 根目录，整个文件系统的起点 |
315|| `/home/` | 用户文件夹（你的文件默认放这里） |
316|| `/opt/` | 第三方软件（如 Immich） |
317|| `/etc/` | 系统配置文件 |
318|| `/var/log/` | 系统日志 |
319|| `/mnt/` | 临时挂载外部设备 |
320|| `/boot/` | 系统启动文件、内核 |
321|
322|---
323|
324|学完这篇可以看看 [[linux]]，里面把命令按场景分类整理好了，方便复习查阅。
325|
326|---
327|
328|## ⚠️ 踩坑记录
329|
330|| 坑 | 原因 | 解决办法 |
331||:---|:-----|:---------|
332|| Ventoy U 盘只能用一次 | 杂牌 U 盘兼容性差 | 换 Rufus 直接写 ISO |
333|| 清盘后 U 盘不识别 | U 盘抽风/BIOS 缓存 | 多试 USB 口，重做启动盘 |
334|| cloud-init 卡住 | 安装时没连网 | 先连 WiFi 再安装 |
335|| ghcr.io 镜像拉不动 | 国内被墙 | 用 `ghcr.nju.edu.cn` 镜像 |
336|| SSH 卡顿 | Docker 拉镜像占带宽 | 等镜像下完就好了 |
337|| SecureBoot 关不掉 | 没设 Supervisor Password | 先设密码才能改 |
338|| 根目录只有 100G | LVM 默认只分这么点 | `lvextend` + `resize2fs` 扩 |
339|| `docker-compose` 报错 | 旧版 docker.io 不带 compose | 装官方 Docker CE |