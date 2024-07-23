import request from "@/common/request";
import { R } from '@/common/types';
import { Dept } from "./types";

export const createDept = async (params?: Record<string, any>): R<any> => {
  const result = await request.post('/api/v1/system/dept/create', params);
  return result;
}

export const updateDept = async (params?: Record<string, any>): R<any> => {
  const result = await request.post('/api/v1/system/dept/update', params);
  return result;
}

export const deleteDept = async (id:number): R<any> => {
  const result = await request.post('/api/v1/system/dept/delete/'+id);
  return result;
}

export const getDeptById = async (id:number): R<Dept> => {
  const result = await request.get('/api/v1/system/dept/get/'+id);
  return result;
}

export const getDeptList = async (params?: Record<string, any>): R<Dept[]> => {
  const result = await request.get('/api/v1/system/dept/query', { } );
  return result;
}

export const getDeptTree = async (params?: Record<string, any>): R<Dept[]> => {
  const result = await getDeptList(params);

  const deptMap: Map<number, Dept> = new Map(result.data?.map((node: Dept) => [node.id, node]));
  const deptTree: Dept[] = [];
  deptMap.forEach((node) => {
    if (node.parentId === 0) {
      deptTree.push(node);
    } else {
      const parent = deptMap.get(node.parentId);
      if (parent) {
        (parent.children || (parent.children = [])).push(node);
      }
    }
  })
  result.data = deptTree;
  return result;
}

export const DeptService = {}

