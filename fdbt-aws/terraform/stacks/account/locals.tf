locals {
  name  = "cfd-${local.stage}"
  stage = lower(terraform.workspace)

  log_retention_in_days = {
    default = 90
    prod    = 365
  }

  tags = {
    project = "create-fares-data"
    stage   = local.stage
    tool    = "terraform"
  }
}
