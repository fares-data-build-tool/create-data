resource "aws_ssm_parameter" "parameter" {
  count = var.ignore_value_changes ? 0 : 1

  name      = "/${var.stage}/${var.name}"
  type      = var.type
  value     = var.value
  overwrite = true
}

resource "aws_ssm_parameter" "ignore_value_changes" {
  count = var.ignore_value_changes ? 1 : 0

  name      = "/${var.stage}/${var.name}"
  type      = var.type
  value     = var.value
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
