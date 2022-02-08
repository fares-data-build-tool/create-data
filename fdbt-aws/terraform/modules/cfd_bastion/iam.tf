resource "aws_iam_instance_profile" "bastion" {
  name = "fdbt-bastion-${var.stage}"
  role = aws_iam_role.bastion.name
}

resource "aws_iam_role" "bastion" {
  name               = "fdbt-bastion-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "ec2.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role_policy_attachment" "managed_ssm" {
  role       = aws_iam_role.bastion.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
