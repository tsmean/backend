import * as passport from 'passport';
import * as local from 'passport-local';
import {dao} from '../db/dao';
import {passwordCryptographer} from './password-cryptographer';

class Passport {

  public constructed: boolean;

  constructor() {

    passport.use('local', new local.Strategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'email',
          passwordField : 'password',
        },
        function(email, password, done) {

          dao.readOneByField('email', email, 'users', function (dbResp) {
            if (dbResp.error) {
              return done(dbResp);
            } else if (!dbResp.data) {
              return done(null, false, { message: 'Incorrect username.' });
            } else if (!passwordCryptographer.doCompare(password, dbResp.data.password.hash)) {
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

export const myPassport = new Passport();