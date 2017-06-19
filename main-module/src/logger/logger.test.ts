import * as mocha from 'mocha';
import * as chai from 'chai';

import {log} from './logger';

const expect = chai.expect;

describe('Logger', () => {

  it('should be able to log', () => {
    log.info('Hello');
    log.warn('World.');
    log.debug('You are');
    log.error('nice.');
  });

});
