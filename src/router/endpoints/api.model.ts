import {User} from '../../db/user.model';

// Not in use yet

export interface Api {
  v1: {
    user: StandardRestInterface<User, {}>
  };
}

interface StandardRestInterface<T, K> {
  get: {
    id: string;
    queryParams?: K;
  };
  post: {
    payload: T;
  };
  put: {
    payload: T;
  };
  httpDelete: {
    id: string;
  };
}
