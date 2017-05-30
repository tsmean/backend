import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../router";
import {beforeEachDo} from "../../test/before-eachs";
import {log} from "../../logger/logger";
import * as assert from "assert";
import {User} from "../../db/user.model";
import {userDAO} from "../../db/user-dao";

chai.use(chaiHttp);
const expect = chai.expect;

describe('UserRouter', () => {

  beforeEachDo.connectTestToDatabase();

  it('should be able to create user', (done) => {

    const user: User = {
      email: 'hans'
    };

    const plaintextPassword: string = 'Hello World';

    chai.request(router)
        .post(`/api/v1/users`)
        .send({
          user: user,
          password: plaintextPassword
        })
        .then((resp: any) => {
          expect(resp.body.data.uid).to.exist;
          done();
        }, (err) => {
          log.error(err);
          assert(false);
          done();
        })
        .catch((err) => { //TODO: do i really need catch here?
          throw err;
        });

  });

  it('should be able to fetch a user', (done) => {
    const user: User = {
      email: 'hans'
    };

    const plaintextPassword: string = 'Hello World';

    userDAO.create(user, plaintextPassword, (dbResp) => {
      const user: User = dbResp.data;
      chai.request(router)
          .post(`/api/v1/login`)
          .send({
            email: user.email,
            password: plaintextPassword
          })
          .then((resp: any) => {
            chai.request(router).get('/api/v1/users/' + user.uid)
                .then(resp2 => {
                  expect(resp2.body.data.email).to.equal('hans');
                  done();
                }, errorResp => {
                  assert(false, 'error on getting user:' + errorResp);
                })
                .catch((err) => {
                  throw err;
                });
          }, (err) => {
            log.error(err);
            assert(false);
            done();
          })
          .catch((err) => {
            throw err;
          });
    });

  });



});