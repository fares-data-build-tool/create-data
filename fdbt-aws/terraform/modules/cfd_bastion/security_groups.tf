resource "aws_security_group" "bastion" {
  name        = "fdbt-bastion-${var.stage}"
  description = "fdbt-bastion-${var.stage}"
  vpc_id      = var.vpc_id

  tags = {
    Name = "fdbt-bastion-${var.stage}"
  }
}

resource "aws_security_group_rule" "egress_to_aws_apis" {
  description       = "to AWS APIs"
  security_group_id = aws_security_group.bastion.id
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "egress_database" {
  description              = "to Database"
  security_group_id        = aws_security_group.bastion.id
  type                     = "egress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = var.aws_security_group_rds_id
}

resource "aws_security_group_rule" "ingress_from_bastion" {
  description              = "from Bastion"
  security_group_id        = var.aws_security_group_rds_id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion.id
}
