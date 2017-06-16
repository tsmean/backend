import * as mongo from 'mongodb';
import {database} from './database';
import {log} from '../logger/logger';
import {
  CreateResponse, DatabaseError, DatabaseResponse, DeleteResponse,
  UpdateResponse
} from './database-response.model';
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

  export function read(id, tableName: string, cb: (dbResponse: DatabaseResponse<any>) => void): void {

    const sql = `SELECT * from ${tableName} WHERE _id = ${id} LIMIT 1`;

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
            data: morphDataOnRetrieval(data)[0]
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


  export function readAll(tableName: string, cb: (dbResponse: DatabaseResponse<any>) => void): void {
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
    fieldValue: any,
    tableName: string,
    cb: (dbResponse: DatabaseResponse<any>) => void): void {

    const sql = `SELECT * from ${tableName} WHERE ${fieldName} = ${orm.mapValue(fieldValue)} LIMIT 1`;

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
            data: morphDataOnRetrieval(data)[0]
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

  export function create(item: Object, tableName: string, cb: (dbResp: DatabaseResponse<CreateResponse>) => void): void {

    const converted = orm.flatObjectToMysql(item);
    converted.push(['createTime', 'now()']);

    const sql = `INSERT INTO ${tableName} (${converted.map(x => x[0]).join(', ')})
    VALUES (${converted.map(x => x[1]).join(', ')})`;

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
            data: {
              insertId: data.insertId
            }
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


  export function update(item, tableName: string, cb: (dbResp: DatabaseResponse<UpdateResponse>) => void): void {
    const morphedItem = morphDataOnStorage(item);
    let converted = orm.flatObjectToMysql(morphedItem);
    converted = converted.filter(x => x[0] !== 'updateTime');
    converted.push(['updateTime', 'now()']);

    const sql = `UPDATE ${tableName} SET ${converted.map(x => `${x[0]}=${x[1]}`).join(', ')} WHERE _id=${morphedItem._id}`;

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


  export function remove(id, tableName: string, cb: (dbResp: DatabaseResponse<DeleteResponse>) => void): void {

    const sql = `DELETE FROM ${tableName} WHERE _id=${id}`;
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
      resource.uid = resource._id;
      delete resource._id;
    };

    if (Array.isArray(dataCopy)) {
      dataCopy.forEach(resource => {
        morphResource(resource);
      });
    } else {
      morphResource(dataCopy);
    }

    // Array is returned
    return dataCopy;
  };

  function morphDataOnStorage(data) {
    const dataCopy = utils.deepCopyData(data);
    dataCopy._id = data.uid;
    delete dataCopy.uid;
    return dataCopy;
  };

}
