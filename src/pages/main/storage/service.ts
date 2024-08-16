import request from "@/common/request";
import { R } from '@/common/types';

export const createMultipartUpload = async (params?: Record<string, any>,option: Record<string, any> = {}): R<any> => {
  const result = await request.post('/api/v1/storage/upload/id', params,option);
  return result;
}

export const checkObjectPartList = async (params?: Record<string, any>, option: Record<string, any> = {}): R<any> => {
  const result = await request.post('/api/v1/storage/check/part', params,option);
  return result;
}

export const uploadPart = async (params?: Record<string, any>,option: Record<string, any> = {}): R<any> => {
  const result = await request.post('/api/v1/storage/upload/part', params, {
    type: "FormData",
    ...option
  });
  return result;
}

export const completeMultipartUpload = async (params?: Record<string, any>,option: Record<string, any> = {}): R<any> => {
  const result = await request.post('/api/v1/storage/upload/complete', params,option);
  return result;
}

export const checkMultipartUpload = async (params?: Record<string, any>,option: Record<string, any> = {}): R<any> => {
  const result = await request.post('/api/v1/storage/check/upload', params,option);
  return result;
}


export const StorageService = {createMultipartUpload}
