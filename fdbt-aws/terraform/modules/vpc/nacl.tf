resource "aws_network_acl" "acl" {
  vpc_id = aws_vpc.vpc.id
  subnet_ids = [
    aws_subnet.data_a.id,
    aws_subnet.data_b.id,
    aws_subnet.private_a.id,
    aws_subnet.private_b.id,
    aws_subnet.public_a.id,
    aws_subnet.public_b.id,
  ]

  egress {
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = "0"
    icmp_code  = "0"
    icmp_type  = "0"
    protocol   = "-1"
    rule_no    = "100"
    to_port    = "0"
  }

  ingress {
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = "0"
    icmp_code  = "0"
    icmp_type  = "0"
    protocol   = "-1"
    rule_no    = "100"
    to_port    = "0"
  }
}
