import * as bcrypt from 'bcrypt';

export namespace passwordCryptographer {

  function saltRounds() {
    return 10;
  }

  export function doHash (plaintextPassword: string): Promise<string> {
    return bcrypt.hash(plaintextPassword, saltRounds());
  }

  export function doCompare (plaintextPassword, hash): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, hash);
  }

}
