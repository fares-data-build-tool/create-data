locals {
  name  = "cfd-${local.environment}"
  stage = lower(terraform.workspace)

  log_retention_in_days = {
    default = 90
    prod    = 365
  }

  tags = {
    project     = "create-fares-data"
    environment = local.stage
    tool        = "terraform"
  }
}
