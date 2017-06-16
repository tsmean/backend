import {Router, Request, Response, NextFunction} from 'express';
import {dao} from '../../db/dao';
import {api} from '../api';

export class SimpleCrudRouter {
  router: Router;

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/:resource', this.create);
    this.router.get('/:resource', this.getAll);
    this.router.get('/:resource/:id', this.getOne);
    this.router.put('/:resource', this.updateOne);
    this.router.delete('/:resource/:id', this.deleteOne);
  }

  /**
   * Initialize the CrudRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * CREATE one resource
   */
  public create(req: Request, res: Response, next: NextFunction) {

    const resource = req.body;
    const resourceName = req.params.resource;

    dao.create(resource, resourceName, (dbResp) => {
      if (dbResp.error) {
        res.status(500).send({
          message: 'Server error',
          status: res.status
        });
      } else {
        res.status(201)
          res.location(`${api.root()}/${resourceName}/${dbResp.data.insertId}`)
            .send({
              message: 'Success',
              status: res.status,
              data: dbResp.data
            });
      }
    });

  }

  /**
   * GET one resource by id
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    const resourceId = req.params.id;
    const resourceName = req.params.resource;

    dao.read(resourceId, resourceName, (dbResp) => {
      if (dbResp.error) {
        res.status(500).send({
          message: 'Server error',
          status: res.status
        });
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data: dbResp.data
            });
      }
    });
  }

  /**
   * UPDATE one resource by id
   */
  public updateOne(req: Request, res: Response, next: NextFunction) {
    const resourceName = req.params.resource;

    dao.update(req.body, resourceName, (dbResp) => {

      if (dbResp.error) {
        res.status(500).send({
          message: `Database error:(${dbResp.error.code}) ${dbResp.error.message}`,
          status: res.status
        });
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data: dbResp.data
            });
      }


    });
  }


  /**
   * GET all Resources.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    const resourceName = req.params.resource;

    dao.readAll(resourceName, (dbResp) => {
      if (dbResp.error) {
        res.status(500).send({
          message: 'Server error',
          status: res.status
        });
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data: dbResp.data
            });
      }
    });
  }

  /**
   * DELETE one resource by id
   */
  public deleteOne(req: Request, res: Response, next: NextFunction) {
    const resourceId = req.params.id;
    const resourceName = req.params.resource;

    dao.remove(resourceId, resourceName, (dbResp) => {
      if (dbResp.error) {
        res.status(500).send({
          message: 'Server error',
          status: res.status
        });
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status
            });
      }
    });
  }


}

// Create the CrudRouter, and export its configured Express.Router
const intialRouter = new SimpleCrudRouter();
intialRouter.init();

export const simpleCrudRouter = intialRouter.router;
