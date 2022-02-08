module "cfd_rds" {
  source = "../../modules/cfd_rds"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
