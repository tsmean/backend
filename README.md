# Installation

```
git clone https://github.com/bersling/typescript-mongo-express-node-seed.git project-name-backend
cd project-name-backend
yarn install
```

You need to have git and yarn installed to make this work.

# Run
Make sure you have typescript installed, then run:
```
npm start
```

# Test
```
npm test
```
(on windows: `npm run windows_test`)

or to run a single test

```
TEST=someRegexThatMatchesDescribeOrItFromTest npm run spec
```

Note: If you're using an IDE such as IntelliJ, you can also run single files
directly from the IDE! See https://www.jetbrains.com/help/idea/2017.1/run-debug-configuration-mocha.html


# Deployment

I have configured a small `deploy.sh` script
(doing it with typescript was horrible, so I switched back to a good old shell script).
That way you should be able to deploy on any remote (ubuntu) instance easily.
Just change the `server` variable in the script
and run
`./deploy.sh` or `./deploy.sh test` for a dry run
executing all unit tests reomtely.


# See it in action

You can test the interface at http://demo.tsmean.com:4242, e.g.
http://demo.tsmean.com:4242/api/v1/heroes.


# Database
When you first run this project,
it will connect to a remote Mongo instance I have setup so this project can be run with minimal overhead.
However, I advise you to create your own `<project>/properties/local.properties.json`
and `<project>/properties/test.properties.json`,
since the remote mongo instance is cleaned on a regular basis.
