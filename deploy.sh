#!/usr/bin/env bash
server="ubuntu@54.93.232.18"

echo "Compile typescript"
tsc

echo "Remove old directory"
ssh ${server} "rm -rf tsmean/be"

echo "Upload new contents"
ssh ${server} "mkdir tsmean/be"
scp -r dist "${server}:~/tsmean/be/dist"
scp package.json "${server}:~/tsmean/be/package.json"
scp -r properties "${server}:~/tsmean/be/properties"

echo "Install packages on server"
ssh ${server} "cd tsmean/be && npm install --production"

echo "(Re-)Start server"
ssh ${server} "forever stop tsmean/be/dist/index.js"
ssh ${server} "forever start tsmean/be/dist/index.js"

echo "Done!"
