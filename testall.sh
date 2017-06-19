mocha --reporter spec --timeout 15000  --compilers ts:ts-node/register 'src/**/*.test.ts'
cd ./router-module/
mocha --reporter spec --timeout 15000  --compilers ts:ts-node/register 'src/**/*.test.ts'
cd ..
cd ./auth-module/
mocha --reporter spec --timeout 15000  --compilers ts:ts-node/register 'src/**/*.test.ts'
