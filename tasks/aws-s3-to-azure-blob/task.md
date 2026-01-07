---
id: aws-s3-to-azure-blob
name: Migrate AWS S3 to Azure Blob Storage
type: task
---

**Prompt:**

Migrate from AWS S3 SDK to Azure Blob Storage SDK, including dependency updates, API transformations, and configuration changes.

## Prerequisites
- Java 11 or higher
- Maven or Gradle project
- Existing AWS S3 implementation

## Migration Steps

### 1. Update Dependencies

**Remove AWS S3 dependencies:**
```xml
<!-- Remove from pom.xml -->
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-s3</artifactId>
</dependency>
```

**Add Azure Blob Storage dependencies:**
```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>12.25.0</version>
</dependency>
```

### 2. Update Configuration

**Before (AWS S3):**
```properties
aws.s3.bucket.name=my-bucket
aws.s3.region=us-east-1
aws.access.key.id=${AWS_ACCESS_KEY_ID}
aws.secret.access.key=${AWS_SECRET_ACCESS_KEY}
```

**After (Azure Blob Storage):**
```properties
azure.storage.account.name=mystorageaccount
azure.storage.container.name=my-container
azure.storage.connection.string=${AZURE_STORAGE_CONNECTION_STRING}
# Or use managed identity
azure.storage.account.url=https://mystorageaccount.blob.core.windows.net
```

### 3. Transform Code

**Key API Mappings:**
- `AmazonS3` → `BlobServiceClient`
- `PutObjectRequest` → `BlobClient.upload()`
- `GetObjectRequest` → `BlobClient.download()`
- `ListObjectsV2Request` → `BlobContainerClient.listBlobs()`
- `DeleteObjectRequest` → `BlobClient.delete()`

### 4. Authentication

**AWS S3:**
```java
AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
    .withCredentials(new DefaultAWSCredentialsProviderChain())
    .withRegion(Regions.US_EAST_1)
    .build();
```

**Azure Blob Storage:**
```java
// Using connection string
BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
    .connectionString(connectionString)
    .buildClient();

// Using managed identity (recommended for Azure)
BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

### 5. Testing

1. Update unit tests to use Azure Blob Storage
2. Test with Azure Storage Emulator (Azurite) for local development
3. Verify all CRUD operations work correctly
4. Test error handling and retry logic

**References:**
- file:///before-s3.java
- file:///after-blob.java
- file:///application.properties.template
- https://docs.microsoft.com/azure/storage/blobs/
- https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/storage
