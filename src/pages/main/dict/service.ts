import request from "@/common/request";
import { QueryParams,R } from '@/common/types'; // 根据实际路径导入类型
import { Dict,DictDetail } from "./types";

export const createDict = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/dict/create`,params);
  return result;
}

export const updateDict = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/dict/update`,params);
  return result;
}


export const deleteDict = async (id:number): R<any> => {
  const result = await request.post(`/api/v1/system/dict/delete/${id}`);
  return result;
}


export const queryDict = async (params?: QueryParams): R<Dict[]> => {
  const result = await request.get('/api/v1/system/dict/query', params);
  return result;
}


export const createDictDetail = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/dict/detail/create`,params);
  return result;
}

export const updateDictDetail = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/dict/detail/update`,params);
  return result;
}


export const deleteDictDetail = async (id:number): R<any> => {
  const result = await request.post(`/api/v1/system/dict/detail/delete/${id}`);
  return result;
}

export const queryDictDetail = async (params: Record<string, any>): R<DictDetail[]> => {
  const result = params.dictId && await request.get('/api/v1/system/dict/detail/query/'+params.dictId);
  return result;
}