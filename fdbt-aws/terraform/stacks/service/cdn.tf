resource "aws_cloudfront_origin_access_identity" "error_page" {
  comment = "error_page"
}

# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for CloudFront resources

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - test
#       - preprod
#       - prod
#   DomainList:
#     Type: CommaDelimitedList
#   CertificateArn:
#     Type: String
#     Default: ""
#     Description: ARN for ACM certificate
#   OriginRequestPolicyId:
#     Type: String
#     Default: 216adef6-5c7f-47e4-b989-5492eafa07d3
#   WebAclArn:
#     Type: String
#     Description: ARN for the WAF to apply to the distribution (optional)
#   HeaderName:
#     Type: String
#     Default: X-Origin-Verify
#     Description: Header name for origin secret
#   SecurityHeadersEdgeLambdaARN:
#     Type: String

# Conditions:
#   HasWaf: !Not [!Equals ["", !Ref WebAclArn]]

# Resources:
#   SiteCachePolicy:
#     Type: AWS::CloudFront::CachePolicy
#     Properties:
#       CachePolicyConfig:
#         DefaultTTL: 86400
#         MinTTL: 0
#         MaxTTL: 31536000
#         Name: CfdSiteCachePolicy
#         ParametersInCacheKeyAndForwardedToOrigin:
#           CookiesConfig:
#             CookieBehavior: all
#           EnableAcceptEncodingGzip: true
#           HeadersConfig:
#             HeaderBehavior: none
#           QueryStringsConfig:
#             QueryStringBehavior: all

#   ErrorCachePolicy:
#     Type: AWS::CloudFront::CachePolicy
#     Properties:
#       CachePolicyConfig:
#         DefaultTTL: 31536000
#         MinTTL: 31536000
#         MaxTTL: 31536000
#         Name: CfdErrorCachePolicy
#         ParametersInCacheKeyAndForwardedToOrigin:
#           CookiesConfig:
#             CookieBehavior: none
#           EnableAcceptEncodingGzip: true
#           HeadersConfig:
#             HeaderBehavior: none
#           QueryStringsConfig:
#             QueryStringBehavior: none

#   AssetsCachePolicy:
#     Type: AWS::CloudFront::CachePolicy
#     Properties:
#       CachePolicyConfig:
#         DefaultTTL: 86400
#         MinTTL: 1
#         MaxTTL: 31536000
#         Name: CfdAssetsCachePolicy
#         ParametersInCacheKeyAndForwardedToOrigin:
#           EnableAcceptEncodingGzip: true
#           EnableAcceptEncodingBrotli: true
#           HeadersConfig:
#             HeaderBehavior: none
#           QueryStringsConfig:
#             QueryStringBehavior: none
#           CookiesConfig:
#             CookieBehavior: none

