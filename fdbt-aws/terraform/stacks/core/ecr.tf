resource "aws_ecr_repository" "site" {
  name                 = "fdbt-site"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository_policy" "site" {
  repository = aws_ecr_repository.site.name
  policy     = data.aws_iam_policy_document.site.json
}

data "aws_iam_policy_document" "site" {
  statement {
    sid    = "AllowCrossAccountPull"
    effect = "Allow"

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:DescribeImageScanFindings",
      "ecr:GetDownloadUrlForLayer",
    ]

    principals {
      type = "AWS"

      identifiers = [
        "arn:aws:iam::077142786865:root",
        "arn:aws:iam::154232459932:root",
        "arn:aws:iam::442445088537:root",
      ]
    }
  }
}
