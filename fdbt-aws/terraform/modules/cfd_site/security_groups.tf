resource "aws_security_group" "alb" {
  name        = "fdbt-alb-${var.stage}"
  description = "fdbt-alb-${var.stage}"
  vpc_id      = one(data.aws_vpcs.vpc.ids)

  tags = {
    Name = "fdbt-alb-${var.stage}"
  }
}

resource "aws_security_group_rule" "ingress_http" {
  description       = "form HTTP"
  security_group_id = aws_security_group.alb.id
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ingress_https" {
  description       = "form HTTPS"
  security_group_id = aws_security_group.alb.id
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "egress_site" {
  description              = "to Site"
  security_group_id        = aws_security_group.alb.id
  type                     = "egress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.site.id
}

resource "aws_security_group" "site" {
  name        = "fdbt-site-${var.stage}"
  description = "fdbt-site-${var.stage}"
  vpc_id      = one(data.aws_vpcs.vpc.ids)

  tags = {
    Name = "fdbt-site-${var.stage}"
  }
}

resource "aws_security_group_rule" "egress_to_aws_apis" {
  description       = "to AWS APIs"
  security_group_id = aws_security_group.site.id
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "egress_database" {
  description              = "to Database"
  security_group_id        = aws_security_group.site.id
  type                     = "egress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = var.aws_security_group_rds_id
}

resource "aws_security_group_rule" "ingress_site" {
  description              = "from Site"
  security_group_id        = var.aws_security_group_rds_id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.site.id
}

resource "aws_security_group_rule" "ingress_alb" {
  description              = "from ALB"
  security_group_id        = aws_security_group.site.id
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb.id
}
