resource "aws_wafv2_web_acl" "global" {
  provider = aws.use1

  name        = "fdbt-global-${var.stage}"
  description = "fdbt-global-${var.stage}"
  scope       = "CLOUDFRONT"

  default_action {
    block {}
  }

  rule {
    name     = "BodySizeRestriction"
    priority = 0
    action {
      allow {}
    }
    statement {
      and_statement {
        statement {
          size_constraint_statement {
            comparison_operator = "LT"
            size                = 8192
            field_to_match {
              body {}
            }
            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
        statement {
          not_statement {
            statement {
              byte_match_statement {
                positional_constraint = "STARTS_WITH"
                search_string         = "/api/"
                field_to_match {
                  uri_path {}
                }
                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BodySize"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 2
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
        excluded_rule {
          name = "SizeRestrictions_BODY"
        }
        excluded_rule {
          name = "NoUserAgent_HEADER"
        }
        excluded_rule {
          name = "CrossSiteScripting_BODY"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # TODO Only in Test
  rule {
    name     = "AllowIw"
    priority = 10
    action {
      allow {
      }
    }
    statement {
      ip_set_reference_statement {
        arn = "arn:aws:wafv2:us-east-1:442445088537:global/ipset/IwIpSet/ac4c7704-f604-48c8-8eda-9506a86e2bd8" # TODO
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AllowIwRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  # TODO Only in Test
  rule {
    name     = "AllowCi"
    priority = 11
    action {
      allow {}
    }
    statement {
      ip_set_reference_statement {
        arn = "arn:aws:wafv2:us-east-1:442445088537:global/ipset/CiIpSet/957d3f63-3fd8-463e-be53-b03d936e0978" # TODO
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AllowCiRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  # TODO Only in Test
  rule {
    name     = "AllowPersonalUserIP"
    priority = 12
    action {
      allow {
      }
    }
    statement {
      ip_set_reference_statement {
        arn = "arn:aws:wafv2:us-east-1:442445088537:global/ipset/PersonalUserIpSet/f3491194-cebd-4709-9ac0-cec59b7ce018" # TODO
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AllowPersonalUserIPRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "RestrictAccessMetric"
    sampled_requests_enabled   = true
  }
}
