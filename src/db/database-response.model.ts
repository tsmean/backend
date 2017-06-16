
export interface DatabaseResponse<T> {
  error: DatabaseError;
  data?: T;
}

export interface DatabaseError {
  code?: number;
  message: string;
}

export interface CreateResponse {
  uid: number;
  createTime: Date;
  [x: string]: any;
}

export interface UpdateResponse {
  uid: number;
  updateTime: Date;
  [x: string]: any;
}

export interface DeleteResponse {
  bla: any; // TODO: what does it really return?
}

export interface MysqlSuccess {
  fieldCount: number;
  affectedRows: number;
  uid: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  changedRows: 1;
}
