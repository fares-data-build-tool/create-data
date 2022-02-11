module "cfd_site" {
  source = "../../modules/cfd_site"

  stage                       = local.stage
  log_retention_days          = local.log_retention_days
  aws_security_group_rds_id   = module.cfd_database.aws_security_group_rds.id
  aws_lb_listener_certificate = module.regional_cert.this.id
  data_subnets_ids            = local.data_subnets_ids
  private_subnets_ids         = local.private_subnets_ids
  vpc_id                      = local.vpc_id
}
