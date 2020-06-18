#!/usr/bin/env bash

set -e

BUCKET_NAME=fdbt-unvalidated-netex-data-dev

FILE=$(awslocal s3 ls s3://$BUCKET_NAME --recursive | sort | tail -n 1 | awk '{print $4}')

$FDBT_ROOT/fdbt-dev/scripts/trigger_netex_validator.sh $FILE
