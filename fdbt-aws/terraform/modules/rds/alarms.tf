#   DatabaseMasterCPUAlarm:
#     Type: AWS::CloudWatch::Alarm
#     Properties:
#       AlarmDescription: Master database CPU utilization is over 95%.
#       Namespace: AWS/RDS
#       MetricName: CPUUtilization
#       Unit: Percent
#       Statistic: Average
#       Period: 300
#       EvaluationPeriods: 3
#       Threshold: 95
#       ComparisonOperator: GreaterThanOrEqualToThreshold
#       Dimensions:
#         - Name: DBInstanceIdentifier
#           Value: !Ref DatabaseMasterInstance
#       AlarmActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       InsufficientDataActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       OKActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn

#   DatabaseMasterMemoryAlarm:
#     Type: AWS::CloudWatch::Alarm
#     Properties:
#       AlarmDescription: Master database freeable memory is under 300MB.
#       Namespace: AWS/RDS
#       MetricName: FreeableMemory
#       Unit: Bytes
#       Statistic: Average
#       Period: 300
#       EvaluationPeriods: 2
#       Threshold: 300000000
#       ComparisonOperator: LessThanOrEqualToThreshold
#       Dimensions:
#         - Name: DBInstanceIdentifier
#           Value: !Ref DatabaseMasterInstance
#       AlarmActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       InsufficientDataActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       OKActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
