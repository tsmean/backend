/*
import moment = require('moment');
namespace orm {

  export function flatObjectToMysql(obj: Object): any[][] {

    const result: any[][] = [];

    Object.keys(obj).forEach(key => {
      const convertedKeyValuePair = [];
      convertedKeyValuePair.push(key);
      const val = obj[key];
      convertedKeyValuePair.push(mapValue(val));
      result.push(convertedKeyValuePair);
    });

    return result;

  }

  export function mapValue(val: any): string {

    let convertedValue = null;

    if (typeof val === 'string') {
      convertedValue = `'${val}'`;
    } else if (typeof val === 'number') {
      convertedValue = val;
    } else if (val instanceof Date) {
      convertedValue = moment(val).format('YYYY-MM-DD');
    } else {
      throw new Error('Unmappable Type:' + val);
    }

    return convertedValue;

  }

}
*/
