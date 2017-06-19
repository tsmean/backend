import * as tsmongo from 'tsmongo';
import * as tsmysql from 'tsmysql';

export function dbadapter(databaseType: 'mongo' | 'mysql') {
  switch (databaseType) {
    case 'mongo':
      return tsmongo;
    case 'mysql':
      return tsmysql;
    default:
      throw Error('Database type not implemented!');
  }
}

