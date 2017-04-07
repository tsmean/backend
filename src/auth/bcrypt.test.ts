import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import Bcrypt from './Bcrypt';
import {log} from "../logger";

chai.use(chaiHttp);
const expect = chai.expect;

describe('bcrypt', () => {

  it('should be encrypt & decrypt', (done) => {

    const mypw = 'Hello World';

    Bcrypt.doHash(mypw).then(encrypted => {
      Bcrypt.doCompare(mypw, encrypted).then((decrypted) => {
        expect(decrypted).to.equal(true);
        done();
      }, (err) => {
        log.error('Error while decrypting:');
        log.error(err);
      })
    }, (err) => {
      log.error('Error while encrypting:');
      log.error(err);
    })
  });

});