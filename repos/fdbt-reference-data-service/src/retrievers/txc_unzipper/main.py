import urllib.parse
import boto3
import os
import logging
from zipfile import ZipFile

file_dir = '/tmp/file.zip'

s3 = boto3.client('s3')
cloudwatch = boto3.client('cloudwatch')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(
        event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    try:
        s3.download_file(bucket, key, file_dir)
        zipfile = ZipFile(file_dir)

        key_base = os.path.splitext(key)[0]

        namelist = zipfile.namelist()
        xml_files = list(filter(lambda x: x.endswith('.xml'), namelist))

        for filename in xml_files:
            s3.upload_fileobj(
                zipfile.open(filename),
                os.getenv('BUCKET_NAME'),
                key_base + '/' + os.path.basename(filename),
                ExtraArgs={
                    'ContentType': 'application/xml'
                }
            )

        cloudwatch.put_metric_data(
            MetricData = [
                {
                    'MetricName': 'TxcFilesCopied',
                    'Dimensions': [
                        {
                            'Name': 'By Data Source',
                            'Value': key.split('/')[0]
                        },
                    ],
                    'Unit': 'None',
                    'Value': len(xml_files)
                },
            ],
            Namespace='FDBT/Reference-Data-Retrievers'
        )
    except Exception as e:
        logger.error(e)
        logger.error(
            'Error getting object {} from bucket {}.'.format(key, bucket))
        raise e
