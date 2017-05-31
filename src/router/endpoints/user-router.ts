import {Router, Request, Response, NextFunction} from 'express';
import * as passport from "passport";
import {log} from "../../logger/logger";
import {dao} from "../../db/dao";
import {userDAO} from "../../db/user-dao";

export class UserRouter {
  router: Router;

  /**
   * Take login handler and attach to login endpoint, but precede it with authentication
   */
  init() {
    this.router.post('/users',
        this.postHandler);
    this.router.get('/users/:id',
    this.getHandler)
  }

  /**
   * Initialize the login
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  private postHandler(req: Request, res: Response, next: NextFunction) {
    userDAO.create(req.body.user, req.body.password, (dbResponse => {
      if (dbResponse.error) {
        if (dbResponse.error.message === 'User already exists') {
          res.statusMessage = dbResponse.error.message;
          res.status(403).send()
        } else {
          res.statusMessage = dbResponse.error.message;
          res.status(500).send()
        }
      } else {
        res.status(200).send({
          message: 'Success',
          status: res.status,
          data: dbResponse.data
        })
      }
    }));
  }

  private getHandler(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    dao.read(userId, 'users', (dbResp) => {
      if (dbResp.error) {
        res.status(500).send({
          message: "Server error",
          status: res.status
        })
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data: dbResp.data
            })
      }
    });
  }

}

// Create the CrudRouter, and export its configured Express.Router
const intialRouter = new UserRouter();
intialRouter.init();

export const userRouter = intialRouter.router;