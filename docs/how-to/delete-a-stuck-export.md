# Delete a "stuck" Export

## Overview

As part of the Export functionality, it is possible for exports to become "stuck" where one of the many files fail to be exported, which means the zip is never created and users are not able to download the file. This also means they are unable to trigger a new export, as the UI checks for any in progress jobs and as the one with a failure is marked as still in progress, the UI hides the create exports button.

## Steps

1. Find the NOC of the affected user, for example `ACKC`
1. Login to the AWS S3 Console or authenticate via the CLI into the desired environment either `test`/`preprod`/`prod`
1. Locate the `fdbt-matching-data-${environment}` bucket, when `environment` is `test`/`preprod`/`prod`
1. Locate any files in `${noc}/exports/${exportName}/`, where `noc` is the affected users NOC and `exportName` is `${noc}_${year}_${month}_${day}/` for example `ACKC_2022_01_01`
1. Delete all the files found within the export you want to clear
1. Login to the site, with your users `custom:noc` Cognito attribute including the affected NOC and on the page `/products/exports` ensure no in-progress jobs are listed and the button to create a new export is displayed
