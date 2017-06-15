import * as passport from 'passport';
import * as local from 'passport-local';
import {dao} from '../db/dao';
import {passwordCryptographer} from './password-cryptographer';
import {User} from '../db/user.model';
import * as expressSession from 'express-session';


export namespace passportInit {

  function initializePassportLocalStrategy(): boolean {
    const updatedPassport = passport.use('local', new local.Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
      },
      function(email, password, done) {

        dao.readOneByField('email', email, 'users', function (dbResp) {
          if (dbResp.error) {
            // It's better not to disclose whether username OR password is wrong
            return done(null, false, { message: 'Wrong password or username.' });
          } else if (!dbResp.data) {
            return done(null, false, { message: 'Wrong password or username.' });
          } else {
            passwordCryptographer.doCompare(password, dbResp.data.password.hash).then(isMatching => {
              if (!isMatching) {
                return done(null, false, { message: 'Wrong password or username.' });
              } else {
                return done(null, dbResp.data);
              }
            });
          }
        });
      }
    ));
    return updatedPassport ? true : false;
  }


  export function init(appRouter): string {
    appRouter.use(passport.initialize());
    initializePassportLocalStrategy();
    return 'success';
  }

}
