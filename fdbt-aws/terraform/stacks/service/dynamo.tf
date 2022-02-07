# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for a dynamo db table

# Parameters:
#   HashKeyName:
#     Type: String
#     Default: id

# Resources:
#   siteSessionStorage:
#     Type: AWS::DynamoDB::Table
#     Properties:
#       TableName: sessions
#       BillingMode: PAY_PER_REQUEST
#       AttributeDefinitions:
#         - AttributeName: !Ref "HashKeyName"
#           AttributeType: S
#       KeySchema:
#         - AttributeName: !Ref "HashKeyName"
#           KeyType: HASH
#       TimeToLiveSpecification:
#         AttributeName: expires
#         Enabled: true
