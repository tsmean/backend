import * as http from 'http';
import * as debug from 'debug'; 
import {router} from './api/Router';
import {database} from './db/Database';
import {appConfig} from './config/AppConfig';
import {log} from "./logger/logger";

const appDebug = debug('app');

// Step 1) Set & Get App Configuration
appConfig.setAppConfig(process.argv[2] || 'local');

// Step 2) Connect to the database
database.connectToDatabase(appConfig.appConfig, (db) => {

  // when connected to db:

  // Step 3) Set Port for router
  const normalizePort = (val: number|string): number|string|boolean => {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
  };

  const port = normalizePort(process.env.PORT || 3000);
  router.set('port', port);
  const server = http.createServer(router);

  // Step 4) Handle Errors
  const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  const onListening = (): void => {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  };
  server.on('error', onError);
  server.on('listening', onListening);

  server.listen(port,function(){
    log.info('Server listening at port %d', port);
  });

});












