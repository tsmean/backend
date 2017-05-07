export interface DatabaseResponse {
  error: DatabaseError;
  data?: any;
  //id?: { //composed ID of created, updated, read or deleted object
  //  key: string,
  //  version?: string //optionally, the id is versioned
  //}
}

export interface DatabaseError {
  code?: number,
  message: string,
}