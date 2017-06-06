export interface DatabaseResponse {
  error: DatabaseError;
  data?: any;
}

export interface DatabaseError {
  code?: number;
  message: string;
}
