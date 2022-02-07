module "cluster_endpoint_dns_record" {
  source = "../ssm_parameter"

  name  = "rds/cluster_endpoint_dns_record"
  stage = var.stage
  value = aws_rds_cluster.rds.endpoint
}
