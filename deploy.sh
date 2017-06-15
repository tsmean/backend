#!/usr/bin/env bash
server="ubuntu@52.59.71.133"

echo "Remove old directory"
ssh ${server} "rm -rf tsmean/be"

echo "Upload source"
ssh ${server} "mkdir tsmean/be"
scp -r src "${server}:~/tsmean/be/src"
scp package.json "${server}:~/tsmean/be/package.json"
scp tsconfig.json "${server}:~/tsmean/be/tsconfig.json"
scp -r properties "${server}:~/tsmean/be/properties"

echo "Install packages on server"
ssh ${server} "cd tsmean/be && npm install"

echo "Compiling sources"
ssh ${server} "cd tsmean/be && tsc"

echo "(Re-)Start server"
ssh ${server} "forever stop tsmean/be/dist/index.js"
ssh ${server} "forever start tsmean/be/dist/index.js"

echo "Done!"
