import * as mocha from 'mocha';
import * as chai from 'chai';
import {crud} from "./crud";
import {beforeEachDo} from "../test/BeforeEachs";
const expect = chai.expect;

describe('UserDAO', () => {

  beforeEachDo.connectTestToDatabase();

  it("should be able to retrieve user", function(done) {

    const user = {
      email: 'hans',
      password: '1234'
    };

    //TODO: clarify whether you really want a triple parameter callback
    //isn't just either result or item enough?

    crud.create(user, 'Users', (err, result, u) => {
      expect(err).to.be.null;
      expect(u._id).to.exist;
      done();
    })

  });

});