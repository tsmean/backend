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
      expect(dbResp.error).to.be.null;
      chai.request(router).get(`/api/v1/items/${dbResp.data.insertId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          });
    });
  });

  it('should return all items', (done) => {
    dao.create({'hello': 'world'}, 'items', (dbResp1) => {
      expect(dbResp1.error).to.be.null;
      dao.create({'hello': 'universe'}, 'items', (dbResp2) => {
        expect(dbResp2.error).to.be.null;
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
      chai.request(router).get(`/api/v1/items/${dbResp.data.insertId}`)
          .then(res => {

            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          }, err => {
            log.error('Error on GET request:');
            log.error(err);
            assert(false);
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
          'hello': 'world'
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body.data.insertId).to.exist;
          done();
        }, err => {
          log.error('Error on POST request:');
          log.error(err);
          assert(false);
        })
        .catch(function (err) {
          throw err;
        });
  });

  it('should be able to update', (done) => {
    const item: any = {'hello': 'world'};
    dao.create(item, 'items', (dbResp) => {
      item.hello = 'planet';
      item.uid = dbResp.data.insertId;
      chai.request(router)
          .put(`/api/v1/items`)
          .send(item)
          .then(res => {
            expect(res).to.have.status(200);
            chai.request(router).get(`/api/v1/items/${dbResp.data.insertId}`).then((res2) => {
              expect(res2.body.data.hello).to.equal('planet');
              done();
            }, () => {
              log.error('Error on GET request');
            });
          }, err => {
            log.error('Error on PUT request:');
            log.error(err);
          })
          .catch(function (err) {
            throw err;
          });
    });
  });


  it('should be able to delete', (done) => {
    dao.create({'hello': 'world'}, 'items', (dbResp) => {
      expect(dbResp.error).to.be.null;
      chai.request(router)
          .del(`/api/v1/items/${dbResp.data.insertId}`)
          .then(res => {
            expect(res).to.have.status(200);
            dao.read(1, 'items', (dbResponse => {
              expect(dbResponse.data).to.be.undefined;
              done();
            }));
          }, err => {
            log.error('Error on DELETE request:');
            log.error(err);
            assert(false);
          })
          .catch(function (err) {
            throw err;
          });
    });
  });


});
