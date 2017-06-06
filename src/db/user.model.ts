export interface User {
  uid?: string;
  email: string;
  password?: {
    hash: string;
    algorithm: HashingAlgorithm;
  };
}

type HashingAlgorithm = 'bcrypt';
