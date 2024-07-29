import request from "@/common/request";
import { QueryParams,R } from '@/common/types'; // 根据实际路径导入类型
import { Role } from "./types";

export const createRole = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/role/create`,params);
  return result;
}

export const updateRole = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/role/update`,params);
  return result;
}


export const deleteRole = async (id:number): R<any> => {
  const result = await request.post(`/api/v1/system/role/delete/${id}`);
  return result;
}


export const bindRoleMenu = async (params): R<any> => {
  const result = await request.post(`/api/v1/system/role/bind/menu`,params);
  return result;
}

export const queryRole = async (params?: QueryParams): R<Role[]> => {
  const result = await request.get('/api/v1/system/role/query', params);
  return result;
}


export const queryRoleAll = async (): R<Role[]> => {
  const result = await request.get('/api/v1/system/role/query/all');
  return result;
}

export const getRoleById = async (id:number): R<Role> => {
  const result = await request.get(`/api/v1/system/role/get/${id}`);
  return result;
}
