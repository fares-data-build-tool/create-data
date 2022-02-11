###         NOT YET IMPLEMENTED         ###
### REPLACE WITH CLOUDWATCH DASHBOARDS? ###
###       OR AWS MANAGED GRAFANA?       ###

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
#   MonitoringImage:
#     Type: String
#     Description: The monitoring docker image
#     Default: grafana/grafana:8.3.3
#   MonitoringContainerPort:
#     Type: Number
#     Default: 3000
#     Description: Port on which the monitoring process is running in the container
#   MonitoringContainerCpu:
#     Type: Number
#     Default: 256
#     Description: How much CPU to give the monitoring container. 1024 is 1 CPU
#   MonitoringContainerMemory:
#     Type: Number
#     Default: 512
#     Description: How much memory in MiB to give the monitoring container
#   MonitoringDesiredCount:
#     Type: Number
#     Default: 1
#     Description: How many copies of the monitoring service task to run
#   MonitoringDomain:
#     Type: String
#     Description: Domain for monitoring
#   SessionSecret:
#     AllowedPattern: "[a-zA-Z0-9]+"
#     ConstraintDescription: Must be between 8 to 41 alphanumeric characters
#     Description: The session secret, between 8 to 41 alphanumeric characters
#     MaxLength: "41"
#     MinLength: "8"
#     NoEcho: "true"
#     Type: String
#   ExternalCertificateArn:
#     Type: String
#     Default: ""
#     Description: ARN for ACM certificate for external domain

# Resources:
#   # ECS Resources
#   ECSCluster:
#     Type: AWS::ECS::Cluster
#     Properties:
#       ClusterName: !Sub ${ProductName}-fargate-cluster-${Stage}

#   MonitoringTaskDefinition:
#     Type: AWS::ECS::TaskDefinition
#     Properties:
#       Family: !Sub ${ProductName}-monitoring-${Stage}
#       ContainerDefinitions:
#         - Name: !Sub ${ProductName}-monitoring-${Stage}
#           Cpu: !Ref MonitoringContainerCpu
#           Memory: !Ref MonitoringContainerMemory
#           Image: !Ref MonitoringImage
#           PortMappings:
#             - ContainerPort: !Ref MonitoringContainerPort
#           MountPoints:
#             - SourceVolume: efs
#               ContainerPath: /var/lib/grafana
#               ReadOnly: false
#           LogConfiguration:
#             LogDriver: awslogs
#             Options:
#               awslogs-group: !Ref MonitoringLogGroup
#               awslogs-region: !Ref AWS::Region
#               awslogs-stream-prefix: !Ref ProductName
#           Environment:
#             - Name: GF_SERVER_ROOT_URL
#               Value: !Sub https://${MonitoringDomain}
#           Secrets:
#             - Name: GF_SECURITY_ADMIN_PASSWORD
#               ValueFrom: !Ref MonitoringPasswordSecret
#       Cpu: !Ref MonitoringContainerCpu
#       ExecutionRoleArn: !GetAtt MonitoringTaskExecutionRole.Arn
#       Memory: !Ref MonitoringContainerMemory
#       NetworkMode: awsvpc
#       RequiresCompatibilities:
#         - FARGATE
#       TaskRoleArn:
#         Fn::ImportValue: !Sub ${Stage}:EcsMonitoringTaskRoleArn
#       Volumes:
#         - Name: efs
#           EFSVolumeConfiguration:
#             FilesystemId: !Ref EFSMonitoringFileSystem
#             TransitEncryption: ENABLED
#             AuthorizationConfig:
#               AccessPointId: !Ref EFSMonitoringAccessPoint

