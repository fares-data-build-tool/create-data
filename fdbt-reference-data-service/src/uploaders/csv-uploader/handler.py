import boto3
import os
from ftplib import FTP
from pathlib import Path
from urllib.parse import unquote_plus
import uuid
import sys
import logging
import pymysql

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
        conn = pymysql.connect(rds_host, user=username['Parameter']['Value'], passwd=password['Parameter']['Value'], db=db_name, connect_timeout=5)
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

def public_name_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE nocPublicName;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/PublicName.csv' REPLACE INTO TABLE nocPublicName FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( pubNmId, operatorPublicName, pubNmQual, ttrteEnq, fareEnq, lostPropEnq, disruptEnq, complEnq, twitter, facebook, linkedin, youtube, changeDate, changeAgent, changeComment, ceasedDate, dataOwner, website );", "SET FOREIGN_KEY_CHECKS = 1;"]

def noc_table_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE nocTable;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/NOCTable.csv' REPLACE INTO TABLE nocTable FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( nocCode, operatorPublicName, vosaPsvLicenseName, opId, pubNmId, nocCdQual, changeDate, changeAgent, changeComment, dateCeased, dataOwner );", "SET FOREIGN_KEY_CHECKS = 1;"]

def noc_lines_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE nocLine;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/NOCLines.csv' REPLACE INTO TABLE nocLine FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( nocLineNo, nocCode, pubNm, refNm, licence, mode, tlRegOwn, ebsrAgent, lo, sw, wm, wa, yo, nw, ne, sc, se, ea, em, ni, nx, megabus, newBharat, terravision, ncsd, easybus, yorksRt, travelEnq, comment, auditDate, auditEditor, auditComment, duplicate, dateCeased, cessationComment );", "SET FOREIGN_KEY_CHECKS = 1;"]

def stops_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE naptanStop;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/Stops.csv' REPLACE INTO TABLE naptanStop FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\r\\n' IGNORE 1 lines ( atcoCode, naptanCode, plateCode, cleardownCode, commonName, commonNameLang, shortCommonName, shortCommonNameLang, landmark, landmarkLang, street, streetLang, crossing, crossingLang, indicator, indicatorLang, bearing, nptgLocalityCode, localityName, parentLocalityName, grandParentLocalityName, town, townLang, suburb, suburbLang, localityCentre, gridType, easting, northing, longitude, latitude, stopType, busStopType, timingStatus, defaultWaitTime, notes, notesLang, administrativeAreaCode, creationDateTime, modificationDateTime, revisionNumber, modification, status );", "SET FOREIGN_KEY_CHECKS = 1;"]

def service_report_query(bucket_name): 
    return ["SET FOREIGN_KEY_CHECKS = 0;", "TRUNCATE tndsService;", f"LOAD DATA FROM S3 's3-eu-west-2://{bucket_name}/servicereport.csv' REPLACE INTO TABLE tndsService FIELDS TERMINATED BY ',' ENCLOSED BY '\"' ESCAPED BY '' LINES TERMINATED BY '\\n' IGNORE 1 lines ( @rowId, @regionCode, @regionOperatorCode, @serviceCode, @lineName, @description, @startDate, @nocCode ) SET regionCode = @regionCode, regionOperatorCode = @regionOperatorCode, serviceCode = @serviceCode, lineName = @lineName, description = @description, startDate = @startDate, nocCode = @nocCode;", "SET FOREIGN_KEY_CHECKS = 1;"]
