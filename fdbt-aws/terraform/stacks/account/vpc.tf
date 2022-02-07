module "vpc" {
  source = "../../modules/vpc"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
