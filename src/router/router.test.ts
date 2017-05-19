import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import {router} from './router';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Router Test', () => {

  it('should be json', () => {
    return chai.request(router).get('/')
        .then(res => {
          expect(res.type).to.eql('application/json');
        });
  });

  it('should have a message prop', () => {
    return chai.request(router).get('/')
        .then(res => {
          expect(res.body.message).to.eql('Hello World!');
        });
  });

});