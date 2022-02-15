# Clean Up the UI Test NOCs

## Overview

As part of the UI Tests, test products and data are generated for a set of NOCs. These are not cleaned up by the steps and eventually result in so many Products that it isn't representative of real world usage. Therefore we need to clean up the affected NOCs every so often.

## Steps

- With an authenticated AWS CLI session [see Access AWS](./access-aws.md)
- [Start a Database Tunnel](./access-the-database.md)
- Execute the script: `fdbt-dev/scripts/cleanup_ui_test_nocs.sh`
- Confirm you're happy to clear out the data: enter `Yes` then press return
- Wait for the script to finish with message: `"Cleaned up data for: <list of NOCs>"`
