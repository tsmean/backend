import * as mongo from 'mongodb'
import {database} from "./Database";
import {log} from "../logger/logger";
import {DatabaseError, DatabaseResponse} from "./DatabaseResponse.model";
import {MongoError} from "mongodb";
import {utils} from "../utils/Utils";

//Database Access Object
//Everything that operates directly on the database goes here
//i.e. everything that has to do anything with mongodb
//goal is to abstract away MongoDB stuff and localize in one place, so if you want to swap e.g. for a relational DB
//it's not too much effort

//also, don't expose Mongo API directly, but program against an interface (DatabaseResponse)

class DAO {


  read(id:string, collectionName: string, cb:(dbResponse: DatabaseResponse) => void) {
    database.database.collection(collectionName, (err, collection) => {

      if (err) {
        return cb({
          error: err
        })
      } else {

        collection.findOne({"_id": new mongo.ObjectID(id)}, (err, data) => {

          if (err) {
            return cb({
              error: err
            });
          } else {
            if (data) {
              return cb({
                error: null,
                data: this.morphDataOnRetrieval(data)
              });
            } else {
              log.error('not found!');
              return cb({
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

  readOneByField(fieldName: string, fieldValue: string, collectionName: string, cb:(dbResponse: DatabaseResponse) => void) {
    database.database.collection(collectionName, (err, collection) => {

      if (err) {
        return cb({
          error: err
        })
      } else {

        const searchObject = {};
        searchObject[fieldName] = fieldValue;

        collection.findOne(searchObject, (err, data) => {
          if (err) {
            return cb({
              error: err
            });
          } else {
            if (data) {
              return cb({
                error: null,
                data: this.morphDataOnRetrieval(data)
              });
            } else {
              return cb({
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


  create(item: Object, collectionName: string, cb:(dbResp: DatabaseResponse) => void) {

    //deep copy object so input doesn't get mutated
    const itemCopy = JSON.parse(JSON.stringify(item));

    database.database.collection(collectionName, (err: MongoError, collection) => {
      if (err) {
        return cb({
          error: this.mongoErrorToGeneralDbError(err)
        });
      } else {
        collection.insertOne(itemCopy, (err: MongoError, result) => {
          if (err) {
            return cb({
              error: this.mongoErrorToGeneralDbError(err)
            });
          } else {
            return cb({
              error: null,
              data: this.morphDataOnRetrieval(itemCopy)
            });
          }
        })
      }
    })
  }


  update(item, collectionName: string, cb:(dbResp: DatabaseResponse) => void) {

    //deep copy object so input doesn't get mutated and morph it to correct storage form
    const itemCopy = this.morphDataOnStorage(item);



    database.database.collection(collectionName, (err, collection) => {
      if (err) return cb({
        error: this.mongoErrorToGeneralDbError(err)
      });
      collection.updateOne({"_id": new mongo.ObjectID(itemCopy._id)}, item, (err: MongoError, result) => {
        if (err) {
          return cb({
            error: this.mongoErrorToGeneralDbError(err)
          });
        } else {
          cb({
            error: null,
            data: this.morphDataOnRetrieval(itemCopy)
          })
        }
      })
    })
  }


  delete(id: string, collectionName: string, cb:(dbResp: DatabaseResponse) => void) {
    database.database.collection(collectionName, (err, collection) => {
      if (err) return cb({
        error: this.mongoErrorToGeneralDbError(err)
      });
      collection.deleteOne({"_id": new mongo.ObjectID(id)}, (err, result) => {
        if (err) {
          return cb({
            error: this.mongoErrorToGeneralDbError(err)
          });
        } else {
          return cb({
            error: null
          });
        }
      })
    })
  }


  private mongoErrorToGeneralDbError (err: MongoError): DatabaseError {
    return {
      code: err.code,
      message: err.message
    }
  }

  private morphDataOnRetrieval(data) {

    if (!data) {
      log.error('omg no data!!!');
      return;
    }

    const dataCopy = utils.deepCopyData(data);
    if (typeof data._id !== 'string') {
      dataCopy.uid = data._id.toHexString();
    } else {
      dataCopy.uid = data._id;
    }
    delete dataCopy._id;
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