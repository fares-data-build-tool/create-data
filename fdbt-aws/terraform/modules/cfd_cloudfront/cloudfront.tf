resource "aws_cloudfront_distribution" "site" {
  comment         = "fdbt-site-${var.stage}"
  aliases         = ["test.dft-cfd.com"] # TODO
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100"
  web_acl_id      = aws_wafv2_web_acl.global.id

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 400
    response_code         = 404
    response_page_path    = "/error/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 403
    response_code         = 404
    response_page_path    = "/error/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 500
    response_code         = 500
    response_page_path    = "/error/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 501
    response_code         = 501
    response_page_path    = "/error/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 502
    response_code         = 502
    response_page_path    = "/error/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 503
    response_code         = 503
    response_page_path    = "/error/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 60
    error_code            = 504
    response_code         = 504
    response_page_path    = "/error/index.html"
  }

  default_cache_behavior {
    cache_policy_id          = aws_cloudfront_cache_policy.site.id
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3" # TODO Managed-AllViewer
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "AlbOrigin"
    viewer_protocol_policy   = "redirect-to-https"
    min_ttl                  = 0
    default_ttl              = 0
    max_ttl                  = 0
    compress                 = true
  }

  ordered_cache_behavior {
    cache_policy_id        = aws_cloudfront_cache_policy.error.id
    path_pattern           = "/error/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "ErrorOrigin"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    lambda_function_association {
      event_type   = "origin-response"
      include_body = false
      lambda_arn   = "arn:aws:lambda:us-east-1:442445088537:function:security-headers-edge-lambda-test:6" #TODO
    }
  }

  ordered_cache_behavior {
    cache_policy_id          = aws_cloudfront_cache_policy.assets.id
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3" # TODO Managed-AllViewer
    path_pattern             = "/assets/*"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "AlbOrigin"
    min_ttl                  = 0
    default_ttl              = 0
    max_ttl                  = 0
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"
  }

  ordered_cache_behavior {
    cache_policy_id          = aws_cloudfront_cache_policy.assets.id
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3" # TODO Managed-AllViewer
    path_pattern             = "/_next/static/*"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "AlbOrigin"
    min_ttl                  = 0
    default_ttl              = 0
    max_ttl                  = 0
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"
  }

  ordered_cache_behavior {
    cache_policy_id          = aws_cloudfront_cache_policy.assets.id
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3" # TODO Managed-AllViewer
    path_pattern             = "/scripts/*"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "AlbOrigin"
    min_ttl                  = 0
    default_ttl              = 0
    max_ttl                  = 0
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"
  }

  origin {
    origin_id           = "AlbOrigin"
    domain_name         = "FDBT-Publi-15WTO2TET4UZC-1641913309.eu-west-2.elb.amazonaws.com" #TODO
    connection_attempts = 3
    connection_timeout  = 10

    custom_header {
      name  = "X-Origin-Verify"
      value = "TODO" # TODO
    }

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "https-only"
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1.2"]
    }
  }

  origin {
    origin_id           = "ErrorOrigin"
    domain_name         = "fdbt-error-page-test.s3.amazonaws.com" #TODO
    connection_attempts = 3
    connection_timeout  = 10

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/E33EM905H564IQ" #TODO
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "fdbt-site-${var.stage}"
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:442445088537:certificate/ad0dd416-276e-40af-9938-f36a002dbf71" #TODO
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_cloudfront_cache_policy" "site" {
  name        = "fdbt-site-${var.stage}"
  comment     = "fdbt-site-${var.stage}"
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip = true

    cookies_config {
      cookie_behavior = "all"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

resource "aws_cloudfront_cache_policy" "error" {
  name        = "fdbt-error-${var.stage}"
  comment     = "fdbt-error-${var.stage}"
  default_ttl = 31536000
  max_ttl     = 31536000
  min_ttl     = 31536000

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_gzip = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "assets" {
  name        = "fdbt-assets-${var.stage}"
  comment     = "fdbt-assets-${var.stage}"
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "error_page" {
  comment = "error_page"
}
