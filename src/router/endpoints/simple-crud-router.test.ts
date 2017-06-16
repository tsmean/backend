import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from '../router';
import {beforeEachDo} from '../../test/before-eachs';
import {log} from '../../logger/logger';
import * as assert from 'assert';
import {dao} from '../../db/dao';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Simple CRUD Route Test', () => {

  beforeEachDo.connectTestToDatabase();

  it('should return the item', (done) => {
    dao.create({'hello': 'world'}, 'items', (dbResp) => {
      chai.request(router).get(`/api/v1/items/${dbResp.data.uid}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          });
    });
  });

  it('should return all items', (done) => {
    dao.create({'hello': 'world'}, 'items', (dbResp1) => {
      dao.create({'goodbye': 'world'}, 'items', (dbResp2) => {
        chai.request(router).get(`/api/v1/items`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(Array.isArray(res.body.data)).to.be.true;
              expect(res.body.data.length).to.equal(2);
              done();
            });
      });
    });
  });

  it('should work with promise', (done) => {
    dao.create({'hello': 'world'}, 'items', (dbResp) => {
      chai.request(router).get(`/api/v1/items/${dbResp.data.uid}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          }, err => {
            done();
          })
          .catch(function (err) {
            throw err;
          });
    });
  });


  it('should be able to create', (done) => {
    chai.request(router)
        .post(`/api/v1/items`)
        .send({
          'hair': 'red',
          'nose': 'long'
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.data.hair).to.equal('red');
          expect(res.body.data.uid).to.exist;
          done();
        }, err => {
          log.error('Error on POST request:');
          log.error(err);
          done();
        })
        .catch(function (err) {
          throw err;
        });
  });

  it('should be able to update', (done) => {
    const item: any = {'hello': 'world'};
    dao.create(item, 'items', (dbResp) => {
      dbResp.data.hello = 'planet';
      chai.request(router)
          .put(`/api/v1/items`)
          .send(dbResp.data)
          .then(res => {
            expect(res).to.have.status(200);
            chai.request(router).get(`/api/v1/items/${dbResp.data.uid}`).then((res2) => {
              expect(res2.body.data.hello).to.equal('planet');
              done();
            }, () => {
              log.error('Error on GET request');
              done();
            });
          }, err => {
            log.error('Error on PUT request:');
            log.error(err);
            done();
          })
          .catch(function (err) {
            throw err;
          });
    });
  });


  it('should be able to delete', (done) => {
    dao.create({'hello': 'world'}, 'items', (dbResp) => {
      chai.request(router)
          .del(`/api/v1/items/${dbResp.data.uid}`)
          .then(res => {
            expect(res).to.have.status(200);
            chai.request(router).get(`/api/v1/items/${dbResp.data.uid}`).then(() => {
              // shouldnt find anything
              assert(false);
            }, () => {
              // TODO: make this a 404
              // expect(res.status).to.equal(500);
              done();
            });
          }, err => {
            done();
          })
          .catch(function (err) {
            throw err;
          });
    });
  });


});
