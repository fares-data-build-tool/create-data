# tfn-aws

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

## Running helper scripts

Requirements:

- AWS CLI
- AWS CLI Session Manager Plugin
- jq

In order to use the helper scripts, you will first need to set some env vars in your bashrc or zshrc:

```bash
 export TFN_CORE_ACCOUNT_ID=ID_HERE
 export TFN_TEST_ACCOUNT_ID=ID_HERE
 export TFN_PREPROD_ACCOUNT_ID=ID_HERE
```

After adding these you will be able to run the `awstfn-mfa` script:

```bash
. ./awstfn-mfa {ACCOUNT_NAME} {AWS_IAM_USERNAME}
```

The script will ask for your MFA code, after entering it you will have assumed the role into the target account.

After assuming this role you will be able to run the bastion tunnel script:

```bash
./tfn-bastion-tunnel
```
