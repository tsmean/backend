import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {database} from './database';
import {beforeEachDo} from '../test/before-eachs';

chai.use(chaiHttp);
const expect = chai.expect;


describe('Connect Test', () => {

  beforeEachDo.connectTestToDatabase();

  it('should be able to write to db', function(done) {

    const item = {
      text: 'Hello World'
    };

    expect(database.database !== undefined).to.be.true;
    const sql = `INSERT INTO users (email, firstName, lastName) VALUES ('bla@bla.com', 'Urs', 'Schweizer')`;
    database.database.query(sql, function(err, result) {
      expect(err).to.equal(null);
      expect(result.affectedRows).to.equal(1);
      done();
    });

  });

});
