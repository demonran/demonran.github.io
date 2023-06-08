### 问题发现
服务启动失败，看日志发现如下报错：
 Nacos cluster is running with 1.X mode, can't accept gRPC request temporarily. Please check the server status or close Double write to force open 2.0 mode

 ### 问题分析
 1. nacos采用的集群方式部署， 突然有一台机器出现了异常，将nacos集群进行重启， 重启后nacos启动正常，
 - 查看logs/naming-server.log 发现如下INFO日志：upgrade check result false
 - 查看 data/upgrade.state, 显示upgraded=false

 由此推断服务启动后集群被降级到1.x版本。导致客户端和服务端版本不一致。

 ### 问题原因
 由于同时重启nacos集群 


### 问题解决
 curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'

关闭后可以从logs/naming-server.log日志中观察到Disable Double write, stop and clean v1.x cache and features字样。说明关闭双写。