#!/usr/bin/env bash

set -e

for i in $(ls -1 $FDBT_ROOT/fdbt-aws/sql/*.sql); do
    removed_s3=$(sed 's/, LOAD FROM S3//g' $i)
    updated_password=$(echo $removed_s3 | sed 's/<INSERT PASSWORD>/password/g')
    mysql -h127.0.0.1 -uroot -proot fdbt -e "$updated_password" 2>/dev/null
done

echo "Tables and users created"
