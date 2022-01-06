# Release infrastructure changes

AWS resources are managed by AWS CloudFormation, any change will need to be done via updating the CloudFormation templates and running them into the environment.

## Change notice

Before making a change to the production infrastructure (CloudFormation, DB etc.), a ticket detailing the change will need to be created in the service management JIRA the working day before running in the change, this ticket should contain the following:

- Description
- Business Justification
- Proposed start/end date/time
- Impact to service
- Risk assessment
- Implementation plan
- Back out plan
- Test plan

## CloudFormation release process

Make sure to deploy changes to test and pre-prod first to make sure they work as intended

- Update the CloudFormation templates as necessary
- Log into the AWS console and assume a role into the target account (see [Access AWS](./access-aws.md)))
- Navigate to the CloudFormation console and select the stack to update
- Click ‘Update’ at the top right
- Click ‘Replace current template’ and then ‘Upload template file’, then select the template file from your computer and click ‘Next’
- The next page will ask for the stack parameters, make sure they are correct and click ‘Next’
- The next page is for configuring stack options but nothing should ever need to be changed here so click ‘Next’
- On this page, WAIT for the change preview to be created at the bottom before continuing, this is to make sure you are only changing the resources that you expect to. Making an incorrect change to CloudFormation can easily cause downtime so make sure everything has been tested on the test and pre-prod environments before releasing to production. It’s also best to do production changes in pairs for an extra pair of eyes.
- Click ‘Update stack’ to confirm and run in the change

## DB release process

- Write the SQL to run in the change and test it on your local DB to validate it first
- In your shell, assume a role into the target environment and run the DB tunnel script (see [Access the Database](./access-the-database.md))
- Access the DB using the MySQL CLI or your preferred GUI
- Run the SQL to make the change
- Verify that the change was successful
  As with CloudFormation changes, incorrect DB changes can cause downtime so make sure the SQL has been tested and run it in with someone else to be safe
