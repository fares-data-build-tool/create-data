#!/usr/bin/env bash

set -e

FILE_NAME=$1
NETEX_BUCKET=fdbt-netex-data-dev
MATCHING_DATA_BUCKET=fdbt-matching-data-dev

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s:KEY_HERE:BLAC/$FILE_NAME.xml:g | sed s:BUCKET_HERE:$NETEX_BUCKET:g)

cd $FDBT_ROOT/repos/fdbt-netex-output/src/netex-emailer/

rm -rf build

NODE_ENV=development MATCHING_DATA_BUCKET=$MATCHING_DATA_BUCKET ts-node run-local.ts "$EVENT_DATA"

