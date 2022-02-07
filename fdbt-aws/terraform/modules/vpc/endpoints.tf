resource "aws_vpc_endpoint" "s3" {
  service_name      = "com.amazonaws.eu-west-2.s3"
  auto_accept       = true
  vpc_endpoint_type = "Gateway"
  vpc_id            = aws_vpc.vpc.id

  route_table_ids = [
    aws_route_table.data.id,
    aws_route_table.private.id
  ]

  tags = {
    Name = "fdbt-s3-endpoint-${var.stage}"
  }
}
