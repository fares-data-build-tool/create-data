# NeTEx validation failures

**PREREQUISITES:** VScode xml validation feature turned on

NeTEx validation failures can happen locally or to the end users of the tool, users will not know the NeTEx failed validation but they will not receive the file. In almost all cases NeTEx validation failures will require investigation and a code change to resolve the issue.

## End User NeTEx validation failures

If a user reports not receiving their NeTEx or a validation failure alert is thrown in slack, this needs to be investigated, there are a couple of ways to approach this:

1. Look in the NeTEx Validator logs in CloudWatch to locate the error (see [Search logs](../how-to/search-logs.md))
1. Download the failed NeTEx file from the `fdbt-unvalidated-netex-data-prod` bucket, follow the details in the section below to then diagnose the issue (see [Accessing data in S3](../how-to/access-data-in-s3.md))

## Local NeTEx validation failures

When running the dev script to validate netex, and you notice there are validation issues, these are the steps to take next.

Use S3 local or the get-latest script to download the file, and open it in VScode.

You should then see the issues highlighted with the generated netex, the same as they were spat out on terminal when the validate command was run. It should be evident what the issue is, perhaps some formatting incorrect around the values ( $t: value ) or duplication of tags, or (most common) some references to ids which are not present in the xml. In this situation, we need to find out where those references and/or ids are set, and figure out why they were missing or a mismatch.

Another common issue is values not matching the enumeration. VScode is very helpful here, as it will tell you which values are allowed. We then need to make sure we use one.
