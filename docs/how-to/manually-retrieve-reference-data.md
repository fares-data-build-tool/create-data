# Manually retrieve reference data

Occasionally it may be necessary to manually trigger the process to pull down the reference data from the external sources (NOC, NaPTAN, TNDS). This may be due to a failure with the automated retrieval in the morning (which should throw an error in Slack) or for testing purposes.

Running this on prod will lead to a period where the data is not available in the database for the end users, this can lead to errors on the site or during NeTEx creation, this is only a period of a few seconds for NOC and NaPTAN data but TNDS retrieval can take 15 minutes and so this needs to be considered before running during business hours

- Navigate to the AWS console and assume a role into the account which you want to retrieve the data in (see [Access AWS](./access-aws.md))

- Navigate to the Lambda console and select the relevant retriever for the data you wish to manually retrieve (eg. `reference-data-service-retrievers-prod-NaptanRetriever`)
- In the ‘Code Source’ block, click the ‘Test’ dropdown and create a new test event
- Leave the default template and name the event whatever you want, the template doesn’t matter for this use case
- Save the test event
- Click the test button to trigger the manual retrieval
