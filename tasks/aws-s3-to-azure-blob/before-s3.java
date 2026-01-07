package com.example.storage;

import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import java.io.File;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

public class S3StorageService {
    private final AmazonS3 s3Client;
    private final String bucketName;

    public S3StorageService(String bucketName, String region) {
        this.bucketName = bucketName;
        this.s3Client = AmazonS3ClientBuilder.standard()
            .withRegion(region)
            .withCredentials(new DefaultAWSCredentialsProviderChain())
            .build();
    }

    public void uploadFile(String key, File file) {
        PutObjectRequest request = new PutObjectRequest(bucketName, key, file);
        s3Client.putObject(request);
    }

    public InputStream downloadFile(String key) {
        S3Object object = s3Client.getObject(bucketName, key);
        return object.getObjectContent();
    }

    public List<String> listFiles(String prefix) {
        ListObjectsV2Request request = new ListObjectsV2Request()
            .withBucketName(bucketName)
            .withPrefix(prefix);
        
        ListObjectsV2Result result = s3Client.listObjectsV2(request);
        return result.getObjectSummaries().stream()
            .map(S3ObjectSummary::getKey)
            .collect(Collectors.toList());
    }

    public void deleteFile(String key) {
        s3Client.deleteObject(bucketName, key);
    }

    public boolean fileExists(String key) {
        return s3Client.doesObjectExist(bucketName, key);
    }
}
