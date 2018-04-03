#!/bin/bash

# Check if couchbase image already exists
docker inspect -f {{.State.Running}} couchbase_db >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo couchbase_db is already exists/running
  exit 1
fi

# Compose and start our image to a container
docker-compose up -d
sleep 30s

# Setup couchbase
# // Setup Services
curl -u Administrator:123465 -v -X POST http://127.0.0.1:8091/node/controller/setupServices \
             -d 'services=kv%2Cn1ql%2Cindex'

curl -u Administrator:123465 http://127.0.0.1:8091/settings/indexes -v -X POST \
             -d "storageMode=memory_optimized"

curl -v -X POST http://127.0.0.1:8091/nodes/self/controller/settings \
             -d path=/opt/couchbase/var/lib/couchbase/data \
             -d index_path=/opt/couchbase/var/lib/couchbase/data

curl -v -X POST http://127.0.0.1:8091/settings/web \
             -d password=123465 \
             -d username=Administrator \
             -d port=8091

curl -u Administrator:123465 -v -X POST http://127.0.0.1:8091/pools/default/buckets \
             -d authType=sasl \
             -d saslPassword= \
             -d ramQuotaMB=300 \
             -d flushEnabled=1 \
             -d name=default \
             -d bucketType=couchbase

# // Setup Index RAM Quota
curl -u Administrator:123465 -X POST http://127.0.0.1:8091/pools/default \
             -d memoryQuota=2000 \
             -d indexMemoryQuota=300


sleep 5s




