import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import Bcrypt from './Bcrypt';

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
        console.log('Error while decrypting:', err);
      })
    }, (err) => {
      console.log('Error while encrypting:', err);
    })
  });

});