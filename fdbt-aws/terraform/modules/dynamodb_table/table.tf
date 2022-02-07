resource "aws_dynamodb_table" "table" {
  hash_key       = var.table_hash_key
  name           = var.table_name
  range_key      = var.table_range_key
  billing_mode   = var.billing_mode
  stream_enabled = false

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  server_side_encryption {
    enabled = true
  }

  dynamic "attribute" {
    for_each = var.attributes

    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.secondary_index

    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      projection_type = global_secondary_index.value.projection_type
    }
  }
}
