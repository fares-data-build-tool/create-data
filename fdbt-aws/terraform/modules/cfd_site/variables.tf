variable "stage" {
  description = "Stage name"
  type        = string
}

variable "log_retention_days" {
  description = "number of days to retain logs for"
  type        = number
}

variable "aws_security_group_rds_id" {}
variable "aws_lb_listener_certificate" {}
variable "data_subnets_ids" {}
variable "private_subnets_ids" {}
variable "vpc_id" {}
