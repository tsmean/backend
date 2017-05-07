import * as mocha from 'mocha';
import * as chai from 'chai';

import Bcrypt from './Bcrypt';
import {log} from "../logger/logger";
import {myPassport} from "./Passport";
import * as passport from "passport";

const expect = chai.expect;

describe('MyPassport', () => {

  //TODO: this doesn't really test whether configuration was successful. Find a better way?

  it('should have registered the local strategy', () => {
    myPassport; //make sure it exists...
    expect(passport).not.to.be.null;
    expect(myPassport.constructed).to.be.true;
  });

});
