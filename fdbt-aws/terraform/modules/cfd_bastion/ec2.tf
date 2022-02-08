# TODO handle nightly reboot/scaling in and out daily in here and remove from Exporter Stack

data "aws_ssm_parameter" "latest_amazon_linux_ami_id" {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

resource "aws_launch_template" "bastion" {
  name_prefix   = "fdbt-bastion-${var.stage}"
  image_id      = data.aws_ssm_parameter.latest_amazon_linux_ami_id.value
  instance_type = "t3.micro"

  vpc_security_group_ids = [
    aws_security_group.bastion.id
  ]

  iam_instance_profile {
    arn = aws_iam_instance_profile.bastion.arn
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      "Bastion" = "true"
      "Name"    = "Bastion"
    }
  }
}

resource "aws_autoscaling_group" "bastion" {
  name             = "fdbt-bastion-${var.stage}"
  desired_capacity = 1
  max_size         = 1
  min_size         = 1

  availability_zones = [
    "eu-west-2a",
    "eu-west-2b"
  ]

  launch_template {
    id      = aws_launch_template.bastion.id
    version = "$Latest"
  }
}
