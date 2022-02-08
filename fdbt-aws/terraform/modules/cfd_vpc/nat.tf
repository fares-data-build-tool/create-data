resource "aws_nat_gateway" "nat" {
  allocation_id     = aws_eip.nat.id
  connectivity_type = "public"
  subnet_id         = aws_subnet.public_a.id

  tags = {
    Name = "fdbt-natGateway-${var.stage}"
  }
}

resource "aws_eip" "nat" {
  network_border_group = "eu-west-2"
  network_interface    = "eni-04f6762fcd2d6d6c4"
  public_ipv4_pool     = "amazon"
  vpc                  = "true"

  tags = {
    Name = "fdbt-natGatewayEip-${var.stage}"
  }
}
