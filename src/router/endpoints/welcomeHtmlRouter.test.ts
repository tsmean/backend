import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test simple welcome Html Router', () => {

  it('should return html containing the word welcome', (done) => {
    chai.request(router)
        .get(`/welcome`)
        .then((resp) => {
          expect((<any>resp).text).to.contain('Welcome!');
          done();
        });
  });

});