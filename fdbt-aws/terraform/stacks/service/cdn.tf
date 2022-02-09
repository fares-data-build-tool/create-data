module "cfd_cloudfront" {
  source = "../../modules/cfd_cloudfront"

  providers = {
    aws.use1 = aws.use1
  }

  stage                    = local.stage
  log_retention_days       = local.log_retention_days
  cfd_error_page_bucket_id = module.cfd_error_page_bucket.bucket.id
}
