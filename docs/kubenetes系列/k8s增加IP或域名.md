
导出配置
```bash
$ kubectl -n kube-system get configmap kubeadm-config -o jsonpath='{.data.ClusterConfiguration}' > kubeadm-init.yaml
```
在配置中增加对应的域名或者ip
```yml
apiServer:
  certSANs:
  - kubernetes
  - kubernetes.default
  - kubernetes.default.svc
  - kubernetes.default.svc.cluster.local
  - localhost
  - 127.0.0.1
  - master
  - master.cluster.local
  - 10.233.0.1
```

更新完 kubeadm 配置文件后我们就可以更新证书了，首先我们移动现有的 APIServer 的证书和密钥，因为 kubeadm 检测到他们已经存在于指定的位置，它就不会创建新的了。
```
mv /etc/kubernetes/pki/apiserver.{crt,key} ~
```
然后直接使用 kubeadm 命令生成一个新的证书：


```
kubeadm init phase certs apiserver --config kubeadm-init.yaml 
```

最后一步是重启 APIServer 来接收新的证书，最简单的方法是直接杀死 APIServer 的容器：

```
docker ps | grep kube-apiserver | grep -v pause | awk '{print $1}' | xargs docker kill
```

要验证证书是否更新我们可以直接去编辑 kubeconfig 文件中的 APIServer 地址，将其更换为新添加的 IP 地址或者主机名，然后去使用 kubectl 操作集群，查看是否可以正常工作。

```
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text
```

如果上面的操作都一切顺利，最后一步是将上面的集群配置信息保存到集群的 kubeadm-config 这个 ConfigMap 中去，这一点非常重要，这样以后当我们使用 kubeadm 来操作集群的时候，相关的数据不会丢失，比如升级的时候还是会带上 certSANs 中的数据进行签名的。

```
kubeadm init phase upload-config kubeadm --config kubeadm-init.yaml
```
检查
```
$ kubectl -n kube-system get configmap kubeadm-config -o yaml
```


