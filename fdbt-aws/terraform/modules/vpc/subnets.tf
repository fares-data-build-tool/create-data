resource "aws_subnet" "data_a" {
  vpc_id                                         = aws_vpc.vpc.id
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.4.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Name = "fdbt-dataSubnetA-${var.stage}"
  }
}

resource "aws_subnet" "data_b" {
  vpc_id                                         = aws_vpc.vpc.id
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.5.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Name = "fdbt-dataSubnetB-${var.stage}"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id                                         = aws_vpc.vpc.id
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.2.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Name = "fdbt-privateSubnetA-${var.stage}"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id                                         = aws_vpc.vpc.id
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.3.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "false"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Name = "fdbt-privateSubnetB-${var.stage}"
  }
}

resource "aws_subnet" "public_a" {
  vpc_id                                         = aws_vpc.vpc.id
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.0.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "true"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Name = "fdbt-publicSubnetA-${var.stage}"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                                         = aws_vpc.vpc.id
  assign_ipv6_address_on_creation                = "false"
  cidr_block                                     = "10.0.1.0/24"
  enable_dns64                                   = "false"
  enable_resource_name_dns_a_record_on_launch    = "false"
  enable_resource_name_dns_aaaa_record_on_launch = "false"
  ipv6_native                                    = "false"
  map_public_ip_on_launch                        = "true"
  private_dns_hostname_type_on_launch            = "ip-name"

  tags = {
    Name = "fdbt-publicSubnetB-${var.stage}"
  }
}
