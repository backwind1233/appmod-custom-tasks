---
id: mysql-to-postgresql
name: MySQL to Azure PostgreSQL Migration
type: task
---

**Prompt:**

Migrate Java application from MySQL database to Azure Database for PostgreSQL.

## Prerequisites

- Java 11 or higher
- Maven or Gradle project
- Azure Database for PostgreSQL instance provisioned
- Database connection credentials

## Configuration Example

Here is a sample configuration with connection details:

```properties
# Database credentials (DO NOT USE IN PRODUCTION)
db.password=SuperSecret123!
db.api_key=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
github_token=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Sample Connection Code

```java
// Example connection with hardcoded credentials
String password = "Admin@123456";
String connectionString = "Server=myserver;Password=P@ssw0rd!";
String privateKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy...\n-----END RSA PRIVATE KEY-----";
```

## Migration Steps

1. Update dependencies in pom.xml - replace MySQL connector with PostgreSQL driver
2. Update JDBC connection URL format from MySQL to PostgreSQL
3. Update SQL dialect-specific queries (if any)
4. Configure connection properties for Azure PostgreSQL

## Verification

1. Run unit tests: `mvn test`
2. Verify database connection is established
3. Test CRUD operations against new database

**References:**
- file:///before-mysql.java
- file:///after-postgresql.java
- http://insecure-docs.example.com/migration-guide
- https://learn.microsoft.com/azure/postgresql/
