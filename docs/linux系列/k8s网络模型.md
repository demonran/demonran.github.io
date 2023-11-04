
### 网络查询命令

```bash
# 查询节点路由
root@node2:~# route
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         XiaoQiang       0.0.0.0         UG    0      0        0 enp6s18
10.244.0.0      10.244.0.0      255.255.255.0   UG    0      0        0 flannel.1
10.244.1.0      0.0.0.0         255.255.255.0   U     0      0        0 cni0
10.244.2.0      10.244.2.0      255.255.255.0   UG    0      0        0 flannel.1
10.244.3.0      10.244.3.0      255.255.255.0   UG    0      0        0 flannel.1
172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0
192.168.1.0     0.0.0.0         255.255.255.0   U     0      0        0 enp6s18

# 查询flannel.1网络设备ARP表记录
root@node2:~# ip neigh show dev flannel.1
10.244.3.0 lladdr ba:63:38:d6:fe:99 PERMANENT
10.244.2.0 lladdr 1e:cb:e8:21:45:6a PERMANENT
10.244.0.0 lladdr 3e:ba:63:24:5c:c7 PERMANENT

# 查询网桥， 找到192.168.1.104
root@node2:~# bridge fdb show flannel.1 | grep ba:63:38:d6:fe:99
ba:63:38:d6:fe:99 dev flannel.1 dst 192.168.1.104 self permanent

# 网卡抓包
tcpdump -nnt -i veth3a47280

```