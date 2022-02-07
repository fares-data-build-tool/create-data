module "slack_alerts_lambda" {
  source = "../../modules/slack_alerts_lambda"

  stage              = local.stage
  log_retention_days = local.log_retention_days
}
