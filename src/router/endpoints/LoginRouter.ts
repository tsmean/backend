import {Router, Request, Response, NextFunction} from 'express';
import * as passport from "passport";
import {log} from "../../logger/logger";

export class LoginRouter {
  router: Router;


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/login', passport.authenticate('local'),
        function(req, res) {
          // If this function gets called, authentication was successful.
          // `req.user` contains the authenticated user.
          res.redirect('/users/' + req.user.username);
          log.info('=======AUTHENTICATED=======')
        });
  }

  /**
   * Initialize the login
   */
  constructor() {
    this.router = Router();
    this.init();
  }


}

// Create the CrudRouter, and export its configured Express.Router
const intialRouter = new LoginRouter();
intialRouter.init();

export const loginRouter = intialRouter.router;