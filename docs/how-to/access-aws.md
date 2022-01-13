# Access AWS

Helper scripts for AWS can be found in the `fdbt-aws` directory.

## Requirements

- AWS CLI
  - [cli-chap-install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- Python 3.5 or greater
  - [Getting Started](../guides/getting-started.md#install-upgrade-python)
- `aws-azure-login`
  - [configure-aws-config](https://handbook.infinityworks.com/tools/aws#configure-aws-config)
- AWS CLI Session Manager Plugin
  - [session-manager-working-with-install-plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)

## Getting an AWS account

AWS SSO is currently used to access the four AWS accounts, an Admin can add your corporate account to the required groups to grant you access to each of the accounts as required.

## Accessing AWS (Console)

Four SSO links will be shared with you, one for each AWS Account, upon SSO login you will be able to select your desired role if multiple are available to you.

## Accessing AWS (CLI)

To use the CLI we advise using the [aws-azure-login](https://github.com/sportradar/aws-azure-login) tool

### Install AWS CLI

[https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

### Install aws-azure-login

See the [installation instructions here](https://github.com/sportradar/aws-azure-login#installation)

### Config setup

Add the following to your `~/.aws/config` file, updating the `azure_tenant_id`, `azure_app_id_uri`, `azure_default_username` and `azure_default_role_arn`:

```
[profile fdbt-core]
region=eu-west-2
azure_tenant_id=00000000-0000-0000-0000-000000000000
azure_app_id_uri=00000000-0000-0000-0000-000000000000
azure_default_username=email@example.com
azure_default_role_arn=arn:aws:iam::827855331226:role/ExampleRole
azure_default_duration_hours=1
azure_default_remember_me=true

[profile fdbt-test]
region=eu-west-2
azure_tenant_id=00000000-0000-0000-0000-000000000000
azure_app_id_uri=00000000-0000-0000-0000-000000000000
azure_default_username=email@example.com
azure_default_role_arn=arn:aws:iam::442445088537:role/ExampleRole
azure_default_duration_hours=1
azure_default_remember_me=true

[profile fdbt-preprod]
region=eu-west-2
azure_tenant_id=00000000-0000-0000-0000-000000000000
azure_app_id_uri=00000000-0000-0000-0000-000000000000
azure_default_username=email@example.com
azure_default_role_arn=arn:aws:iam::077142786865:role/ExampleRole
azure_default_duration_hours=1
azure_default_remember_me=true

[profile fdbt-prod]
region=eu-west-2
azure_tenant_id=00000000-0000-0000-0000-000000000000
azure_app_id_uri=00000000-0000-0000-0000-000000000000
azure_default_username=email@example.com
azure_default_role_arn=arn:aws:iam::154232459932:role/ExampleRole
azure_default_duration_hours=1
azure_default_remember_me=true
```
