locals {
  name  = "cfd-${local.stage}"
  stage = lower(terraform.workspace)

  log_retention_days = 180

  domain_name = {
    test    = "test.dft-cfd.com"
    preprod = "preprod.dft-cfd.com"
    prod    = "prod.dft-cfd.com"
  }

  dft_domain_name = {
    test    = "test.dft-cfd.com"
    preprod = "preprod.dft-cfd.com"
    prod    = "dft.gov.uk"
  }

  vpc_name = "fdbt-vpc-${local.stage}"
  vpc_id   = one(data.aws_vpcs.vpc.ids)

  data_subnets_names = ["fdbt-dataSubnetA-${local.stage}", "fdbt-dataSubnetB-${local.stage}"]
  data_subnets_ids   = data.aws_subnet_ids.data.ids

  private_subnets_names = ["fdbt-privateSubnetA-${local.stage}", "fdbt-privateSubnetB-${local.stage}"]
  private_subnets_ids   = data.aws_subnet_ids.private.ids

  public_subnets_names = ["fdbt-publicSubnetA-${local.stage}", "fdbt-publicSubnetB-${local.stage}"]
  public_subnets_ids   = data.aws_subnet_ids.public.ids

  tags = {
    project = "create-fares-data"
    stage   = local.stage
    tool    = "terraform"
  }
}
