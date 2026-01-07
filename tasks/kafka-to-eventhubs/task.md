---
id: kafka-to-eventhubs
name: Migrate Kafka to Azure Event Hubs
type: task
---

# Migrate Kafka to Azure Event Hubs

## Overview
Azure Event Hubs provides a Kafka endpoint that enables you to migrate Kafka applications with minimal code changes. This task guides you through the migration process.

## Prerequisites
- Java 11 or higher
- Existing Kafka-based application
- Azure Event Hubs namespace (with Kafka endpoint enabled)

## Migration Steps

### 1. Update Dependencies

Keep your existing Kafka client dependencies - Event Hubs is protocol-compatible!

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>3.6.0</version>
</dependency>
```

### 2. Update Configuration

**Before (Kafka):**
```properties
bootstrap.servers=localhost:9092
security.protocol=PLAINTEXT
group.id=my-consumer-group
```

**After (Event Hubs):**
```properties
bootstrap.servers=<your-namespace>.servicebus.windows.net:9093
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="<your-connection-string>";
group.id=my-consumer-group
```

### 3. Connection String Format

Get your Event Hubs connection string from Azure Portal:
```
Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<key-name>;SharedAccessKey=<key-value>
```

### 4. Code Changes

**Minimal changes required!** Most Kafka client code works as-is:

```java
// Producer - same code, just updated configuration
Properties props = new Properties();
props.put("bootstrap.servers", "<namespace>.servicebus.windows.net:9093");
props.put("security.protocol", "SASL_SSL");
props.put("sasl.mechanism", "PLAIN");
props.put("sasl.jaas.config", connectionString);

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.send(new ProducerRecord<>("my-topic", "key", "value"));
```

### 5. Topic Mapping

- Kafka topics → Event Hubs event hubs
- Create Event Hubs with the same names as your Kafka topics
- Consumer groups work the same way

### 6. Feature Differences

Be aware of these differences:

| Feature | Kafka | Event Hubs |
|---------|-------|------------|
| Message Retention | Configurable | 1-7 days (90 days with Premium) |
| Partitions | User-defined | Fixed per tier |
| Transactions | Supported | Not supported |
| Compacted Topics | Supported | Not supported |

### 7. Testing

1. Test producer with Event Hubs endpoint
2. Verify consumer group functionality
3. Test partition assignment and rebalancing
4. Validate message ordering within partitions
5. Test failure scenarios and retry logic

## Best Practices

- Use connection pooling for producers
- Implement proper error handling
- Monitor with Azure Monitor
- Use managed identities in production
- Consider Event Hubs Premium for high-throughput scenarios

## References

- file:///kafka.properties.template
- [Event Hubs for Kafka Documentation](https://docs.microsoft.com/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)
