#!/usr/bin/env bash

set -e

FILE_NAME=$1
BUCKET_NAME=fdbt-matching-data-dev
UNVALIDATED_NETEX_BUCKET=fdbt-unvalidated-netex-data-dev

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s:KEY_HERE:BLAC/$FILE_NAME.json:g | sed s:BUCKET_HERE:$BUCKET_NAME:g)

cd $FDBT_ROOT/repos/fdbt-netex-output

rm -rf src/netex-convertor/build

EVENT_DATA=$EVENT_DATA UNVALIDATED_NETEX_BUCKET=$UNVALIDATED_NETEX_BUCKET npm run netexConvert
