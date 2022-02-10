locals {
  name  = "cfd-${local.stage}"
  stage = lower(terraform.workspace)

  log_retention_days = 180

  admin_domain_name = {
    test = "admin.test.dft-cfd.com"
    preprod = "admin.preprod.dft-cfd.com"
    prod = "admin.prod.dft-cfd.com"
  }

  monitoring_domain_name = {
    test = "monitoring.test.dft-cfd.com"
    preprod = "monitoring.preprod.dft-cfd.com"
    prod = "monitoring.prod.dft-cfd.com"
  }

  site_domain_name = {
    test = "fares-data.test.dft-cfd.com"
    preprod = "fares-data.preprod.dft-cfd.com"
    prod = "fares-data.dft.gov.uk"
  }

  vpc_name = "fdbt-vpc-${local.stage}"
  data_subnets_names = ["fdbt-dataSubnetA-${local.stage}","fdbt-dataSubnetB-${local.stage}"]
  private_subnets_names = ["fdbt-privateSubnetA-${local.stage}","fdbt-privateSubnetB-${local.stage}"]
  public_subnets_names = ["fdbt-publicSubnetA-${local.stage}","fdbt-publicSubnetB-${local.stage}"]

  tags = {
    project = "create-fares-data"
    stage   = local.stage
    tool    = "terraform"
  }
}
