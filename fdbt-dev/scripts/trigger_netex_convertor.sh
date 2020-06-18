#!/usr/bin/env bash

set -e

FILE_NAME=$1
BUCKET_NAME=fdbt-matching-data-dev
UNVALIDATED_NETEX_BUCKET=fdbt-unvalidated-netex-data-dev

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s/KEY_HERE/$FILE_NAME.json/g | sed s/BUCKET_HERE/$BUCKET_NAME/g)

cd $FDBT_ROOT/repos/fdbt-netex-output/src/netex-convertor

rm -rf build

NODE_ENV=development UNVALIDATED_NETEX_BUCKET=$UNVALIDATED_NETEX_BUCKET ts-node run-local.ts "$EVENT_DATA"
