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
    this.router.post('/login',
        passport.authenticate('local', { session: false }),
        this.loginHandler);

    //this.router.post('/login', this.loginHandler);

  }

  /**
   * Initialize the login
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public loginHandler(req: Request, res: Response, next: NextFunction) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    log.info('=======AUTHENTICATED=======');
    res.status(200).send({
      message: 'Success',
      status: res.status,
      data: {
        firstName: 'bla'
      }
    })
  }

}

// Create the CrudRouter, and export its configured Express.Router
const intialRouter = new LoginRouter();
intialRouter.init();

export const loginRouter = intialRouter.router;