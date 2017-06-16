import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from '../router';
import {beforeEachDo} from '../../test/before-eachs';
import {log} from '../../logger/logger';
import * as assert from 'assert';
import {User} from '../../db/user.model';
import {userDAO} from '../../db/user-dao';

chai.use(chaiHttp);
const expect = chai.expect;

describe('LoginRouter', () => {

  beforeEachDo.connectTestToDatabase();

  it('should be able to login', (done) => {

    const user: User = {
      email: 'hans'
    };

    const plaintextPassword = 'Hello World';

    userDAO.create(user, plaintextPassword, (dbResp) => {

      expect(dbResp.error).to.be.null;

      chai.request(router)
        .post(`/api/v1/login`)
        .send({
          email: user.email,
          password: plaintextPassword
        }).then((resp: any) => {
        expect(resp.body.data.uid).to.equal(dbResp.data.uid);
        done();
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

  it('shouldnt be able to login with wrong password', (done) => {

    const user: User = {
      email: 'hans'
    };

    const plaintextPassword = 'Hello World';

    userDAO.create(user, plaintextPassword, (dbResp) => {

      expect(dbResp.error).to.be.null;

      chai.request(router)
        .post('/api/v1/login')
        .send({
          email: user.email,
          password: 'some wrong password'
        })
        .catch((err) => {
          expect(err.response.res.statusCode).to.equal(401);
          done();
        });
    });

  });

});
