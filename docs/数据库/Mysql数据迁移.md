### 概要
数据库备份有全量备份和增量备份，备份的方式有在线备份和离线备份，本文主要讲myql的全量备份及使用的一些工具， 增量备份后续文章再单独分析说明。

### 在线模式
不停服务，通过mysql命令进行备份和还原
#### 备份
> 本文主要讲通过命令行工具进行迁移备份，其他工具navicat 和 datagrip都有比较好用的图形化操作界面。

备份分全量备份和增量备份，本次先考虑全量备份的场景。

 数据备份的工具有 mysqldump，xtrabackup， mydumper。
 
 1. 在线备份
 小容量数据库备份可以用mysqldump， 会锁表，耗时较长
 大容量数据库可以使用xtrabackup， 不会锁定InnoDB表，耗时主要在备份和网络传输。



因为我所涉及到的数据量都比较小，所以使用通过mysqldump 来实现。
>mysqldump的原理是在导入到新数据库时，先将原数据库表结构使用CREATE TABLE 'table'语句创建，然后在使用INSERT将原数据导入至新表中。可以理解为一个批量导入脚本。

备份常用的命令
```bash
#导出所有的数据库（包括系统数据库）数据库用户也会导出
mysqldump -u*** -p*** --all-databases > /root/all.sql

#导出db1和db2两个数据库的所有数据
mysqldump -u*** -p*** --databases db1 db2 > /root/db1_2.sql

# 只导出db1的表结构
mysqldum -utoot -p123456 --no-data --database db1 > /root/db1_ddl.sql

#只导出表数据不导出表结构： -t
mysqldum -u*** -p*** -t --database db1 > /root/db1_dml.sql

# 跨服务器导出导入数据（指定host）
mysqldump --host=<备份的数据库> -u*** -p*** -C --database db1 |mysql --host=<还原的数据库> -u*** -p*** db1
```
*注：加上-C参数可以启用压缩传递*

#### 数据库还原
1. 在线导入
使用source命令还原数据。
```bash
# 连接mysql
mysql -u*** -p***
# 切换database
use <dbname>;
# 导入数据
source <sql path>
```
一些版本中可以使用mysql < 导入数据，但我用版本(8.0.31)不支持。
```bash
mysql -u*** -p*** db1 < <sql path>
```

### 离线模式
关闭mysql服务，通过文件拷贝进行数据备份和还原
#### 数据库备份
查看mysql的数据存储路径
```bash
mysql> show global variables like "%datadir%";
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| datadir       | /var/lib/mysql/ |
+---------------+-----------------+
1 row in set (0.00 sec)
```

直接拷贝数据库目录文件, 备份到其他存储中。
需要拷贝的文件：
- 数据库目录：数据库数据
- ibdata1文件 ： 共享表空间

2. 离线还原

步骤
1. 停掉mysql
2. 拷贝数据库目录和ibdata1 到mysql数据目录
3. 启动服务
*注：保证数据库前后版本一致*
