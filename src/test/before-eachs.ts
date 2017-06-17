import * as mysql from 'mysql';

import * as mysql2 from 'mysql2';

import {database} from './../db/database';
import {appConfig} from '../config/app-config';
import {IConnection} from 'mysql';
import {MysqlSuccess} from '../db/database-response.model';
export namespace beforeEachDo {

  export async function connectTestToDatabase() {
    return beforeEach('connect to db', (done) => {
      appConfig.setAppConfig('test');
      doAsyncStuff(done);
    });
  }

}

async function doAsyncStuff (done) {
  const con = await database.connectToNoSpecificDatabase(appConfig.appConfig);
  await dropDatabase(con);
  await createDatabase(con);
  const con2 = await getNewConnection();
  await createTables(con2);
  done();
}

function getNewConnection(): Promise<IConnection> {
  return database.connectToDatabase(appConfig.appConfig);
}

function createDatabase (con: IConnection): Promise<MysqlSuccess> {
  return new Promise((resolve, reject) => {

    con.query(`CREATE DATABASE ??`, [appConfig.appConfig.db.dbname], (err, result) => {
      if (err) {
        reject(err);
      } else {
       resolve(result);
      }
    });
  });
}


function dropDatabase(con): Promise<MysqlSuccess> {
  const sql = `DROP DATABASE ??`;


  return new Promise((resolve, reject) => {
    con.query(sql, [appConfig.appConfig.db.dbname], (err, result) => {

      if (err) {
        reject(err);
      } else {
        resolve(result);
      }

    });
  });

}

async function createTables(connection) {
  await createUsersTable(connection);
  await createHeroesTable(connection);
  await createItemsTable(connection);
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
