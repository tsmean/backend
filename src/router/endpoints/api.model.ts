import {User} from "../../db/User.model";

export interface api {
  v1: {
    user: StandardRestInterface<User, {}>
  }
}

interface StandardRestInterface<T, K> {
  get: {
    id: string;
    queryParams?: K;
  },
  post: {
    payload: T;
  },
  put: {
    paylaod: T;
  },
  delete: {
    id: string
  }
}