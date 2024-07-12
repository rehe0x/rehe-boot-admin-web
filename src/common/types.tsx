
export interface QueryParams {
  pageSize: number;
  pageNum: number;
  [key: string]: any; // 允许包含任意键值对
}

export interface Result<T> {
  data: T;
  successful: boolean;
  msg: string;
  page:{total:number};
}

export type R<T> = Promise<Result<T>>