resource "aws_iam_policy" "ui" {
  count = local.stage == "test" ? 1 : 0

  name   = "fdbt-ui-tests-${local.stage}"
  policy = data.aws_iam_policy_document.ui[0].json
}

data "aws_iam_policy_document" "ui" {
  count = local.stage == "test" ? 1 : 0

  statement {
    effect = "Allow"

    actions = [
      "wafv2:UpdateIPSet",
      "wafv2:GetIPSet",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_user_policy_attachment" "ui" {
  count = local.stage == "test" ? 1 : 0

  user       = aws_iam_user.ui[0].name
  policy_arn = aws_iam_policy.ui[0].arn
}

resource "aws_iam_user" "ui" {
  count = local.stage == "test" ? 1 : 0

  name = "fdbt-ui-tests-user"

  tags = {
    "Type" = "AppID"
  }
}

resource "aws_iam_access_key" "ui" {
  count = local.stage == "test" ? 1 : 0

  user = aws_iam_user.ui[0].name
}
