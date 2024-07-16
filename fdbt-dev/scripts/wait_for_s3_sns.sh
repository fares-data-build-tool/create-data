#!/usr/bin/env bash

set -e

until awslocal s3 ls > /dev/null; do
    echo "Waiting for AWS S3 to come online"
    sleep 1
done

until awslocal sns list-topics > /dev/null; do
    echo "Waiting for AWS SNS to come online"
    sleep 1
done

echo "AWS S3 and SNS is online"
