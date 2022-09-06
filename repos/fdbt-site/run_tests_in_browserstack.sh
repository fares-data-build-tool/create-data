#!/usr/bin/env bash

set -e
echo e
# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

# This script will update the WAF with the IP of the CI box and then run the tests on the required browser

update_ip_set() {
    IP=$(wget -qO- http://checkip.amazonaws.com)
    echo $IP
    echo $WAF_IPSET_NAME
    echo $WAF_IPSET_ID
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

echo "started"
sudo apt update
echo "apt updated"
sudo apt install jq unzip
echo "jq installed"

n=0

until [ "$n" -ge 5 ]; do
    echo "$n"
    update_ip_set && break
    n=$((n+1))
    sleep 5
done
echo "added ip's"

make install-cypress-deps-ci
echo "line 50"

make run-cypress-browserstack
echo "run cypress browserstacks"

cleanup_ip_set
echo "cleanup ip set"
