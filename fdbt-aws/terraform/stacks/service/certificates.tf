data "aws_route53_zone" "dft_cfd_com" {
  name = "dft-cfd.com."
}

module "external_cert" {
  source = "../../modules/acm_certificate"

  stage = local.stage

  domain_name     = "test.dft-cfd.com"
  route53_zone_id = data.aws_route53_zone.dft_cfd_com.zone_id
}
