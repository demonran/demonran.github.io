

### 中文文档：
https://tkjohn.github.io/flowable-userguide/#_introduction

### 认识flowable

Flowable是一个使用Java编写的轻量级业务流程引擎。Flowable流程引擎可用于部署BPMN 2.0流程定义（用于定义流程的行业XML标准）， 创建这些流程定义的流程实例，进行查询，访问运行中或历史的流程实例与相关数据，等等。这个章节将用一个可以在你自己的开发环境中使用的例子，逐步介绍各种概念与API。

可以加入任何Java环境： javaSE Tomcat Spring 等。
也有许多Flowable应用（Flowable Modeler, Flowable Admin, Flowable IDM 与 Flowable Task），提供了直接可用的UI示例，可以使用流程与任务。

Flowable是Activiti(Alfresco持有的注册商标)的fork。在下面的章节中，你会注意到包名，配置文件等等，都使用flowable。


### 构建命令行程序
Maven依赖
```
<dependencies>
  <dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-engine</artifactId>
    <version>6.3.0</version>
  </dependency>
  <dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>1.3.176</version>
  </dependency>
  <dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-api</artifactId>
  <version>1.7.21</version>
</dependency>
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-log4j12</artifactId>
  <version>1.7.21</version>
</dependency>
</dependencies>

```

启动类
```
public class HolidayRequest {
    public static void main(String[] args) {
        ProcessEngineConfiguration cfg = new StandaloneInMemProcessEngineConfiguration();
        ProcessEngine processEngine = cfg.buildProcessEngine();
    }
}
```

保存流程定义
```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:flowable="http://flowable.org/bpmn"
  typeLanguage="http://www.w3.org/2001/XMLSchema"
  expressionLanguage="http://www.w3.org/1999/XPath"
  targetNamespace="http://www.flowable.org/processdef">

  <process id="holidayRequest" name="Holiday Request" isExecutable="true">

    <startEvent id="startEvent"/>
    <sequenceFlow sourceRef="startEvent" targetRef="approveTask"/>

    <userTask id="approveTask" name="Approve or reject request"/>
    <sequenceFlow sourceRef="approveTask" targetRef="decision"/>

    <exclusiveGateway id="decision"/>
    <sequenceFlow sourceRef="decision" targetRef="externalSystemCall">
      <conditionExpression xsi:type="tFormalExpression">
        <![CDATA[
          ${approved}
        ]]>
      </conditionExpression>
    </sequenceFlow>
    <sequenceFlow  sourceRef="decision" targetRef="sendRejectionMail">
      <conditionExpression xsi:type="tFormalExpression">
        <![CDATA[
          ${!approved}
        ]]>
      </conditionExpression>
    </sequenceFlow>

    <serviceTask id="externalSystemCall" name="Enter holidays in external system"
        flowable:class="org.flowable.CallExternalSystemDelegate"/>
    <sequenceFlow sourceRef="externalSystemCall" targetRef="holidayApprovedTask"/>

    <userTask id="holidayApprovedTask" name="Holiday approved"/>
    <sequenceFlow sourceRef="holidayApprovedTask" targetRef="approveEnd"/>

    <serviceTask id="sendRejectionMail" name="Send out rejection email"
        flowable:class="org.flowable.SendRejectionMail"/>
    <sequenceFlow sourceRef="sendRejectionMail" targetRef="rejectEnd"/>

    <endEvent id="approveEnd"/>

    <endEvent id="rejectEnd"/>

  </process>

</definitions>
```

将流程定义部署至Flowable引擎，使用RepositoryService
```java
RepositoryService repositoryService = processEngine.getRepositoryService();
Deployment deploy = repositoryService.createDeployment()
        .addClasspathResource("holiday-request.bpmn20.xml")
        .deploy();
```

启动流程实例，使用RuntimeService
```java
RuntimeService runtimeService = processEngine.getRuntimeService();
Map<String, Object> variable = new HashMap<>();
variable.put("employee", "张三");
// key 为xml中Process的ID
runtimeService.startProcessInstanceByKey("holidayRequest", variable);
```

为用户任务指定执行人或组
```xml
<!--第一个任务指定为managers组 -->
<userTask id="approveTask" name="Approve or reject request" flowable:candidateGroups="managers"/>
<!-- 第二个任务指定为发起人，使用启动流程时的变量-->
<userTask id="holidayApprovedTask" name="Holiday approved" flowable:assignee="${employee}"/>

```

