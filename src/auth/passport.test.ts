import * as mocha from 'mocha';
import * as chai from 'chai';

import Bcrypt from './Bcrypt';
import {log} from "../logger/logger";
import {myPassport} from "./Passport";
import * as passport from "passport";

const expect = chai.expect;

describe('MyPassport', () => {



  it('should be able to login as hans', (done) => {
    myPassport; //make sure it exists...
    expect(passport.authenticate('local', (req, res) => {

    })).to.equal({
      email: 'hans@bla',
      firstName: 'bla',
      lastName: 'blub'
    });

  });

});
