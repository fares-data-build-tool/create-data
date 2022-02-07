output "parameter" {
  value = length(aws_ssm_parameter.parameter) > 0 ? aws_ssm_parameter.parameter[0] : aws_ssm_parameter.ignore_value_changes[0]
}
