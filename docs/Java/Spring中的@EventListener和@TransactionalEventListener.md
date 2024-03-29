Spring中的发布/订阅模式非常好用，我个人经常将它用于监听程序中的事件并做相应的处理，这样有利于分离关注点和代码解耦。而本文的目的就在于描述@EventListener和@TransactionalEventListener的区别，帮助大家更好地使用发布/订阅模式。


@TransactionalEventListener
@TransactionalEventListener可以说是@EventListener的增强版，可以更好地配合数据库事务。通过该注解注册的监听者可以在以下几个事务阶段中执行（通过phase参数设置）：

AFTER_COMMIT（默认）：当事务成功提交后执行
AFTER_ROLLBACK：当事务失败回滚后执行
AFTER_COMPLETION：当事务完成后执行（无论事务是否成功）
BEFORE_COMMIT：在事务提交之前执行
除非将fallbackExecution设置为true，否则当没有处于一个事务中时，@TransactionalEventListener注册的监听方法不会被执行。

接下来我们将@EventListener替换为@TransactionalEventListener试一下：

TransactionSynchronization.afterCommint()方法的注释上找到了答案：
>NOTE: The transaction will have been committed already, but the transactional resources
might still be active and accessible. As a consequence, any data access code triggered at 
this point will still "participate" in the original transaction, allowing to perform some 
cleanup (with no commit following anymore!), unless it explicitly declares that it needs to 
run in a separate transaction. Hence: Use PROPAGATION_REQUIRES_NEW for any transactional 
operation that is called from here.

大概意思是说：事务已经提交了，虽然后续的操作仍然会“参与到”原先的事务当中，但是不会被再commit一次，想要在监听者方法中做一些写入操作，需要显式声明一个新事务。
根据Spring作者给出的建议，我们需要在userAllocation方法上声明一个新事务：
@Transactional(propagation = Propagation.REQUIRES_NEW)

当监听者方法耗时很长时，我们可以考虑使用@Async注解来使方法异步执行：
@TransactionalEventListener
@Async
此时不再需要声明事务，因为Spring中的事务默认是和线程绑定的，当新启动一条线程时，将开启另一个独立的事务。

## 总结
@TransactionalEventListener在事务场景下是对@EventListener的一个很好的替代方案，并且你可以决定它是异步还是同步执行。需要注意的是在默认情况下监听者方法会被绑定到发布者所在的事务中，你不能在监听者方法中将任何数据保存到数据库中，因为事务已经被提交了，并且再也没有机会重新提交。要解决这个问题有三种方法：

在方法上声明一个新事务
使用@Async让方法异步执行，新线程中会自动开启一个新事务
@TransactionalEventListener的phase参数设置为BEFORE_COMMIT，但是这种方法会导致之前所说的业务不能解耦的问题

