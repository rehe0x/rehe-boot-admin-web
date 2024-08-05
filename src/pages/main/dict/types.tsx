export interface Dict {
  id: number;
  code: string;
  name: string;
  createTime: string; 
  updateTime: string; 
}

export interface DictDetail {
  id: number;
  dictId: number;
  label: string;
  value: string;
  sort: number;
  createTime: string; 
  updateTime: string; 
}


export interface EditData{
  id?:number;
  code?: string;
  name?: string;
}

export interface DetailEditData{
  id?:number;
  dictId?: number;
  label?: string;
  value?: string;
  sort?: number;
}