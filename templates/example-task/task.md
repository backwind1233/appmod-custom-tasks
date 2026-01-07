---
id: example-task
name: Example Migration Task
type: task
---

# Example Migration Task

This is a template task that demonstrates the expected format for migration tasks.

## Overview

Briefly describe what this task accomplishes and the technologies involved.

## Prerequisites

- Requirement 1 (e.g., Java 11 or higher)
- Requirement 2 (e.g., Maven or Gradle project)
- Requirement 3 (e.g., Access to Azure subscription)

## Migration Steps

### 1. Update Dependencies

**Remove old dependencies:**
```xml
<!-- Remove from pom.xml -->
<dependency>
    <groupId>com.example</groupId>
    <artifactId>old-library</artifactId>
</dependency>
```

**Add new dependencies:**
```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>com.example</groupId>
    <artifactId>new-library</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 2. Update Configuration

**Before:**
```properties
old.config.setting=value
old.connection.string=${OLD_CONNECTION_STRING}
```

**After:**
```properties
new.config.setting=value
new.connection.string=${NEW_CONNECTION_STRING}
```

### 3. Transform Code

**Before (Old API):**
```java
// Old implementation
OldClient client = OldClientBuilder.create()
    .withEndpoint(endpoint)
    .build();

client.performOperation(data);
```

**After (New API):**
```java
// New implementation
NewClient client = new NewClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultCredentialBuilder().build())
    .buildClient();

client.executeOperation(data);
```

### 4. Update Error Handling

Ensure error handling is updated for the new API:

```java
try {
    client.executeOperation(data);
} catch (NewApiException e) {
    // Handle new API exceptions
    logger.error("Operation failed: {}", e.getMessage());
    throw new RuntimeException("Migration operation failed", e);
}
```

## Verification

1. Run unit tests: `mvn test`
2. Verify application starts: `mvn spring-boot:run`
3. Test key functionality manually
4. Check logs for any errors or warnings

## Common Issues

### Issue 1: Connection Timeout

**Symptom:** Connection timeout errors after migration

**Solution:** Update timeout settings in configuration:
```properties
new.connection.timeout=30000
```

### Issue 2: Authentication Failure

**Symptom:** 401 Unauthorized errors

**Solution:** Ensure credentials are properly configured:
```bash
export NEW_CONNECTION_STRING="your-connection-string"
```

## Additional Resources

- [New API Documentation](https://example.com/docs)
- [Migration Guide](https://example.com/migration)
- [Troubleshooting](https://example.com/troubleshooting)
