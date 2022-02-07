variable "name" {
  type = string
}

variable "stage" {
  type = string
}

variable "type" {
  type    = string
  default = "SecureString"
}

variable "value" {
  type    = string
  default = "To Replace"
}

variable "ignore_value_changes" {
  type    = bool
  default = false
}
