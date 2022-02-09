# TODO uplift data resources to Stacks
#   use locals for value names
data "aws_vpcs" "vpc" {
  tags = {
    Name = "fdbt-vpc-${var.stage}"
  }
}

data "aws_subnet" "private_a" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-privateSubnetA-${var.stage}"]
  }
}

data "aws_subnet" "private_b" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-privateSubnetB-${var.stage}"]
  }
}

data "aws_subnet" "public_a" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-publicSubnetA-${var.stage}"]
  }
}

data "aws_subnet" "public_b" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-publicSubnetB-${var.stage}"]
  }
}
