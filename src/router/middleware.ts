// Configure Express middleware.

// Creates and configures an ExpressJS web server.
import bodyParser = require('body-parser');
import * as passport from 'passport';
class Middleware {

  public addBodyParser(express): void {
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({ extended: false }));
    express.use(passport.initialize());
  }

}

export const middleware = new Middleware();
