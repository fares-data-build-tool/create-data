package unit;

import com.serverless.Handler;
import org.junit.Test;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.event.S3EventNotification;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.google.common.collect.Lists;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.isNotNull;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.isA;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;

import javax.annotation.processing.Processor;
import java.util.List;

public class HandlerTest {

    @Test
    public void validateNetex(){

        Handler handler = new Handler();

        String bucketName = "bucketname";
        String arn = "foo";

        Processor processor = mock(Processor.class);
        List<Processor> processors = Lists.newLinkedList();
        processors.add(processor);

        handler.overrideProcessors(processors);
        CloudFrontLogHandlerConfig params = new CloudFrontLogHandlerConfig();
        doReturn(params).when(handler).getConfiguration(arn);

        Context context = mock(Context.class);
        when(context.getInvokedFunctionArn()).thenReturn(arn);

        S3Event event = mock(S3Event.class);
        List<S3EventNotification.S3EventNotificationRecord> records = Lists.newArrayList();
        S3EventNotification.S3EventNotificationRecord record = mock(S3EventNotification.S3EventNotificationRecord.class);
        records.add(record);
        when(event.getRecords()).thenReturn(records);
        S3EventNotification.S3Entity s3Entity = mock(S3EventNotification.S3Entity.class);
        S3EventNotification.S3BucketEntity bucketEntity = mock(S3EventNotification.S3BucketEntity.class);
        S3EventNotification.S3ObjectEntity objectEntity = mock(S3EventNotification.S3ObjectEntity.class);
        when(s3Entity.getBucket()).thenReturn(bucketEntity);
        when(s3Entity.getObject()).thenReturn(objectEntity);
        when(record.getS3()).thenReturn(s3Entity);
        when(bucketEntity.getName()).thenReturn(bucketName);
        when(objectEntity.getKey()).thenReturn("access.log.gz");
        when(amazonS3Client.getObject(isA(GetObjectRequest.class))).thenReturn(mock(S3Object.class));
        doReturn(null).when(handler).ingestLogStream(null);

        handler.handleNewS3Event(event, context);

        verify(processor, times(1)).processLogEvents(null, params, bucketName);
    }
}
