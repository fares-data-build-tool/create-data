resource "aws_lambda_function" "slack_alerts" {
  function_name = "slack-alerts-${var.stage}"
  filename      = "slackAlerts.js"
  role          = aws_iam_role.slack_alerts.arn
  handler       = "slackAlerts.handler"
  runtime       = "nodejs12.x"

  environment {
    variables = {
      HOOK_URL = data.aws_ssm_parameter.hook_url.value
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.slack_alerts,
  ]
}

resource "aws_iam_role" "slack_alerts" {
  name               = "slack-alerts-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com",
      ]
    }
  }
}

resource "aws_cloudwatch_log_group" "slack_alerts" {
  name              = "/aws/lambda/slack-alerts-${var.stage}"
  retention_in_days = var.log_retention_days
}

module "hook_url" {
  source = "../ssm_parameter"

  name                 = "slack_alerts/hook_url"
  stage                = var.stage
  ignore_value_changes = true
}

data "aws_ssm_parameter" "hook_url" {
  name = module.hook_url.parameter.name

  depends_on = [
    module.hook_url
  ]
}
