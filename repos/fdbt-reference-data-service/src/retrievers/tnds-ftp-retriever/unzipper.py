import urllib.parse
import boto3
import os
import pymysql
import logging
from zipfile import ZipFile

file_dir = '/tmp/file.zip'

s3 = boto3.client('s3')
ssm = boto3.client('ssm')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rds_host = os.getenv('RDS_HOST')
db_name = "fdbt"

username = ssm.get_parameter(
    Name='fdbt-rds-reference-data-username',
    WithDecryption=True
)['Parameter']['Value']

password = ssm.get_parameter(
    Name='fdbt-rds-reference-data-password',
    WithDecryption=True
)['Parameter']['Value']

db_connection = pymysql.connect(rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)

queries = [
    'SET FOREIGN_KEY_CHECKS=0',
    'TRUNCATE TABLE tndsOperatorService',
    'TRUNCATE TABLE tndsJourneyPattern',
    'TRUNCATE TABLE tndsJourneyPatternLink',
    'SET FOREIGN_KEY_CHECKS=1'
]


def cleardown_tnds_tables():
    try:
        with db_connection.cursor() as cursor:
            for query in queries:
                cursor.execute(query)

        db_connection.commit()

    except Exception as e:
        logger.error('ERROR: Failed to truncate tables')
        logger.error(e)
        raise e


def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    try:
        s3.download_file(bucket, key, file_dir)
        zipfile = ZipFile(file_dir)

        key_base = os.path.splitext(key)[0]

        cleardown_tnds_tables()

        for filename in zipfile.namelist():
            if filename.endswith('.xml'):
                s3.upload_fileobj(
                    zipfile.open(filename),
                    os.getenv('BUCKET_NAME'),
                    key_base + '/' + os.path.basename(filename),
                    ExtraArgs={
                        'ContentType': 'application/xml'
                    }
                )
    except Exception as e:
        logger.error(e)
        logger.error('Error getting object {} from bucket {}.'.format(key, bucket))
        raise e
