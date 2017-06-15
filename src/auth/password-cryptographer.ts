import * as bcrypt from 'bcrypt-nodejs';
export namespace passwordCryptographer {

  function saltRounds() {
    return 5;
  }

  export function doHash (plaintextPassword: string): Promise<string> {

    return new Promise(function(resolve, reject) {

      bcrypt.genSalt(saltRounds(), (error, salt) => {
        bcrypt.hash(plaintextPassword, salt, null, function(err, hash) {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });

    });

  }

  export function doCompare (plaintextPassword, hash): Promise<boolean> {

    return new Promise(function(resolve, reject) {

      bcrypt.compare(plaintextPassword, hash, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });

    });

  }

}
