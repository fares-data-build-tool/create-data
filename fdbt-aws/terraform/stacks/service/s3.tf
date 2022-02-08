###     MIGRATE BUCKETS OUT OF SERVERLESS AND CDK     ###
### ALL STATEFUL RESOURCES TO BE MANAGED BY TERRAFORM ###

module "user_data_bucket" {
  source = "../../modules/s3_bucket"

  name  = "fdbt-user-data-${local.stage}"
  stage = local.stage
}

module "raw_user_data_bucket" {
  source = "../../modules/s3_bucket"

  name  = "fdbt-raw-user-data-${local.stage}"
  stage = local.stage
}

module "cfd_error_page_bucket" {
  source = "../../modules/cfd_error_page_bucket"

  name  = "fdbt-error-page-${local.stage}"
  stage = local.stage

  cloudfront_oai_arn = aws_cloudfront_origin_access_identity.error_page.iam_arn
}
