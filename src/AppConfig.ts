import {AppProperties} from "ts-mean-models/app-properties.model";

export class AppConfig {

  public setAppConfig(configName: string) {
    this._appConfig = require(`../properties/${configName}.properties.json`);
  }

  public get appConfig(): AppProperties {
    return this._appConfig;
  }

  private _appConfig;

}