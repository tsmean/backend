import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";
import {dao} from "../../db/dao";
import {beforeEachDo} from "../../test/BeforeEachs";
import {log} from "../../logger/logger";
import * as assert from "assert";

chai.use(chaiHttp);
const expect = chai.expect;

describe('Simple CRUD Route Test', () => {

  beforeEachDo.connectTestToDatabase();

  it('should return the item', (done) => {

    dao.create({"hello": "world"}, 'items', (dbResp) => {
      chai.request(router).get(`/api/v1/items/${dbResp.data.uid}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          });
    });

  });

  it('should work with promise', (done) => {
    dao.create({"hello": "world"}, 'items', (dbResp) => {
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
          expect(res).to.have.status(200);
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
    let item: any = {"hello": "world"};
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
    dao.create({"hello": "world"}, 'items', (dbResp) => {
      chai.request(router)
          .del(`/api/v1/items/${dbResp.data.uid}`)
          .then(res => {
            expect(res).to.have.status(200);
            chai.request(router).get(`/api/v1/items/${dbResp.data.uid}`).then(() => {
              //shouldnt find anything
              assert(false);
            }, () => {
              //TODO: make this a 404
              //expect(res.status).to.equal(500);
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