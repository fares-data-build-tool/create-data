# FDBT Admin

The codebase for the Create Fares Data admin panel. The site is built using React with Amplify to interact with AWS services.

## Pre-requisites

* Node 12+
* AWS CLI
* [Amplify CLI](https://docs.amplify.aws/cli/start/install)

## Initial Setup for dev

* If using aws-vault, follow the instructions in 'Using aws-vault' below instead
* Run `npm install` to install necessary dependencies
* Retrieve the contents of the secret, `adminTeamProviderInfo`, from secrets manager in the core or test AWS account
* Create a file called `team-provider-info.json` in the root of the amplify folder and paste the above content into it
* Run `amplify init` to start init process
  * "Do you want to use an existing environment?": Yes
  * "Choose the environment you would like to use": test
  * "Choose your default editor": Preferred editor
  * "Do you want to use an AWS profile?": Yes
  * "Please choose the profile you want to use": Profile with correct privileges

## Using aws-vault

* When using aws-vault the required setup is slightly different, these instructions assume you have a valid aws-vault setup with necessary access to the AWS accounts
* Add a new profile to your AWS config file that looks like the following, where `PROFILE_NAME` is the name of the profile you normally use to access the target environment:

```
[profile amplify-{PROFILE_NAME}]
region=eu-west-2
output=json
credential_process=aws-vault exec {PROFILE_NAME} --json
```

* Run `npm install` to install necessary dependencies
* Retrieve the contents of the secret, `adminTeamProviderInfo`, from secrets manager in the core or test AWS account
* Create a file called `team-provider-info.json` in the root of the amplify folder and paste the above content into it
* Run `aws-vault exec {PROFILE_NAME} -- amplify init` to start init process
  * "Do you want to use an existing environment?": Yes
  * "Choose the environment you would like to use": test
  * "Choose your default editor": Preferred editor
  * "Do you want to use an AWS profile?": Yes
  * "Please choose the profile you want to use": Be careful to select the new profile you just added to the config file, ie. `amplify-{PROFILE_NAME}`

## Running site

* Run `npm start` to start the site on port `localhost:3000`

## Retrieving changes to the infrastructure

* To retrieve the latest changes to amplify, run `amplify pull`, make sure to do this before making pushing any other amplify changes

## Switching envs

* If you need to switch amplify envs to work against pre-prod or prod, this can be achieved by running `amplify env checkout {ENV}`

## Changes to amplify

* After making a change to amplify, either with `amplify add` or by changing the config file, this will need to be pushed up to AWS, make sure you are using the correct env and then run `amplify push`
* If you have made a change to the `team-provider-info.json` file then this will need to be updated in secrets manager as well
