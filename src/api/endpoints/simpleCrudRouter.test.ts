import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";
import {crud} from "../../db/crud";
import {beforeEachDo} from "../../test/BeforeEachs";
import {log} from "../../logger/logger";

chai.use(chaiHttp);
const expect = chai.expect;

describe('Simple CRUD Route Test', () => {

  beforeEachDo.connectTestToDatabase();

  it('should return the item', (done) => {

    crud.create({"hello": "world"}, 'items', (err, item) => {
      chai.request(router).get(`/api/v1/items/${item.insertedId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          });
    });

  });

  it('should work with promise', (done) => {
    crud.create({"hello": "world"}, 'items', (err, item) => {
      chai.request(router).get(`/api/v1/items/${item.insertedId}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body.data.hello).to.equal('world');
            done();
          }, err => {
            log.error('Error on GET request:');
            log.error(err);
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
          expect(res.body.data._id).to.exist;
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



});