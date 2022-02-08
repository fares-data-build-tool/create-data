resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "fdbt-internetGateway-${var.stage}"
  }
}
