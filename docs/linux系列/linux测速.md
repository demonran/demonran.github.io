## linux测试工具

在做性能测试时有时候受带宽影响，测试结果会发生很大的差异。

本文讲讲如何在服务上进行传输数据测试。

### 1. 两台服务器之间测速

使用iperf 测速

两台服务器上安装iperf：
```
yum install -y iperf
```
测试：
被访问服务器执行：
iperf -s

访问的服务器执行：
iperf -c <被测试服务器IP>



### 2. 测试服务器到外网的速度
使用speedtest
服务器安装：
wget -O speedtest-cli https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py
chmod +x speedtest-cli
./speedtest-cli

### 3. 测试本地到服务器的速度
使用docker安装
docker run --restart=always -d -p 8080:80 adolfintel/speedtest

本地打开网页测试：
http://<服务器IP>:8080
