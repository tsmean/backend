import * as mocha from 'mocha';
import * as chai from 'chai';
import {dao} from './dao';
import {beforeEachDo} from '../test/before-eachs';
import {DatabaseResponse} from './database-response.model';
import readAll = dao.readAll;
const expect = chai.expect;

describe('DAO', () => {

  beforeEachDo.connectTestToDatabase();

  it ('should be able to create', (done) => {
    const user = {
      firstName: 'Brandon',
      lastName: 'Stark',
      email: 'brandon.stark@gmail.com'
    };
    dao.create(user, 'users', (dbResp) => {
      expect(dbResp.error).to.equal(null);
      expect(dbResp.data.uid).to.equal(1);
      done();
    });
  });

  it ('should be able to read one', (done) => {
    const user = {
      firstName: 'Brandon',
      lastName: 'Stark',
      email: 'brandon.stark@gmail.com'
    };
    dao.create(user, 'users', (dbResp) => {
      expect(dbResp.error).to.equal(null);
      expect(dbResp.data.uid).to.equal(1);
      dao.read(1, 'users', (innerDbResp) => {
        expect(innerDbResp.error).to.equal(null);
        expect(innerDbResp.data.uid).to.equal(1);
        expect(innerDbResp.data.firstName).to.equal('Brandon');
        done();
      });
    });
  });

  it ('should be able to read one by field', (done) => {
    const user = {
      firstName: 'Brandon',
      lastName: 'Stark',
      email: 'brandon.stark@gmail.com'
    };
    dao.create(user, 'users', (dbResp) => {
      expect(dbResp.error).to.equal(null);
      expect(dbResp.data.uid).to.equal(1);
      dao.readOneByField('email', user.email, 'users', (innerDbResp) => {
        expect(innerDbResp.error).to.equal(null);
        expect(innerDbResp.data.uid).to.equal(1);
        expect(innerDbResp.data.firstName).to.equal('Brandon');
        done();
      });
    });
  });

  it ('should be able to update', (done) => {
    const user: any = {
      firstName: 'Brandon',
      lastName: 'Stark',
      email: 'brandon.stark@gmail.com',
    };

    dao.create(user, 'users', (dbResp) => {

      expect(dbResp.error).to.equal(null);
      expect(dbResp.data.uid).to.equal(1);
      user.uid = 1;
      user.firstName = 'Sansa';
      dao.update(user, 'users', (innerDbResp) => {
        expect(innerDbResp.error).to.equal(null);
        expect(innerDbResp.data.firstName).to.equal('Sansa');
        done();
      });
    });
  });

  it ('should be able to remove', (done) => {
    const user: any = {
      firstName: 'Brandon',
      lastName: 'Stark',
      email: 'brandon.stark@gmail.com',
    };
    dao.create(user, 'users', (dbResp) => {
      expect(dbResp.error).to.equal(null);
      expect(dbResp.data.uid).to.equal(1);
      dao.remove(1, 'users', (innerDbResp) => {
        expect(innerDbResp.error).to.equal(null);
        done();
      });
    });
  });

  it ('should be able read all', (done) => {
    const user: any = {
      firstName: 'Brandon',
      lastName: 'Stark',
      email: 'brandon.stark@gmail.com',
    };
    dao.create(user, 'users', (dbResp) => {
      expect(dbResp.error).to.equal(null);
      expect(dbResp.data.uid).to.equal(1);
      dao.readAll('users', (innerDbResp) => {
        expect(innerDbResp.error).to.equal(null);
        expect(innerDbResp.data.length).to.equal(1);
        done();
      });
    });
  });

});
