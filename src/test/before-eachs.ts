import {database} from './../db/database';
import {appConfig} from '../config/app-config';
export namespace BeforeEach {

  export async function connectTestToDatabase() {
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
