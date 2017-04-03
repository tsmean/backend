import * as mocha from 'mocha';
import * as chai from 'chai';
import {crudRead, crudCreate, crudUpdate, crudDelete} from "./crud";
import {Connect} from "./Connect";

const expect = chai.expect;

describe('CRUD', () => {

  it("should be able to insert, read, update, delete", function(done) {

    const item = {text: 'hello'};

    const start = () => {
      doCreate();
    };

    const doReadOne = (id: string) => {
      crudRead(id, 'items', (err, item) => {

        expect(err).to.equal(null);
        expect(item.text).to.equal("hello");
        expect(item._id).to.exist;

        doUpdate(item);

      });
    };

    const doReadTwo = (id: string) => {
      crudRead(id, 'items', (err, item) => {

        expect(err).to.equal(null);
        expect(item.text).to.equal("hello world!");

        doDelete(item._id);

      });
    };

    const doDelete = (id: string) => {
      crudDelete(id, 'items', (err, result) => {
        expect(err).to.equal(null);
        expect(result.deletedCount).to.equal(1);
        done();
      })

    };


    const doCreate = () => {
      crudCreate(item, 'items', (err, result) => {
        expect(err).to.equal(null);
        expect(result.insertedCount).to.equal(1);

        const insertedId = result.insertedId;

        doReadOne(insertedId);

      })
    };

    const doUpdate = (item) => {
      item.text = item.text + " world!";
      crudUpdate(item, 'items', (err, result) => {
        expect(err).to.equal(null);
        expect(result.modifiedCount).to.equal(1);

        doReadTwo(item._id);

      })
    };

    new Connect().connectToDatabase(start);

  });

});