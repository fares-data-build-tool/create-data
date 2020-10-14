#!/usr/bin/env bash

set -e

convert_and_validate() {
    local filename=$1
    basename=$(basename "$filename" .json)
    $FDBT_ROOT/fdbt-dev/scripts/trigger_netex_convertor.sh $basename
    $FDBT_ROOT/fdbt-dev/scripts/trigger_netex_validator.sh "BLAC/$basename.xml"
}

for filename in $FDBT_ROOT/fdbt-dev/data/matchingData/*.json; do
    convert_and_validate $filename &
done
