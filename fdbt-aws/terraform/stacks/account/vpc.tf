module "cfd_vpc" {
  source = "../../modules/cfd_vpc"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
