# Search logs

Application logs are all streamed into AWS CloudWatch logs where they can be searched through the console or through the CLI.

## Console

AWS CloudWatch Logs Insights provides a way to easily query large amounts of log data

- Navigate to the AWS console and assume a role into the target account (see [Access AWS](./access-aws.md))
- Navigate to the CloudWatch console and select Insights under Logs on the left hand side
- Select the log groups that you wish to search through in the dropdown
- The query language used can get quite complex but in most cases you will want to filter for a certain term such as ‘error’ which can be done with:

```
fields @timestamp, @message
| sort @timestamp desc
| filter @message like /error/
```

- The time period can be changed by selecting it in the top right

See [https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) for more detail on how to use Insights

## CLI

The easiest way to query logs via the CLI is to use [https://github.com/jorgebastida/awslogs](https://github.com/jorgebastida/awslogs) in conjunction with tools like grep.

- Install awslogs via the above link
- Assume a role into the target account in your shell (see [Access AWS](./access-aws.md))
- Query a log group by using `awslogs get` with the `-s` flag to define the start time and `-e` to define the end time, eg. `awslogs get fdbt-site-test -s1d` will get the logs for the past day in the site log group
- This can then be used with grep to query for a particular word or phrase, eg. `awslogs get fdbt-site-test -s1d | grep error` will retrieve all logs in the site log group over the past day that contain the word error
