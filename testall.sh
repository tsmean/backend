#!/usr/bin/env bash

for modulename in auth dbadapter main mongo mysql router
do
  cd ./${modulename}-module/
  echo "Running tests for ${modulename}-module"
  $(npm bin)/mocha --reporter spec --timeout 15000  --compilers ts:ts-node/register 'src/**/*.test.ts'
  cd ..
done
