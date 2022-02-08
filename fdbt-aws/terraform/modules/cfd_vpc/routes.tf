resource "aws_route_table" "data" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "fdbt-dataRouteTable-${var.stage}"
  }
}

resource "aws_route_table_association" "data_a" {
  route_table_id = aws_route_table.data.id
  subnet_id      = aws_subnet.data_a.id
}

resource "aws_route_table_association" "data_b" {
  route_table_id = aws_route_table.data.id
  subnet_id      = aws_subnet.data_b.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "fdbt-privateRouteTable-${var.stage}"
  }
}

resource "aws_route_table_association" "private_a" {
  route_table_id = aws_route_table.private.id
  subnet_id      = aws_subnet.private_a.id
}

resource "aws_route_table_association" "private_b" {
  route_table_id = aws_route_table.private.id
  subnet_id      = aws_subnet.private_b.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "fdbt-publicRouteTable-${var.stage}"
  }
}

resource "aws_route_table_association" "public_a" {
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public_a.id
}

resource "aws_route_table_association" "public_b" {
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public_b.id
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "fdbt-mainRouteTable-${var.stage}"
  }
}

resource "aws_main_route_table_association" "main" {
  route_table_id = aws_route_table.main.id
  vpc_id         = aws_vpc.vpc.id
}
