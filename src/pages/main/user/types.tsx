export interface User {
  id: number;
  deptId: number;
  username: string;
  password: string;
  nickname: string;
  gender: string;
  phone: string;
  email: string;
  avatarPath: string;
  enabled: number;
  createTime: string;
  updateTime: string;
  deleted: boolean;
}

export interface EditData{
  id?:number
}