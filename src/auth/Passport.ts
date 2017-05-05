import * as passport from 'passport'
import * as local from 'passport-local'

class Passport {

  LocalStrategy = local.Strategy;

  constructor() {
    passport.use(new this.LocalStrategy(
        function(username, password, done) {


          if (username !== 'hans') {
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


          /*
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
          });
          */


        }
    ));
  }


}

export const myPassport = new Passport();