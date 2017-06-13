import * as mocha from 'mocha';
import * as chai from 'chai';
import {passportInit} from './passport';
import * as express from 'express';

const expect = chai.expect;

describe('MyPassport', () => {

  it('should have registered the local strategy', () => {
    expect(passportInit.init(express())).to.equal('success');
  });

});
