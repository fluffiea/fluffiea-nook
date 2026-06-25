## 服务控制

```bash
sudo systemctl start <服务名>       # 启动服务
sudo systemctl stop <服务名>        # 停止服务
sudo systemctl restart <服务名>     # 重启服务
sudo systemctl reload <服务名>      # 重载配置
sudo systemctl status <服务名>      # 查看状态
```

## 自启管理

```bash
sudo systemctl enable <服务名>         # 设置开机自启
sudo systemctl disable <服务名>        # 取消开机自启
sudo systemctl is-enabled <服务名>     # 查询是否设了自启动
```

## 查看服务
 ```bash
 systemctl list-units                          # 列出当前正在运行的服务
 systemctl list-units --all                    # 列出所有安装过的服务
 systemctl list-unit-files                     # 列出所有服务文件及其自启状态
 systemctl list-unit-files --state=enabled     # **只筛选出**那些设置了开机自启的服务
 ```