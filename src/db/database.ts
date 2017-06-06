import * as mongo from 'mongodb';
import {Db} from 'mongodb';
import {log} from '../logger/logger';
import {AppProperties} from '../config/app-properties.model';

class Database {

  private _database;
  private _mongoClient;

  private mongoUri = (appParams: AppProperties) => {
    const params = appParams.db;
    return `mongodb://${params.dbuser}:${params.dbpassword}@${params.host}:${params.port}/${params.dbname}`;
  }

  constructor(

  ) {
    this._mongoClient = mongo.MongoClient;
  }

  public get database() {
    return this._database;
  }

  public connectToDatabase (appConfig: AppProperties, callback?: (database: Db) => any) {

    // Connect to the db
    this._mongoClient.connect(this.mongoUri(appConfig), (err, db) => {
      if (!err) {
        this._database = db;
        if (callback) {
          callback(db);
        }
      } else {
        log.error('Error while connecting to Database:');
        log.error(err);
      }
    });

  };

}

export const database = new Database();


