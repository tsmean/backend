import * as http from 'http';
import {log} from './logger/logger';
import {appConfig} from './config/app-config';
import {database} from 'tsmongo/dist/database';
import {router} from 'tsrouter';

// Step 1) Set & Get App Configuration
appConfig.setAppConfig(process.argv[2] || 'local');


// Step 2) Connect to the database
database.connectToDatabase(appConfig.appConfig.db, (db) => {

  // when connected to db:

  // Step 3) Set Port for router
  const normalizePort = (val: number|string): number|string|boolean => {
    const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
      return val;
    } else if (port >= 0) {
      return port;
    } else {
      return false;
    }
  };

  const port = normalizePort(process.env.PORT || 4242);
  router.set('port', port);
  const server = http.createServer(router);

  // Step 4) Handle Errors
  const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
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
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  };
  server.on('error', onError);
  server.on('listening', onListening);

  server.listen(port, function(){
    log.info('Server listening at port %d', port);
  });

});
