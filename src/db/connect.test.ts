import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {Connect} from "./Connect";

chai.use(chaiHttp);
const expect = chai.expect;


describe('Connect Test', () => {

  const item = {
    text: 'Hello World'
  };

  it("should be able to connect", function(done) {

    const cb = (db) => {
      expect(db !== undefined).to.be.true;
      db.collection('notes').insertOne(item, function(err, result) {
        expect(err).to.equal(null);
        expect(result.insertedCount).to.equal(1);
        done();
      });
    };

    new Connect().connectToDatabase(cb);

  });

});