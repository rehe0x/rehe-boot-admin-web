export interface EditData{
  id?:number
}

export interface OperationLog {
  id: number;
  username: string;
  description: string;
  logType: string;
  method: string;
  params: string;
  ip: string;
  address: string;
  header: string;
  time: number;
  detail: string;
  createTime: Date;
}