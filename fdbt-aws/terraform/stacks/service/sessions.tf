module "site_session_storage" {
  source = "../../modules/dynamodb_table"

  # we would never want to restore user sessions
  point_in_time_recovery_enabled = false

  table_name     = "sessions"
  table_hash_key = "id"

  attributes = [
    {
      name = "id"
      type = "S"
    }
  ]
}
