module "vpc" {
  source = "../../modules/vpc"

  stage = local.stage
}
