import * as process from 'process';
import {spawn, spawnSync, SpawnSyncOptionsWithStringEncoding, SpawnSyncReturns} from 'child_process';

// declaring utf8 makes sure a string is returned (as opposed to a buffer) from spawnSync
const spawnSyncOptions: SpawnSyncOptionsWithStringEncoding = {
  encoding: 'utf8'
};

/**
 * Setup git submodules
 */
const initSubmodules = spawnSync('git', ['submodule', 'init'], spawnSyncOptions);
handleCommandResult(initSubmodules);
const updateSubmodules = spawnSync('git', ['submodule', 'update'], spawnSyncOptions);
handleCommandResult(updateSubmodules);

/**
 * Install all modules
 */
const startingDirectory = process.cwd();
const modules = ['dbadapter', 'main', 'mongo', 'mysql', 'router', 'auth'];
modules.forEach(moduleName => {
  changeToDirectory(startingDirectory);
  changeToDirectory(`${moduleName}-module`);
  const installModuleDependencies = spawnSync('npm', ['install'], spawnSyncOptions);
  handleCommandResult(installModuleDependencies);
  const compileModule = spawnSync('tsc', [], spawnSyncOptions);
  handleCommandResult(compileModule);

});


/**
 * Helper functions
 */
function handleCommandResult(result: SpawnSyncReturns<string>) {
  if (result.error) {
    console.error('ERROR in process:', result.error);
    process.exit();
  } else if (result.stderr !== undefined && result.stderr !== "") {
   console.error('stderr not empty:', result.stderr);
   process.exit();
  } else {
    console.log(result.stdout);
  }
}

function changeToDirectory (dir) {
  try {
    console.log(`Changing to directory ${dir}`)
    process.chdir(dir);
  } catch (err) {
    console.log(`Could not change to directory ${dir}: ${err}`);
    process.exit();
  }
}