#   MonitoringService:
#     Type: AWS::ECS::Service
#     DependsOn: PublicLoadBalancerListener
#     Properties:
#       ServiceName: !Sub ${ProductName}-monitoring-${Stage}
#       Cluster: !Ref ECSCluster
#       LaunchType: FARGATE
#       PlatformVersion: "1.4.0"
#       DeploymentConfiguration:
#         MaximumPercent: 200
#         MinimumHealthyPercent: 75
#       DesiredCount: !Ref MonitoringDesiredCount
#       NetworkConfiguration:
#         AwsvpcConfiguration:
#           AssignPublicIp: DISABLED
#           SecurityGroups:
#             - Fn::ImportValue: !Sub ${Stage}:FargateMonitoringContainerSecurityGroup
#           Subnets:
#             - Fn::ImportValue: !Sub ${Stage}:PrivateSubnetA
#             - Fn::ImportValue: !Sub ${Stage}:PrivateSubnetB
#       TaskDefinition: !Ref MonitoringTaskDefinition
#       LoadBalancers:
#         - ContainerName: !Sub ${ProductName}-monitoring-${Stage}
#           ContainerPort: !Ref MonitoringContainerPort
#           TargetGroupArn: !Ref MonitoringTargetGroup

#   MonitoringAutoScalingTarget:
#     Type: AWS::ApplicationAutoScaling::ScalableTarget
#     Properties:
#       MinCapacity: 1
#       MaxCapacity: 1
#       ResourceId:
#         !Join ["/", [service, !Ref ECSCluster, !GetAtt MonitoringService.Name]]
#       ScalableDimension: ecs:service:DesiredCount
#       ServiceNamespace: ecs
#       RoleARN:
#         Fn::ImportValue: !Sub ${Stage}:EcsSiteScalingRoleArn
#       ScheduledActions:
#         Fn::If:
#           - IsNotProd
#           - - Schedule: "cron(0 19 ? * MON-FRI *)"
#               ScheduledActionName: MonitoringScaleIn
#               ScalableTargetAction:
#                 MaxCapacity: 0
#                 MinCapacity: 0
#             - Schedule: "cron(0 7 ? * MON-FRI *)"
#               ScheduledActionName: MonitoringScaleOut
#               ScalableTargetAction:
#                 MaxCapacity: 1
#                 MinCapacity: 1
#           - !Ref AWS::NoValue

#   # ALB Resources

#   MonitoringTargetGroup:
#     Type: AWS::ElasticLoadBalancingV2::TargetGroup
#     DependsOn: PublicLoadBalancer
#     Properties:
#       HealthCheckIntervalSeconds: 30
#       HealthCheckPath: /api/health
#       HealthCheckProtocol: HTTP
#       HealthCheckTimeoutSeconds: 5
#       HealthyThresholdCount: 2
#       UnhealthyThresholdCount: 2
#       TargetType: ip
#       Name: !Sub ${ProductName}-monitoring-tg-${Stage}
#       Port: !Ref MonitoringContainerPort
#       Protocol: HTTP
#       VpcId:
#         Fn::ImportValue: !Sub ${Stage}:VpcId

#   PublicLoadBalancer:
#     Type: AWS::ElasticLoadBalancingV2::LoadBalancer
#     Properties:
#       Scheme: internet-facing
#       LoadBalancerAttributes:
#         - Key: idle_timeout.timeout_seconds
#           Value: "30"
#       Subnets:
#         - Fn::ImportValue: !Sub ${Stage}:PublicSubnetA
#         - Fn::ImportValue: !Sub ${Stage}:PublicSubnetB
#       SecurityGroups:
#         - Fn::ImportValue: !Sub ${Stage}:LoadBalancerSecurityGroup

#   PublicLoadBalancerListener:
#     Type: AWS::ElasticLoadBalancingV2::Listener
#     Properties:
#       Certificates:
#         - CertificateArn:
#             Fn::ImportValue: !Sub ${Stage}:CertificateArn
#       DefaultActions:
#         - TargetGroupArn: !Ref SiteTargetGroup
#           Type: forward
#       LoadBalancerArn: !Ref PublicLoadBalancer
#       Port: 443
#       Protocol: HTTPS
#       SslPolicy: ELBSecurityPolicy-TLS-1-2-2017-01