#   SiteDistribution:
#     Type: AWS::CloudFront::Distribution
#     Properties:
#       DistributionConfig:
#         Aliases: !Ref DomainList
#         WebACLId: !If [HasWaf, !Ref WebAclArn, !Ref AWS::NoValue]
#         CacheBehaviors:
#           - TargetOriginId: ErrorOrigin
#             ViewerProtocolPolicy: redirect-to-https
#             PathPattern: /error/*
#             CachePolicyId: !Ref ErrorCachePolicy
#             Compress: true
#             LambdaFunctionAssociations:
#               - LambdaFunctionARN: !Ref SecurityHeadersEdgeLambdaARN
#                 EventType: origin-response
#           - TargetOriginId: AlbOrigin
#             ViewerProtocolPolicy: redirect-to-https
#             PathPattern: /assets/*
#             CachePolicyId: !Ref AssetsCachePolicy
#             OriginRequestPolicyId: !Ref OriginRequestPolicyId
#             Compress: true
#           - TargetOriginId: AlbOrigin
#             ViewerProtocolPolicy: redirect-to-https
#             PathPattern: /_next/static/*
#             CachePolicyId: !Ref AssetsCachePolicy
#             OriginRequestPolicyId: !Ref OriginRequestPolicyId
#             Compress: true
#           - TargetOriginId: AlbOrigin
#             ViewerProtocolPolicy: redirect-to-https
#             PathPattern: /scripts/*
#             CachePolicyId: !Ref AssetsCachePolicy
#             OriginRequestPolicyId: !Ref OriginRequestPolicyId
#             Compress: true
#         CustomErrorResponses:
#           - ErrorCode: 400
#             ErrorCachingMinTTL: 60
#             ResponseCode: 404
#             ResponsePagePath: /error/index.html
#           - ErrorCode: 403
#             ErrorCachingMinTTL: 60
#             ResponseCode: 404
#             ResponsePagePath: /error/index.html
#           - ErrorCode: 500
#             ErrorCachingMinTTL: 60
#             ResponseCode: 500
#             ResponsePagePath: /error/index.html
#           - ErrorCode: 501
#             ErrorCachingMinTTL: 60
#             ResponseCode: 501
#             ResponsePagePath: /error/index.html
#           - ErrorCode: 502
#             ErrorCachingMinTTL: 60
#             ResponseCode: 502
#             ResponsePagePath: /error/index.html
#           - ErrorCode: 503
#             ErrorCachingMinTTL: 60
#             ResponseCode: 503
#             ResponsePagePath: /error/index.html
#           - ErrorCode: 504
#             ErrorCachingMinTTL: 60
#             ResponseCode: 504
#             ResponsePagePath: /error/index.html
#         DefaultCacheBehavior:
#           AllowedMethods:
#             - DELETE
#             - GET
#             - HEAD
#             - OPTIONS
#             - PATCH
#             - POST
#             - PUT
#           Compress: true
#           TargetOriginId: AlbOrigin
#           ViewerProtocolPolicy: redirect-to-https
#           CachePolicyId: !Ref SiteCachePolicy
#           OriginRequestPolicyId: !Ref OriginRequestPolicyId
#         Enabled: true
#         HttpVersion: http2
#         Origins:
#           - Id: AlbOrigin
#             CustomOriginConfig:
#               OriginProtocolPolicy: https-only
#               OriginSSLProtocols:
#                 - TLSv1.2
#             DomainName:
#               Fn::ImportValue: !Sub ${Stage}:LoadbalancerDomainName
#             OriginCustomHeaders:
#               - HeaderName: !Ref HeaderName
#                 HeaderValue:
#                   Fn::Join:
#                     - ""
#                     - - "{{resolve:secretsmanager:"
#                       - Fn::ImportValue: !Sub ${Stage}:OriginVerifySecret
#                       - ":SecretString:HEADERVALUE}}"
#           - Id: ErrorOrigin
#             S3OriginConfig:
#               OriginAccessIdentity:
#                 Fn::Sub:
#                   - origin-access-identity/cloudfront/${OAIId}
#                   - OAIId:
#                       Fn::ImportValue: !Sub ${Stage}:ErrorBucketOAI
#             DomainName:
#               Fn::ImportValue: !Sub ${Stage}:ErrorBucketDomainName
#         PriceClass: PriceClass_100
#         ViewerCertificate:
#           AcmCertificateArn: !Ref CertificateArn
#           SslSupportMethod: sni-only
#           MinimumProtocolVersion: TLSv1.2_2021






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



### EU-WEST-2 RESOURCES ###
###      FOR ALB        ###

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







### US-EAST-1 RESOURCES ###
###   FOR CLOUDFRONT    ###

# AWSTemplateFormatVersion: 2010-09-09
# Description: CloudFormation template for Lambda resources

# Parameters:
#   Stage:
#     Type: String
#     AllowedValues:
#       - test
#       - preprod
#       - prod

# Resources:
#   SecurityHeadersEdgeLambdaRole:
#     Type: AWS::IAM::Role
#     Properties:
#       Path: /
#       ManagedPolicyArns:
#         - "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
#       AssumeRolePolicyDocument:
#         Version: "2012-10-17"
#         Statement:
#           - Sid: "AllowLambdaServiceToAssumeRole"
#             Effect: "Allow"
#             Action:
#               - "sts:AssumeRole"
#             Principal:
#               Service:
#                 - "lambda.amazonaws.com"
#                 - "edgelambda.amazonaws.com"

#   SecurityHeadersEdgeLambda:
#     Type: AWS::Lambda::Function
#     Properties:
#       FunctionName: !Sub security-headers-edge-lambda-${Stage}
#       Role: !GetAtt SecurityHeadersEdgeLambdaRole.Arn
#       Runtime: nodejs12.x
#       Handler: index.handler
#       Timeout: 5
#       Code:
#         ZipFile: |
#           'use strict';
#           exports.handler = (event, context, callback) => {
#               const response = event.Records[0].cf.response;
#               const headers = response.headers;

#               headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload'}];

#               if (!headers['content-security-policy']) {
#                 headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; object-src 'self'; connect-src 'self'; upgrade-insecure-requests"}];
#               }

#               headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}];
#               headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}];
#               headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block'}];
#               headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}];
#               delete headers['x-powered-by'];

#               callback(null, response);
#           };

#   SecurityHeadersEdgeLambdaVersion:
#     Type: AWS::Lambda::Version
#     Properties:
#       FunctionName: !Ref SecurityHeadersEdgeLambda

# Outputs:
#   SecurityHeadersEdgeLambdaVersion:
#     Value: !Ref SecurityHeadersEdgeLambdaVersion
