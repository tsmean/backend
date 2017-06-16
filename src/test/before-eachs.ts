import {database} from './../db/database';
import {appConfig} from '../config/app-config';
class BeforeEach {

  public connectTestToDatabase() {
    return beforeEach('connect to db', (done) => {
      appConfig.setAppConfig('test');
      database.connectToNoSpecificDatabase(appConfig.appConfig, (con) => {
        con.query(`DROP DATABASE ${appConfig.appConfig.db.dbname}`, (err) => {
          if (err) {
            console.error(err);
            throw err;
          }
          con.query(`CREATE DATABASE ${appConfig.appConfig.db.dbname}`, (innerError) => {
            if (innerError) {
              console.error(innerError);
              throw innerError;
            }
            database.connectToDatabase(appConfig.appConfig, (connection) => {
              if (connection) {
                createTables(connection, done)
              }
            });
          });
        });
      });
    });
  }

}

async function createTables(connection, done) {
  await createUsersTable(connection);
  await createHeroesTable(connection);
  await createItemsTable(connection);
  done();
}

function createUsersTable (connection) {
  connection.query(`CREATE TABLE users (
    _id int NOT NULL AUTO_INCREMENT,
    email varchar(50) NOT NULL,
    firstName varchar(35) NOT NULL,
    lastName varchar(35) NOT NULL,
    createTime DATETIME NOT NULL,
    updateTime DATETIME,
    birthday DATE,
    gender TINYINT(1),
    password VARCHAR(255),
    PRIMARY KEY (_id)
);`);
}

function createHeroesTable (connection) {
  connection.query(`CREATE TABLE heroes (
    _id int NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    createTime DATETIME NOT NULL,
    updateTime DATETIME,
    PRIMARY KEY (_id)
);`);
}

function createItemsTable (connection) {
  connection.query(`CREATE TABLE items (
    _id int NOT NULL AUTO_INCREMENT,
    hello varchar(50) NOT NULL,
    createTime DATETIME NOT NULL,
    updateTime DATETIME,
    PRIMARY KEY (_id)
);`);
}


export const beforeEachDo = new BeforeEach();
