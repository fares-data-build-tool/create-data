# fdbt-aws

This repo contains the following:

- The CloudFormation templates necessary to deploy the Fares Data Build Tool in AWS
- The SQL to create the necessary tables in RDS
- Some helper scripts to assume roles into the accounts and to tunnel through to the database using the bastion host

## Running in CloudFormation

The CloudFormation templates have dependencies on each other and therefore need to be applied in a particular order, first in a central account apply the cloudformation in the core folder:

- iam.yml
- s3.yml

Then in each service account you wish to deploy the tool into, run in the following:

- iam.yml
- s3.yml
- alerts.yml
- vpc.yml
- acm.yml (You will need to perform the DNS validation for the certificate before this stack will finish deploying)
- fargate.yml
- waf.yml (optional to restrict access to the ALB)
- rds.yml
- dynamo.yml

## Running helper scripts

Requirements:

- [awsume](https://awsu.me/general/quickstart.html)

AWSume is used to authenticate against the AWS environments, follow the above link to get it running. You will need to assume a role into the target account before running the scripts in this repo
