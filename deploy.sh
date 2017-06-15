#!/usr/bin/env bash
server="ubuntu@52.59.71.133"

if [ "${1}" == "test" ]; then
  rootdir="tsmean/testbe"
else
  rootdir="tsmean/be"
fi

# Setup server (Debian / Ubuntu assumed)
# ssh ${server} curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
# ssh ${server} sudo apt-get install -y nodejs
# ssh ${server} sudo npm install -g typescript
# ssh ${server} sudo npm install -g yarn

# Those are the same steps for production & test setup
echo "Remove old test directory"
ssh ${server} "rm -rf ${rootdir}"

echo "Upload source"
ssh ${server} "mkdir ${rootdir}"
scp -r src "${server}:${rootdir}/src"
scp package.json "${server}:${rootdir}/package.json"
scp yarn.lock "${server}:${rootdir}/yarn.lock"
scp tsconfig.json "${server}:${rootdir}/tsconfig.json"
scp -r properties "${server}:${rootdir}/properties"

echo "Install packages on server"
ssh ${server} "cd ${rootdir} && yarn install"

echo "Compiling sources"
ssh ${server} "cd ${rootdir} && tsc"


# Special logic for test setup
if [ "${1}" == "test" ]; then
  echo "Run tests"
  ssh ${server} "cd ${rootdir} && npm test"
else
  echo "(Re-)Start server"
  ssh ${server} "forever stop ${rootdir}/dist/index.js"
  ssh ${server} "forever start ${rootdir}/dist/index.js"
fi

echo "Done!"
