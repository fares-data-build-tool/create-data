variable "table_name" {
  type = string
}

variable "billing_mode" {
  type    = string
  default = "PAY_PER_REQUEST"
}

variable "default_read_capacity" {
  type    = string
  default = "5"
}

variable "secondary_index" {
  type = list(object({
    name            = string,
    hash_key        = string
    projection_type = string
  }))
  default = []
}

variable "table_hash_key" {
  type = string
}

variable "attributes" {
  type = list(object({
    name = string,
    type = string
  }))
}

variable "table_range_key" {
  type    = string
  default = ""
}

variable "point_in_time_recovery_enabled" {
  type    = bool
  default = true
}
