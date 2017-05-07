import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";
import {crud} from "../../db/crud";
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

    //TODO: user should only be created once.

    crud.create(user, 'Users', (err, result) => {

      expect(err).to.be.null;

      chai.request(router)
          .post(`/api/v1/login`)
          .send({
            email: user.email,
            password: user.password
          })
          .then((resp: any) => {
            expect(resp.body.data._id).to.equal(result.insertedId.toHexString());
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