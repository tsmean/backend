export namespace orm {

  export function flatObjectToMysql(obj: Object): null | any[][] {

    let invalidResult = false;

    const result: any[][] = [];

    Object.keys(obj).forEach(key => {
      const convertedKeyValuePair = [];
      convertedKeyValuePair.push(key);
      const val = obj[key];
      if (typeof val === 'string') {
        convertedKeyValuePair.push(`'${val}'`);
      } else if (typeof obj[key] === 'number') {
        convertedKeyValuePair.push(val);
      } else if (val instanceof Date) {
        convertedKeyValuePair.push(`${val.getFullYear()}-${val.getMonth()}-${val.getDay()}`);
      } else {
        invalidResult = true;
      }
      result.push(convertedKeyValuePair);
    });

    return invalidResult ? null : result;

  }

}
