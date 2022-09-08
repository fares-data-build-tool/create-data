#!/usr/bin/env bash

set -e

for i in $(ls -1 $FDBT_ROOT/fdbt-dev/sql/*.sql); do
    docker exec -i fdbt_mysql mysql -h127.0.0.1 -uroot -proot fdbt < $i 2>/dev/null
done

echo "Data reset complete"
