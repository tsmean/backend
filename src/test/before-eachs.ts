import {database} from './../db/database';
import {appConfig} from '../config/app-config';
class BeforeEach {

  public connectTestToDatabase() {
    return beforeEach('connect to db', (done) => {
      appConfig.setAppConfig('test');
      database.connectToNoSpecificDatabase(appConfig.appConfig, (con) => {
        con.query(`DROP DATABASE ${appConfig.appConfig.db.dbname}`, (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
          con.query(`CREATE DATABASE ${appConfig.appConfig.db.dbname}`, (innerError) => {
            if (innerError) {
              console.log(innerError);
              throw innerError;
            }
            database.connectToDatabase(appConfig.appConfig, (connection) => {
              if (connection) {
                connection.query(`CREATE TABLE users (
    _id int NOT NULL AUTO_INCREMENT,
    email varchar(50) NOT NULL,
    firstName varchar(35) NOT NULL,
    lastName varchar(35) NOT NULL,
    createTime DATETIME NOT NULL,
    birthday DATE,
    gender TINYINT(1),
    passwordHash VARCHAR(255),
    hashingAlgo TINYINT(1),
    PRIMARY KEY (_id)
);`, function () {
                  connection.query(`CREATE TABLE heroes (
    _id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    PRIMARY KEY (_id)
);`);
                });
                done();
              }
            });
          });
        });
      });
    });
  }

}

export const beforeEachDo = new BeforeEach();
