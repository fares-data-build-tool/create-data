resource "aws_lambda_permission" "s3" {
  count = length(var.s3_triggers)

  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = var.s3_triggers[count.index].lambda_function_arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.bucket.arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  count = length(var.s3_triggers) > 0 ? 1 : 0

  bucket = aws_s3_bucket.bucket.bucket

  dynamic "lambda_function" {
    for_each = var.s3_triggers

    content {
      lambda_function_arn = lambda_function.value.lambda_function_arn
      events              = lambda_function.value.events
      filter_prefix       = lambda_function.value.key_prefix
    }
  }

  depends_on = [
    aws_lambda_permission.s3
  ]
}
