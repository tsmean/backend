import * as passport from 'passport'
import * as local from 'passport-local'

class Passport {

  LocalStrategy = local.Strategy;

  /*
  constructor() {
    passport.use(new this.LocalStrategy(
        function(username, password, done) {
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
        }
    ));
  }
  */

}

export default new Passport();