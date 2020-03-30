import boto3
import os
from ftplib import FTP
from pathlib import Path
from urllib.parse import unquote_plus
import uuid
import sys
import logging
import pymysql
from db_querys import *

s3 = boto3.resource('s3')
ssm = boto3.client('ssm')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    try:

        bucket = event['Records'][0]['s3']['bucket']['name']
        key = unquote_plus(event['Records'][0]['s3']['object']['key'])

        insert_in_database(key, bucket)

    except Exception as e:
        logger.error(e)
        raise e


def insert_in_database(key, bucket):
    rds_host = os.getenv('RDS_HOST')
    db_name = "fdbt"
    username = ssm.get_parameter(
        Name='fdbt-rds-reference-data-username',
        WithDecryption=True
    )
    password = ssm.get_parameter(
        Name='fdbt-rds-reference-data-password',
        WithDecryption=True
    )

    try:
        conn = pymysql.connect(rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error(
            "ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit()

    logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")

    query_array = None

    if(key == "servicereport.csv"):
        query_array = service_report_query(bucket)
    elif(key == "Stops.csv"):
        query_array = stops_query(bucket)
    elif(key == "NOCLines.csv"):
        query_array = noc_lines_query(bucket)
    elif(key == "NOCTable.csv"):
        query_array = noc_table_query(bucket)
    elif(key == "PublicName.csv"):
        query_array = public_name_query(bucket)

    for query_line in query_array:

        with conn.cursor() as cur:

            cur.execute(query_line)

    conn.commit()

    logger.info("SUCCESS: Data insertion to RDS MySQL instance succeeded")
