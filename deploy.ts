// Run this with ts-node (https://github.com/TypeStrong/ts-node)

const node_ssh = require('node-ssh');
const ssh = new node_ssh();

interface DeployConfig {
  restartServer: boolean;
  ssh: {
    host: string;
    username: string;
    privateKey: string;
  };
}

const config: DeployConfig = require('./deploy.config');

console.log('Compiling Typescript');
const spawn = require( 'child_process' ).spawn;
const ngBuild = spawn( 'tsc');

ngBuild.stdout.on('data', (data) => {
  console.log(data);
});

ngBuild.stderr.on('data', (data) => {
  console.error(data);
});

ngBuild.on('close', (code) => {

  async function doDeploy() {
    try {

      console.log('connecting to server');
      const sshConnection = await ssh.connect({
        host: config.ssh.host,
        username: config.ssh.username,
        privateKey: config.ssh.privateKey
      });

      await ssh.execCommand('rm -rf tsmean/be');
      await ssh.mkdir('tsmean/be/dist'); // creates all folders if they don't exist yet

      console.log('Uploading dist folder');
      await ssh.putDirectory('dist', 'tsmean/be/dist');

      if (config.restartServer) {
        console.log('Copying additional files');
        await ssh.putFile('package.json', 'tsmean/be/package.json');
        await ssh.putFile('tsconfig.json', 'tsmean/be/tsconfig.json');
        await ssh.putDirectory('properties', 'tsmean/be/properties');

        console.log('Install required packages on server');
        await ssh.execCommand('cd tsmean/be && npm install --production');

        console.log('Starting Forever');
        await ssh.execCommand('forever stop tsmean/be/dist/index.js');
        await ssh.execCommand('forever start tsmean/be/dist/index.js');
      }

      console.log('Everything done!');
      ssh.dispose();

    } catch (err) {
      console.log('Error: ', err.message);
    }
  }
  doDeploy();

});
