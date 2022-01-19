import boto3
import os
import logging
from io import BytesIO
from zipfile import ZipFile, is_zipfile
import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.resource("s3")


def lambda_handler(event, context):
    try:
        data_url = os.getenv("DATA_URL")
        content_type = os.getenv("CONTENT_TYPE")
        bucket_name = os.getenv("BUCKET_NAME")

        if data_url is None:
            raise Exception("There was no DATA_URL environment variable!")

        if content_type is None:
            raise Exception("There was no CONTENT_TYPE environment variable!")

        if bucket_name is None:
            raise Exception("There was no BUCKET_NAME environment variable!")

        response = requests.get(data_url, allow_redirects=True, timeout=30)
        file = BytesIO(response.content)

        if is_zipfile(file):
            logger.info("File retrieved is a ZIP file")

            zip_file = ZipFile(file)
            target_file = os.getenv("TARGET_FILE")

            for file_name in zip_file.namelist():
                if (target_file and file_name == target_file) or not target_file:
                    s3.meta.client.upload_fileobj(
                        zip_file.open(file_name),
                        bucket_name,
                        file_name,
                        ExtraArgs={"ContentType": content_type},
                    )
        else:
            logger.info("File retrieved is not a ZIP file")

            target_file = os.getenv("TARGET_FILE")
            if target_file is None:
                raise Exception("There was no TARGET_FILE environment variable!")

            s3.meta.client.put_object(
                Body=response.content, Bucket=bucket_name, Key=target_file
            )

    except Exception as e:
        logger.error(e)
        raise e
