package com.serverless;

import com.amazonaws.AmazonServiceException;

import com.amazonaws.SdkClientException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.util.IOUtils;

import java.io.IOException;

public class S3 {

    public String getObjectContentAsStringFromS3(String bucketName, String key) throws IOException {
        Regions clientRegion = Regions.DEFAULT_REGION;

        S3Object fullObject = null;

        try {
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withRegion(clientRegion)
                    .withCredentials(new ProfileCredentialsProvider()).build();

            System.out.println(String.format("Downloading object %s from S3", key));

            fullObject = s3Client.getObject(new GetObjectRequest(bucketName, key));

            final String content = IOUtils.toString(fullObject.getObjectContent());

            return content;

        } catch (AmazonServiceException e) {
            // The call was transmitted successfully, but Amazon S3 couldn't process
            // it, so it returned an error response.
            return e.getErrorMessage();
        } catch (SdkClientException e) {
            // Amazon S3 couldn't be contacted for a response, or the client
            // couldn't parse the response from Amazon S3.
            return e.getMessage();
        } finally {
            // Close any open input streams.
            if (fullObject != null) {
                fullObject.close();
            }
        }

    }

    public void putObjectInValidatedBucket(String bucketName, String key, String content){

        System.out.format("Uploading %s to S3 bucket %s...\n", key, bucketName);

        final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.DEFAULT_REGION).build();

        try {
            s3.putObject(bucketName, key, content);
        } catch (AmazonServiceException e) {
            System.err.println(e.getErrorMessage());
            System.exit(1);
    }
}}