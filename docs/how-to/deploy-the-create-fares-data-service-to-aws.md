# Deploy the Create Fares Data Service in AWS

## Create AWS Account

- Navigate through the create AWS account flow, naming it appropriately and using the correct email address, create a password and store this in vault
- At the billing step, quit out and navigate to the console, you will be logged in but won’t be able to provision any resources
- Work with the IW IT Systems team to have the new account added to the IW Organisation, this will allow the use of consolidated billing
- Navigate back to the create account flow and you should be taken to the choose support plan page, select basic and this should complete the create account process. Navigate to the EC2 page to confirm you can now get there.
- Enable MFA for the root user and store the MFA code in vault
- Run in the service `iam.yml` CloudFormation template from the `tfn-aws` repo to create the necessary roles to assume from the core account
- Update the core `iam.yml` template to allow any users or groups to assume the roles created in the previous step and run that in to the `tfn-core` account
- Update any ECR repositories so the new account has permission to pull down the images
- Test assuming the role in the new account from the core account

## Deploy Infrastructure

- Deploy the CF templates in the following order in eu-west-2:
  - `iam.yml` as `FDBT-IAM` (this should have been deployed in the previous step when setting up the AWS account)
    - This will create all of the necessary roles and groups for users and services
  - `route53.yml` as `FDBT-Route53`
    - This will create the necessary hosted zone
  - `acm.yml` as `FDBT-ACM`
    - If there is a certificate that needs to be validated externally (eg. by DfT), the certificate should be generated outside of CloudFormation due to limitations on the time taken for validation
    - This will setup the ACM certificate
    - The stack deployment for ACM will pause until the DNS validation has been successful so you will need to add the necessary CNAME to Route53 before the stack deployment is successful
  - `s3.yml` as `FDBT-S3`
    - This will create the buckets for the user data and for static files
  - `alerts.yml` as `FDBT-Alerts`
    - This will setup the Lambda and SNS topic for sending Slack alerts
- Before the deploying the rest of the CloudFormation stacks, SES needs to be configured, do all of the following in eu-west-1:
  - If necessary for the environment, move out of the SES sandbox by following [https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html)
  - Verify the email address that is needed to send cognito emails (registration, change password etc.)
- Run in the rest of the CF stacks in the following order, passing in the relevant parameter values, in eu-west-2:
  - `cognito.yml` as `FDBT-Cognito`
    - This will create the necessary Cognito User Pool
  - `vpc.yml` as `FDBT-VPC`
    - This will setup the VPC with the necessary subnets for the Fargate tasks and the DB
  - `rds.yml` as `FDBT-RDS`
    - This will create the MySQL RDS instance
    - Store the root password in vault
- Connect to the Database using the username and password used in the CF Stack
  - Run in the SQL found in the AWS repo in the order given in the folder
  - When running in the user SQL, generate a password for each of the user types and add them to parameter store in the next step
- Set the necessary parameters in SSM parameter store as SecureString types, this includes:
  - `fdbt-cognito-client-secret` - The value of the app client secret which can be found in Cognito
  - `fdbt-tnds-ftp-username` - Username for the TNDS FTP Server
  - `fdbt-tnds-ftp-password` - Password for the TNDS FTP Server
  - `fdbt-rds-netex-output-username` - MySQL username for the NeTEx Output Service
  - `fdbt-rds-netex-output-password` - MySQL password for the NeTEx Output Service
  - `fdbt-rds-reference-data-username` - MySQL username for the Reference Data Service
  - `fdbt-rds-reference-data-password` - MySQL password for the Reference Data Service
  - `fdbt-rds-site-username` - MySQL username for the Site
  - `fdbt-rds-site-password` - MySQL password for the Site
- Run in the following CF Stacks:
  - `fargate.yml` as `FDBT-Fargate`
    - This will setup Fargate with an ALB
  - `waf.yml` as `FDBT-WAF`
    - This will setup the Web ACL and IP Sets (on test) and associate them with the ALB
  - `dynamo.yml` as `FDBT-DynamoDB`
    - This will create the dynamo table for storing sessions

## Setup Pipelines

- Create an access key for the ci user in AWS, take not of the access key id and secret
- Create a new context in CircleCI for the environment, this should contain the following environment variables:

| Name                  | Value                                         |
| --------------------- | --------------------------------------------- |
| AWS_ACCESS_KEY_ID     | Access key generated for the AWS user above   |
| AWS_SECRET_ACCESS_KEY | Secret generated for the AWS user above       |
| AWS_REGION            | AWS region to deploy into (default eu-west-2) |
| AWS_DEFAULT_REGION    | Same as above                                 |
| SITE_ECS_CLUSTER      | Name of the ECS cluster                       |
| SITE_ECS_FAMILY       | Name of the ECS task definition               |

- Update the Circle workflows to account for the new environment

## Setup Route53

- Navigate to the Route53 console and add a new A record with the correct domain name and alias it to the load balancer brought up in the previous step.
- Do this for the monitoring domain as well
- If an external domain is being used, then send the target alb domain to the relevant party to have this updated on their side
- Test that the site can be accessed on the domain.

## Setup Monitoring

- Navigate to the monitoring site
- The first time navigating to the site the credentials will be admin/admin
- Create a new password and store in vault in an appropriate place
- Setup the data source for CloudWatch by using the credential file mode and setting the default region correctly
- Import all dashboards if they exist in another environment or create new ones
