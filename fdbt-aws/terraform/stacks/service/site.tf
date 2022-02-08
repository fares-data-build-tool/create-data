module "cfd_site" {
  source = "../../modules/cfd_site"

  stage              = local.stage
  log_retention_days = local.log_retention_days

  aws_security_group_rds_id   = module.cfd_database.aws_security_group_rds.id
  aws_lb_listener_certificate = module.external_cert.this.id
}
