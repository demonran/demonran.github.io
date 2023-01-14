
### 背景
现在大多公司都会使用Jenkins作为CI工具，随着公司的项目增多，Jenkins上的job会越来越多，磁盘空间越来越大，可能会更换服务器等需求，或者数据中心迁移， 都需要进行jenkins的备份迁移。


### 部署新的jenkins服务
#### 安装jenkins
1. 使用包管理工具安装
```bash
# 导入jenkins安装源
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
# 安装jenkins
apt update
apt install jenkins
安装特定版本
apt install jenkins=1.239.0
```

#### 停止服务
```
systemctl stop jenkins
```
> 可以通过`systemctl cat jenkins.service`查看服务启动配置
#### 数据迁移
 迁移如下几个目录文件
    - plugins  插件目录
    - users    用户数据
    - jobs     job目录
    - config.xml  主要配置
    - credentials.xml  账号信息
> 虽然迁移了credentials.xml,但是所有的creadential还是无法使用需要重新配置，可能是每次安装jenkins会生成一个不同的密钥，所以解密会出错。
  
#### 启动服务
service start jenkins
老版本的jenkins会启动一个damon进程来管理jenkins
新版本是使用systemd管理。
> 建议使用同版本的jenkins

### 全量拷贝
#### 停止jenkins的服务
```bash
systemctl start jenkins
```
#### 拷贝
1. 拷贝jenkins home目录下的所有文件到新的服务器
2. 拷贝启动脚本
3. 拷贝war包
#### 启动服务
```bash
systemctl start jenkins
```
