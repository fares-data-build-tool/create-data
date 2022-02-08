module "cfd_slack_alerts" {
  source = "../../modules/cfd_slack_alerts"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
