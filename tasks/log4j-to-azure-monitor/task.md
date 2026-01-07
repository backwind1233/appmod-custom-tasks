---
id: log4j-to-azure-monitor
name: Integrate Azure Monitor Application Insights
type: task
---

**Prompt:**

Add comprehensive monitoring and telemetry to your Java application using Azure Monitor Application Insights.

## Prerequisites
- Java 8 or higher
- Azure Application Insights resource
- Existing Java application

## Integration Steps

### 1. Add Dependencies

**For Spring Boot applications:**
```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-monitor</artifactId>
</dependency>
```

**For other Java applications:**
```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-runtime-attach</artifactId>
    <version>3.4.19</version>
</dependency>
```

### 2. Configuration

**For Spring Boot (application.properties):**
```properties
# Connection string approach (recommended)
applicationinsights.connection-string=InstrumentationKey=<your-key>;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/

# Alternative: Using environment variable
# APPLICATIONINSIGHTS_CONNECTION_STRING=...
```

**For non-Spring applications:**
Create `applicationinsights.json`:
```json
{
  "connectionString": "InstrumentationKey=<your-key>;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/",
  "role": {
    "name": "my-application"
  },
  "instrumentation": {
    "logging": {
      "level": "INFO"
    }
  }
}
```

### 3. Automatic Instrumentation

Application Insights automatically captures:
- HTTP requests and responses
- Database calls (JDBC)
- Redis operations
- HTTP client calls
- Exceptions and stack traces

### 4. Custom Telemetry

Add custom tracking:
```java
import com.microsoft.applicationinsights.TelemetryClient;

public class MyService {
    private final TelemetryClient telemetryClient = new TelemetryClient();
    
    public void processOrder(Order order) {
        // Track custom event
        telemetryClient.trackEvent("OrderProcessed", 
            Map.of("orderId", order.getId(), "amount", order.getTotal()),
            Map.of("itemCount", (double) order.getItems().size())
        );
        
        // Track custom metric
        telemetryClient.trackMetric("OrderValue", order.getTotal());
        
        // Track dependency
        long startTime = System.currentTimeMillis();
        try {
            externalService.call();
            telemetryClient.trackDependency("ExternalAPI", "POST /api/orders", 
                startTime, System.currentTimeMillis() - startTime, true);
        } catch (Exception e) {
            telemetryClient.trackException(e);
            telemetryClient.trackDependency("ExternalAPI", "POST /api/orders", 
                startTime, System.currentTimeMillis() - startTime, false);
        }
    }
}
```

### 5. Log Integration

**Log4j2 appender:**
```xml
<Configuration packages="com.microsoft.applicationinsights.log4j.v2">
    <Appenders>
        <ApplicationInsightsAppender name="aiAppender">
            <ConnectionString>
                InstrumentationKey=<your-key>;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/
            </ConnectionString>
        </ApplicationInsightsAppender>
    </Appenders>
    
    <Loggers>
        <Root level="info">
            <AppenderRef ref="aiAppender"/>
        </Root>
    </Loggers>
</Configuration>
```

### 6. Performance Monitoring

Monitor key performance indicators:
```java
import com.microsoft.applicationinsights.TelemetryClient;
import com.microsoft.applicationinsights.telemetry.Duration;

// Track operation timing
long startTime = System.currentTimeMillis();
try {
    performOperation();
    telemetryClient.trackMetric("OperationDuration", 
        System.currentTimeMillis() - startTime);
} catch (Exception e) {
    telemetryClient.trackException(e);
}
```

### 7. Distributed Tracing

Application Insights automatically correlates distributed traces across:
- HTTP calls between services
- Database operations
- Queue operations
- Custom dependencies

No additional code required for basic distributed tracing!

**References:**
- https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview
- https://docs.microsoft.com/azure/data-explorer/kusto/query/
