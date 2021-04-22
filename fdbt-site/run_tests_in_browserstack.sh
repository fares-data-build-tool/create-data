#!/usr/bin/env bash

set -e

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

# This script will update the WAF with the IP of the CI box and then run the tests on the required browser

update_ip_set() {
    IP=$(wget -qO- http://checkip.amazonaws.com)
    LOCK_TOKEN=$(aws wafv2 get-ip-set --scope CLOUDFRONT --region us-east-1 --name $WAF_IPSET_NAME --id $WAF_IPSET_ID | jq .LockToken | tr -d '"')
    NEXT_LOCK_TOKEN=$(aws wafv2 update-ip-set --scope CLOUDFRONT --region us-east-1 --name $WAF_IPSET_NAME --id $WAF_IPSET_ID --addresses $IP/32 --lock-token $LOCK_TOKEN 2>/dev/null | jq .NextLockToken | tr -d '"')

    if [ -z "$NEXT_LOCK_TOKEN" ]; then
        return 1
    fi
}

cleanup_ip_set() {
    LOCK_TOKEN=$(aws wafv2 get-ip-set --scope CLOUDFRONT --region us-east-1 --name $WAF_IPSET_NAME --id $WAF_IPSET_ID | jq .LockToken | tr -d '"')
    aws wafv2 update-ip-set --scope CLOUDFRONT --region us-east-1 --name $WAF_IPSET_NAME --id $WAF_IPSET_ID --addresses --lock-token $LOCK_TOKEN
}

sudo apt update
sudo apt install jq unzip

n=0

until [ "$n" -ge 5 ]; do
    update_ip_set && break
    n=$((n+1))
    sleep 5
done

make install-cypress-deps-ci

make run-cypress-browserstack

cleanup_ip_set
