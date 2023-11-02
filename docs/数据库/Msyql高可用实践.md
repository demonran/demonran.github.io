MysqlRouter

MGR


启动复制
 Start group_replication;

启动复制报错：
 ERROR 3092 (HY000): The server is not configured properly to be an active member of the group. Please see more details on error log.


检查状态
SELECT * FROM performance_schema.replication_group_members;


