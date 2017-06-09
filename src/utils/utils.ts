export namespace utils {

  /* Copies the data, but loses function assignments! */
  export function deepCopyData(data: Object) {
    return JSON.parse(JSON.stringify(data));
  }

}
