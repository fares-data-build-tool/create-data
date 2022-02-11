terraform {
  required_version = ">= 1.1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "eu-west-2"

  default_tags {
    tags = local.tags
  }
}

terraform {
  backend "s3" {
    bucket         = "create-fares-data-terraform-state"
    key            = "account.tfstate"
    dynamodb_table = "create-fares-data-terraform-state"
    region         = "eu-west-2"
    encrypt        = true
    role_arn       = "arn:aws:iam::827855331226:role/TerraformState"
  }
}
