import * as passport from 'passport'
import * as local from 'passport-local'
import {log} from "../logger/logger";
import {crud} from "../db/crud";
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

      /*
          if (email !== 'hans') {
            return done(null, false, { message: 'Incorrect username.' }) //theres only hans
          } else if (password !== '1234') {
            return done(null, false, { message: 'Incorrect password.' }) //and hans has a simple pw
          } else {
            return done(null, {
              email: 'hans@bla',
              firstName: 'bla',
              lastName: 'blub'
            })
          }
*/

          userDAO.findOne(email, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== password) {
              return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
          });

        }
    ));

    this.constructed = true;

  }

}

//TODO: okay this is a bit weird, new Passport() only exists to run a constructor...

export const myPassport = new Passport();