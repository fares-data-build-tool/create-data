module "rds" {
  source = "../../modules/rds"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
