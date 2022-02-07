### EU-WEST-1 RESOURCES ###
###       FOR ALB       ###

# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for WAF resources

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - test
#       - preprod
#       - prod
#   ProductName:
#     Type: String
#     Default: fdbt
#   HeaderName:
#     Type: String
#     Default: X-Origin-Verify
#     Description: Header name for origin secret

# Resources:
#   OriginVerifySecret:
#     Type: AWS::SecretsManager::Secret
#     Properties:
#       GenerateSecretString:
#         SecretStringTemplate: '{"HEADERVALUE": "RandomPassword"}'
#         GenerateStringKey: "HEADERVALUE"
#         ExcludePunctuation: true

#   RestrictToCloudfrontAccessAcl:
#     Type: AWS::WAFv2::WebACL
#     Properties:
#       Name: !Sub ${ProductName}-waf-restrict-cloudfront-access-${Stage}
#       Scope: REGIONAL
#       Description: Restricts access to CloudFront
#       DefaultAction:
#         Block: {}
#       VisibilityConfig:
#         SampledRequestsEnabled: true
#         CloudWatchMetricsEnabled: true
#         MetricName: RestrictCloudfrontAccessMetric
#       Rules:
#         - Name: AllowCloudfrontHeader
#           Priority: 0
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AllowCloudfrontHeaderMetric
#           Action:
#             Allow: {}
#           Statement:
#             ByteMatchStatement:
#               PositionalConstraint: EXACTLY
#               FieldToMatch:
#                 SingleHeader:
#                   Name: !Ref HeaderName
#               SearchString:
#                 !Join [
#                   "",
#                   [
#                     "{{resolve:secretsmanager:",
#                     !Ref OriginVerifySecret,
#                     ":SecretString:HEADERVALUE}}",
#                   ],
#                 ]
#               TextTransformations:
#                 - Priority: 0
#                   Type: NONE

#   WafAssociation:
#     Type: AWS::WAFv2::WebACLAssociation
#     Properties:
#       ResourceArn:
#         Fn::ImportValue: !Sub ${Stage}:LoadbalancerArn
#       WebACLArn: !GetAtt RestrictToCloudfrontAccessAcl.Arn

# Outputs:
#   OriginVerifySecret:
#     Value: !Ref OriginVerifySecret
#     Export:
#       Name: !Sub ${Stage}:OriginVerifySecret





### US-EAST-1 RESOURCES ###
###   FOR CLOUDFRONT    ###

### WAF-TEST ###

# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for WAF resources in Test

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - test

#   ProductName:
#     Type: String
#     Default: fdbt

#   IwIpSetList:
#     Type: CommaDelimitedList
#     Default: ""

#   CiIpSetList:
#     Type: CommaDelimitedList
#     Default: ""

#   PersonalUserIpSetList:
#     Type: CommaDelimitedList
#     Default: ""

# Resources:
#   IwIpSet:
#     Type: AWS::WAFv2::IPSet
#     Properties:
#       Description: IP Set for Infinity Works office
#       Name: IwIpSet
#       Scope: CLOUDFRONT
#       IPAddressVersion: IPV4
#       Addresses: !Ref IwIpSetList

#   CiIpSet:
#     Type: AWS::WAFv2::IPSet
#     Properties:
#       Description: IP Set for CI
#       Name: CiIpSet
#       Scope: CLOUDFRONT
#       IPAddressVersion: IPV4
#       Addresses: !Ref CiIpSetList

#   PersonalUserIpSet:
#     Type: AWS::WAFv2::IPSet
#     Properties:
#       Description: Personal IPs for IW and DFT users of the tool
#       Name: PersonalUserIpSet
#       Scope: CLOUDFRONT
#       IPAddressVersion: IPV4
#       Addresses: !Ref PersonalUserIpSetList

