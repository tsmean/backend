import * as mongo from 'mongodb'
import {database} from "./database";
import {log} from "../logger/logger";
import {DatabaseResponse} from "./database-response.model";
import {dao} from "./dao";
import {passwordCryptographer} from "../auth/password-cryptographer";
import {User} from "./user.model";


class UserDAO {

  create(user: User, password: string, cb:(dbResponse: DatabaseResponse) => void) {

    dao.readOneByField("email", user.email, "Users", (dbResp) => {

      //TODO: this inverted check is quite confusing...

      if (dbResp.error) {
        //create when no user was found (meaning an error was thrown!)

        passwordCryptographer.doHash(password).then((hash: string) => {
          user.password = {
            hash: hash,
            algorithm: "bcrypt"
          };
          dao.create(user, "Users", cb)
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
            message: 'already exists'
          }
        })
      }
    });

  }

}

export const userDAO = new UserDAO();