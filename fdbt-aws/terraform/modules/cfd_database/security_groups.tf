resource "aws_security_group" "rds" {
  name        = "fdbt-database-${var.stage}"
  description = "fdbt-database-${var.stage}"
  vpc_id      = var.vpc_id

  tags = {
    Name = "fdbt-database-${var.stage}"
  }
}

resource "aws_security_group_rule" "egress_to_aws_apis" {
  description       = "to AWS APIs"
  security_group_id = aws_security_group.rds.id
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

# TODO do we move security groups out of Serverless?
# resource "aws_security_group_rule" "ingress_uploaders" {
#   description              = "from Uploaders"
#   security_group_id        = aws_security_group.rds.id
#   type                     = "ingress"
#   from_port                = 3306
#   to_port                  = 3306
#   protocol                 = "tcp"
#   source_security_group_id = !Ref UploaderSecurityGroup
# }
