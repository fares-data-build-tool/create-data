#!/usr/bin/env bash

function run_inline_sql_cmd() {
    docker exec -e MYSQL_PWD=${MYSQL_PWD} -i ${MYSQL_CONTAINER_NAME} mysql -u${MYSQL_USERNAME} -e "${1}"
}

MYSQL_USERNAME=root
MYSQL_PWD=root
MYSQL_CONTAINER_NAME="$(docker ps -af "name=mysql" --format='{{.Names}}')"

if [[ $? != 0 ]]; then
    echo "Failed to retrieve MySQL container name. Is it running?"
    exit 1
fi

until run_inline_sql_cmd "SHOW STATUS;"; do
    echo "Waiting for MySQL to come online"
    sleep 1
done

echo "MySQL is online"
