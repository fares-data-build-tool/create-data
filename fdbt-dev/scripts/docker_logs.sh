#!/usr/bin/env bash

CONTAINER_NAME=$1
CONTAINER_ID=$(docker ps -a | grep -m1 ${CONTAINER_NAME} | awk '{print $1}')

docker logs --tail 200 -f ${CONTAINER_ID} |
sed --unbuffered \
-e 's/\(.*NOTICE.*\)/\o033[32m\1\o033[39m/i' \
-e 's/\(.*WARN.*\)/\o033[33m\1\o033[39m/i' \
-e 's/\(.*ERR.*\)/\o033[31m\1\o033[39m/i'