#   ListenerExternalCertificate:
#     Type: AWS::ElasticLoadBalancingV2::ListenerCertificate
#     Condition: IsProd
#     Properties:
#       Certificates:
#         - CertificateArn: !Ref ExternalCertificateArn
#       ListenerArn: !Ref PublicLoadBalancerListener

#   MonitoringListenerRule:
#     Type: AWS::ElasticLoadBalancingV2::ListenerRule
#     Properties:
#       Actions:
#         - TargetGroupArn: !Ref MonitoringTargetGroup
#           Type: forward
#       Conditions:
#         - Field: host-header
#           HostHeaderConfig:
#             Values:
#               - !Ref MonitoringDomain
#       ListenerArn: !Ref PublicLoadBalancerListener
#       Priority: 1

#   ALBRedirectHttpsListener:
#     Type: AWS::ElasticLoadBalancingV2::Listener
#     Properties:
#       DefaultActions:
#         - RedirectConfig:
#             Host: "#{host}"
#             Path: "/#{path}"
#             Port: "443"
#             Protocol: HTTPS
#             StatusCode: HTTP_301
#           Type: redirect
#       LoadBalancerArn: !Ref PublicLoadBalancer
#       Port: 80
#       Protocol: HTTP

#   EFSMonitoringFileSystem:
#     Type: AWS::EFS::FileSystem
#     Properties:
#       Encrypted: true
#       PerformanceMode: generalPurpose
#       ThroughputMode: bursting
#       FileSystemTags:
#         - Key: Name
#           Value: !Sub ${ProductName}-monitoring-fs-${Stage}

#   EFSMonitoringMountTargetA:
#     Type: AWS::EFS::MountTarget
#     Properties:
#       FileSystemId: !Ref EFSMonitoringFileSystem
#       SecurityGroups:
#         - Fn::ImportValue: !Sub ${Stage}:EFSMonitoringMountTargetSecurityGroup
#       SubnetId:
#         Fn::ImportValue: !Sub ${Stage}:PrivateSubnetA

#   EFSMonitoringMountTargetB:
#     Type: AWS::EFS::MountTarget
#     Properties:
#       FileSystemId: !Ref EFSMonitoringFileSystem
#       SecurityGroups:
#         - Fn::ImportValue: !Sub ${Stage}:EFSMonitoringMountTargetSecurityGroup
#       SubnetId:
#         Fn::ImportValue: !Sub ${Stage}:PrivateSubnetB

#   EFSMonitoringAccessPoint:
#     Type: AWS::EFS::AccessPoint
#     Properties:
#       FileSystemId: !Ref EFSMonitoringFileSystem
#       PosixUser:
#         Gid: "1000"
#         Uid: "1000"
#       RootDirectory:
#         CreationInfo:
#           OwnerUid: "1000"
#           OwnerGid: "1000"
#           Permissions: "755"
#         Path: "/var/lib/grafana"

#   # Secrets

#   MonitoringPasswordSecret:
#     Type: AWS::SecretsManager::Secret
#     Properties:
#       Description: Password for Grafana admin user
#       GenerateSecretString: {}

#   # IAM

#   SecretsManagerPolicy:
#     Type: AWS::IAM::ManagedPolicy
#     Properties:
#       PolicyDocument:
#         Version: 2012-10-17
#         Statement:
#           - Effect: Allow
#             Action:
#               - "secretsmanager:GetSecretValue"
#               - "secretsmanager:DescribeSecret"
#             Resource: !Ref MonitoringPasswordSecret

#   MonitoringTaskExecutionRole:
#     Type: AWS::IAM::Role
#     Properties:
#       AssumeRolePolicyDocument:
#         Statement:
#           - Effect: Allow
#             Principal:
#               Service: [ecs-tasks.amazonaws.com]
#             Action: ["sts:AssumeRole"]
#       Path: /
#       ManagedPolicyArns:
#         - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
#         - !Ref SecretsManagerPolicy


