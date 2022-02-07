resource "aws_flow_log" "flowlogs" {
  iam_role_arn    = aws_iam_role.flowlogs.arn
  log_destination = aws_cloudwatch_log_group.flowlogs.arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.vpc.id
}

resource "aws_cloudwatch_log_group" "flowlogs" {
  name              = "/aws/vpc/${aws_vpc.vpc.id}"
  retention_in_days = var.log_retention_days
}

resource "aws_iam_role" "flowlogs" {
  name               = "fdbt-flowlogs-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["vpc-flow-logs.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "flowlogs" {
  name   = "fdbt-flowlogs-${var.stage}"
  role   = aws_iam_role.flowlogs.id
  policy = data.aws_iam_policy_document.flowlogs.json
}

data "aws_iam_policy_document" "flowlogs" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
    ]

    resources = [
      aws_cloudwatch_log_group.flowlogs.id
    ]
  }
}
