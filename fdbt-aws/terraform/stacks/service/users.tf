module "cfd_cognito" {
  source = "../../modules/cfd_cognito"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
