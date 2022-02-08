data "aws_vpcs" "vpc" {
  tags = {
    Name = "fdbt-vpc-${var.stage}"
  }
}
