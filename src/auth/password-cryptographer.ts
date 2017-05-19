import * as bcrypt from 'bcrypt'

class PasswordCryptographer {

  private get saltRounds() {
    return 10;
  }

  public doHash (plaintextPassword: string): Promise<string> {
    return bcrypt.hash(plaintextPassword, this.saltRounds);
  };

  public doCompare (plaintextPassword, hash): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, hash);
  };

}

export const passwordCryptographer = new PasswordCryptographer();
