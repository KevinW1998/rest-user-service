#!/bin/bash

cd $(dirname "$0")

# Check if couchbase image already exists
docker inspect -f {{.State.Running}} couchbase_db >/dev/null 2>&1
if [ $? -eq 1 ]; then
  echo couchbase_db does not exist, running prepare.sh
  ./prepare.sh
else
  docker start couchbase_db
  sleep 10s
fi





