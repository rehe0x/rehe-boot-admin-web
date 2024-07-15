export interface Menu {
  id: number;
  parentId: number;
  menuType: number;
  title: string;
  name: string;
  component: string;
  routePath: string;
  sort: number;
  icon: string;
  link: boolean;
  cache: boolean;
  hidden: boolean;
  permission: string;
  createTime: string;
  updateTime: string;
  children?:Menu[]
}

export interface EditData{
  id?:number,
  update?:boolean
}