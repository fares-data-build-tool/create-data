import boto3
import os
from urllib.parse import unquote_plus
import logging
import pymysql
from csv_uploader.db_queries import *

s3 = boto3.resource('s3')
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


def handler(event, context):
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = unquote_plus(event['Records'][0]['s3']['object']['key'])

        insert_in_database(key, bucket)
    except Exception as e:
        logger.error(e)
        raise e


def insert_in_database(key, bucket):
    query_array = None

    if key == "Stops.csv":
        query_array = stops_query(bucket)
    elif key == "NOCLines.csv":
        query_array = noc_lines_query(bucket)
    elif key == "NOCTable.csv":
        query_array = noc_table_query(bucket)
    elif key == "PublicName.csv":
        query_array = public_name_query(bucket)

    for query_line in query_array:
        with db_connection.cursor() as cursor:
            cursor.execute(query_line)

    db_connection.commit()

    logger.info("SUCCESS: Data insertion to RDS MySQL instance succeeded")
