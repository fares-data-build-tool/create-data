#!/usr/bin/env bash
# cleanup_ui_test_nocs.sh
# this script will cleanup all products generate by UI test NOCs from the database and S3 buckets

set -e
set -u
set -o pipefail

TEST_AWS_ACCOUNT_NUMBER="442445088537"
NOCS="BLAC LNUD TESTSE"

function main() {
if ! dependencies_available; then
  echo "Dependencies error:
you need to have installed: awscli, mysql client and jq"
  exit 1
fi

while true; do
    read -p "Do you wish to clean up data for NOCs: ${NOCS}?
**WARNING**: this deletion is permanent and S3 data is not covered by backups
Enter choice [Yes/No]: " yn
    case $yn in
        Yes ) break;;
        [Nn]* ) exit;;
        * ) echo "Please answer Yes or No.";;
    esac
done

if ! valid_aws_test_session_found; then
  echo "AWS Authentication error:
your shell session needs to authenticated to account: ${TEST_AWS_ACCOUNT_NUMBER}"
  exit 1
fi

if ! valid_database_test_session_found; then
  echo "Database connection error:
couldn't connect to database (cfd-bastion-tunnel), ensure a tunnel is running and credentials are correct"
  exit 1
else
  DATABASE_COMMAND="mysql -h 127.0.0.1 -P 13306 -u admin -p${MYSQL_PASSWORD} -D fdbt"
fi

for NOC in ${NOCS}; do
  echo "Cleaning up data for: ${NOC}"
  database_products_delete_by_noc ${NOC}
  s3_bucket_delete_prefix_by_noc fdbt-matching-data-test ${NOC}
  s3_bucket_delete_prefix_by_noc fdbt-netex-data-test ${NOC}
  s3_bucket_delete_prefix_by_noc fdbt-products-data-test ${NOC}
  s3_bucket_delete_prefix_by_noc fdbt-user-data-test ${NOC}
  echo
done

echo "Cleaned up data for: ${NOCS}"
exit 0
}

function dependencies_available() {
  command -v aws &> /dev/null
  command -v mysql &> /dev/null
  command -v jq &> /dev/null
}

function valid_aws_test_session_found() {
  aws whoami | grep ${TEST_AWS_ACCOUNT_NUMBER} &> /dev/null
}

function valid_database_test_session_found() {
  MYSQL_PASSWORD=$(aws ssm get-parameter --name fdbt-rds-root-password --with-decryption | jq -r .Parameter.Value)
  mysql -h 127.0.0.1 -P 13306 -u admin -p${MYSQL_PASSWORD} -D fdbt -e "select 1;" &>/dev/null
}

function database_products_delete_by_noc() {
  echo "deleting from products table for noc: $1"
  ${DATABASE_COMMAND} -e "DELETE FROM fdbt.products WHERE nocCode = '$1';" 2>/dev/null
}

function s3_bucket_delete_prefix_by_noc() {
  echo "deleting from bucket: $1 for noc: $2"
  aws s3 rm --recursive --only-show-errors s3://$1/$2
}

# execute the main function
main
