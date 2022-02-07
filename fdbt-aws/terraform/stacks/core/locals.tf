locals {
  name  = "cfd-${local.stage}"
  stage = "core"

  log_retention_days = 180

  tags = {
    project = "create-fares-data"
    stage   = local.stage
    tool    = "terraform"
  }
}
