import {dbadapter} from './dbadapter';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as express from 'express';

const expect = chai.expect;

describe('DAO Test', () => {

  it('should return correct layer', () => {
    expect(dbadapter('mongo')).to.exist;
    expect(dbadapter('mongo').dao).to.exist;
    expect(dbadapter('mysql')).to.exist;
    expect(dbadapter('mysql').dao).to.exist;
  });

});

