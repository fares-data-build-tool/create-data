variable "name" {
  type = string
}

variable "environment" {
  type = string
}

variable "s3_logging_bucket_name" {
  description = ""
  type        = string
}

variable "log_retention_in_days" {
  description = "How many days to retain logs for"
  type        = number

  validation {
    condition     = var.log_retention_in_days >= 1
    error_message = "The log_retention_in_days value must be greater than or equal to 1."
  }
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
  description = ""
  type        = bool
  default     = true
}

variable "s3_logging_enabled" {
  description = ""
  type        = bool
  default     = false
}

variable "s3_triggers" {
  description = ""
  type = list(object({
    events              = list(string)
    lambda_function_arn = string
    key_prefix          = string
  }))
  default = []
}
