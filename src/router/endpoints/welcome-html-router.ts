import {Router, Request, Response, NextFunction} from 'express';

export class WelcomeHtmlRouter {

  router: Router;

  /**
   * Attach handler to endpoint.
   */
  init() {
    this.router.get('/', this.welcome);
  }

  /**
   * Initialize the WelcomeHtmlRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  public welcome(req: Request, res: Response, next: NextFunction) {
    res.status(200)
        .send(`<html><head><title>My Title</title></head><body><p>Welcome!</p></body></html>`);
  }


}

// Create the SecondRouter, and export its configured Express.Router
const intialRouter = new WelcomeHtmlRouter();
intialRouter.init();

export const welcomeHtmlRouter = intialRouter.router;
