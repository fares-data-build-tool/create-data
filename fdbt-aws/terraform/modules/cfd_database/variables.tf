variable "stage" {
  description = "Stage name"
  type        = string
}

variable "log_retention_days" {
  description = "number of days to retain logs for"
  type        = number
}

variable "data_subnets_ids" {}
variable "vpc_id" {}
