// Example: Before migration (Old API)
package com.example.service;

import com.example.old.OldClient;
import com.example.old.OldClientBuilder;
import com.example.old.OldRequest;
import com.example.old.OldResponse;

public class DataService {
    
    private final OldClient client;
    
    public DataService(String endpoint, String accessKey) {
        this.client = OldClientBuilder.create()
            .withEndpoint(endpoint)
            .withAccessKey(accessKey)
            .build();
    }
    
    public String uploadData(String container, String key, byte[] data) {
        OldRequest request = new OldRequest()
            .withContainer(container)
            .withKey(key)
            .withData(data);
        
        OldResponse response = client.upload(request);
        return response.getId();
    }
    
    public byte[] downloadData(String container, String key) {
        return client.download(container, key);
    }
    
    public void deleteData(String container, String key) {
        client.delete(container, key);
    }
}
