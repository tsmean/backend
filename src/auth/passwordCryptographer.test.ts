import * as mocha from 'mocha';
import * as chai from 'chai';

import {passwordCryptographer} from './PasswordCryptographer';
import {log} from "../logger/logger";

const expect = chai.expect;

describe('bcrypt', () => {

  it('should be encrypt & decrypt', (done) => {

    const mypw = 'Hello World';

    passwordCryptographer.doHash(mypw).then(encrypted => {
      passwordCryptographer.doCompare(mypw, encrypted).then((isMatching: boolean) => {
        expect(isMatching).to.equal(true);
        done();
      }, (err) => {
        log.error('Error while comparing:');
        log.error(err);
      })
    }, (err) => {
      log.error('Error while encrypting:');
      log.error(err);
    })
  });

});