#   Stage:
#     Type: String
#     AllowedValues:
#       - test
#       - preprod
#       - prod
#   ProductName:
#     Type: String
#     Default: fdbt
#   SiteImageUrl:
#     Type: String
#     Description: The url of the site docker image in ECR
#   SiteContainerPort:
#     Type: Number
#     Default: 80
#     Description: Port on which the site process is running in the container
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
#   SupportPhoneNumber:
#     Type: String
#     Description: The phone number to be used for user support
#   SupportEmailAddress:
#     Type: String
#     Description: The email address to be used for user support
#   ServiceEmailAddress:
#     Type: String
#     Description: The email address used by the service to email users

# Conditions:
#   IsTest: !Equals [!Ref Stage, "test"]
#   IsProd: !Equals [!Ref Stage, "prod"]
#   IsNotProd: !Not [!Equals [!Ref Stage, "prod"]]

# Resources:
#   # ECS Resources
#   ECSCluster:
#     Type: AWS::ECS::Cluster
#     Properties:
#       ClusterName: !Sub ${ProductName}-fargate-cluster-${Stage}

#   SiteTaskDefinition:
#     Type: AWS::ECS::TaskDefinition
#     Properties:
#       Family: !Sub ${ProductName}-site-${Stage}
#       Cpu: 512
#       Memory: 2048
#       NetworkMode: awsvpc
#       RequiresCompatibilities:
#         - FARGATE
#       ExecutionRoleArn:
#         Fn::ImportValue: !Sub ${Stage}:EcsTaskExecutionRoleArn
#       TaskRoleArn:
#         Fn::ImportValue: !Sub ${Stage}:EcsSiteTaskRoleArn
#       ContainerDefinitions:
#         - Name: !Sub ${ProductName}-site-${Stage}
#           Cpu: 512
#           Memory: 2048
#           Image: !Ref SiteImageUrl
#           PortMappings:
#             - ContainerPort: !Ref SiteContainerPort
#           LogConfiguration:
#             LogDriver: awslogs
#             Options:
#               awslogs-group: !Ref SiteLogGroup
#               awslogs-region: !Ref AWS::Region
#               awslogs-stream-prefix: !Ref ProductName
#           Environment:
#             - Name: STAGE
#               Value: !Ref Stage
#             - Name: AWS_NODEJS_CONNECTION_REUSE_ENABLED
#               Value: "1"
#             - Name: RDS_HOST
#               Value:
#                 Fn::ImportValue: !Sub ${Stage}:RdsClusterInternalEndpoint
#             - Name: FDBT_USER_POOL_CLIENT_ID
#               Value:
#                 Fn::ImportValue: !Sub ${Stage}:UserPoolClientID
#             - Name: FDBT_USER_POOL_ID
#               Value:
#                 Fn::ImportValue: !Sub ${Stage}:UserPoolID
#             - Name: ALLOW_DISABLE_AUTH
#               Value: !If [IsTest, "1", "0"]
#             - Name: SESSION_SECRET
#               Value: !Ref SessionSecret
#             - Name: ENABLE_VIRUS_SCAN
#               Value: "1"
#             - Name: SUPPORT_PHONE_NUMBER
#               Value: !Ref SupportPhoneNumber
#             - Name: SUPPORT_EMAIL_ADDRESS
#               Value: !Ref SupportEmailAddress
#             - Name: SERVICE_EMAIL_ADDRESS
#               Value: !Ref ServiceEmailAddress

#   SiteService:
#     Type: AWS::ECS::Service
#     DependsOn: PublicLoadBalancerListener
#     Properties:
#       ServiceName: !Sub ${ProductName}-site-${Stage}
#       Cluster: !Ref ECSCluster
#       LaunchType: FARGATE
#       PlatformVersion: "1.4.0"
#       DeploymentConfiguration:
#         MaximumPercent: 200
#         MinimumHealthyPercent: 75
#       DesiredCount: 3
#       NetworkConfiguration:
#         AwsvpcConfiguration:
#           AssignPublicIp: DISABLED
#           SecurityGroups:
#             - Fn::ImportValue: !Sub ${Stage}:FargateSiteContainerSecurityGroup
#           Subnets:
#             - Fn::ImportValue: !Sub ${Stage}:PrivateSubnetA
#             - Fn::ImportValue: !Sub ${Stage}:PrivateSubnetB
#       TaskDefinition: !Ref SiteTaskDefinition
#       LoadBalancers:
#         - ContainerName: !Sub ${ProductName}-site-${Stage}
#           ContainerPort: !Ref SiteContainerPort
#           TargetGroupArn: !Ref SiteTargetGroup

#   SiteAutoScalingTarget:
#     Type: AWS::ApplicationAutoScaling::ScalableTarget
#     Properties:
#       MinCapacity: 2
#       MaxCapacity: 5
#       ResourceId:
#         !Join ["/", [service, !Ref ECSCluster, !GetAtt SiteService.Name]]
#       ScalableDimension: ecs:service:DesiredCount
#       ServiceNamespace: ecs
#       RoleARN:
#         Fn::ImportValue: !Sub ${Stage}:EcsSiteScalingRoleArn
#       ScheduledActions:
#         Fn::If:
#           - IsNotProd
#           - - Schedule: "cron(0 19 ? * MON-FRI *)"
#               ScheduledActionName: SiteScaleIn
#               ScalableTargetAction:
#                 MaxCapacity: 0
#                 MinCapacity: 0
#             - Schedule: "cron(0 7 ? * MON-FRI *)"
#               ScheduledActionName: SiteScaleOut
#               ScalableTargetAction:
#                 MaxCapacity: 5
#                 MinCapacity: 2
#           - !Ref AWS::NoValue

#   SiteAutoScalingPolicy:
#     Type: AWS::ApplicationAutoScaling::ScalingPolicy
#     Properties:
#       PolicyName: site-scaling-policy
#       PolicyType: TargetTrackingScaling
#       ScalingTargetId: !Ref SiteAutoScalingTarget
#       TargetTrackingScalingPolicyConfiguration:
#         PredefinedMetricSpecification:
#           PredefinedMetricType: ECSServiceAverageCPUUtilization
#         ScaleInCooldown: 60
#         ScaleOutCooldown: 60
#         TargetValue: 50
