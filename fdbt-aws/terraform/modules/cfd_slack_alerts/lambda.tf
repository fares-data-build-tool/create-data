resource "aws_lambda_function" "slack_alerts" {
  function_name = "fdbt-slack-alerts-${var.stage}"
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

resource "aws_cloudwatch_log_group" "slack_alerts" {
  name              = "/aws/lambda/fdbt-slack-alerts-${var.stage}"
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
