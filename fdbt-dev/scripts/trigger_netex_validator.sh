#!/usr/bin/env bash

set -e

BUCKET_NAME=$1
FILE_NAME=$2

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s/KEY_HERE/$FILE_NAME.xml/g | sed s/BUCKET_HERE/$BUCKET_NAME/g)

cd $FDBT_ROOT/repos/fdbt-netex-output/src/netex-validator

ENV=development sls invoke local --stage dev -f NetexValidator -d "$EVENT_DATA"
