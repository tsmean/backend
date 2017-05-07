import {appConfig} from "../config/AppConfig";
import {database} from "./../db/Database";
class BeforeEach {

  public connectTestToDatabase() {
    return beforeEach('connect to db', (done) => {
      appConfig.setAppConfig('test');
      database.connectToDatabase(appConfig.appConfig, (db) => {
        db.dropDatabase().then(() => {
          done();
        });
      })
    });
  }

}

export const beforeEachDo = new BeforeEach();