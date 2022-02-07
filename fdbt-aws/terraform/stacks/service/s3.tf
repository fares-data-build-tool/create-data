###     MIGRATE BUCKETS OUT OF SERVERLESS AND CDK     ###
### ALL STATEFUL RESOURCES TO BE MANAGED BY TERRAFORM ###

#   UserDataBucket:
#     Type: AWS::S3::Bucket
#     Properties:
#       BucketName: !Sub fdbt-user-data-${Stage}
#       PublicAccessBlockConfiguration:
#         BlockPublicAcls: true
#         BlockPublicPolicy: true
#         IgnorePublicAcls: true
#         RestrictPublicBuckets: true
#       BucketEncryption:
#         ServerSideEncryptionConfiguration:
#           - ServerSideEncryptionByDefault:
#               SSEAlgorithm: AES256

#   RawUserDataBucket:
#     Type: AWS::S3::Bucket
#     Properties:
#       BucketName: !Sub fdbt-raw-user-data-${Stage}
#       PublicAccessBlockConfiguration:
#         BlockPublicAcls: true
#         BlockPublicPolicy: true
#         IgnorePublicAcls: true
#         RestrictPublicBuckets: true
#       BucketEncryption:
#         ServerSideEncryptionConfiguration:
#           - ServerSideEncryptionByDefault:
#               SSEAlgorithm: AES256

#   ErrorPageBucket:
#     Type: AWS::S3::Bucket
#     Properties:
#       BucketName: !Sub fdbt-error-page-${Stage}
#       PublicAccessBlockConfiguration:
#         BlockPublicAcls: true
#         BlockPublicPolicy: true
#         IgnorePublicAcls: true
#         RestrictPublicBuckets: true
#       BucketEncryption:
#         ServerSideEncryptionConfiguration:
#           - ServerSideEncryptionByDefault:
#               SSEAlgorithm: AES256

#   ErrorBucketOAI:
#     Type: AWS::CloudFront::CloudFrontOriginAccessIdentity
#     Properties:
#       CloudFrontOriginAccessIdentityConfig:
#         Comment: "OAI for Errors Bucket"

#   ErrorPageBucketPolicy:
#     Type: AWS::S3::BucketPolicy
#     Properties:
#       Bucket: !Ref ErrorPageBucket
#       PolicyDocument:
#         Statement:
#           - Action: "s3:GetObject"
#             Effect: Allow
#             Resource: !Sub ${ErrorPageBucket.Arn}/*
#             Principal:
#               CanonicalUser: !GetAtt ErrorBucketOAI.S3CanonicalUserId
