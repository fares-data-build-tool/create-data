resource "aws_rds_cluster_parameter_group" "rds" {
  # using old generated name to stop replacement
  # TODO won't work cross environment
  name        = "fdbt-rds-databaseclusterparametergroup5dot7-cieoizd8zvnl"
  description = "Parameter Group for master DB"

  family = "aurora-mysql5.7"

  parameter {
    name  = "aurora_load_from_s3_role"
    value = "arn:aws:iam::442445088537:role/FDBT-IAM-RdsAuroraS3Role-QMZAJJU8U0Z4" # TODO do this
  }

  parameter {
    name  = "max_connections"
    value = "90"
  }
}
