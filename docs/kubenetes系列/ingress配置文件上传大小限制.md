### 问题原因
在通过ingress-nginx访问k8s服务，并执行文件上传等逻辑时，如果文件过大，会出现413 Request Entity Too Large。

### 原因分析
这是因为nginx的默认的request body大小为1M, 我们使用ingress访问后端服务，ingress的实现使用的是nginx-ingress-controller, 所以就会有文件上传大小配置。
我们知道，nginx可以在nginx的配置中加client_max_body_size 参数来修改该默认值。 
client_max_body_size 支持 http 、 server 、 location

但是我们使用ingress时nginx配置是k8s生成的， 我们要修改该配置执行通过k8s的相关方式来进行修改。

### 方法
##### 全局修改
1. 查找configmap
查看nginx-ingress-controller的启动配置，找到` --configmap=$(POD_NAMESPACE)/nginx-configuration` 这个配置。
可以看到读取了nginx-configuration这个configmap。

2. 增加configmap数据data.
```
kind: ConfigMap
apiVersion: v1
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
  labels:
    app: ingress-nginx
data:
    proxy-body-size: 50m
```

##### 单个应用修改
在对应的应用的ingress增加annotation
```
kind: Ingress
apiVersion: networking.k8s.io/v1
metadata:
  name: infra-gateway-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: '50m'
```

参考文档：
https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size
https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#proxy-body-size