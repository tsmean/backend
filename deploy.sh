server=root@104.236.93.140

# Switch to main folder
cd ..

# remove the old zip file if present, locally and on server
rm -f backend.zip
ssh ${server} "rm -f backend.zip"

# zip the required directories
zip -r backend.zip backend -x \
backend/node_modules/**\* \
backend/dist/**\* >/dev/null

echo ""
echo "---------------------------------"
echo "Upload Zip"
echo "---------------------------------"

scp backend.zip "${server}:~"

ssh ${server} "rm -rf backend"
ssh ${server} "unzip backend.zip"
ssh ${server} "cd backend && npm install"

echo ""
echo "---------------------------------"
echo "Cleanup"
echo "---------------------------------"
rm backend.zip
