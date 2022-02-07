data "aws_kms_alias" "rds" {
  name = "alias/aws/rds"
}

resource "aws_rds_cluster" "rds" {
  # using old generated name to stop replacement
  # TODO won't work cross environment
  cluster_identifier = "fdbt-rds-databasecluster-eqltqtcq3q8n"

  engine                           = "aurora-mysql"
  engine_version                   = "5.7.mysql_aurora.2.09.2"
  availability_zones               = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
  database_name                    = "fdbt"
  master_username                  = "admin"
  backup_retention_period          = 1
  preferred_backup_window          = "01:00-02:00"
  skip_final_snapshot              = true
  db_instance_parameter_group_name = aws_rds_cluster_parameter_group.rds.id
  db_subnet_group_name             = aws_db_subnet_group.rds.id
  storage_encrypted                = true
  kms_key_id                       = data.aws_kms_alias.rds.target_key_arn
  vpc_security_group_ids           = [aws_security_group.rds.id]
}

resource "aws_rds_cluster_instance" "primary" {
  # using old generated name to stop replacement
  # TODO won't work cross environment
  identifier = "fdkiqad04hwww"

  instance_class       = "db.t3.small"
  cluster_identifier   = aws_rds_cluster.rds.id
  engine               = aws_rds_cluster.rds.engine
  engine_version       = aws_rds_cluster.rds.engine_version
  db_subnet_group_name = aws_db_subnet_group.rds.id
  monitoring_interval  = 60
  promotion_tier       = 1

  tags = {
    Master = "true"
  }
}

resource "aws_rds_cluster_instance" "secondary" {
  count = var.stage == "prod" ? 1 : 0

  identifier           = "fdbt-rds-databasecluster-secondary"
  instance_class       = "db.t3.medium"
  cluster_identifier   = aws_rds_cluster.rds.id
  engine               = aws_rds_cluster.rds.engine
  engine_version       = aws_rds_cluster.rds.engine_version
  db_subnet_group_name = aws_db_subnet_group.rds.id
}
