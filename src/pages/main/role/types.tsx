export interface Role {
  id: number;
  name: string;
  level: number;
  description: string;
  scope: number;
  createTime: string; 
  updateTime: string; 
  deptIds:number[];
  menuIds:number[]
}

export interface EditData{
  id?:number
}