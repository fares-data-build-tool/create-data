variable "name" {
  type = string
}

variable "stage" {
  type = string
}

variable "s3_acl" {
  type    = string
  default = "private"
}

variable "s3_force_destroy_bucket" {
  type    = bool
  default = false
}

variable "cloudfront_oai_arn" {}
