variable "name" {
  type = string
}

variable "stage" {
  type = string
}

variable "s3_logging_bucket_name" {
  type    = string
  default = null
}

variable "s3_acl" {
  type    = string
  default = "private"
}

variable "s3_force_destroy_bucket" {
  type    = bool
  default = false
}

variable "versioning_enabled" {
  type    = bool
  default = false
}

variable "s3_logging_enabled" {
  type    = bool
  default = false
}

variable "s3_triggers" {
  type = list(object({
    events              = list(string)
    lambda_function_arn = string
    key_prefix          = string
  }))
  default = []
}
