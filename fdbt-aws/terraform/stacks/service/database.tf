module "cfd_database" {
  source = "../../modules/cfd_database"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
