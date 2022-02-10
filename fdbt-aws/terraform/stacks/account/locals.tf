locals {
  name  = "cfd-${local.stage}"
  stage = lower(terraform.workspace)

  log_retention_days = 180

  vpc_name              = "fdbt-vpc-${local.stage}"
  data_subnets_names    = ["fdbt-dataSubnetA-${local.stage}", "fdbt-dataSubnetB-${local.stage}"]
  private_subnets_names = ["fdbt-privateSubnetA-${local.stage}", "fdbt-privateSubnetB-${local.stage}"]
  public_subnets_names  = ["fdbt-publicSubnetA-${local.stage}", "fdbt-publicSubnetB-${local.stage}"]

  tags = {
    project = "create-fares-data"
    stage   = local.stage
    tool    = "terraform"
  }
}
