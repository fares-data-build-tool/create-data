#!/usr/bin/env bash

set -e

FILE_NAME=$1

EVENT_DATA=$(cat $FDBT_ROOT/fdbt-dev/data/s3Events/putEvent.json | sed s/KEY_HERE/$FILE_NAME.json/g)

cd $FDBT_ROOT/repos/fdbt-netex-output

NODE_ENV=development sls invoke local --stage dev -f NetexConvertor -d "$EVENT_DATA"
