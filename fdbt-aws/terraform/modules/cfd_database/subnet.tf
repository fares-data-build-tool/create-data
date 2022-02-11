resource "aws_db_subnet_group" "rds" {
  # using old generated name to stop replacement
  # TODO won't work cross environment
  name       = "fdbt-rds-databasesubnetgroup-vt6rbod0i260"
  subnet_ids = var.data_subnets_ids
}
