import boto3
import os
import pymysql
import logging
from ftplib import FTP
from zipfile import ZipFile
from io import BytesIO
from urllib.request import urlopen

logger = logging.getLogger()
logger.setLevel(logging.INFO)

file_dir = '/tmp/'

s3 = boto3.resource('s3')
ssm = boto3.client('ssm')
cloudwatch = boto3.client('cloudwatch')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rds_host = os.getenv('RDS_HOST')
db_name = 'fdbt'

ftp_username = ssm.get_parameter(
    Name='fdbt-tnds-ftp-username',
    WithDecryption=True
)

ftp_password = ssm.get_parameter(
    Name='fdbt-tnds-ftp-password',
    WithDecryption=True
)

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
    'TRUNCATE TABLE txcJourneyPatternLink',
    'TRUNCATE TABLE txcJourneyPattern',
    'TRUNCATE TABLE txcOperatorLine',
    'SET FOREIGN_KEY_CHECKS=1'
]


def cleardown_txc_tables():
    try:
        with db_connection.cursor() as cursor:
            for query in queries:
                cursor.execute(query)

        db_connection.commit()

    except Exception as e:
        logger.error('ERROR: Failed to truncate tables')
        logger.error(e)
        raise e


def get_tnds_data():
    ftp = FTP(host=os.getenv('TNDS_FTP_HOST'))
    ftp.login(ftp_username['Parameter']['Value'], ftp_password['Parameter']['Value'])

    files = ftp.nlst()

    for file in files:
        if file.endswith('.zip'):
            ftp.retrbinary("RETR " + file, open(file_dir + file, 'wb').write)

    ftp.close()


def get_bods_data():
    resp = urlopen(os.getenv('BODS_URL'))

    return ZipFile(BytesIO(resp.read()))


def upload_tnds_data_to_s3():
    for file in os.listdir(file_dir):
        bucket = os.getenv('ZIPPED_BUCKET_NAME')
        content_type = 'application/zip'
        
        s3.meta.client.upload_file(
            file_dir + file,
            bucket,
            'tnds/' + file,
            ExtraArgs={
                'ContentType': content_type
            }
        )


def upload_bods_data_to_s3(zip_file):
    xml_count = 0

    for filename in zip_file.namelist():
        if (filename.endswith('.xml')):
            s3.meta.client.upload_fileobj(
                zip_file.open(filename),
                os.getenv('XML_BUCKET_NAME'),
                'bods/' + filename,
                ExtraArgs={
                    'ContentType': 'application/xml'
                }
            )

            xml_count += 1

        elif (filename.endswith('.zip')):
            s3.meta.client.upload_fileobj(
                zip_file.open(filename),
                os.getenv('ZIPPED_BUCKET_NAME'),
                'bods/' + filename,
                ExtraArgs={
                    'ContentType': 'application/zip'
                }
            )

    cloudwatch.put_metric_data(
        MetricData = [
            {
                'MetricName': 'TxcFilesCopied',
                'Dimensions': [
                    {
                        'Name': 'By Data Source',
                        'Value': 'bods'
                    },
                ],
                'Unit': 'None',
                'Value': xml_count
            },
        ],
        Namespace='FDBT/Reference-Data-Retrievers'
    )


def lambda_handler(event, context):
    try:
        cleardown_txc_tables()

        bods_zip = get_bods_data()
        upload_bods_data_to_s3(bods_zip)

        get_tnds_data()
        upload_tnds_data_to_s3()
    except Exception as e:
        logger.error(e)
        raise e
