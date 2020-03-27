package com.serverless;

import java.io.IOException;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.event.S3EventNotification;

import org.xml.sax.SAXParseException;

public class Handler implements RequestHandler<S3Event, String> {
	@Override
	public String handleRequest(S3Event event, Context ctx) {

		final S3EventNotification.S3EventNotificationRecord record = event.getRecords().get(0);
		final String bucketName = record.getS3().getBucket().getName();
		final String key = record.getS3().getObject().getKey();

		final S3 s3 = new S3();

		final NetexValidator netexValidator = new NetexValidator();

		byte[] s3ByteArray = null;

		try {
			final String validatedBucketname = "";
			s3ByteArray = s3.getS3ObjectAsByteArray(bucketName, key);
			final ValidationResult result = netexValidator.isNetexValid(bucketName, key, s3ByteArray.clone());

			if (result.getValidity()) {
				System.out.println("NeTEx valid, writing to validated bucket");
				s3.putObjectInValidatedBucket(validatedBucketname, key, s3ByteArray.clone());
			} else {
				System.out.println("NeTEx validation failed. Errors are: \n");

				for (SAXParseException e : result.getErrors()) {
					System.out
							.println(String.format("Error Line number: %s , Error Column number: %s, Error Message: %s",
									e.getLineNumber(), e.getColumnNumber(), e.toString()));
				}
			}
		} catch (IOException e) {
			System.out.println(e.getStackTrace());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "Netex Validation complete.";
	}
}
