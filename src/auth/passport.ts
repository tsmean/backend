import * as passport from 'passport';
import * as local from 'passport-local';
import {dao} from '../db/dao';
import {passwordCryptographer} from './password-cryptographer';
import {User} from '../db/user.model';
import {userDAO} from '../db/user-dao';
import * as expressSession from 'express-session';

import * as express from 'express';


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
            return done(dbResp);
          } else if (!dbResp.data) {
            return done(null, false, { message: 'Incorrect username.' });
          } else {
            passwordCryptographer.doCompare(password, dbResp.data.password.hash).then(isMatching => {
              if (!isMatching) {
                return done(null, false, { message: 'Incorrect password.' });
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

  function sessionSetup(appRouter) {
    // appRouter.use(cookieParser());
    appRouter.use(expressSession({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));

    passport.serializeUser(function(user: User, done) {
      done(null, user.uid);
    });

    passport.deserializeUser(function(id, done) {
      console.log(id);

      // userDAO.getById(id, function(err, user) {
      //   done(err, user);
      // });
    });
  }

  export function init(appRouter): string {
    appRouter.use(passport.initialize());
    sessionSetup(appRouter);
    initializePassportLocalStrategy();
    return 'success';
  }

}
