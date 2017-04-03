import {AppProperties} from "ts-mean-models/app-properties.model";

export class AppConfig {

  constructor() {

    //set a default config
    this._appConfig = {
      "db": {
        "host": "ds145220.mlab.com",
        "dbuser": "notely",
        "port": 45220,
        "dbpassword": "jlkajoijjjaksjkfiiq82",
        "dbname": "notely-local"
      },
      "redis": {
        "url": "redis-16390.c9.us-east-1-2.ec2.cloud.redislabs.com:16390",
        "secret": "jajdjlkajklajlklkjqiw"
      }
    }

  }

  public setAppConfig(configName: string) {
    this._appConfig = require(`../properties/${configName}.properties.json`);
  }

  public get appConfig(): AppProperties {
    return this._appConfig;
  }

  private _appConfig;

}