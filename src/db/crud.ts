import * as mongo from 'mongodb'
import {database} from "./Database";

class Crud {

  read(id:string, collectionName: string, cb:(err, item?) => void) {
    database.database.collection(collectionName, (err, collection) => {
      if (err) return cb(err);
      collection.findOne({"_id": new mongo.ObjectID(id)}, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
      })
    })
  }


  create(item: Object, collectionName: string, cb:(err, item?) => void) {

    database.database.collection(collectionName, (err, collection) => {
      if (err) return cb(err);
      collection.insertOne(item, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
      })
    })

  }

  update(item, collectionName: string, cb:(err, item?) => void) {
    database.database.collection(collectionName, (err, collection) => {
      if (err) return cb(err);

      collection.updateOne({"_id": new mongo.ObjectID(item._id)}, item, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
      })
    })
  }

  delete(id: string, collectionName: string, cb:(err, item?) => void) {
    database.database.collection(collectionName, (err, collection) => {
      if (err) return cb(err);

      collection.deleteOne({"_id": new mongo.ObjectID(id)}, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
      })
    })
  }
}

export const crud = new Crud();