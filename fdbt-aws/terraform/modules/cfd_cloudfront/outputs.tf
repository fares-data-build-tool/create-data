output "cloudfront_oai_arn" {
  value = aws_cloudfront_origin_access_identity.error_page.iam_arn
}
