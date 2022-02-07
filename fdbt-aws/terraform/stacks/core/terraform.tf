terraform {
  required_version = ">= 1.0.0"

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
    key            = "core.tfstate"
    dynamodb_table = "create-fares-data-terraform-locks"
    region         = "eu-west-2"
    encrypt        = true
    # role_arn       = "arn:aws:iam::000000000000:role/xxx"
  }
}
