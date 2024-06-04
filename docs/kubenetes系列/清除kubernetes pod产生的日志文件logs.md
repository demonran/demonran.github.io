随着系统运行的时间越长，Log日志所占的空间也越来越大，但是磁盘空间是一定的，这时就需要清理一下这些无用的日志文件。

### 手动清理
进入 /var/lib/docker/containers 中找到较大的 .log 文件，在管理员权限下(sudo su root)使用命令 cat /dev/null > xxx.log 清空文件。 注意直接删除文件可能导致后续log无法写入


### 对日志设置自动回滚写入以及清除
通过logrotate服务实现日志定期清理和回卷

logrotate是个十分有用的工具，它可以自动对日志进行截断（或轮循）、压缩以及删除旧的日志文件。例如，你可以设置logrotate，让/var/log/foo日志文件每30天轮循，并删除超过6个月的日志。配置完后，logrotate的运作完全自动化，不必进行任何进一步的人为干预。

但如果按照之前的部署方式，需要手动在每个节点上都安装和配置对应logrotate工具。如果通过Kubernetes容器服务编排的能力，将logrotate通过Kubernetes中服务的方式部署到各个节点上，这样既可以实现只需要一次部署，部署到所有节点。并且通过容器的方式保证了logrotate配置的一致性。

方案的具体实现是在Kubernetes集群中，创建DaemonSet资源实现。DaemonSet资源会在每个Node节点上都部署一个logrotate的容器实例，并且在容器实例中设置映射主机的log日志目录，从而实现日志的定时清理和回卷。

```yml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: logrotate
spec:
  template:
    metadata:
      labels:
        app: logging
        id: logrotate
      name: logrotate
    spec:
      containers:
      - name: logrotate-es
        image: blacklabelops/logrotate
        securityContext:
          privileged: true
        volumeMounts:
         - name: containers
           mountPath: /var/lib/docker/containers
         - name: varlog
           mountPath: /var/log/docker
         - name: logs
           mountPath: /logs
        env:
        - name: LOGS_DIRECTORIES
          value: "/var/lib/docker/containers /var/log/docker"
        - name: LOGROTATE_INTERVAL
          value: "hourly"
        - name: LOGROTATE_OLDDIR
          value: "/logs"
      volumes:
         - hostPath:
             path: /var/lib/docker/containers
           name: containers
         - hostPath:
             path: /var/log/docker
           name: varlog
         - hostPath:
             path: /var/log/containers/
           name: logs 
```

在示例的yaml文件中，logrotate服务将按照定时(1小时)的对日志进行回卷，回卷超过5个副本后则会对日志进行清理。如果有需要，可以修改相应的参数，设置不同的回卷规则和清理规则。详细的参数说明可以参考：https://github.com/blacklabelops/logrotate

在kubernetes执行
```bash
# kubectl create -f logrotate_ds.yaml
daemonset "logrotate" created
```