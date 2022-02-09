module "global_cert" {
  source = "../../modules/acm_certificate"

  providers = {
    aws      = aws.use1
    aws.core = aws.core
  }

  stage = local.stage

  # TODO need to support multiple domain names for Prod
  domain_name     = "test.dft-cfd.com"
  route53_zone_id = data.aws_route53_zone.dft_cfd_com.zone_id
}

module "regional_cert" {
  source = "../../modules/acm_certificate"

  providers = {
    aws.core = aws.core
  }

  stage = local.stage

  # TODO need to support multiple domain names for Prod
  domain_name     = "test.dft-cfd.com"
  route53_zone_id = data.aws_route53_zone.dft_cfd_com.zone_id
}
