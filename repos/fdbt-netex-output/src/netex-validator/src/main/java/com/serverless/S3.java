package com.serverless;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.ClientConfiguration;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class S3 {

    private AmazonS3 s3Client;

    public S3() {
        final ClientConfiguration config = new ClientConfiguration();
        config.setSocketTimeout(0);
        config.setConnectionTimeout(30000);
        config.setRequestTimeout(60000);
        this.s3Client = AmazonS3ClientBuilder.standard().withRegion(Regions.EU_WEST_2).withClientConfiguration(config)
                .build();
    }

    public byte[] getS3ObjectAsByteArray(String bucketName, String key) throws IOException {
        System.out.println(String.format("Downloading object %s from S3", key));

        S3Object obj = this.s3Client.getObject(new GetObjectRequest(bucketName, key));
        S3ObjectInputStream s3is = obj.getObjectContent();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        IOUtils.copy(s3is, baos);

        return baos.toByteArray();
    }

    public void putObjectInValidatedBucket(String bucketName, String key, byte[] s3ByteArray) {
        System.out.format("Uploading %s to S3 bucket %s...\n", key, bucketName);

        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(s3ByteArray);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("text/plain");
            metadata.setContentLength(s3ByteArray.length);
            this.s3Client.putObject(
                    new PutObjectRequest(bucketName, key.substring(0, key.lastIndexOf('.')), bais, metadata));
        } catch (AmazonServiceException e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}