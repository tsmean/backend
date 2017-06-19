#!/usr/bin/env bash
server="ubuntu@52.59.71.133"

if [ "${1}" == "test" ]; then
  rootdir="tsmean/testbe"
else
  rootdir="tsmean/be"
fi

# Setup server (Debian / Ubuntu assumed)
# ssh ${server} sudo apt-get install git
# ssh ${server} curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
# ssh ${server} sudo apt-get install -y nodejs
# ssh ${server} sudo npm install -g typescript
# ssh ${server} sudo npm install -g forever
# ssh ${server} sudo npm install -g yarn

# Those are the same steps for production & test setup
echo "Remove old test directory"
ssh ${server} "rm -rf ${rootdir}"

echo "Pull from github"
ssh ${server} "git clone https://github.com/bersling/typescript-mongo-express-node-seed ${rootdir}"

echo "Install"
ssh ${server} "cd ${rootdir} && npm run install"

# Special logic for test setup
if [ "${1}" == "test" ]; then
  echo "Run tests"
  ssh ${server} "cd ${rootdir} && npm test"
else
  echo "(Re-)Start server"
  ssh ${server} "forever stop ${rootdir}/dist/index.js"
  ssh ${server} "forever start ${rootdir}/dist/index.js"
fi

echo "Done!!!"
