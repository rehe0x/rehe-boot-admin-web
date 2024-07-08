import request from "@/common/request";
import { Result } from '@/common/types'; // 根据实际路径导入类型

export const getDepts = async (): Promise<Result> => {
  const result = await request.get('/api/v1/system/dept/query', { } );
  return result;
}


export const DeptService = {}

