module "cluster_endpoint" {
  source = "../ssm_parameter"

  name  = "rds/cluster_endpoint"
  stage = var.stage
  value = aws_rds_cluster.rds.endpoint
}
