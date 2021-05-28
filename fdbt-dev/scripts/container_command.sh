#!/usr/bin/env bash

CONTAINER_SEARCH=$1
shift
COMMAND=$@

CONTAINER_ID=$(docker ps | grep ${CONTAINER_SEARCH} | awk '{print $1}')

set -f
docker exec -it ${CONTAINER_ID} ${COMMAND}
