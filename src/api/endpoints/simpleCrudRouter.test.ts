import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {router} from "../Router";
// import {database} from "../../index";
import {Connect} from "../../db/Connect";
import {crudRead, crudCreate} from "../../db/crud";


chai.use(chaiHttp);
const expect = chai.expect;

describe('Simple CRUD Route Test', () => {

  /*
   it('responds with JSON array', () => {
   return chai.request(router).get('/api/v1/heroes')
   .then(res => {
   expect(res.status).to.equal(200);
   expect(res).to.be.json;
   expect(res.body).to.be.an('array');
   expect(res.body).to.have.length(5);
   });
   });

   it('should include Wolverine', () => {
   return chai.request(router).get('/api/v1/heroes')
   .then(res => {
   let Wolverine = res.body.find(hero => hero.name === 'Wolverine');
   expect(Wolverine).to.exist;
   expect(Wolverine).to.have.all.keys([
   'id',
   'name',
   'aliases',
   'occupation',
   'gender',
   'height',
   'hair',
   'eyes',
   'powers'
   ]);
   });
   });*/

  it('should return the item', (done) => {

    new Connect().connectToDatabase((database) => {
      crudCreate({"hello": "world"}, 'items', (err, item) => {
        return chai.request(router).get(`/api/v1/items/${item.id}`)
            .then(res => {
              expect(res.body.hello).to.equal('world');
            });
      })
    });


  });

});