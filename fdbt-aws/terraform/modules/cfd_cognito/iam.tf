resource "aws_iam_role" "cognito_custom_emails" {
  name               = "fdbt-cognito-custom-emails-${var.stage}"
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

resource "aws_iam_role_policy_attachment" "cognito_custom_emails" {
  role       = aws_iam_role.cognito_custom_emails.name
  policy_arn = aws_iam_policy.cognito_custom_emails.arn
}

resource "aws_iam_policy" "cognito_custom_emails" {
  name        = "fdbt-cognito-custom-emails-${var.stage}"
  description = "fdbt-cognito-custom-emails-${var.stage}"
  policy      = data.aws_iam_policy_document.cognito_custom_emails.json
}

data "aws_iam_policy_document" "cognito_custom_emails" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      aws_cloudwatch_log_group.cognito_custom_emails.arn,
      "${aws_cloudwatch_log_group.cognito_custom_emails.arn}:*"
    ]
  }
}
