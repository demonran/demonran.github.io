## 客户端工具
本文主要讲一下我这些年用的一些k8s的工具，以及使用的一些感受。

### kubectl
k8s默认的管理工具还是kubectl， 其他很多工具的实现都是基于kubectl的基础上实现的。
##### 配置
1. kubectl默认读取～/.kube/config的配置， 所以客户端需要copy k8s集群的配置到本地，并放到～/kube/config中， 
*注意： 每个用户需要单独放一个配置文件*
##### 别名
1. 每次都输入kubectl 命令显的很臃肿， 可以.bashrc/ .zshrc中配置别名 `alias k=kubectl`
2. 如果有多个集群需要管理，也可以使用别名来解决： 将集群配置放置在任意位置， 我这里放在 ～/.kube/config_club 
然后配置别名`alias kc=kubectl --kubeconfig=~/.kube/config_club`
##### 常用的命令
`k get pod`: 查询pod，默认是default命名空间，可以通过-n <namespce>指定命名空间 
`k get pod -A`: 查询所有空间的pod 
`k get pod -o wide`: 查询pod并且带有node信息
`k get deploy`: 查询deployment
`k get svc`: 查询service
`k get ingress`: 查询ingerss
`k get cm ` 查询配置列表
`k get cm config1 -oyaml`: 使用yaml格式查询config1 , `- ojson`使用json格式
`k edit cm config1 -oyaml` : 编辑congfig1，保存后会自动生效。
`k describe pod <pod name>`: 查看pod描述，pod启动出错时查看错误信息。
`k logs <pod name>`: 查看pod日志， pod启动后可以查看。 加上`-f`后可以监听日志变化并实时输出。
`k exec -it <pod name> -- bash`: 进入pod容器中，用来查看pod容器的一些文件信息。有些镜像比较精简，没有bash工具，可以尝试用sh。
`k cp <namespace>/<pod name>:/etc/resolv.conf ./resolv.conf`: 将文件从pod中拷贝到本地，解决一些pod中没有bash和sh， 无法查看pod内的文件临时验证的问题。
`k scale --replicas=1 deploy <deployment>`: 动态扩容/缩小deployment。
`kubectl create secret docker-registry docker-registry --docker-server=http://10.101.4.40:5000 --docker-username=jenkins --docker-password=jenkins@123`: 创建docker-registry secret
`k api-resources`: 查看所有k8s的资源列表

### k9s
k9s是一个k8s客户端cli工具，可以在命令行视图来查看k8s的pod运行情况
##### 安装
mac
```bash
brew install k9s
```
ubuntu
```bash 
snap install k9s
```
其他环境后续再补充

##### 使用
命令行直接执行`k9s`就可以打开所有pod视图, 如果需要指定配置文件可以使用`k9s --kubeconfig <path>`指定配置文件
命令说明
0 : 所有pod
1 : default命名空间
<ctrl-d> : 删除pod
d : 进入描述
l : 查看log
s : 进入shell
<shift-f> : 端口转发
y : 打开配置文件

lens
kuboard
kubespare