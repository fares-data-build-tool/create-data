#!/usr/bin/env bash

set -e

FILE_NAME=$1
UNVALIDATED_NETEX_BUCKET=fdbt-unvalidated-netex-data-dev
MATCHING_DATA_BUCKET=fdbt-matching-data-dev

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s/KEY_HERE/$FILE_NAME.json/g | sed s/BUCKET_HERE/$MATCHING_DATA_BUCKET/g)

cd $FDBT_ROOT/repos/fdbt-netex-output/src/netex-emailer/

rm -rf build

NODE_ENV=development UNVALIDATED_NETEX_BUCKET=$UNVALIDATED_NETEX_BUCKET MATCHING_DATA_BUCKET=$MATCHING_DATA_BUCKET ts-node run-local.ts "$EVENT_DATA"

