module "cfd_database" {
  source = "../../modules/cfd_database"

  stage              = local.stage
  log_retention_days = local.log_retention_days
  data_subnets_ids   = local.data_subnets_ids
  vpc_id             = local.vpc_id
}
