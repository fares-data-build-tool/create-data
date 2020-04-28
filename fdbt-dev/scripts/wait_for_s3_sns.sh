#!/usr/bin/env bash

set -e

until curl --fail --silent -w "\n" http://localhost:4572 > /dev/null; do
    echo "Waiting for AWS S3 to come online"
    sleep 1
done

until curl --fail --silent -w "\n" http://localhost:4575 > /dev/null; do
    echo "Waiting for AWS SNS to come online"
    sleep 1
done

echo "AWS S3 and SNS is online"
