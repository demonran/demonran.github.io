#### Jpa并发save导致数据覆盖
>在使用JPA作为数据库ORM工具操作数据时，经常使用的方式时，先通过findById查询数据，然后对数据进行更新，然后调用save方法更新数据。
但是在并发场景下， 多个操作同时更新同一个实体， 就会出现数据被覆盖的场景。

##### 案例：
用户服务有两个更新接口， 分别更新用户名和密码， 先调用更新用户接口，再调用更新密码接口。
手动调用如下两个API, 代码执行流程如下：
1. 查询根据id查询用户实体
2. 更新实体username字段
3. 睡眠10s
4. 另一个线程，根据id查询同一个实体
5. 更新实体password字段
6. 保存User实体
7. 第一个线程保存User实体。
```java
  @PutMapping("username")
    public void updateUsername(@RequestBody User resource) throws InterruptedException {
        User user = userRepository.findById(resource.getId()).orElse(null);
        user.setUsername(resource.getUsername());
        Thread.sleep(10000);
        userRepository.save(user);
    }

    @PutMapping("password")
    public void updatePassword(@RequestBody User resource) {
        User user = userRepository.findById(resource.getId()).orElse(null);
        user.setPassword(resource.getPassword());
        userRepository.save(user);
    }
```
结果：修改password的逻辑会被完全覆盖掉。 只有username修改了。


##### 问题分析：
查看sql执行情况：
```sql
# 第一个线程查询
select * from user where id = 3;
# username = 'username1' password = 'password1'
# 第二个线程查询
select * from user where id = 3;
# username = 'username1' password = 'password1'
# 第二个线程更新passowrd = passwrod2
update user set username='username1' , passwrod = 'passwrod2' where id = 3;
# 第一个线程更新 username = username2
update user set username='username2' , passwrod = 'passwrod1' where id = 3;
```
结果最后只有username更新成功了。 password修改的数据被覆盖回去了。


Jpa的save()方法的逻辑是如果实体存在就更新，不存在就插入。本测试用例中User实体是存在的，所以都会执行更新操作。默认是所有字段都会更新。

```java
	@Transactional
	@Override
	public <S extends T> S save(S entity) {

		Assert.notNull(entity, "Entity must not be null.");

		if (entityInformation.isNew(entity)) {
			em.persist(entity);
			return entity;
		} else {
			return em.merge(entity);
		}
	}
```

原因是由于多个线程同时操作， 一个线程还没有提交前，另一个线程就查询了数据并且进行了数据修改，那么后一个修改就会覆盖前一个修改。

解决办法：
方法一： 增加事物， 让数据查询增加行锁。
select * from user where id = 3 for update;
那么第二个线程查询时就会等待。
JPA的实现是实现一个查询的接口方法，并设置Lock
```java
   @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<User> findOneById(Long id);
```

方法二： 增加乐观锁
```java
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;

    private String password;

    private Boolean deleted;

    @Version
    private Integer version;
}
```
第一个save方法执行时会成功，第二个会失败。
假设当前version = 0；
两次查询的User实体对象的version=0，
第一个执行save方法时，where version = 0, 匹配成功，更新数据并将版本号会升级为1。
第二个save方法执行时，where version = 0 ,匹配失败，sql执行失败。
```sql
update user set username='username1' , passwrod = 'passwrod2', version = version + 1 where id = 3 and version = 0; 
```

方法三：只更新变更的数据。
```java
@Table(name = "user")
@DynamicUpdate
public class User {
}
```
调用save方法时， 只会更新变更的字段，没有变更的字段不会再update语句中不会出现。但是由于是动态sql， 还需要在执行时进行数据比对，会有一点的性能消耗。

```sql
# 第一个线程查询
select * from user where id = 3;
# username = 'username1' password = 'password1'
# 第二个线程查询
select * from user where id = 3;
# username = 'username1' password = 'password1'
# 第二个线程更新passowrd = passwrod2
update user set passwrod = 'passwrod2' where id = 3;
# 第一个线程更新 username = username2
update user set username='username2'  where id = 3;
```

##### 总结：
以上三种方法，在实际使用时根据场景进行选择。
