import boto3
import sys
import os
from io import BytesIO
from zipfile import ZipFile
from urllib.request import urlopen

s3 = boto3.resource('s3')

def lambda_handler(event, context):
    try:
        resp = urlopen(os.getenv('DATA_URL'))
        zipfile = ZipFile(BytesIO(resp.read()))
        target_file = os.getenv('TARGET_FILE')
        
        for filename in zipfile.namelist():
            if (target_file and filename == target_file) or not target_file:
                s3.meta.client.upload_fileobj(
                    zipfile.open(filename),
                    os.getenv('BUCKET_NAME'),
                    filename,
                    ExtraArgs={
                        'ContentType': os.getenv('CONTENT_TYPE')
                    }
                )
    except Exception as e:
        print(e)
        raise e