import boto3
import os
import logging
from ftplib import FTP

logger = logging.getLogger()
logger.setLevel(logging.INFO)

file_dir = '/tmp/'

s3 = boto3.resource('s3')
ssm = boto3.client('ssm')


def lambda_handler(event, context):
    try:
        username = ssm.get_parameter(
            Name='fdbt-tnds-ftp-username',
            WithDecryption=True
        )

        password = ssm.get_parameter(
            Name='fdbt-tnds-ftp-password',
            WithDecryption=True
        )

        ftp = FTP(host=os.getenv('FTP_HOST'))
        ftp.login(username['Parameter']['Value'], password['Parameter']['Value'])

        files = ftp.nlst()

        for file in files:
            if file.endswith('.zip') or file.endswith('servicereport.csv'):
                ftp.retrbinary("RETR " + file, open(file_dir + file, 'wb').write)

        ftp.close()

        for file in os.listdir(file_dir):
            bucket = None
            content_type = None

            if file.endswith('.zip'):
                bucket = os.getenv('ZIPPED_BUCKET_NAME')
                content_type = 'application/zip'
            elif file.endswith('.csv'):
                bucket = os.getenv('BUCKET_NAME')
                content_type = 'text/csv'
            
            s3.meta.client.upload_file(
                file_dir + file,
                bucket,
                file,
                ExtraArgs={
                    'ContentType': content_type
                }
            )
    except Exception as e:
        logger.error(e)
        raise e
