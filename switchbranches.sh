#!/usr/bin/env bash


oldbranch=$(git rev-parse --abbrev-ref HEAD)

if [ "${oldbranch}" == "master" ]; then
  branchname=mysql
else
  branchname=master
fi

git checkout ${branchname}
cd ./auth-module
git checkout ${branchname}
cd ../router-module
git checkout ${branchname}
