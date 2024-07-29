import request from "@/common/request";
import { R } from '@/common/types';
import { Menu } from "./types";

export const createMenu = async (params?: Record<string, any>): R<any> => {
  const result = await request.post('/api/v1/system/menu/create', params);
  return result;
}

export const updateMenu = async (params?: Record<string, any>): R<any> => {
  const result = await request.post('/api/v1/system/menu/update', params);
  return result;
}

export const deleteMenu = async (id:number): R<any> => {
  const result = await request.post('/api/v1/system/menu/delete/'+id);
  return result;
}

export const getMenuById = async (id:number): R<Menu> => {
  const result = await request.get('/api/v1/system/menu/get/'+id);
  return result;
}

export const queryMenu = async (params?: Record<string, any>): R<Menu[]> => {
  const result = await request.get('/api/v1/system/menu/query', params);
  return result;
}

export const getMenuTree = async (params?: Record<string, any>): R<Menu[]> => {
  const result = await queryMenu(params);
  
  const menuIds = result.data?.map(item => item.id)
  const menuMap: Map<number, Menu> = new Map(result.data?.map((node: Menu) => [node.id, node]));
  const menuTree: Menu[] = [];
  menuMap.forEach((node) => {
    if (node.parentId === 0) {
      menuTree.push(node);
    } else {
      const parent = menuMap.get(node.parentId);
      if (parent) {
        (parent.children || (parent.children = [])).push(node);
      }
    }
  })
  result.data = menuTree;
  result.menuIds = menuIds
  return result;
}
export const MenuService = {queryMenu}
