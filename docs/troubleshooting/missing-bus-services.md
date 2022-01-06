# Missing bus services

Users may report that their desired bus service is not available in the tool, this can be due to a number of reasons.

## Possible Causes

- TNDS retriever or uploader failure during the daily run (see [Reference data retrieval / upload failure](./reference-data-retrieval-and-upload-failures.md))
- Service not in TNDS - The tool does not currently support non-TNDS transXChange, this will need to be reported to the user
- User added with incorrect NOC - Double check that the NOC stored in Cognito matches the user’s requested NOC
- DB query error - Check the site logs for any errors that may have occurred during the query [Search logs](../how-to/search-logs.md)
