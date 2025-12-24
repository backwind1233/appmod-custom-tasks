package com.example.storage;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.BlobItem;
import java.io.File;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class BlobStorageService {
    private final BlobContainerClient containerClient;

    public BlobStorageService(String accountUrl, String containerName) {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
            .endpoint(accountUrl)
            .credential(new DefaultAzureCredentialBuilder().build())
            .buildClient();
        
        this.containerClient = blobServiceClient.getBlobContainerClient(containerName);
        
        // Create container if it doesn't exist
        if (!containerClient.exists()) {
            containerClient.create();
        }
    }

    // Alternative constructor using connection string
    public BlobStorageService(String connectionString, String containerName, boolean useConnectionString) {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
            .connectionString(connectionString)
            .buildClient();
        
        this.containerClient = blobServiceClient.getBlobContainerClient(containerName);
        
        if (!containerClient.exists()) {
            containerClient.create();
        }
    }

    public void uploadFile(String blobName, File file) {
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        blobClient.uploadFromFile(file.getAbsolutePath(), true);
    }

    public InputStream downloadFile(String blobName) {
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        return blobClient.openInputStream();
    }

    public List<String> listFiles(String prefix) {
        return StreamSupport.stream(
            containerClient.listBlobsByHierarchy(prefix).spliterator(), 
            false
        )
        .map(BlobItem::getName)
        .collect(Collectors.toList());
    }

    public void deleteFile(String blobName) {
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        blobClient.delete();
    }

    public boolean fileExists(String blobName) {
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        return blobClient.exists();
    }
}
