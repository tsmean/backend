import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";
import {database} from "../../db/Database";
import {crud} from "../../db/crud";
import {beforeEachDo} from "../../BeforeEachs";


chai.use(chaiHttp);
const expect = chai.expect;

describe('Simple CRUD Route Test', () => {

  beforeEachDo.connectTestToDatabase();

  it('should return the item', (done) => {

    crud.create({"hello": "world"}, 'items', (err, item) => {
      chai.request(router).get(`/api/v1/items/${item.insertedId}`)
          .end((err, res) => {
            expect(res.body.data.hello).to.equal('world');
            done();
          });
    });

  });

  it('should work with promise', (done) => {
    //TODO: Find out why then is not working?!
    //See docs: https://github.com/chaijs/chai-http
    crud.create({"hello": "world"}, 'items', (err, item) => {
      chai.request(router).get(`/api/v1/items/${item.insertedId}`)
          .then(res => {
            expect(res.body.data.hello).to.equal('world');
            done();
          }, err => {
            console.log("ERROR:", err);
            done();
          })
          .catch(function (err) {
            throw err;
          });
    });
  })

});