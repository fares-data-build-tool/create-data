resource "aws_cloudwatch_log_group" "site" {
  name              = "/aws/ecs/fdbt-site-${var.stage}"
  retention_in_days = var.log_retention_days
}

#   2xxResponsesLogGroupMetric:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: "{$.res.statusCode=2*}"
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "2xxResponses"

#   3xxResponsesLogGroupMetric:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: "{$.res.statusCode=3*}"
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "3xxResponses"

#   4xxResponsesLogGroupMetric:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: "{$.res.statusCode=4*}"
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "4xxResponses"

#   5xxResponsesLogGroupMetric:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: "{$.res.statusCode=5*}"
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "5xxResponses"

#   ErrorLogGroupMetric:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: "{ $.level = error }"
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "Errors"

#   ResponsesTimeLogMetric:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: "{$.responseTime=*}"
#       MetricTransformations:
#         - MetricValue: "$.responseTime"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "responseTime"

#   TransactionStartLogMetrics:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: '{$.message="*transaction start"}'
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "startedTransactions"

#   TransactionSuccessLogMetrics:
#     Type: AWS::Logs::MetricFilter
#     Properties:
#       LogGroupName: !Ref SiteLogGroup
#       FilterPattern: '{$.message="*transaction complete"}'
#       MetricTransformations:
#         - MetricValue: "1"
#           MetricNamespace: "FDBT/Site"
#           MetricName: "completeTransactions"
