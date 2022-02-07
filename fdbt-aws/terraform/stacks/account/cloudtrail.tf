# NOT CURRENTLY IMPLEMENTED
#  Covered by Origanisational CloudTrails

#   Trail:
#     Type: AWS::CloudTrail::Trail
#     Properties:
#       EnableLogFileValidation: true
#       IncludeGlobalServiceEvents: true
#       IsLogging: true
#       IsMultiRegionTrail: true
#       S3BucketName: cfd-audit-trails
#       TrailName: !Sub fdbt-audit-trail-${Stage}
