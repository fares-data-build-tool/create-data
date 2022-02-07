data "aws_subnet" "data_a" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-dataSubnetA-${var.stage}"]
  }
}

data "aws_subnet" "data_b" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-dataSubnetB-${var.stage}"]
  }
}

resource "aws_db_subnet_group" "rds" {
  # using old generated name to stop replacement
  # TODO won't work cross environment
  name = "fdbt-rds-databasesubnetgroup-vt6rbod0i260"

  subnet_ids = [
    data.aws_subnet.data_a.id,
    data.aws_subnet.data_b.id
  ]
}
