import * as mocha from 'mocha';
import * as chai from 'chai';
import {appConfig} from "./AppConfig";

const expect = chai.expect;

describe('AppConfig', () => {

  it('should be able to set & get config', () => {
    appConfig.setAppConfig('test');
    expect(typeof appConfig.appConfig).to.equal('object');
  });

});