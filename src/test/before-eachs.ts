import {database} from './../db/database';
import {appConfig} from '../config/app-config';
class BeforeEach {

  public connectTestToDatabase() {
    return beforeEach('connect to db', (done) => {
      appConfig.setAppConfig('test');
      database.connectToDatabase(appConfig.appConfig, (db) => {
        db.dropDatabase().then(() => {
          done();
        });
      });
    });
  }

}

export const beforeEachDo = new BeforeEach();
