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

describe('Test Login', () => {

  it('should be able to login', (done) => {
    chai.request(router)


        .post(`/api/v1/login`)
        .send({
          email: 'hans',
          password: '1234'
        })

        //.get(`/welcome`)

        .then((resp) => {
          log.debug('success!');
          expect(resp.body.data.firstName).to.equal('bla');

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