# Recreation of Site Grafana Dashboard as a CloudWatch Dashboard
# {
#     "widgets": [
#         {
#             "height": 3,
#             "width": 3,
#             "y": 0,
#             "x": 3,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT SUM(completeTransactions) FROM \"FDBT/Site\"", "label": "", "id": "completeTransactionsSum", "region": "eu-west-2", "period": 300 } ]
#                 ],
#                 "view": "singleValue",
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 300,
#                 "title": "Successful Transactions",
#                 "singleValueFullPrecision": true,
#                 "setPeriodToTimeRange": true,
#                 "sparkline": false
#             }
#         },
#         {
#             "height": 3,
#             "width": 3,
#             "y": 0,
#             "x": 0,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT SUM(startedTransactions) FROM \"FDBT/Site\"", "label": "", "id": "startedTransactionsSum", "region": "eu-west-2" } ]
#                 ],
#                 "view": "singleValue",
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 300,
#                 "title": "Started Transactions",
#                 "singleValueFullPrecision": true,
#                 "liveData": true,
#                 "setPeriodToTimeRange": true,
#                 "sparkline": false
#             }
#         },
#         {
#             "height": 5,
#             "width": 7,
#             "y": 5,
#             "x": 16,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT SUM(\"5xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
#                 ],
#                 "view": "timeSeries",
#                 "stacked": true,
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 1,
#                 "title": "5xx Response Codes",
#                 "yAxis": {
#                     "left": {
#                         "label": "Count",
#                         "showUnits": false
#                     }
#                 },
#                 "legend": {
#                     "position": "hidden"
#                 }
#             }
#         },
#         {
#             "height": 7,
#             "width": 9,
#             "y": 3,
#             "x": 0,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT AVG(responseTime) FROM \"FDBT/Site\"", "label": "responseTime", "id": "responseTime", "region": "eu-west-2", "period": 1 } ]
#                 ],
#                 "view": "timeSeries",
#                 "stacked": true,
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 1,
#                 "title": "Response Time",
#                 "yAxis": {
#                     "left": {
#                         "showUnits": false
#                     }
#                 },
#                 "liveData": true,
#                 "legend": {
#                     "position": "hidden"
#                 }
#             }
#         },
#         {
#             "height": 5,
#             "width": 7,
#             "y": 5,
#             "x": 9,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT SUM(\"4xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
#                 ],
#                 "view": "timeSeries",
#                 "stacked": true,
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 1,
#                 "title": "4xx Response Codes",
#                 "yAxis": {
#                     "left": {
#                         "label": "Count",
#                         "showUnits": false
#                     }
#                 },
#                 "legend": {
#                     "position": "hidden"
#                 }
#             }
#         },
#         {
#             "height": 5,
#             "width": 7,
#             "y": 0,
#             "x": 16,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT SUM(\"3xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
#                 ],
#                 "view": "timeSeries",
#                 "stacked": true,
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 1,
#                 "title": "3xx Response Codes",
#                 "yAxis": {
#                     "left": {
#                         "label": "Count",
#                         "showUnits": false
#                     }
#                 },
#                 "legend": {
#                     "position": "hidden"
#                 }
#             }
#         },
#         {
#             "height": 5,
#             "width": 7,
#             "y": 0,
#             "x": 9,
#             "type": "metric",
#             "properties": {
#                 "metrics": [
#                     [ { "expression": "SELECT SUM(\"2xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
#                 ],
#                 "view": "timeSeries",
#                 "stacked": true,
#                 "region": "eu-west-2",
#                 "stat": "Average",
#                 "period": 1,
#                 "title": "2xx Response Codes",
#                 "yAxis": {
#                     "left": {
#                         "label": "Count",
#                         "showUnits": false
#                     }
#                 },
#                 "legend": {
#                     "position": "hidden"
#                 }
#             }
#         }
#     ]
# }
