# Site error page displaying for users

When a user has reported an error page showing for them, these are the general steps to take:

- Ask the user for the rough time in which they were using the site, and date.
- Ask the steps they took, in as much detail as possible, to getting to the error page, and if they can repeat it and get the same result.
- On AWS, find the CloudWatch log group for tfn-prod, and attempt to find the stack trace (see [Search logs](../how-to/search-logs.md) for detail on querying logs).
- If the issue is found to be due to a recent release, consider rolling back (see [Rolling back](../how-to/rollback-a-release.md))
