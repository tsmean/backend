import {AppProperties} from "ts-mean-models/app-properties.model";

class AppConfig {

  constructor() {

    // set a default config
    // Note: I leave my credentials here ON PURPOSE so that YOU can get started faster.
    // However, those are small instances, the content of which is regularly deleted. So don't build on this.
    // To switch away from this initial config, build your own config in the properties folder!
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

  // configName is the name of the properties file.
  // There's an untracked folder properties at the same level as the src directory with the properties.
  public setAppConfig(configName: string) {
    this._appConfig = require(`../../properties/${configName}.properties.json`);
  }

  public get appConfig(): AppProperties {
    return this._appConfig;
  }

  private _appConfig;

}

export const appConfig = new AppConfig();