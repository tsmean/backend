import * as passport from 'passport'
import * as local from 'passport-local'
import {log} from "../logger/logger";
import {dao} from "../db/dao";
import {userDAO} from "../db/UserDAO";

class Passport {

  public constructed: boolean;

  constructor() {

    passport.use('local', new local.Strategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'email',
          passwordField : 'password',
        },
        function(email, password, done) {

          dao.readOneByField("email", email, "Users", function (dbResp) {
            if (dbResp.error) {
              return done(dbResp);
            } else if (!dbResp.data) {
              return done(null, false, { message: 'Incorrect username.' });
            } else if (dbResp.data.password.hash !== password) {
              return done(null, false, { message: 'Incorrect password.' });
            } else {
              return done(null, dbResp.data);
            }
          });

        }
    ));

    this.constructed = true;

  }

}

//TODO: okay this is a bit weird, new Passport() only exists to run a constructor...

export const myPassport = new Passport();