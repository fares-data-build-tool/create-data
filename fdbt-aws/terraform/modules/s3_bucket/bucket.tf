resource "aws_s3_bucket" "bucket" {
  bucket        = var.name
  acl           = var.s3_acl
  force_destroy = var.s3_force_destroy_bucket

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  versioning {
    enabled = var.versioning_enabled
  }

  dynamic "logging" {
    for_each = var.s3_logging_enabled ? [var.name] : []

    content {
      target_bucket = var.s3_logging_bucket_name
      target_prefix = "${var.name}/"
    }
  }
}
