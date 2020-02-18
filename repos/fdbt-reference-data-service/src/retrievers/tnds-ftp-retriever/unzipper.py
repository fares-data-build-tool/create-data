import urllib.parse
import boto3
import os
from zipfile import ZipFile
from io import BytesIO

file_dir = '/tmp/file.zip'

s3 = boto3.client('s3')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    try:
        obj = s3.download_file(bucket, key, file_dir)
        zipfile = ZipFile(file_dir)

        key_base = os.path.splitext(key)[0]

        for filename in zipfile.namelist():
            s3.upload_fileobj(
                zipfile.open(filename),
                os.getenv('BUCKET_NAME'),
                key_base + '/' + os.path.basename(filename),
                ExtraArgs={
                    'ContentType': 'application/xml'
                }
            )
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}.'.format(key, bucket))
        raise e