import * as mongo from 'mongodb'
import {database} from "./Database";
import {log} from "../logger/logger";

class UserDAO {

  findOne(email:string,  cb:(err, item?) => void) {
    database.database.collection('Users', (err, collection) => {
      if (err) return cb(err);
      collection.findOne({"email": email}, (err, result) => {
        if (err) return cb(err);
        return cb(null, result);
      })
    })
  }

}

export const userDAO = new UserDAO();