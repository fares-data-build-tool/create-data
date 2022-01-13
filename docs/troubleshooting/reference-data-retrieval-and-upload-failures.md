# Reference data retrieval and upload failures

## Retrieval error

Errors with the reference data retrievers should throw an error in Slack. In the majority of cases this is due to an issue with the source not being available at the time of the retrievers running.

If a retriever fails to run then it should not impact the site, it will just mean the data is slightly out of date until the retriever next runs but the data does not change frequently enough for this to be an issue.

To diagnose the error look at the logs for the retriever that has thrown the error (see [Search logs](../how-to/search-logs.md)).

### Diagnosing

- Look at the logs for the retriever that has thrown the error (see [Search logs](../how-to/search-logs.md)).

### Possible reasons

- Issue with data source

- AWS error

### Resolutions

- Manually re-run the retriever [Manually retrieve reference data](../how-to/manually-retrieve-reference-data.md)
- Wait for the automated run the next day if not an emergency

## NOC / NaPTAN Uploader error

If the NOC or NaPTAN uploader fails then the database may be in an inconsistent state since the data is cleared down before the uploader runs.

### Diagnosing

- Look at the logs for the uploader that has thrown the error (see [Search logs](../how-to/search-logs.md)).
- Look at the structure of the data to make sure nothing has changed since the previous successful run.
- Look at Grafana dashboards for Lambda and RDS to check for any abnormal CPU or memory usage

### Possible reasons

- Issue with structure of retrieved data
- AWS error
- Increased DB CPU or memory usage

## XML Uploader error

The XML (TNDS) uploader runs for each individual file (1 file per service) so if it only fails for a few files then the service will remain operational for the vast majority of users.

In most cases an XML Uploader error is due to an invalid TNDS file being uploaded. There is nothing that can be done about this on our side, if it is causing an issue then it will need to be escalated to DfT.

Due to the number of TNDS files that are processed, the uploader lambda is throttled to 20 concurrent executions to prevent overloading the database, if the issue is not due to an invalid TNDS file then it is worth checking monitoring for the DB to see CPU and memory utilisation.

### Diagnosing

- Look at the logs for the XML Uploader that has thrown the error (see [Search logs](../how-to/search-logs.md)).
- Look at Grafana dashboards for Lambda and RDS to check for any abnormal CPU or memory usage

### Possible reasons

- Issue with structure of retrieved data
- AWS error
- Increased DB CPU or memory usage
