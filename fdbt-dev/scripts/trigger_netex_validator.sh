#!/usr/bin/env bash

set -e

FILE_NAME=$1
BUCKET_NAME=fdbt-unvalidated-netex-data-dev

echo "Starting validation of $FILE_NAME..."

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s:KEY_HERE:$FILE_NAME:g | sed s:BUCKET_HERE:$BUCKET_NAME:g)

cd $FDBT_ROOT/repos/fdbt-netex-output/src/netex-validator

EVENT_DATA=$EVENT_DATA npm run triggerNetexValidator
