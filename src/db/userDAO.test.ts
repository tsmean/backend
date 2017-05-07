import * as mocha from 'mocha';
import * as chai from 'chai';
import {beforeEachDo} from "../test/BeforeEachs";
import {userDAO} from "./UserDAO";
import {User} from "../../../models/src/user.model";
const expect = chai.expect;

describe('UserDAO', () => {

  beforeEachDo.connectTestToDatabase();

  it("should be able to retrieve user", function(done) {

    const user: User = {
      email: 'hans',
      password: {
        hash: '1234',
        algorithm: "bcrypt"
      }
    };

    //TODO: clarify whether you really want a triple parameter callback
    //isn't just either result or item enough?

    userDAO.create(user, (dbResponse) => {
      expect(dbResponse.error).to.be.null;
      expect(dbResponse.data.uid).to.exist;
      done();
    })

  });

});