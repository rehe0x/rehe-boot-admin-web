import request from "@/common/request";
import { QueryParams,R } from '@/common/types'; // 根据实际路径导入类型
import { OperationLog } from "./types";

export const queryOperationLog = async (params?: QueryParams): R<OperationLog[]> => {
  const result = await request.get('/api/v1/operation/log/query', params);
  return result;
}

export const getOperationLogById = async (id:number): R<OperationLog> => {
  const result = await request.get(`/api/v1/operation/log/get/${id}`);
  return result;
}

