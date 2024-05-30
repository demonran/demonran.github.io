
1. 先通过可以上网的服务器下载安装包
    ```bash
        # 方法1: 
        repotrack <package> # 会下载到当前目录
        #推荐， 会下载依赖的依赖

        #方法2:  
        yumdownloader --resolve --destdir=/tmp/<package> <package>
        # 只会下载当前软件包的依赖， 依赖的依赖不会下载
        # 方法3: 
         yum -y install <package> --downloadonly --downloaddir=/tmp/<package>
        # 如果已经安装了就使用不了，会提示已经安装，然后退出。
    ```
    

2. 再scp到服务器上
```bash
    scp /tmp/<package> target_hotst:/tmp
```
3. 在服务器上离线安装
```bash
   yum install /tmp/<package>/*.rpm
   或者
   rpm -Uvh --force --nodeps /tmp/<package>/*.rpm
```