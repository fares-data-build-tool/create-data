module "cfd_bastion" {
  source = "../../modules/cfd_bastion"

  stage              = local.stage
  log_retention_days = local.log_retention_days

  aws_security_group_rds_id = module.cfd_database.aws_security_group_rds.id
}
