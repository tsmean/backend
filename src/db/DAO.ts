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
    return this.readOneByField("_id", id, collectionName, cb);
  }

  readOneByField(fieldName: string, fieldValue: string, collectionName: string, cb:(dbResponse: DatabaseResponse) => void) {
    database.database.collection(collectionName, (err, collection) => {

      log.debug('here', fieldName, fieldValue);

      if (err) {
        return cb({
          error: err
        })
      } else {
        collection.findOne({fieldName: fieldValue}, (err, data) => {
          log.debug('1');
          if (err) {
            return cb({
              error: err
            });
          } else {
            log.debug('2', data, 'bla', err, 'blub');
            return cb({
              error: null,
              data: this.morphDataOnRetrieval(data)
            });
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
            const bla = this.morphDataOnRetrieval(itemCopy);
            log.debug(bla, 'come on');
            return cb({
              error: null,
              data: bla
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
      collection.updateOne({"_id": new mongo.ObjectID(item._id)}, item, (err: MongoError, result) => {
        if (err) {
          return cb({
            error: this.mongoErrorToGeneralDbError(err)
          });
        } else {
          if (result.nUpdated === 1) {
            return cb({
              error: null,
              data: this.morphDataOnRetrieval(itemCopy)
            })
          } else {
            return cb({
              error: {
                code: -1,
                message: `There were ${result.nUpdated} items updated instead of one item`
              }
            })
          }
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
         if (result.deletedCount === 1) {
           return cb({
             error: this.mongoErrorToGeneralDbError(err)
           });
         } else {
           return cb({
             error: {
               code: -1,
               message: `There were ${result.deletedCount} items deleted instead of one item`
             }
           })
         }
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
    const dataCopy = utils.deepCopyData(data);
    dataCopy.uid = data._id.toHexString();
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