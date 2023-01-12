## 背景
在工作中经常会遇到一些数据迁移的工作，大多数据数据迁移都存在表结构的差异，也可能砸死迁移过程中存在一些数据统计的工作，比如新开发了一个统计查询功能， 为了数据实时性，可以直接通过sql来查询基础数据通过聚合函数进行统计； 为了查询效率，也可以通过创建一张统计表来存储汇总数据，新的数据可以在数据添加时实时计算并在数据统计的工作，但是老的数据需要做一些统计插入。 当然这些工作基本上都可以通过写代码的方式进行实现， 但是如果能用sql实现岂不是更简单？

## 场景
### 场景1
#### 问题
在一个签到打卡程序中，每个人每天可以进行任务打卡，有一天产品突然提出要做一个统计页面，在页面上要显示每个任务的连续打卡天数。
历史数据： 统计到今天为止连续打卡的天数（即： 从今日倒推有多少天连续，就统计连续天数为多少天）

```sql
# 每日打卡记录表
create table daily_tasks
(
    id          varchar(32) not null primary key,
    todolist_id varchar(32) null comment '任务ID',
    date        datetime(3) null comment '打卡日期', 
    user_id     longtext    null comment '用户ID'
);

```
上面是精简后的表结构，因为每次打卡后会新增加一条数据， 没有打卡就不会有数据。

#### 解决方案
##### 思路

- 如果要统计连续性， 首先就需要排序，因为是统计每个人每个任务的打卡记录，所以此处应该为分组排序（todolist_id, user_id)
- 因为要统计时间连续性，所以要使用date进行排序；
- 统计连续性，可以转换为打卡日期+排序序号=当前日期， 所以排序采用倒序排序；
    - 计算打卡日期+排序序号(dt)；
    - 过滤数据： dt = 当前日期
    - 统计数据：过滤出来符合的数据后分组count
    
- mysql可以使用row_number()来获取排序序号
##### 实现
1. 查询数据
分析完问题和思路后我们可以转换成mysql语法完成sql。
```sql
# 查询排序序号
row_number() over (partition by todolist_id, daily_tasks.user_id order by date desc)
# 计算dt
select user_id, todolist_id, 
       date_add(date, interval( row_number() over (partition by todolist_id, user_id order by date desc)) day) as dt 
from daily_tasks 
# 统计数据， 假设上面过滤后的数据表为t1
select todolist_id, user_id, count(1) as days_of_continuous_done from t1 where t1.dt = curdate() group by todolist_id, user_id, dt;
```
完整的查询sql
```bash
with t1 as (  select user_id, todolist_id,
       date_add(date, interval( row_number() over (partition by todolist_id, user_id order by date desc)) day) as dt
from daily_tasks )
select todolist_id, user_id, count(1) as days_of_continuous_done from t1 where t1.dt = curdate() group by todolist_id, user_id, dt;

```

2. 插入数据
将查出来的数据迁移到统计表，可以使用insert into ... select 
```sql
# 创建统计表
create table nes.user_todolist_statistics
(
    id                     int  not null auto_increment primary key,
    todolist_id            varchar(32)    null,
    days_of_continuous_done int      null,
    user_id                varchar(32)    null
);

# 插入数据
insert into user_todolist_statistics(todolist_id, user_id, continuous_finish_days) 
with t1 as (select user_id, todolist_id,
       date_add(date, interval( row_number() over (partition by todolist_id, user_id order by date desc)) day) as dt
from daily_tasks )
select  todolist_id, user_id, count(1) as days_of_continuous_done from t1 where t1.dt = curdate() group by todolist_id, user_id, dt;

```
如果id不是自增，是雪花或者uuid的话，数据库可以使用uuid_short()生成随机id。

>持续更新补充