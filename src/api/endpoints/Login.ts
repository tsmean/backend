import {Router, Request, Response, NextFunction} from 'express';
import * as passport from "passport";

export class SimpleCrudRouter {
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