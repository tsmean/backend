// Configure Express middleware.

// Creates and configures an ExpressJS web server.
import bodyParser = require("body-parser");
class Middleware {

  public addBodyParser(express): void {
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({ extended: false }));
  }

}

export const middleware = new Middleware();
