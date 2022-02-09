resource "aws_lambda_function" "cognito_custom_emails" {
  function_name = "fdbt-cognito-custom-emails-${var.stage}"
  filename      = "custom_email_trigger.py"
  role          = aws_iam_role.cognito_custom_emails.arn
  handler       = "custom_email_trigger.handler"
  runtime       = "python3.8"

  environment {
    variables = {
      REGISTRATION_LINK       = "https://test.dft-cfd.com/register"      # TODO parameterise
      FORGOTTEN_PASSWORD_LINK = "https://test.dft-cfd.com/resetPassword" # TODO parameterise
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.cognito_custom_emails,
  ]
}

resource "aws_cloudwatch_log_group" "cognito_custom_emails" {
  name              = "/aws/lambda/fdbt-cognito-custom-emails-${var.stage}"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_permission" "with_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_custom_emails.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.user_pool.arn
}
