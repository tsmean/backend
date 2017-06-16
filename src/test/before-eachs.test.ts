import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {beforeEachDo} from '../test/before-eachs';

chai.use(chaiHttp);
const expect = chai.expect;


describe('Connect Test', () => {

  beforeEachDo.connectTestToDatabase();

  it('should be able to execute before eachs', function(done) {
    done();
  });

});
