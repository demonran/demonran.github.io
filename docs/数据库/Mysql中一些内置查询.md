
1. Mysql连接数查询
```
show variables like '%max_connection%';

show global status like 'Thread%';

show global status like 'Connections%';


show variables like 'thread_cache_size';


show processlist;
```