import request from "@/common/request";
import { QueryParams,R } from '@/common/types';
import { ScheduledTask,StopScheduledTaskParams } from "./types";

export const createScheduledTask = async (params): R<any> => {
  const result = await request.post(`/scheduled-service/api/v1/task/create`,params);
  return result;
}

export const updateScheduledTask = async (params): R<any> => {
  const result = await request.post(`/scheduled-service/api/v1/task/update`,params);
  return result;
}


export const deleteScheduledTask = async (id:number): R<any> => {
  const result = await request.post(`/scheduled-service/api/v1/task/delete/${id}`);
  return result;
}


export const stopScheduledTask = async (params:StopScheduledTaskParams): R<any> => {
  const result = await request.post(`/scheduled-service/api/v1/task/stop`,params);
  return result;
}

export const executeScheduledTask = async (id:number): R<any> => {
  const result = await request.post(`/scheduled-service/api/v1/task/execute/${id}`);
  return result;
}

export const reloadScheduledTask = async (): R<any> => {
  const result = await request.post(`/scheduled-service/api/v1/task/reload`);
  return result;
}


export const queryScheduledTask = async (params?: QueryParams): R<ScheduledTask[]> => {
  const result = await request.get('/scheduled-service/api/v1/task/query', params);
  return result;
}

export const getScheduledTaskById = async (id:number): R<ScheduledTask> => {
  const result = await request.get(`/scheduled-service/api/v1/task/get/${id}`);
  return result;
}

