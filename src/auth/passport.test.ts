import * as mocha from 'mocha';
import * as chai from 'chai';
import {myPassport} from "./passport";
import * as passport from "passport";

const expect = chai.expect;

describe('MyPassport', () => {

  it('should have registered the local strategy', () => {
    expect(passport).not.to.be.null;
    expect(myPassport.constructed).to.be.true;
  });

});
