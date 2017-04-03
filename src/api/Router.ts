import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {simpleCrudRouter} from './endpoints/SimpleCrudRouter';
import session = require("express-session");
//const RedisStore = require('connect-redis')(session);
//import * as passport from 'passport';

// Creates and configures an ExpressJS web server.
class Router {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    /* TODO: find problematic part, test
    this.express.use(session({
      store: new RedisStore({
        url: appConfig.appConfig.redis.url
      }),
      secret: appConfig.appConfig.redis.secret,
      resave: false,
      saveUninitialized: false
    }));
    this.express.use(passport.initialize());
    this.express.use(passport.session());
    */
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.express.use('/', router);
    this.express.use('/api/v1/heroes', simpleCrudRouter);
  }

}

export const router = new Router().express;