查询任务
```java
 TaskService taskService = processEngine.getTaskService();
  List<Task> tasks = taskService.createTaskQuery().taskCandidateGroup("managers")
                                .list();

  System.out.println("You have " + tasks.size() + " tasks:");
  for (int i = 0; i < tasks.size(); i++) {
      System.out.println((i + 1) + ") " + tasks.get(i).getName());
  }
```

执行用户任务
```java
Map<String, Object> variables = new HashMap<String, Object>();
boolean approved = approveCmd.toUpperCase().equals("Y");
variables.put("approved", approved);
taskService.complete(task.getId(), variables);
```

查询任务历史
```java
HistoryService historyService = processEngine.getHistoryService();
List<HistoricActivityInstance> activities =
        historyService.createHistoricActivityInstanceQuery()
                      .processInstanceId(processInstance.getId())
                      .finished()
                      .orderByHistoricActivityInstanceEndTime().asc()
                      .list();

activities.forEach(activity -> {
    System.out.println(activity.getActivityId() + "耗时" + activity.getDurationInMillis() + "ms");
});
```


### 配置
Flowable流程引擎通过名为flowable.cfg.xml的XML文件进行配置。请注意这种方式与使用Spring创建流程引擎不一样。
获取ProcessEngine，最简单的方式是使用org.flowable.engine.ProcessEngines类：
```
ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine()

```
这样会从classpath寻找flowable.cfg.xml，并用这个文件中的配置构造引擎。下面的代码展示了一个配置的例子。后续章节会对配置参数进行详细介绍。
```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="processEngineConfiguration" class="org.flowable.engine.impl.cfg.StandaloneProcessEngineConfiguration">

    <property name="jdbcUrl" value="jdbc:h2:mem:flowable;DB_CLOSE_DELAY=1000" />
    <property name="jdbcDriver" value="org.h2.Driver" />
    <property name="jdbcUsername" value="sa" />
    <property name="jdbcPassword" value="" />

    <property name="databaseSchemaUpdate" value="true" />

    <property name="asyncExecutorActivate" value="false" />

    <property name="mailServerHost" value="mail.my-corp.com" />
    <property name="mailServerPort" value="5025" />
  </bean>

</beans>
```
flowable.cfg.xml文件中必须包含一个id为'processEngineConfiguration'的bean。


通过提供的JDBC参数构造的数据源，使用默认的MyBatis连接池设置。可用下列属性调整这个连接池（来自MyBatis文档）：

MyBatis连接池在处理大量并发请求时，并不是最经济或最具弹性的。因此，建议使用javax.sql.DataSource的实现，并将其注入到流程引擎配置中（如Hikari、Tomcat JDBC连接池，等等）：
```xml
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" >
  <property name="driverClassName" value="com.mysql.jdbc.Driver" />
  <property name="url" value="jdbc:mysql://localhost:3306/flowable" />
  <property name="username" value="flowable" />
  <property name="password" value="flowable" />
  <property name="defaultAutoCommit" value="false" />
</bean>

<bean id="processEngineConfiguration" class="org.flowable.engine.impl.cfg.StandaloneProcessEngineConfiguration">

  <property name="dataSource" ref="dataSource" />
  ...
```

databaseSchemaUpdate: 用于设置流程引擎启动关闭时使用的数据库表结构控制策略。

- false (默认): 当引擎启动时，检查数据库表结构的版本是否匹配库文件版本。版本不匹配时抛出异常。

- true: 构建引擎时，检查并在需要时更新表结构。表结构不存在则会创建。

- create-drop: 引擎创建时创建表结构，并在引擎关闭时删除表结构。

#### 数据库表名说明

Flowable的所有数据库表都以ACT_开头。第二部分是说明表用途的两字符标示符。服务API的命名也大略符合这个规则。

- ACT_RE_*: 'RE’代表repository。带有这个前缀的表包含“静态”信息，例如流程定义与流程资源（图片、规则等）。

- ACT_RU_*: 'RU’代表runtime。这些表存储运行时信息，例如流程实例（process instance）、用户任务（user task）、变量（variable）、作业（job）等。Flowable只在流程实例运行中保存运行时数据，并在流程实例结束时删除记录。这样保证运行时表小和快。

- ACT_HI_*: 'HI’代表history。这些表存储历史数据，例如已完成的流程实例、变量、任务等。

- ACT_GE_*: 通用数据。在多处使用。