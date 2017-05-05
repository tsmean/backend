import {Router, Request, Response, NextFunction} from 'express';
import {crud} from "../../db/crud";
import {log} from '../../logger/logger';
import {ObjectID} from "bson";

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

    crud.create(resource, resourceName, (err, result) => {
      if (err) {
        res.status(500).send({
          message: "Server error",
          status: res.status
        })
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data: resource
            })
      }
    })

  }



  /**
   * GET one resource by id
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    const resourceId = req.params.id;
    const resourceName = req.params.resource;

    crud.read(resourceId, resourceName, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Server error",
          status: res.status
        })
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data
            })
      }
    });
  }

  /**
   * UPDATE one resource by id
   */
  public updateOne(req: Request, res: Response, next: NextFunction) {
    const resourceName = req.params.resource;

    req.body._id = ObjectID.createFromHexString(req.body._id);

    crud.update(req.body, resourceName, (err, result) => {

      if (err) {
        res.status(500).send({
          message: "Server error",
          status: res.status
        })
      } else {

        if (result.modifiedCount !== 1) {
          res.status(404).send({
            message: "Resource not found",
            status: res.status
          })
        } else {
          res.status(200)
              .send({
                message: 'Success',
                status: res.status,
                result
              })
        }

      }
    });
  }


  /**
   * GET all Resources.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    // not implemented
  }

  /**
   * DELETE one resource by id
   */
  public deleteOne(req: Request, res: Response, next: NextFunction) {
    const resourceId = req.params.id;
    const resourceName = req.params.resource;

    crud.delete(resourceId, resourceName, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Server error",
          status: res.status
        })
      } else {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              data
            })
      }
    });
  }


}

// Create the CrudRouter, and export its configured Express.Router
const intialRouter = new SimpleCrudRouter();
intialRouter.init();

export const simpleCrudRouter = intialRouter.router;