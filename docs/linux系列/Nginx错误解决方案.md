 #### 问题1: *2497 socket() failed (24: Too many open files) while connecting to upstream

 vi /etc/sysctl.conf
 增加
 ```
 fs.file-max = 70000
 ```
 
 vi /etc/security/limits.conf
 增加
```
*      soft    nofile  65535
*      hard    nofile  65535
*      soft    nproc   65535
*      hard    nproc   65535
```

vi /etc/nginx/nginx.conf
增加
```
worker_rlimit_nofile 20960;
```


#### 问题2:[alert] 49425#49425: 2048 worker_connections are not enough
nginx 默认：worker_connections: 1024
通过配置调大
```
events {
    worker_connections 65535;
}
```