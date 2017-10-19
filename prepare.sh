#!/bin/bash

# Check if couchbase image already exists
docker inspect -f {{.State.Running}} couchbase_db >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo couchbase_db is already exists/running
  exit 1
fi

# Compose and start our image to a container
docker-compose up -d
sleep 10s

# Setup couchbase
curl -v -X POST http://localhost:8091/nodes/self/controller/settings \
             -d path=/opt/couchbase/var/lib/couchbase/data \
             -d index_path=/opt/couchbase/var/lib/couchbase/data

curl -v -X POST http://localhost:8091/settings/web \
             -d password=123465 \
             -d username=Administrator \
             -d port=8091

curl -u Administrator:123465 -v -X POST http://localhost:8091/pools/default/buckets \
             -d authType=sasl \
             -d saslPassword= \
             -d ramQuotaMB=300 \
             -d name=default \
             -d bucketType=membase

// Setup Index RAM Quota
curl -u Administrator:123465 -X POST http://localhost:8091/pools/default \
             -d memoryQuota=2000 \
             -d indexMemoryQuota=300





