import request from "@/common/request";
import { R } from '@/common/types';

export const loginPasswd = async (params): R<any> => {
  const result = await request.get(`/api/v1/auth/login/passwd`,params);
  return result;
}
