package com.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.event.S3EventNotification;
import org.xml.sax.SAXParseException;

import java.io.IOException;

public class Handler implements RequestHandler<S3Event, String> {
	@Override
	public String handleRequest(S3Event event, Context ctx) {

		final S3EventNotification.S3EventNotificationRecord record = event.getRecords().get(0);
		final String bucketName = record.getS3().getBucket().getName();
		final String key = record.getS3().getObject().getKey();

		final S3 s3 = new S3();

		String content = null;

		try {
			content = s3.getObjectContentAsStringFromS3(bucketName, key);
		} catch (IOException e) {
			System.err.println(e.getMessage());
		}

		final NetexValidator netexValidator = new NetexValidator();

		if (content == null || content.isEmpty()) {
			throw new Error("No content found.");
		}

		final ValidationResult result = netexValidator.isNetexValid(content);

		final String validatedBucketname = "";

		if (result.getValidity()) {
			s3.putObjectInValidatedBucket(validatedBucketname, key, content);
		} else {
			System.out.println("Netex validation failed. Errors are: \n");

			for (SAXParseException e : result.getErrors()) {
				System.out.println(String.format("Error Line number: %s , Error Column number: %s, Error Message: %s",
						e.getLineNumber(), e.getColumnNumber(), e.toString()));
			}
		}

		return "Netex Validation complete.";
	}
}
