import * as mongo from 'mongodb'
import {database} from "./Database";
import {log} from "../logger/logger";
import {User} from "../../../models/src/user.model";
import {DatabaseResponse} from "./DatabaseResponse.model";
import {dao} from "./DAO";


class UserDAO {

  create(user: User, cb:(dbResponse: DatabaseResponse) => void) {

    dao.readOneByField("email", user.email, "Users", (dbResp) => {

      if (dbResp.error) {
        //create when no user was found (meaning an error was thrown!)
        dao.create(user, "Users", cb)
      } else {
        //if a user with this email exists, deny creation
        return cb({
          error: {
            message: 'already exists',
            code: 0
          }
        })
      }
    });

  }

}

export const userDAO = new UserDAO();