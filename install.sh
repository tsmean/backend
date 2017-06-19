#!/usr/bin/env bash

git submodule init
git submodule update

for modulename in auth dbadapter main mongo mysql router
do
  cd ./${modulename}-module/
  yarn install
  tsc
  cd ..
done
