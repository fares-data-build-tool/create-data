resource "aws_cognito_user_pool" "user_pool" {
  name = "fdbt-user-pool-${var.stage}"

  username_attributes = [
    "email"
  ]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
    source_arn            = "arn:aws:ses:eu-west-1:442445088537:identity/create-fares-data@infinityworks.com" # TODO
  }

  lambda_config {
    custom_message = aws_lambda_function.cognito_custom_emails.arn
  }

  username_configuration {
    case_sensitive = false
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = false
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "contactable"
    required                 = false

    string_attribute_constraints {
      max_length = "3"
      min_length = "2"
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "noc"
    required                 = false

    string_attribute_constraints {
      max_length = "256"
      min_length = "1"
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "schemeOperator"
    required                 = false

    string_attribute_constraints {
      max_length = "256"
      min_length = "1"
    }
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "schemeRegionCode"
    required                 = false

    string_attribute_constraints {
      max_length = "2"
      min_length = "1"
    }
  }
}

resource "aws_cognito_user_pool_client" "site" {
  name                   = "fdbt-site-client-${var.stage}"
  user_pool_id           = aws_cognito_user_pool.user_pool.id
  refresh_token_validity = 1
  access_token_validity  = 20
  id_token_validity      = 20

  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]

  read_attributes = [
    "custom:noc",
    "custom:schemeOperator",
    "custom:schemeRegionCode",
    "email",
    "email_verified",
  ]

  write_attributes = [
    "custom:noc",
    "custom:schemeOperator",
    "custom:schemeRegionCode",
    "email",
    "custom:contactable",
  ]

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}
