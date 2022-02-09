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

resource "aws_iam_role_policy_attachment" "slack_alerts" {
  role       = aws_iam_role.slack_alerts.name
  policy_arn = aws_iam_policy.slack_alerts.arn
}

resource "aws_iam_policy" "slack_alerts" {
  name        = "fdbt-slack-alerts-${var.stage}"
  description = "fdbt-slack-alerts-${var.stage}"
  policy      = data.aws_iam_policy_document.slack_alerts.json
}

data "aws_iam_policy_document" "slack_alerts" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      aws_cloudwatch_log_group.slack_alerts.arn,
      "${aws_cloudwatch_log_group.slack_alerts.arn}:*"
    ]
  }
}
