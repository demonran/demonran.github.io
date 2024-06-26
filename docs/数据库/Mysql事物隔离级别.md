
# MySQL的事物隔离级别是怎么实现的？

[[toc]]

## 事物有哪些特性？
事物是有MySQL的存储引擎来实现的，InnoDB是支持事物的。

不是所有的存储引擎都支持事物， MySQL的MyISAM引擎就不支持事物，也正是这样，大多数MySQL引擎都是InnoDB。

实现事物必须遵守4个特性
- 原子性（Atomicity）: 是指一个数据是不可分割的工作单元，其中的操作要么都做，要么都不做。如果事物中的一个sql执行失败，则已经执行的语句也必须回滚，数据库回退到事物前的状态
- 一致性（Consistency）: 事物操作的前后
- 隔离性（Isolation）：数据库允许
- 持久性