
export interface QueryParams {
  pageSize?: number;
  pageNum?: number;
  [key: string]: any; // 允许包含任意键值对
}

export interface Result {
  data: any;
  successful: boolean;
  msg: string;
  total:number;
}