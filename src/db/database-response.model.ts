
export interface DatabaseResponse<T> {
  error: DatabaseError;
  data?: T;
}

export interface DatabaseError {
  code?: number;
  message: string;
}

export interface CreateResponse {
  insertId: number;
}

export interface UpdateResponse {
  bla: any; // TODO: what does it really return?
}


export interface DeleteResponse {
  bla: any; // TODO: what does it really return?
}
