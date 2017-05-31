import * as mongo from 'mongodb'
import {database} from "./database";
import {log} from "../logger/logger";
import {DatabaseResponse} from "./database-response.model";
import {dao} from "./dao";
import {passwordCryptographer} from "../auth/password-cryptographer";
import {User} from "./user.model";
import {utils} from "../utils/utils";

class UserDAO {

  create(user: User, password: string, cb:(dbResponse: DatabaseResponse) => void) {

    const userCopy = utils.deepCopyData(user);

    dao.readOneByField("email", userCopy.email, 'users', (dbResp) => {

      // Condition to create a new is user is no user with this email exists
      // This means that a database error is actually what you expect when creating a new user!
      if (dbResp.error) {

        passwordCryptographer.doHash(password).then((hash: string) => {
          userCopy.password = {
            hash: hash,
            algorithm: "bcrypt"
          };
          dao.create(userCopy, 'users', cb)
        }, (err) => {
          log.error(err);
          return cb({
            error: {
              message: 'Problem during hashing'
            }
          })
        });

      } else {
        //if a user with this email exists, deny creation
        return cb({
          error: {
            message: 'User already exists'
          }
        })
      }
    });

  }

}

export const userDAO = new UserDAO();