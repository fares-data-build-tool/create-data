### US-EAST-1 RESOURCES ###
###   FOR CLOUDFRONT    ###

# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for ACM resources

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - test
#       - preprod
#       - prod
#   PrimaryDomain:
#     Type: String
#     Description: Primary domain name for ACM certificate
#   SecondaryDomain:
#     Type: String
#     Description: Optional secondary domain name for ACM certificate

# Conditions:
#   HasSecondaryDomain: !Not [!Equals ["", !Ref SecondaryDomain]]

# Resources:
#   Certificate:
#     Type: AWS::CertificateManager::Certificate
#     DeletionPolicy: Retain
#     UpdateReplacePolicy: Retain
#     Properties:
#       DomainName: !Ref PrimaryDomain
#       SubjectAlternativeNames:
#         - !Sub "*.${PrimaryDomain}"
#         - !If
#           - HasSecondaryDomain
#           - !Ref SecondaryDomain
#           - !Ref AWS::NoValue
#         - !If
#           - HasSecondaryDomain
#           - !Sub "*.${SecondaryDomain}"
#           - !Ref AWS::NoValue
#       ValidationMethod: DNS

# Outputs:
#   CertificateArn:
#     Value: !Ref Certificate
#     Export:
#       Name: !Sub ${Stage}:CertificateArn
