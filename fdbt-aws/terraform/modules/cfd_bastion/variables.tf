variable "stage" {
  description = "Stage name"
  type        = string
}

variable "log_retention_days" {
  description = "number of days to retain logs for"
  type        = number
}

variable "aws_security_group_rds_id" {}
variable "private_subnets_ids" {}
variable "vpc_id" {}
