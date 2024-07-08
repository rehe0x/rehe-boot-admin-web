import request from "@/common/request";
import { QueryParams,Result } from '@/common/types'; // 根据实际路径导入类型

const getUserList = async ({ pageSize, pageNum }: QueryParams = {}, 
  formData: Record<string, any> = {}): Promise<Result> => {
  const result = await request.get('/api/v1/system/user/query', {  pageSize, pageNum, ...formData } );
  return result;
}


export const UserService = {getUserList}
