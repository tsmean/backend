import * as mysql from 'mysql';
import * as mysql2 from 'mysql2';
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

  private genericConnector(appConfig: AppProperties, nospecificdb: boolean): Promise<IConnection> {

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

    return new Promise((resolve, reject) => {

      const con = mysql.createConnection(connectionConfig);
      con.connect((err) => {
        if (!err) {
          this._database = con;
          resolve (con);
        } else {
          reject(err);
        }
      });

    });

  }

  public connectToDatabase (appConfig: AppProperties): Promise<IConnection> {
    return this.genericConnector(appConfig, false);
  };

  public connectToNoSpecificDatabase (appConfig: AppProperties): Promise<IConnection> {
    return this.genericConnector(appConfig, true);
  };

}

export const database = new Database();


