import AWS from 'aws-sdk';

const S3= new AWS.S3();

export const hello = async (event: any, context: any) => {
  try {
    const data = await S3.getObject({Bucket: 'fdbt-test-ref-data', Key: '<keyNeeded>'}).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }
  catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message || JSON.stringify(err.message)
    }
  }
}