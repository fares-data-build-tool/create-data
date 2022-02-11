resource "aws_amplify_app" "admin" {
  name = "fdbtadmin"

  custom_rule {
    source = "</^((?!\\.(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$).)*$/>"
    status = "200"
    target = "/index.html"
  }

  environment_variables = {
    "_LIVE_PACKAGE_UPDATES" = jsonencode(
      [
        {
          pkg     = "@aws-amplify/cli"
          type    = "npm"
          version = "latest"
        },
      ]
    )
  }
}

resource "aws_amplify_backend_environment" "admin" {
  app_id               = aws_amplify_app.admin.id
  environment_name     = local.stage
  deployment_artifacts = "amplify-fdbtadmin-test-102939-deployment"
  stack_name           = "amplify-fdbtadmin-test-102939"
}

resource "aws_amplify_domain_association" "admin" {
  app_id                = aws_amplify_app.admin.id
  domain_name           = local.domain_name[local.stage]
  wait_for_verification = false

  sub_domain {
    branch_name = local.stage
    prefix      = "admin"
  }
}
