# NOT CURRENTLY IMPLEMENTED
#  Covered by Origanisational CloudTrails

# Trail:
#   Type: AWS::CloudTrail::Trail
#   Properties:
#     EnableLogFileValidation: true
#     IncludeGlobalServiceEvents: true
#     IsLogging: true
#     IsMultiRegionTrail: true
#     S3BucketName: cfd-audit-trails
#     TrailName: fdbt-audit-trail-core

# AuditTrailsBucket:
#   Type: AWS::S3::Bucket
#   DeletionPolicy: Retain
#   UpdateReplacePolicy: Retain
#   Properties:
#     BucketName: cfd-audit-trails
#     PublicAccessBlockConfiguration:
#       BlockPublicAcls: true
#       BlockPublicPolicy: true
#       IgnorePublicAcls: true
#       RestrictPublicBuckets: true
#     LifecycleConfiguration:
#       Rules:
#         - ExpirationInDays: 90
#           Status: Enabled
#     BucketEncryption:
#       ServerSideEncryptionConfiguration:
#         - ServerSideEncryptionByDefault:
#             SSEAlgorithm: AES256

# AuditTrailsBucketPolicy:
#   Type: AWS::S3::BucketPolicy
#   Properties:
#     Bucket: !Ref AuditTrailsBucket
#     PolicyDocument:
#       Statement:
#         - Action:
#             - "s3:PutObject"
#           Effect: "Allow"
#           Resource:
#             - !Sub "arn:aws:s3:::cfd-audit-trails/AWSLogs/${TestAccountId}/*"
#             - !Sub "arn:aws:s3:::cfd-audit-trails/AWSLogs/${PreProdAccountId}/*"
#             - !Sub "arn:aws:s3:::cfd-audit-trails/AWSLogs/${ProdAccountId}/*"
#             - !Sub "arn:aws:s3:::cfd-audit-trails/AWSLogs/${AWS::AccountId}/*"
#           Principal:
#             Service: "cloudtrail.amazonaws.com"
#           Condition:
#             StringEquals: { "s3:x-amz-acl": "bucket-owner-full-control" }
#         - Action:
#             - "s3:GetBucketAcl"
#           Resource: "arn:aws:s3:::cfd-audit-trails"
#           Effect: "Allow"
#           Principal:
#             Service: "cloudtrail.amazonaws.com"
