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

#Cleanup & switch back to deployment
rm backend.zip
cd backend
