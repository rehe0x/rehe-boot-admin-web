export interface Dept {
  id: number;
  parentId: number;
  name: string;
  sort: number;
  enabled: boolean;
  createTime: string; // LocalDateTime 转换为 string
  updateTime: string; // LocalDateTime 转换为 string
  children?:Dept[]
}


export interface EditData{
  id?:number,
  update?:boolean,
}