import * as mysql from 'mysql';
import {database} from './database';
import {log} from '../logger/logger';
import {
  CreateResponse, DatabaseError, DatabaseResponse, DeleteResponse, MysqlSuccess,
  UpdateResponse
} from './database-response.model';
import {Cursor, MongoCallback, MongoClient, MongoError} from 'mongodb';
import {utils} from '../utils/utils';
import {type} from 'os';
import {IConnection, IError} from 'mysql';

// Database Access Object
// Everything that operates directly on the database goes here
// i.e. everything that has to do anything with mongodb
// goal is to abstract away MongoDB stuff and localize in one place, so if you want to swap e.g. for a relational DB
// it's not too much effort

// also, don't expose Mongo API directly, but program against an interface (DatabaseResponse)

export namespace dao {

  export function read(id, tableName: string, cb: (dbResponse: DatabaseResponse<any>) => void): void {

    const sql = 'SELECT * from ?? WHERE _id = ? LIMIT 1';

    database.database.query(sql, [tableName, id], (err, data) => {

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
    database.database.query('SELECT * from ??', [tableName], (err, data) => {

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

    const sql = 'SELECT * from ?? WHERE ?? = ? LIMIT 1';

    database.database.query(sql, [tableName, fieldName, fieldValue], (err, data) => {

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

    const keyValuePairs = [];
    Object.keys(item).forEach(key => {
      keyValuePairs.push([key, item[key]]);
    });
    keyValuePairs.push(['createTime', 'now()']);

    const l = keyValuePairs.length;
    const keyReplacement = Array(l).fill('??').join(', ');
    const valueReplacement = Array(l).fill('?').join(', ');

    const sql = `INSERT INTO ?? (${keyReplacement}) VALUES (${valueReplacement})`;

    database.database.query(sql,
      [tableName, ...keyValuePairs.map(x => x[0]), ...keyValuePairs.map(x => x[1])], (err, data) => {

        if (err) {
          cb({
            error: {
              message: err.code
            }
          });
        } else {
          if (data) {

            // Retrieve data from database, so the client has the updated object with id, timestamp etc.
            dao.read(data.insertId, tableName, (innerDbResp) => {

              if (innerDbResp.error) {
                cb({error: innerDbResp.error});
              } else {
                cb({
                  error: null,
                  data: innerDbResp.data
                });
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
    const id = morphedItem._id;
    delete morphedItem._id;

    const keyValuePairs = [];
    Object.keys(morphedItem).forEach(key => {
      keyValuePairs.push([key, morphedItem[key]]);
    });

    const l = keyValuePairs.length;
    const keyValueReplacement = Array(l).fill('?? = ?').join(', ');

    const sql = `UPDATE ?? SET ${keyValueReplacement} WHERE _id = ?`;

    const mergedArray = [];
    keyValuePairs.forEach(pair => {
      mergedArray.push(pair[0]);
      mergedArray.push(pair[1]);
    });

    database.database.query(sql,
      [tableName, ...mergedArray, id],
      (err: mysql.IError, updateResponseFromDatabase: MysqlSuccess) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (updateResponseFromDatabase) {

          if (updateResponseFromDatabase.affectedRows === 1) {

            // Retrieve data from database, so the client has the updated object with id, timestamp etc.
            dao.read(id, tableName, (innerDbResp) => {

              if (innerDbResp.error) {

                cb({error: innerDbResp.error});
              } else {
                cb({
                  error: null,
                  data: innerDbResp.data
                });
              }
            });

          } else {

            cb({
              error: {
                message: `Instead of 1, there were ${updateResponseFromDatabase.affectedRows} rows affected`
              }
            });

          }

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

    const sql = `DELETE FROM ?? WHERE _id=?`;
    database.database.query(sql, [tableName, id], (err, data: MysqlSuccess) => {

      if (err) {
        cb({
          error: {
            message: err.code
          }
        });
      } else {
        if (data && data.affectedRows === 1) {
          cb({
            error: null,
            data: null
          });
        } else {
          cb({
            error: {
              message: `deleted ${data.affectedRows} items`
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
