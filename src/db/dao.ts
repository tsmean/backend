import * as mongo from 'mongodb'
import {database} from "./database";
import {log} from "../logger/logger";
import {DatabaseError, DatabaseResponse} from "./database-response.model";
import {Cursor, MongoCallback, MongoClient, MongoError} from "mongodb";
import {utils} from "../utils/utils";

//Database Access Object
//Everything that operates directly on the database goes here
//i.e. everything that has to do anything with mongodb
//goal is to abstract away MongoDB stuff and localize in one place, so if you want to swap e.g. for a relational DB
//it's not too much effort

//also, don't expose Mongo API directly, but program against an interface (DatabaseResponse)

class DAO {

  read(id:string, collectionName: string, cb:(dbResponse: DatabaseResponse) => void): void {
    database.database.collection(collectionName, (err, collection) => {

      if (err) {
        cb({
          error: err
        })
      } else {

        collection.findOne({"_id": new mongo.ObjectID(id)}, (err, data) => {

          if (err) {
            cb({
              error: err
            });
          } else {
            if (data) {
              cb({
                error: null,
                data: this.morphDataOnRetrieval(data)
              });
            } else {
              cb({
                error: {
                  message: 'not found'
                }
              })
            }
          }
        });

      }

    })
  }


  readAll(collectionName: string, cb:(dbResponse: DatabaseResponse) => void): void {
    database.database.collection(collectionName, (err, collection) => {

      if (err) {
        cb({
          error: err
        })
      } else {

        collection.find({}, (err, cursor) => {

          if (err) {
            cb({
              error: err
            });
          } else {
            if (cursor) {
              cursor.toArray().then(ary => {
                cb({
                  error: null,
                  data: this.morphDataOnRetrieval(ary)
                });
              });

            } else {
              cb({
                error: {
                  message: 'not found'
                }
              })
            }
          }
        });

      }

    })
  }



  readOneByField(fieldName: string, fieldValue: string, collectionName: string, cb:(dbResponse: DatabaseResponse) => void): void {
    database.database.collection(collectionName, (err, collection) => {

      if (err) {
        cb({
          error: err
        })
      } else {

        const searchObject = {};
        searchObject[fieldName] = fieldValue;

        collection.findOne(searchObject, (err, data) => {
          if (err) {
            cb({
              error: err
            });
          } else {
            if (data) {
              cb({
                error: null,
                data: this.morphDataOnRetrieval(data)
              });
            } else {
              cb({
                error: {
                  message: 'not found'
                }
              })
            }
          }
        })
      }

    })
  }


  create(item: Object, collectionName: string, cb:(dbResp: DatabaseResponse) => void): void {

    //deep copy object so input doesn't get mutated
    const itemCopy = utils.deepCopyData(item);

    database.database.collection(collectionName, (err: MongoError, collection) => {
      if (err) {
        cb({
          error: this.mongoErrorToGeneralDbError(err)
        });
      } else {
        collection.insertOne(itemCopy, (err: MongoError, result) => {
          if (err) {
            cb({
              error: this.mongoErrorToGeneralDbError(err)
            });
          } else {
            cb({
              error: null,
              data: this.morphDataOnRetrieval(itemCopy)
            });
          }
        })
      }
    })
  }


  update(item, collectionName: string, cb:(dbResp: DatabaseResponse) => void): void {

    //deep copy object so input doesn't get mutated and morph it to correct storage form
    const itemCopy = this.morphDataOnStorage(item);

    database.database.collection(collectionName, (err, collection) => {
      if (err) {
        cb({
          error: this.mongoErrorToGeneralDbError(err)
        })
      } else {
        collection.updateOne({"_id": new mongo.ObjectID(itemCopy._id)}, item, (err: MongoError, result) => {
          if (err) {
            cb({
              error: this.mongoErrorToGeneralDbError(err)
            });
          } else {
            cb({
              error: null,
              data: this.morphDataOnRetrieval(itemCopy)
            })
          }
        })
      }
    })
  }


  delete(id: string, collectionName: string, cb:(dbResp: DatabaseResponse) => void): void {
    database.database.collection(collectionName, (err, collection) => {
      if (err) {
        cb({
          error: this.mongoErrorToGeneralDbError(err)
        })
      } else {
        collection.deleteOne({"_id": new mongo.ObjectID(id)}, (err, result) => {
          if (err) {
            cb({
              error: this.mongoErrorToGeneralDbError(err)
            });
          } else {
            cb({
              error: null
            });
          }
        })
      }
    })
  }


  private mongoErrorToGeneralDbError (err: MongoError): DatabaseError {
    return {
      code: err.code,
      message: err.message
    }
  }

  private morphDataOnRetrieval(data, logme?: boolean) {

    if (!data) {
      log.error('No data!');
      return;
    }

    const dataCopy = utils.deepCopyData(data);

    const morphResource = (resource): void => {
      if (typeof resource._id !== 'string') {
        resource.uid = resource._id.toHexString();
      } else {
        resource.uid = resource._id;
      }
      delete resource._id;
    };

    if (Array.isArray(dataCopy)) {
      dataCopy.forEach(resource => {
        morphResource(resource);
      })
    } else {
      morphResource(dataCopy);
    }

    return dataCopy;
  };

  private morphDataOnStorage(data) {
    const dataCopy = utils.deepCopyData(data);
    dataCopy._id = data.uid;
    delete dataCopy.uid;
    return dataCopy;
  };


}

export const dao = new DAO();