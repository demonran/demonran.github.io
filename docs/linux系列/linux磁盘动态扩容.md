### 使用lvm动态扩容磁盘

#### 磁盘分区

```
fdisk /dev/vdc

Command (m for help): n

Select (default p): p

Partition number (2-4, default 2): 

Last sector, +sectors or +size{K,M,G} (62916608-419430399, default 419430399):

Command (m for help): w
```

如果出现如下waring：df 
The partition table has been altered!

Calling ioctl() to re-read partition table.

WARNING: Re-reading the partition table failed with error 16: Device or resource busy.
The kernel still uses the old table. The new table will be used at
the next reboot or after you run partprobe(8) or kpartx(8)

为了不重启生效,可以执行如下命令：partprobe

#### 增加逻辑存储
1. 增加物理卷（PV)
将创建的分区转换成pv
```
pvcreate /dev/vdc2
```
2. 查看卷组（VG)
```
[root@node2 data]# vgs
  VG     #PV #LV #SN Attr   VSize   VFree
  centos   2   2   0 wz--n- 218.99g 170.00g
```

3. 将PV添加到卷组
``` 
vgextend centos /dev/vdc2
```

4. 查看逻辑卷（LV)
```
[root@node2 data]# lvdisplay
  --- Logical volume ---
  LV Path                /dev/centos/swap
  LV Name                swap
  VG Name                centos
  LV UUID                zCWFAk-qd0b-iAs9-4fDB-p2mY-NbfO-eUTNC8
  LV Write Access        read/write
  LV Creation host, time localhost.localdomain, 2019-06-12 16:15:42 +0800
  LV Status              available
  # open                 0
  LV Size                <3.88 GiB
  Current LE             992
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     8192
  Block device           253:1

  --- Logical volume ---
  LV Path                /dev/centos/root
  LV Name                root
  VG Name                centos
  LV UUID                2Fe2A4-Z22o-ada3-9a6K-6ISL-tCor-JJGTE8
  LV Write Access        read/write
  LV Creation host, time localhost.localdomain, 2019-06-12 16:15:42 +0800
  LV Status              available
  # open                 1
  LV Size                <45.12 GiB
  Current LE             11550
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     8192
  Block device           253:0
```

5. 扩容
```
 lvextend -L +50G /dev/centos/root
```
6. 使文件系统生效
- 查看挂载路径
```
[root@node2 data]# df -h
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/centos-root   46G   44G  2.0G  96% /
devtmpfs                 7.8G     0  7.8G   0% /dev
tmpfs                    7.8G   83M  7.7G   2% /dev/shm
tmpfs                    7.8G  795M  7.0G  11% /run
tmpfs                    7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/vda1               1014M  145M  870M  15% /boot
tmpfs                    1.6G     0  1.6G   0% /run/user/0
/dev/vdc1                 30G  979M   27G   4% /minio/dev_data
```

查看分区文件系统
df -T

2. 使文件系统生效
```
xfs_growfs /dev/mapper/centos-root  #xfs扩容
resize2fs /dev/mapper/centos-root   #ext4扩容
```

