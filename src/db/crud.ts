import * as mongo from 'mongodb'
//import {database} from "../index";
import { Connect } from './Connect';
//connect to mongodb
export const database = new Connect();
database.connectToDatabase();

export function crudRead(id:string, collectionName: string, cb:(err, item?) => void) {
  database.database.collection(collectionName, (err, collection) => {
    if (err) return cb(err);
    collection.findOne({"_id": new mongo.ObjectID(id)}, (err, result) => {
      if (err) return cb(err);
      return cb(null, result);
    })
  })
}


export function crudCreate(item: Object, collectionName: string, cb:(err, item?) => void) {

  database.database.collection(collectionName, (err, collection) => {
    if (err) return cb(err);
    collection.insertOne(item, (err, result) => {
      if (err) return cb(err);
      return cb(null, result);
    })
  })

}

export function crudUpdate(item, collectionName: string, cb:(err, item?) => void) {
  database.database.collection(collectionName, (err, collection) => {
    if (err) return cb(err);

    collection.updateOne({"_id": new mongo.ObjectID(item._id)}, item, (err, result) => {
      if (err) return cb(err);
      return cb(null, result);
    })
  })
}

export function crudDelete(id: string, collectionName: string, cb:(err, item?) => void) {
  database.database.collection(collectionName, (err, collection) => {
    if (err) return cb(err);

    collection.deleteOne({"_id": new mongo.ObjectID(id)}, (err, result) => {
      if (err) return cb(err);
      return cb(null, result);
    })
  })
}