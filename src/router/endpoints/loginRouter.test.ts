import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";
import {dao} from "../../db/dao";
import {beforeEachDo} from "../../test/BeforeEachs";
import {log} from "../../logger/logger";
import * as assert from "assert";

chai.use(chaiHttp);
const expect = chai.expect;

describe('LoginRouter', () => {

  beforeEachDo.connectTestToDatabase();

  it('should be able to login', (done) => {

    const user = {
      email: 'hans',
      password: '1234'
    };

    //TODO: test that user can only be created once

    dao.create(user, 'Users', (dbResp) => {

      expect(dbResp.error).to.be.null;

      chai.request(router)
          .post(`/api/v1/login`)
          .send({
            email: user.email,
            password: user.password
          })
          .then((resp: any) => {
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


});