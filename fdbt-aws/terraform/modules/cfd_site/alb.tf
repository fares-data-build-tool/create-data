data "aws_subnet" "public_a" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-publicSubnetA-${var.stage}"]
  }
}

data "aws_subnet" "public_b" {
  filter {
    name   = "tag:Name"
    values = ["fdbt-publicSubnetB-${var.stage}"]
  }
}

resource "aws_lb" "site" {
  name               = "fdbt-site-${var.stage}"
  internal           = false
  load_balancer_type = "application"
  idle_timeout       = 30

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    data.aws_subnet.public_a.id,
    data.aws_subnet.public_b.id
  ]

  tags = {
    Name = "fdbt-site-${var.stage}"
  }
}

resource "aws_lb_listener" "redirect" {
  load_balancer_arn = aws_lb.site.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener_certificate" "site" {
  listener_arn    = aws_lb_listener.site.arn
  certificate_arn = var.aws_lb_listener_certificate
}

resource "aws_lb_listener" "site" {
  load_balancer_arn = aws_lb.site.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = "arn:aws:iam::187416307283:server-certificate/test_cert_rab3wuqwgja25ct3n4jdj2tzu4"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.site.arn
  }
}

resource "aws_lb_target_group" "site" {
  name                 = "fdbt-site-${var.stage}"
  port                 = 80
  protocol             = "HTTP"
  vpc_id               = one(data.aws_vpcs.vpc.ids)
  target_type          = "ip"
  deregistration_delay = 30

  stickiness {
    enabled = false
    type    = "lb_cookie"
  }

  health_check {
    path                = "/"
    matcher             = 200
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}
