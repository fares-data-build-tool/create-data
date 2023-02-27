import boto3
import os
import uuid
import logging
from urllib.parse import unquote_plus
from lxml import etree
from io import StringIO

logger = logging.getLogger()
logger.setLevel(logging.INFO)

SNS_ALERTS_ARN = os.getenv('SNS_ALERTS_ARN')

# xsl = """
#     <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
#         <xsl:output omit-xml-declaration="yes" indent="yes"/>
#         <xsl:strip-space elements="*"/>

#         <xsl:template match="node()|@*">
#             <xsl:copy>
#                 <xsl:apply-templates select="node()|@*"/>
#             </xsl:copy>
#         </xsl:template>

#         <xsl:template match="@id">
#             <xsl:attribute name="id">
#                 <xsl:value-of select="translate(., ' ', '_')"/>
#             </xsl:attribute>
#         </xsl:template>

#         <xsl:template match="@ref">
#             <xsl:attribute name="ref">
#                 <xsl:value-of select="translate(., ' ', '_')"/>
#             </xsl:attribute>
#         </xsl:template>

#         <xsl:template match="*[not(@*|*|comment()|processing-instruction()) and normalize-space()='']"/>
#     </xsl:stylesheet>
# """


def get_s3_client():
    if os.getenv('ENV') == 'development':
        s3_client = boto3.client(
            's3',
            aws_access_key_id='S3RVER',
            aws_secret_access_key='S3RVER',
            endpoint_url='http://localhost:4572',
        )
    else:
        s3_client = boto3.client('s3')

    return s3_client


def get_sns_client():
    if os.getenv('ENV') == 'development':
        sns_client = boto3.client(
            'sns',
            aws_access_key_id='S3RVER',
            aws_secret_access_key='S3RVER',
            endpoint_url='http://localhost:4575',
        )
    else:
        sns_client = boto3.client('sns')

    return sns_client


s3_client = get_s3_client()
sns_client = get_sns_client()


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


def validate_netex(netex):
    try:
        parsed_netex = parse_netex_xml(netex)
    except:
        raise

    if parsed_netex:
        try:
            xmlschema = etree.XMLSchema(file='./xsd/NeTEx_publication.xsd')
            xmlschema.assertValid(parsed_netex)
            logger.info('XML valid schema validation ok.')

        except etree.DocumentInvalid as schema_errors:
            logger.error('Schema validation error')
            logger.error(schema_errors.error_log)
            raise

        except:
            logger.error('Unknown error, exiting.')
            raise


def transform_netex_with_xsl(netex):
    xsl_file = open('./xsl.xml', 'r+', encoding="ISO-8859-1")
    xsl = xsl_file.read()

    parsed_netex = etree.parse(StringIO(netex))
    xslt = etree.parse(StringIO(xsl))
    transform = etree.XSLT(xslt)

    return etree.tostring(transform(parsed_netex), pretty_print=True, encoding='unicode')


def lambda_handler(event, context):
    for record in event['Records']:
        source_bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        tmpkey = key.replace('/', '')
        download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
        s3_client.download_file(source_bucket, key, download_path)

        try:
            logger.info('Starting NeTEx validation...')

            netex_file = open(download_path, 'r+', encoding="ISO-8859-1")
            netex = netex_file.read()
            transformed_netex = transform_netex_with_xsl(netex)
            validate_netex(transformed_netex)
            netex_file.write(transformed_netex)
            
            logger.info('NeTEx valid, uploading to S3...')

            s3_client.upload_file(download_path, os.getenv(
                'VALIDATED_NETEX_BUCKET'), key)

        except Exception as e:
            logger.error(
                f'There was an error when validating NeTEx file: {key}, error: {e}')

            sns_client.publish(
                TopicArn=SNS_ALERTS_ARN,
                Subject="NeTEx Validator",
                Message=f'There was an error when validating NeTEx file: {key}. See logs for details.',
                MessageAttributes={
                    'NewStateValue': {
                        'DataType': 'String',
                        'StringValue': 'ALARM'
                    }
                }
            )
