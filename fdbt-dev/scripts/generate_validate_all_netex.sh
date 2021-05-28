#!/usr/bin/env bash

set -e

for filename in $FDBT_ROOT/fdbt-dev/data/matchingData/*.json; do
    $FDBT_ROOT/fdbt-dev/scripts/trigger_netex_convertor.sh $(basename "$filename" .json)
    $FDBT_ROOT/fdbt-dev/scripts/validate_latest_netex.sh
done
