resource "aws_ecs_cluster" "site" {
  name = "fdbt-site-${var.stage}"
}

resource "aws_ecs_task_definition" "site" {
  family                   = "fdbt-site-${var.stage}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 2048
  execution_role_arn       = aws_iam_role.site_execution.id
  task_role_arn            = aws_iam_role.site_task.id

  container_definitions = jsonencode([{
    "cpu" = 512
    "environment" = [
      {
        "name"  = "RDS_HOST"
        "value" = "db.dft-cfd.internal"
      },
      {
        "name"  = "FDBT_USER_POOL_CLIENT_ID"
        "value" = "2fu8u52qssovhru88t5ps1scsn" # TODO
      },
      {
        "name"  = "SUPPORT_EMAIL_ADDRESS"
        "value" = "fdbt-support@infinityworks.com"
      },
      {
        "name"  = "ENABLE_VIRUS_SCAN"
        "value" = "1"
      },
      {
        "name"  = "SUPPORT_PHONE_NUMBER"
        "value" = "0113 320 5010"
      },
      {
        "name"  = "ALLOW_DISABLE_AUTH"
        "value" = "1"
      },
      {
        "name"  = "STAGE"
        "value" = var.stage
      },
      {
        "name"  = "FDBT_USER_POOL_ID"
        "value" = "eu-west-2_8Bt13tfnT" # TODO
      },
      {
        "name"  = "SERVICE_EMAIL_ADDRESS"
        "value" = "fdbt-support@infinityworks.com"
      },
      {
        "name"  = "SESSION_SECRET"
        "value" = "" # TODO
      },
      {
        "name"  = "AWS_NODEJS_CONNECTION_REUSE_ENABLED"
        "value" = "1"
      },
    ]
    "essential" = true
    "image"     = "827855331226.dkr.ecr.eu-west-2.amazonaws.com/fdbt-site:8a29e3ad1af12206f5d25c09586097675a4f94d0" # TODO
    "logConfiguration" = {
      "logDriver" = "awslogs"
      "options" = {
        "awslogs-group"  = aws_cloudwatch_log_group.site.id
        "awslogs-region" = "eu-west-2"
      }
    }
    "memory" = 2048
    "name"   = "fdbt-site-${var.stage}"
    "portMappings" = [
      {
        "containerPort" = 80
        "hostPort"      = 80
        "protocol"      = "tcp"
      },
    ]
  }])
}


resource "aws_ecs_service" "site" {
  name                               = "fdbt-site-${var.stage}"
  cluster                            = aws_ecs_cluster.site.id
  task_definition                    = aws_ecs_task_definition.site.arn
  desired_count                      = 3
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 25

  load_balancer {
    target_group_arn = aws_lb_target_group.site.arn
    container_name   = "fdbt-site-${var.stage}"
    container_port   = 80
  }

  network_configuration {
    security_groups  = [aws_security_group.site.id]
    assign_public_ip = false
    subnets          = var.private_subnets_ids
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

# TODO

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

#         ScaleInCooldown: 60
#         ScaleOutCooldown: 60
#         TargetValue: 50

# resource "aws_autoscaling_policy" "bat" {
#   name        = "fdbt-site-${var.stage}"
#   policy_type = "TargetTrackingScaling"

#   target_tracking_configuration {
#     predefined_metric_specification {
#       predefined_metric_type = "ECSServiceAverageCPUUtilization"
#     }

#     target_value = 50.0
#   }

#   scaling_adjustment     = 4
#   adjustment_type        = "ChangeInCapacity"
#   cooldown               = 300
#   autoscaling_group_name = aws_autoscaling_group.bar.name
# }

# aws_iam_role.site_scaling.id
