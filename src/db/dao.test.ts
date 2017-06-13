import * as mocha from 'mocha';
import * as chai from 'chai';
import {dao} from './dao';
import {beforeEachDo} from '../test/before-eachs';
import {DatabaseResponse} from './database-response.model';
const expect = chai.expect;

describe('DAO', () => {

  beforeEachDo.connectTestToDatabase();

  // TODO: remove unnecessary nesting
  it('should be able to insert, read, update, delete', function(done) {

    const item = {text: 'hello'};

    const doDelete = (id: string) => {
      dao.remove(id, 'items', (dbResponse: DatabaseResponse) => {
        expect(dbResponse.error).to.equal(null);
        done();
      });
    };

    const doUpdate = (updateItem) => {
      updateItem.text = updateItem.text + ' world!';

      dao.update(updateItem, 'items', (dbResp) => {

        expect(dbResp.error).to.equal(null);

        const doReadTwo = (id: string) => {
          dao.read(id, 'items', (dbResp2) => {
            expect(dbResp2.error).to.equal(null);
            expect(dbResp2.data.text).to.equal('hello world!');
            doDelete(updateItem.uid);
          });
        };
        doReadTwo(updateItem.uid);

      });
    };

    const doRead = (uid: string) => {
      dao.read(uid, 'items', (dbResponse: DatabaseResponse) => {

        expect(dbResponse.error).to.equal(null);
        expect(dbResponse.data.text).to.equal('hello');
        expect(dbResponse.data.uid).to.exist;

        doUpdate(dbResponse.data);

      });
    };


    const doCreate = () => {
      dao.create(item, 'items', (dbResp) => {
        expect(dbResp.error).to.equal(null);
        doRead(dbResp.data.uid);
      });
    };

    const start = () => {
      doCreate();
    };

    start();

  });

  it('should be able to readAll', function(done) {

    const item = {hello: 'world'};
    const item2 = {hello: 'world'};


    dao.create(item, 'items', (dbResp) => {
      dao.create(item, 'items', (dbResp2) => {
        dao.readAll('items', dbResp3 => {
          expect(dbResp3.error).to.be.null;
          expect(Array.isArray(dbResp3.data)).to.be.true;
          expect(dbResp3.data.length).to.equal(2);
          done();
        });
      });
    });

  });

});
