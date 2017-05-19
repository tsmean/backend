class Utils {

  constructor() {}

  /* Copies the data, but loses function assignments! */
  deepCopyData(data: Object) {
    return JSON.parse(JSON.stringify(data));
  }

}

export const utils = new Utils();