#   SiteAccessAcl:
#     Type: AWS::WAFv2::WebACL
#     Properties:
#       Name: !Sub ${ProductName}-waf-site-access-${Stage}
#       Scope: CLOUDFRONT
#       Description: Restricts access to site
#       DefaultAction:
#         Block: {}
#       VisibilityConfig:
#         SampledRequestsEnabled: true
#         CloudWatchMetricsEnabled: true
#         MetricName: RestrictAccessMetric
#       Rules:
#         - Name: BodySizeRestriction
#           Priority: 0
#           Statement:
#             AndStatement:
#               Statements:
#                 - SizeConstraintStatement:
#                     FieldToMatch:
#                       Body: {}
#                     ComparisonOperator: LT
#                     Size: 8192
#                     TextTransformations:
#                       - Priority: 0
#                         Type: NONE
#                 - NotStatement:
#                     Statement:
#                       ByteMatchStatement:
#                         SearchString: /api/
#                         FieldToMatch:
#                           UriPath: {}
#                         TextTransformations:
#                           - Priority: 0
#                             Type: NONE
#                         PositionalConstraint: STARTS_WITH
#           Action:
#             Allow: {}
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: BodySize
#         - Name: AWS-AWSManagedRulesAmazonIpReputationList
#           Priority: 1
#           Statement:
#             ManagedRuleGroupStatement:
#               VendorName: AWS
#               Name: AWSManagedRulesAmazonIpReputationList
#           OverrideAction:
#             None: {}
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AWS-AWSManagedRulesAmazonIpReputationList
#         - Name: AWS-AWSManagedRulesCommonRuleSet
#           Priority: 2
#           Statement:
#             ManagedRuleGroupStatement:
#               VendorName: AWS
#               Name: AWSManagedRulesCommonRuleSet
#               ExcludedRules:
#                 - Name: SizeRestrictions_BODY # handled by BodySizeRestriction
#                 - Name: NoUserAgent_HEADER # allow Cypress tests to run
#                 - Name: CrossSiteScripting_BODY # blocking some legitimate requests - see CFD-571
#           OverrideAction:
#             None: {}
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AWS-AWSManagedRulesCommonRuleSet
#         - Name: AllowIw
#           Action:
#             Allow: {}
#           Priority: 10
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AllowIwRuleMetric
#           Statement:
#             IPSetReferenceStatement:
#               Arn: !GetAtt IwIpSet.Arn
#         - Name: AllowCi
#           Action:
#             Allow: {}
#           Priority: 11
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AllowCiRuleMetric
#           Statement:
#             IPSetReferenceStatement:
#               Arn: !GetAtt CiIpSet.Arn
#         - Name: AllowPersonalUserIP
#           Action:
#             Allow: {}
#           Priority: 12
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AllowPersonalUserIPRuleMetric
#           Statement:
#             IPSetReferenceStatement:
#               Arn: !GetAtt PersonalUserIpSet.Arn

# Outputs:
#   WafAclArn:
#     Value: !GetAtt SiteAccessAcl.Arn

### WAF ###

# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for WAF resources in PreProd and Prod

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - preprod
#       - prod

#   ProductName:
#     Type: String
#     Default: fdbt

# Resources:
#   SiteAccessAcl:
#     Type: AWS::WAFv2::WebACL
#     Properties:
#       Name: !Sub ${ProductName}-waf-site-access-${Stage}
#       Scope: CLOUDFRONT
#       Description: Restricts access to site
#       DefaultAction:
#         Allow: {}
#       VisibilityConfig:
#         SampledRequestsEnabled: true
#         CloudWatchMetricsEnabled: true
#         MetricName: RestrictAccessMetric
#       Rules:
#         - Name: BodySizeRestriction
#           Priority: 0
#           Statement:
#             AndStatement:
#               Statements:
#                 - SizeConstraintStatement:
#                     FieldToMatch:
#                       Body: {}
#                     ComparisonOperator: GT
#                     Size: 8192
#                     TextTransformations:
#                       - Priority: 0
#                         Type: NONE
#                 - NotStatement:
#                     Statement:
#                       ByteMatchStatement:
#                         SearchString: /api/
#                         FieldToMatch:
#                           UriPath: {}
#                         TextTransformations:
#                           - Priority: 0
#                             Type: NONE
#                         PositionalConstraint: STARTS_WITH
#           Action:
#             Block: {}
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: BodySize
#         - Name: AWS-AWSManagedRulesAmazonIpReputationList
#           Priority: 1
#           Statement:
#             ManagedRuleGroupStatement:
#               VendorName: AWS
#               Name: AWSManagedRulesAmazonIpReputationList
#           OverrideAction:
#             None: {}
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AWS-AWSManagedRulesAmazonIpReputationList
#         - Name: AWS-AWSManagedRulesCommonRuleSet
#           Priority: 2
#           Statement:
#             ManagedRuleGroupStatement:
#               VendorName: AWS
#               Name: AWSManagedRulesCommonRuleSet
#               ExcludedRules:
#                 - Name: SizeRestrictions_BODY # handled by BodySizeRestriction
#                 - Name: NoUserAgent_HEADER # allow Cypress tests to run
#                 - Name: CrossSiteScripting_BODY # blocking some legitimate requests - see CFD-571
#           OverrideAction:
#             None: {}
#           VisibilityConfig:
#             SampledRequestsEnabled: true
#             CloudWatchMetricsEnabled: true
#             MetricName: AWS-AWSManagedRulesCommonRuleSet

# Outputs:
#   WafAclArn:
#     Value: !GetAtt SiteAccessAcl.Arn
