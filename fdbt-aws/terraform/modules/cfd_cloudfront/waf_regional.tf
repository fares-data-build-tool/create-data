resource "aws_wafv2_web_acl" "regional" {
  name        = "fdbt-global-${var.stage}"
  description = "fdbt-regional-${var.stage}"
  scope       = "REGIONAL"

  default_action {
    block {}
  }

  rule {
    name     = "AllowCloudfrontHeader"
    priority = 0
    action {
      allow {}
    }
    statement {
      byte_match_statement {
        positional_constraint = "EXACTLY"
        search_string         = "TODO" #TODO
        field_to_match {
          single_header {
            name = "x-origin-verify"
          }
        }
        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AllowCloudfrontHeaderMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "RestrictCloudfrontAccessMetric"
    sampled_requests_enabled   = true
  }
}
