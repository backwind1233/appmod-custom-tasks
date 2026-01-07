// Example: After migration (New API)
package com.example.service;

import com.example.newapi.NewClient;
import com.example.newapi.NewClientBuilder;
import com.example.newapi.credential.DefaultCredentialBuilder;
import com.example.newapi.models.UploadResult;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class DataService {
    
    private final NewClient client;
    
    public DataService(String endpoint) {
        // Using managed identity for authentication (recommended)
        this.client = new NewClientBuilder()
            .endpoint(endpoint)
            .credential(new DefaultCredentialBuilder().build())
            .buildClient();
    }
    
    // Alternative constructor with connection string
    public DataService(String connectionString, boolean useConnectionString) {
        this.client = new NewClientBuilder()
            .connectionString(connectionString)
            .buildClient();
    }
    
    public String uploadData(String container, String key, byte[] data) {
        var containerClient = client.getContainerClient(container);
        var blobClient = containerClient.getBlobClient(key);
        
        UploadResult result = blobClient.upload(
            new ByteArrayInputStream(data), 
            data.length,
            true // overwrite if exists
        );
        
        return result.getETag();
    }
    
    public byte[] downloadData(String container, String key) {
        var containerClient = client.getContainerClient(container);
        var blobClient = containerClient.getBlobClient(key);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.download(outputStream);
        return outputStream.toByteArray();
    }
    
    public void deleteData(String container, String key) {
        var containerClient = client.getContainerClient(container);
        var blobClient = containerClient.getBlobClient(key);
        blobClient.delete();
    }
}
