#!/usr/bin/env bash

set -e

BUCKET_NAME=$1

FILE=$(awslocal s3 ls s3://$BUCKET_NAME --recursive | sort | tail -n 1 | awk '{print $4}')

./scripts/trigger_netex_validator.sh $BUCKET_NAME $FILE
