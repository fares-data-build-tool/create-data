#   Site4xxReponseAlarm:
#     Type: AWS::CloudWatch::Alarm
#     Properties:
#       AlarmDescription: A 4xx response has occurred on the site.
#       Namespace: FDBT/Site
#       MetricName: 4xxResponses
#       Statistic: Sum
#       Period: 60
#       EvaluationPeriods: 1
#       Threshold: 1
#       ComparisonOperator: GreaterThanOrEqualToThreshold
#       TreatMissingData: notBreaching
#       AlarmActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       InsufficientDataActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       OKActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn

#   Site5xxReponseAlarm:
#     Type: AWS::CloudWatch::Alarm
#     Properties:
#       AlarmDescription: A 5xx response has occurred on the site.
#       Namespace: FDBT/Site
#       MetricName: 5xxResponses
#       Statistic: Sum
#       Period: 60
#       EvaluationPeriods: 1
#       Threshold: 1
#       ComparisonOperator: GreaterThanOrEqualToThreshold
#       TreatMissingData: notBreaching
#       AlarmActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       InsufficientDataActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       OKActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn

#   SiteErrorAlarm:
#     Type: AWS::CloudWatch::Alarm
#     Properties:
#       AlarmDescription: An error has occurred on the site.
#       Namespace: FDBT/Site
#       MetricName: Errors
#       Statistic: Sum
#       Period: 60
#       EvaluationPeriods: 1
#       Threshold: 1
#       ComparisonOperator: GreaterThanOrEqualToThreshold
#       TreatMissingData: notBreaching
#       AlarmActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       InsufficientDataActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
#       OKActions:
#         - Fn::ImportValue: !Sub ${Stage}:SlackAlertsTopicArn
