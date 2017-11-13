#!/bin/bash

# Check if couchbase image already exists
if [ `docker inspect -f {{.State.Running}} couchbase_db 2> /dev/null` == "true" ]; then
  docker stop couchbase_db  
else
  echo cannot stop couchbase_db, does it actually run?
fi





