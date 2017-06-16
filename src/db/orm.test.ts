import * as mocha from 'mocha';
import * as chai from 'chai';
import {dao} from './dao';
import {beforeEachDo} from '../test/before-eachs';
import {DatabaseResponse} from './database-response.model';
import {orm} from './orm';
import * as assert from 'assert';
const expect = chai.expect;

describe('ORM', () => {

  it('should have a working orm', function(done) {

    const obj = {
      hello: 'world',
      today: new Date('October 13, 2014 11:13:00'),
      you: 'are',
      number: 1,
    }

    const converted = orm.flatObjectToMysql(obj);

    console.log(converted);

    assert.deepEqual(converted.map(x => x[0]), ['hello', 'today', 'you', 'number']);

    assert.deepEqual(converted.map(x => x[1]), [`'world'`, '2014-10-13', `'are'`, 1]);

  });

});
