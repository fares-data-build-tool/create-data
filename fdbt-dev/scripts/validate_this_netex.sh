#!/usr/bin/env bash

set -e
set -u

FILE=$1

EDGE_PORT=4572 awslocal s3 cp $FILE s3://fdbt-unvalidated-netex-data-dev

BUCKET_NAME=fdbt-unvalidated-netex-data-dev

FILENAME=$(EDGE_PORT=4572 awslocal s3 ls s3://$BUCKET_NAME --recursive | sort | tail -n 1 | awk '{print $4}')

$FDBT_ROOT/fdbt-dev/scripts/trigger_netex_validator.sh $FILENAME