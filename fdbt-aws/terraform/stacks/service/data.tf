data "aws_route53_zone" "dft_cfd_com" {
  provider = aws.core

  name = "dft-cfd.com."
}

data "aws_vpcs" "vpc" {
  tags = {
    Name = local.vpc_name
  }
}

data "aws_subnet_ids" "data" {
  vpc_id = local.vpc_id
  filter {
    name   = "tag:Name"
    values = local.data_subnets_names
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = local.vpc_id
  filter {
    name   = "tag:Name"
    values = local.private_subnets_names
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = local.vpc_id
  filter {
    name   = "tag:Name"
    values = local.public_subnets_names
  }
}
