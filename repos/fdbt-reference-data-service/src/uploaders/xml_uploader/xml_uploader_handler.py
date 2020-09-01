import os
import boto3
import pymysql
import logging
from urllib.parse import unquote_plus
from xml_uploader.xml_uploader import download_from_s3_and_write_to_db

ssm_client = boto3.client('ssm')
s3_client = boto3.client('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rds_host = os.getenv('RDS_HOST')
db_name = 'fdbt'

username = ssm_client.get_parameter(
    Name='fdbt-rds-reference-data-username',
    WithDecryption=True
)['Parameter']['Value']

password = ssm_client.get_parameter(
    Name='fdbt-rds-reference-data-password',
    WithDecryption=True
)['Parameter']['Value']

db_connection = pymysql.connect(
    rds_host,
    user=username,
    passwd=password,
    db=db_name,
    connect_timeout=5
)


def handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = unquote_plus(
        event['Records'][0]['s3']['object']['key'],
        encoding='utf-8'
    )
    file_path = '/tmp/' + key.split('/')[-1]

    try:
        download_from_s3_and_write_to_db(s3_client, bucket, key, file_path, db_connection, logger)

        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info("Removing File {}".format(file_path))
        else:
            logger.warn("File {} does not exist.".format(file_path))

    except Exception as e:
        logger.error(
            "ERROR! Failed to write contents of '{}' to database, error: {}.".format(key, e)
        )
        raise e
