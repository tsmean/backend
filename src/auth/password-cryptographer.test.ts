import * as mocha from 'mocha';
import * as chai from 'chai';

import {log} from '../logger/logger';
import {passwordCryptographer} from './password-cryptographer';

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
      });
    }, (err) => {
      log.error('Error while encrypting:');
      log.error(err);
    });
  });

  it('shouldnt allow wrong comparisons', (done) => {
    passwordCryptographer.doCompare('a', 'jklasdjlqewjk').then((isMatching: boolean) => {
      expect(isMatching).to.equal(false);
      done();
    }, (err) => {
      log.error('Error while comparing:');
      log.error(err);
      done();
    });
  });

});
