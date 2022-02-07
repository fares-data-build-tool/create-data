resource "aws_iam_policy" "ci" {
  name   = "fdbt-ci-${local.stage}"
  policy = data.aws_iam_policy_document.ci.json
}

data "aws_iam_policy_document" "ci" {
  statement {
    effect = "Allow"
    actions = [
      "s3:*",
      "logs:*",
      "cloudformation:*",
      "iam:*",
      "cloudwatch:*",
      "lambda:*",
      "acm:DescribeCertificate",
      "acm:GetCertificate",
      "acm:ListTagsForCertificate",
      "acm:ListCertificates",
      "events:*",
      "ecs:*",
      "ec2:*",
      "sns:*",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_group_policy_attachment" "ci" {
  group      = aws_iam_group.ci.name
  policy_arn = aws_iam_policy.ci.arn
}

resource "aws_iam_group" "ci" {
  name = "fdbt-ci-group"
}

resource "aws_iam_user" "ci" {
  name = "fdbt-ci-user"

  tags = {
    "Type" = "AppID"
  }
}

resource "aws_iam_user_group_membership" "ci" {
  user = aws_iam_user.ci.name

  groups = [
    aws_iam_group.ci.name,
  ]
}

resource "aws_iam_access_key" "ci" {
  user = aws_iam_user.ci.name
}
