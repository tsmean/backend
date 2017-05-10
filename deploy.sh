server=root@46.101.140.209
rootDir=~

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

scp backend.zip ${server}:${rootDir}

#Cleanup & switch back to deployment
rm backend.zip
cd backend

