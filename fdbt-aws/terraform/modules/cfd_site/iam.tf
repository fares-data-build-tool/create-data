resource "aws_iam_role" "site_execution" {
  name               = "fdbt-site-ecs-execution-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.site_execution_assume_role.json
}

data "aws_iam_policy_document" "site_execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "ecs-tasks.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role_policy_attachment" "site_execution" {
  role       = aws_iam_role.site_execution.name
  policy_arn = aws_iam_policy.site_execution.arn
}

resource "aws_iam_policy" "site_execution" {
  name        = "fdbt-site-ecs-execution-${var.stage}"
  description = "fdbt-site-ecs-execution-${var.stage}"
  policy      = data.aws_iam_policy_document.site_execution.json
}

data "aws_iam_policy_document" "site_execution" {
  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
  }
}

resource "aws_iam_role" "site_task" {
  name               = "fdbt-site-ecs-task-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.site_task_assume_role.json
}

data "aws_iam_policy_document" "site_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role_policy_attachment" "site_task" {
  role       = aws_iam_role.site_task.name
  policy_arn = aws_iam_policy.site_task.arn
}

resource "aws_iam_policy" "site_task" {
  name        = "fdbt-site-ecs-task-${var.stage}"
  description = "fdbt-site-ecs-task-${var.stage}"
  policy      = data.aws_iam_policy_document.site_task.json
}

# TODO paramaterise this
data "aws_iam_policy_document" "site_task" {
  statement {
    sid    = ""
    effect = "Allow"

    resources = [
      "arn:aws:s3:::fdbt-user-data-test/*",
      "arn:aws:s3:::fdbt-matching-data-test/*",
      "arn:aws:s3:::fdbt-products-data-test/*",
    ]

    actions = [
      "s3:GetObject",
      "s3:PutObject",
    ]
  }

  statement {
    sid    = ""
    effect = "Allow"

    resources = [
      "arn:aws:s3:::fdbt-matching-data-test",
      "arn:aws:s3:::fdbt-products-data-test",
      "arn:aws:s3:::fdbt-netex-data-test",
    ]

    actions = ["s3:ListBucket"]
  }

  statement {
    sid    = ""
    effect = "Allow"

    resources = [
      "arn:aws:s3:::fdbt-raw-user-data-test/*",
      "arn:aws:s3:::fdbt-netex-data-test/*",
    ]

    actions = ["s3:PutObject"]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["arn:aws:s3:::fdbt-netex-data-test/*"]
    actions   = ["s3:GetObject"]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]
    actions   = ["ssm:GetParameter"]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "cognito-idp:ForgotPassword",
      "cognito-idp:ConfirmForgotPassword",
      "cognito-idp:ChangePassword",
      "cognito-idp:ListUserPools",
    ]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["arn:aws:cognito-idp:eu-west-2:442445088537:userpool/*"]

    actions = [
      "cognito-idp:AdminInitiateAuth",
      "cognito-idp:AdminUserGlobalSignOut",
      "cognito-idp:DescribeUserPool",
      "cognito-idp:AdminRespondToAuthChallenge",
      "cognito-idp:AdminUpdateUserAttributes",
      "cognito-idp:AdminGetUser",
      "cognito-idp:AdminSetUserPassword",
      "cognito-idp:ListUserPoolClients",
      "cognito-idp:DescribeUserPoolClient",
      "cognito-idp:ListUsers",
    ]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
    ]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ]
  }

  statement {
    sid    = ""
    effect = "Allow"

    resources = [
      "arn:aws:lambda:eu-west-2:442445088537:function:exporter-test",
      "arn:aws:lambda:eu-west-2:442445088537:function:zipper-test",
    ]

    actions = [
      "lambda:invokeAsync",
      "lambda:invokeFunction",
    ]
  }
}

resource "aws_iam_role" "site_scaling" {
  name               = "fdbt-site-ecs-scaling-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.site_scaling_assume_role.json
}

data "aws_iam_policy_document" "site_scaling_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role_policy_attachment" "site_scaling" {
  role       = aws_iam_role.site_scaling.name
  policy_arn = aws_iam_policy.site_scaling.arn
}

resource "aws_iam_policy" "site_scaling" {
  name        = "fdbt-site-ecs-scaling-${var.stage}"
  description = "fdbt-site-ecs-scaling-${var.stage}"
  policy      = data.aws_iam_policy_document.site_scaling.json
}

data "aws_iam_policy_document" "site_scaling" {
  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "ecs:DescribeServices",
      "ecs:UpdateService",
    ]
  }

  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "cloudwatch:DescribeAlarms",
      "cloudwatch:PutMetricAlarm",
    ]
  }
}
