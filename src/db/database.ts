import * as mysql from 'mysql';
import {log} from '../logger/logger';
import {AppProperties} from '../config/app-properties.model';
import {IConnection, IConnectionConfig} from 'mysql';

class Database {

  private _database: IConnection;

  constructor(
  ) { }

  public get database() {
    return this._database;
  }

  private genericConnector(appConfig: AppProperties, nospecificdb: boolean, callback?: (database: IConnection) => any) {

    // Connect to the db
    const connectionConfig: IConnectionConfig = {
      host: appConfig.db.host,
      user: appConfig.db.dbuser,
      password: appConfig.db.dbpassword,
      database: appConfig.db.dbname,
      port: appConfig.db.port
    };
    if (nospecificdb) {
      delete connectionConfig.database;
    }

    const con = mysql.createConnection(connectionConfig);
    con.connect((err) => {
      if (!err) {
        this._database = con;
        if (callback) {
          callback(con);
        }
      } else {
        log.error('Error while connecting to Database:');
        log.error(err.message);
      }
    });

  }

  public connectToDatabase (appConfig: AppProperties, callback?: (database: IConnection) => any) {
    this.genericConnector(appConfig, false, callback);
  };

  public connectToNoSpecificDatabase (appConfig: AppProperties, callback?: (database: IConnection) => any) {
    this.genericConnector(appConfig, true, callback);
  };

}

export const database = new Database();


