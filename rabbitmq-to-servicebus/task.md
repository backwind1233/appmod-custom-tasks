# Migrate RabbitMQ to Azure Service Bus

## Overview
Migrate from RabbitMQ to Azure Service Bus, transforming exchanges, queues, and routing patterns to Service Bus equivalents.

## Prerequisites
- Java 11 or higher
- Existing RabbitMQ implementation
- Azure Service Bus namespace

## Concept Mapping

| RabbitMQ | Azure Service Bus |
|----------|-------------------|
| Queue | Queue |
| Exchange (Topic) | Topic |
| Binding | Subscription with Filter |
| Direct Exchange | Queue |
| Topic Exchange | Topic with SQL Filters |
| Fanout Exchange | Topic with no filters |

## Migration Steps

### 1. Update Dependencies

**Remove RabbitMQ:**
```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
</dependency>
```

**Add Service Bus:**
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-servicebus</artifactId>
    <version>7.15.0</version>
</dependency>
```

### 2. Transform Producers

**Before (RabbitMQ):**
```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");
Connection connection = factory.newConnection();
Channel channel = connection.createChannel();

channel.exchangeDeclare("logs", "fanout");
channel.basicPublish("logs", "", null, message.getBytes());
```

**After (Service Bus):**
```java
ServiceBusSenderClient sender = new ServiceBusClientBuilder()
    .connectionString(connectionString)
    .sender()
    .topicName("logs")
    .buildClient();

sender.sendMessage(new ServiceBusMessage(message));
```

### 3. Transform Consumers

**Before (RabbitMQ):**
```java
DeliverCallback deliverCallback = (consumerTag, delivery) -> {
    String message = new String(delivery.getBody(), "UTF-8");
    processMessage(message);
};
channel.basicConsume("queue-name", true, deliverCallback, consumerTag -> {});
```

**After (Service Bus):**
```java
ServiceBusProcessorClient processor = new ServiceBusClientBuilder()
    .connectionString(connectionString)
    .processor()
    .queueName("queue-name")
    .processMessage(context -> {
        ServiceBusReceivedMessage message = context.getMessage();
        processMessage(message.getBody().toString());
    })
    .processError(context -> {
        System.err.println("Error: " + context.getException());
    })
    .buildProcessorClient();

processor.start();
```

### 4. Routing Patterns

**Topic Exchange with Routing Keys:**
```java
// Service Bus Topic with subscription filters
ServiceBusAdministrationClient admin = new ServiceBusAdministrationClientBuilder()
    .connectionString(connectionString)
    .buildClient();

// Create subscription with SQL filter
CreateSubscriptionOptions options = new CreateSubscriptionOptions();
SqlRuleFilter filter = new SqlRuleFilter("sys.Label = 'important'");
CreateRuleOptions ruleOptions = new CreateRuleOptions()
    .setFilter(filter);

admin.createSubscription("topic-name", "subscription-name", options);
admin.createRule("topic-name", "subscription-name", ruleOptions);
```

### 5. Message Properties

Map RabbitMQ properties to Service Bus:
```java
// RabbitMQ: delivery.getProperties()
// Service Bus: message.getApplicationProperties()

ServiceBusMessage message = new ServiceBusMessage("body");
message.getApplicationProperties().put("key", "value");
message.setContentType("application/json");
message.setMessageId(UUID.randomUUID().toString());
```

## Best Practices

- Use Service Bus sessions for ordered message processing
- Implement dead-letter queue handling
- Use auto-complete for most scenarios
- Handle duplicate detection with message IDs
- Monitor with Azure Monitor

## Additional Resources

- [Azure Service Bus Documentation](https://docs.microsoft.com/azure/service-bus-messaging/)
- See `examples/` for complete migration examples
