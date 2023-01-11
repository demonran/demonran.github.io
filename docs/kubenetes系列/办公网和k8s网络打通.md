# 打通办公网和k8s网络
在微服务架构系统开发中，经常需要本地代码调用开发环境的微服务，有的使用k8s的sverice作为负载均衡工具，有个的使用ingress或者nodeport对外暴露服务的访问入口，有的使用nacos/eurake之类的微服务注册中心进行微服务的负载均衡器， 在开发调试中，就需要本地网络和k8s网络打通进行微服务调用了，而不是本地起一大堆依赖的服务。


#### 修改路由表
如果本地网络和k8s集群在同一个子网中，可以直接通过修改本地路由表的方式实现网络打通。
1. 通过如下命令查询podSubnet和serviceSubnet.
```bash
kubectl get cm kubeadm-config -n kube-system -o yaml | grep -i podsub
    podSubnet: 10.200.0.0/16
kubectl get cm kubeadm-config -n kube-system -o yaml | grep -i servicesub
    serviceSubnet: 10.96.0.0/12
```
2. 增加路由配置

增加路由到podSubnet或serviceSubnet的网段路由，使用任意一个node节点的ip作为网关。 因为node节点上安装了k8s的网络插件已经打通了本地网络和pod的网络， 可以在node上直接访问pod的ip. 
假设podSubnet为： 10.200.0.0/16, node地址为192.168.1.101
配置方式如下：
mac:
```bash
# 增加路由
route -q -n add -inet 10.244.0.0/16 192.168.1。101
# 删除路由
route delete -net 10.244.0.0 -netmask 255.255.0.0
```
linux:
```bash
# 增加路由
route add -net 10.244.0.0/16 gw 192.168.1.101
# 删除路由
route del -net 10.244.0.0/16
```
此时即可本地直接通过pod的ip+port访问对应的服务

 #### sshuttle
 一个通过ssh打通道的工具，和ssh的tunnle不同，不是基于TCP-over-TCP的，而是叫data over tcp的，省去了一次包裹。

##### 工具安装
sshuttle 被打包在官方仓库中，因此很容易安装。打开一个终端，并使用 sudo 来运行以下命令：

```
# brew安装
brew install sshuttle
# apt 安装
apt install sshuttle
# npm 安装
npm install -g sshuttle
# pip 安装
pip install sshuttle
# dnf 安装
 dnf install sshuttle
```
##### 工具使用
执行命令创建通道和网络转发
```bash
sshuttle -r <代理服务器> <转发网段>
```
1. 因为本次需要是打通本地网络和k8s的pod网络，所以代理服务器需要使用任意一台node节点， 因为node节点上安装了k8s的网络插件已经打通了本地网络和pod的网络， 可以在node上直接访问pod的ip. 
2. 转发网段配置为podSubnet， 可通过如下命令查询
```bash
kubectl get cm kubeadm-config -n kube-system -o yaml | grep -i podsub
    podSubnet: 10.200.0.0/16
```

此时可以通过本地访问直接访问podSubnet下的ip。

#### ktctl
 KtConnect提供了本地和测试环境集群的双向互联能力。在这篇文档里，我们将使用一个简单的示例，来快速演示通过KtConnect完成本地直接访问集群中的服务、以及将集群中指定服务的请求转发到本地的过程。

官方文档地址： [https://github.com/alibaba/kt-connect/blob/master/README_CN.md](https://github.com/alibaba/kt-connect/blob/master/README_CN.md)

 ##### 工具安装安装
 macos 推荐使用brew工具安装：
 ```bash
 brew install kt-connect
 ```
 Linux安装
 ```bash
$ tar zxf ktctl_0.3.7_Linux_x86_64.tar.gz
$ mv ktctl /usr/local/bin/ktctl
$ ktctl --version
 ```
 Windows
下载并解压，将包中的wintun.dll和可执行文件ktctl.exe一起放到PATH环境变量指定的任意位置。
[下载地址](https://github.com/alibaba/kt-connect/blob/master/docs/zh-cn/guide/downloads.md)

##### 主要功能特性
- Connect：建立数据代理通道，实现本地服务直接访问Kubernetes集群内网（包括Pod IP和Service域名）
- Exchange：让集群服务流量重定向到本地，实现快速验证本地版本和调试排查问题
- Mesh：创建路由规则重定向特定流量，实现多人协作场景下互不影响的本地调试
- Preview：暴露本地服务到集群，实现无需发布即可在线预览集成效果

##### 使用
直接在本地执行命令`sudo ktctl connect`, 执行前确保k8s配置在`~/.kube/config`，如果不在该目录，可用`sudo ktctl connect -c <config path>`指定配置路径。
```bash
# sudo ktctl connect

5:13PM INF Using cluster context kubernetes-admin@cluster.local (cluster.local)
5:13PM INF KtConnect 0.3.7 start at 31099 (darwin amd64)
5:13PM INF Fetching cluster time ...
5:14PM INF Fetching cluster time ...
5:14PM INF Using tun2socks mode
5:14PM INF Successful create config map kt-connect-shadow-nkebg
5:14PM INF Deploying shadow pod kt-connect-shadow-nkebg in namespace default
5:14PM INF Waiting for pod kt-connect-shadow-nkebg ...
5:14PM INF Pod kt-connect-shadow-nkebg is ready
5:14PM INF Port forward local:60810 -> pod kt-connect-shadow-nkebg:22 established
5:14PM INF Socks proxy established
5:14PM INF Tun device utun8 is ready
5:14PM INF Adding route to 10.233.0.0/16
5:14PM INF Adding route to 10.11.38.0/24
5:14PM INF Route to tun device completed
5:14PM INF Setting up dns in local mode
5:14PM INF Port forward local:50531 -> pod kt-connect-shadow-nkebg:53 established
5:14PM INF Setup local DNS with upstream [tcp:127.0.0.1:50531 udp:94.140.14.14:53]
5:14PM INF Creating udp dns on port 10053
5:14PM INF ---------------------------------------------------------------
5:14PM INF  All looks good, now you can access to resources in the kubernetes cluster
5:14PM INF ---------------------------------------------------------------

```
出现`5:14PM INF  All looks good, now you can access to resources in the kubernetes cluster`即说明安装成功
*注： 第一次启动因为要创建 kt-connect-shadow-nkebg pod，所以启动会比较慢，第二次启动就会比较快*

##### 测试
`kubectl get pod -o wide` 查看pod ip，可以直接访问对应的ip+port
`kubectl get svc` 查看svc名称， 可以直接访问service name + port。

此时已经实现本地网络打通k8s集群内网， 
 文档地址：

#### telepresence
待补充， 实现效果和ktctl差不多。