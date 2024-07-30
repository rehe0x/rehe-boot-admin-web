import request from "@/common/request";
import { QueryParams,R } from '@/common/types'; // 根据实际路径导入类型
import { User } from "./types";

export const createUser = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/user/create`,params);
  return result;
}

export const updateUser = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/user/update`,params);
  return result;
}

export const updateUserPlatform = async (platformId:number): R<any> => {
  const result = await request.post(`/api/v1/system/user/update/platform/${platformId}`);
  return result;
}

export const deleteUser = async (id:number): R<any> => {
  const result = await request.post(`/api/v1/system/user/delete/${id}`);
  return result;
}


export const queryUser = async (params?: QueryParams): R<User[]> => {
  const result = await request.get('/api/v1/system/user/query', params);
  return result;
}

export const getUserById = async (id:number): R<User> => {
  const result = await request.get(`/api/v1/system/user/get/${id}`);
  return result;
}

