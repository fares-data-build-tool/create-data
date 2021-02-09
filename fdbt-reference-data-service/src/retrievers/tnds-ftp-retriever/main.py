import boto3
import os
import pymysql
import logging
from ftplib import FTP

logger = logging.getLogger()
logger.setLevel(logging.INFO)

file_dir = '/tmp/'

s3 = boto3.resource('s3')
ssm = boto3.client('ssm')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rds_host = os.getenv('RDS_HOST')
db_name = 'fdbt'

db_username = ssm.get_parameter(
    Name='fdbt-rds-reference-data-username',
    WithDecryption=True
)['Parameter']['Value']

db_password = ssm.get_parameter(
    Name='fdbt-rds-reference-data-password',
    WithDecryption=True
)['Parameter']['Value']

db_connection = pymysql.connect(rds_host, user=db_username, passwd=db_password, db=db_name, connect_timeout=5)

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
    try:
        ftp_username = ssm.get_parameter(
            Name='fdbt-tnds-ftp-username',
            WithDecryption=True
        )

        ftp_password = ssm.get_parameter(
            Name='fdbt-tnds-ftp-password',
            WithDecryption=True
        )

        ftp = FTP(host=os.getenv('FTP_HOST'))
        ftp.login(ftp_username['Parameter']['Value'], ftp_password['Parameter']['Value'])

        files = ftp.nlst()

        for file in files:
            if file.endswith('.zip'):
                ftp.retrbinary("RETR " + file, open(file_dir + file, 'wb').write)

        ftp.close()

        cleardown_tnds_tables()

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
