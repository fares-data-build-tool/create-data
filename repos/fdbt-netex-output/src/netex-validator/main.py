import boto3
import os
import uuid
import logging
from urllib.parse import unquote_plus
from lxml import etree, objectify
from lxml.etree import XMLSyntaxError
from io import StringIO

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
sns_client = boto3.client('sns')

SNS_ALERTS_ARN = os.getenv('SNS_ALERTS_ARN')


def parse_netex_xml(netex):
    doc = None

    try:
        doc = etree.parse(StringIO(netex))
        logger.info('XML well formed, syntax ok.')

    except IOError:
        logger.error('Invalid File')
        raise

    except etree.XMLSyntaxError as syntax_errors:
        logger.error('XML Syntax Error')
        logger.error(syntax_errors.error_log)
        raise

    return doc


def validate_netex(download_path):
    netex_file = open(download_path, 'r')
    netex = netex_file.read()

    try:
        parsed_netex = parse_netex_xml(netex)
    except:
        raise

    if parsed_netex:
        try:
            xmlschema = etree.XMLSchema(file='./xsd/NeTEx_publication.xsd')
            xmlschema.assertValid(parsed_netex)
            logger.info('XML valid, schema validation ok.')

        except etree.DocumentInvalid as schema_errors:
            logger.error('Schema validation error')
            logger.error(schema_errors.error_log)
            raise

        except:
            logger.error('Unknown error, exiting.')
            raise


def lambda_handler(event, context):
    for record in event['Records']:
        source_bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        tmpkey = key.replace('/', '')
        download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
        s3_client.download_file(source_bucket, key, download_path)

        try:
            logger.info('Starting NeTEx validation...')
            validate_netex(download_path)

            logger.info('NeTEx valid, uploading to S3...')
            s3_client.upload_file(download_path, os.getenv('VALIDATED_NETEX_BUCKET'), key)

            sns_client.publish(
                TopicArn=SNS_ALERTS_ARN,
                Subject="NeTEx Convertor",
                Message=f'NeTEx file: {key} has been successfully validated and uploaded',
                MessageAttributes={
                    'NewStateValue': {
                        'DataType': 'String',
                        'StringValue': 'OK'
                    }
                }
            )
        except:
            logger.error(f'There was an error when validating NeTEx file: {key}')

            sns_client.publish(
                TopicArn=SNS_ALERTS_ARN,
                Subject="NeTEx Convertor",
                Message=f'There was an error when validating NeTEx file: {key}. See logs for details.',
                MessageAttributes={
                    'NewStateValue': {
                        'DataType': 'String',
                        'StringValue': 'ALARM'
                    }
                }
            )
