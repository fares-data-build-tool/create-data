locals {
  name  = "cfd-${local.stage}"
  stage = lower(terraform.workspace)

  log_retention_days = 180

  tags = {
    project = "create-fares-data"
    stage   = local.stage
    tool    = "terraform"
  }
}
