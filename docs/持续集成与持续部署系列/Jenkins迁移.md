
1. 部署新的jenkins服务
   ```shell
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins
   ```

   如果要安装特定版本
   ```shell 
   apt install jenkins=1.239.0
```
2. 停止服务
```
systemctl stop jenkins
```
> 可以通过`systemctl cat jenkins.service`查看服务启动配置
3. 迁移如下几个目录文件
    - plugins
    - users
    - jobs
    - config.xml
    - credentials.xml
4. 启动服务

老版本的jenkins会启动一个damon进程来管理jenkins

新版本是使用systemd管理。
