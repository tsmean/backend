import * as mongo from 'mongodb';
import {database} from './database';
import {log} from '../logger/logger';
import {DatabaseError, DatabaseResponse} from './database-response.model';
import {Cursor, MongoCallback, MongoClient, MongoError} from 'mongodb';
import {utils} from '../utils/utils';
import {type} from 'os';
import {orm} from './orm';

// Database Access Object
// Everything that operates directly on the database goes here
// i.e. everything that has to do anything with mongodb
// goal is to abstract away MongoDB stuff and localize in one place, so if you want to swap e.g. for a relational DB
// it's not too much effort

// also, don't expose Mongo API directly, but program against an interface (DatabaseResponse)

export namespace dao {

  export function read(id: string, tableName: string, cb: (dbResponse: DatabaseResponse) => void): void {
    database.database.query(`SELECT * from ${tableName} WHERE id = ${id}`, (err, data) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data) {
          cb({
            error: null,
            data: morphDataOnRetrieval(data)
          });
        } else {
          cb({
            error: {
              message: 'not found'
            }
          });
        }
      }

    });
  }


  export function readAll(tableName: string, cb: (dbResponse: DatabaseResponse) => void): void {
    database.database.query(`SELECT * from ${tableName}`, (err, data) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data) {
          cb({
            error: null,
            data: morphDataOnRetrieval(data)
          });
        } else {
          cb({
            error: {
              message: 'not found'
            }
          });
        }
      }

    });
  }

  export function readOneByField(
    fieldName: string,
    fieldValue: string,
    tableName: string,
    cb: (dbResponse: DatabaseResponse) => void): void {
    database.database.query(`SELECT * from ${tableName} WHERE ${fieldName} = ${fieldValue}`, (err, data) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data) {
          cb({
            error: null,
            data: morphDataOnRetrieval(data)
          });
        } else {
          cb({
            error: {
              message: 'not found'
            }
          });
        }
      }

    });
  }

  export function create(item: Object, tableName: string, cb: (dbResp: DatabaseResponse) => void): void {

    const converted = orm.flatObjectToMysql(item);
    converted.push(['createTime', 'now()']);

    const sql = `INSERT INTO ${tableName} (${converted.join(', ')}) VALUES (${converted.join(', ')})`;
    database.database.query(sql, (err, data) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data) {
          cb({
            error: null,
            data: morphDataOnRetrieval(data)
          });
        } else {
          cb({
            error: {
              message: 'not found'
            }
          });
        }
      }

    });

  }


  export function update(item, tableName: string, cb: (dbResp: DatabaseResponse) => void): void {
    let converted = orm.flatObjectToMysql(item);
    converted = converted.filter(x => x[0] !== 'updateTime');
    converted.push(['updateTime', 'now()']);

    const sql = `UPDATE ${tableName} (${converted.join(', ')}) VALUES (${converted.join(', ')}) WHERE id=${item.id}`;
    database.database.query(sql, (err, data) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data) {
          cb({
            error: null,
            data: morphDataOnRetrieval(data)
          });
        } else {
          cb({
            error: {
              message: 'not found'
            }
          });
        }
      }

    });

  }


  export function remove(id: string, tableName: string, cb: (dbResp: DatabaseResponse) => void): void {

    const sql = `DELETE FROM ${tableName} WHERE id=${id}`;
    database.database.query(sql, (err, data) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data) {
          cb({
            error: null,
            data: morphDataOnRetrieval(data)
          });
        } else {
          cb({
            error: {
              message: 'not found'
            }
          });
        }
      }

    });
  }


  function mongoErrorToGeneralDbError (err: MongoError): DatabaseError {
    return {
      code: err.code,
      message: err.message
    };
  }

  function morphDataOnRetrieval(data, logme?: boolean) {

    if (!data) {
      log.error('No data!');
      return;
    }

    const dataCopy = utils.deepCopyData(data);

    const morphResource = (resource): void => {
      if (typeof resource.id !== 'string') {
        resource.uid = resource.id.toHexString();
      } else {
        resource.uid = resource.id;
      }
      delete resource.id;
    };

    if (Array.isArray(dataCopy)) {
      dataCopy.forEach(resource => {
        morphResource(resource);
      });
    } else {
      morphResource(dataCopy);
    }

    return dataCopy;
  };

  function morphDataOnStorage(data) {
    const dataCopy = utils.deepCopyData(data);
    dataCopy.id = data.uid;
    delete dataCopy.uid;
    return dataCopy;
  };

}
