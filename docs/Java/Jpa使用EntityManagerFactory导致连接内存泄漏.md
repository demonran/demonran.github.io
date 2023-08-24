### 背景
在项目中有个需求，是需要记录数据库Entity发生变化的字段，于是就想到了JPA的EntityListener, 采用自定义的ChangeLogEntityListener在@PostUpdate回调方法中实现前后值的对比。
默认回调方法中返回的是新值，旧值需要通过数据库查询， 在Linstener查询数据库无法获取到Repository,所以只能使用EntityManager, EntityManager的获取就使用了EntityManagerFactory.

### 现象
在对项目压测时发现当压到一定时间后就出现了连接超过最大连接数，之后所有访问数据库的请求都会报错。
通过druid页面查看活跃连接数一直和最大连接数一样，都是200，并且活跃连接数一直下降的迹象。

### 问题排查
通过druid的能力，增加如下配置， 开启连接池的自动回收功能。
#是否自动回收超时连接 
removeAbandoned: true
#超时时间(以秒数为单位) 
removeAbandonedTimeout: 60
#是否在自动回收超时连接的时候打印连接的超时错误 
logAbandoned: true

通过日志查看到ChangeLogEntityListener中存在报错信息，查看代码发现在查询数据时使用EntityManagerFactory.createEntityManager() 方法，但是没有关闭导致连接无法释放，最后超时被关闭。


官网上了解到EntityManager的说明，大致意思是，“EntityManager如果不是由容器管理的情况下需要手动关闭”，正好我们的EntityManager由EntityManager创建而来，属于编码式创建，而非容器管理，所以是使用EntityManager不当导致连接没有正常归还连接池。

### 解决方案
1. 在finally中调用EntityManager.close()方法归还连接池连接。
2. 通过spring管理@PresistenceContext创建EntityManager.

注意注入entityManager不能使用@Autowired，由于EntityManager不是线程安全的，当多个请求进来的时候，spring会创建多个线程，而@PersistenceContext就是用来为每个线程创建一个EntityManager的，而@Autowired就只创建了一个，为所有线程共用，有可能报错，下面是官网原话。
