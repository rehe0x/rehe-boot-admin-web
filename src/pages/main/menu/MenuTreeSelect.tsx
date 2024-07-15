import React,{ useEffect, useState} from 'react';
import { TreeSelect } from 'antd';
import { getMenuTree } from "./service";
import type { DefaultOptionType } from 'antd/es/select';

interface MenuTreeSelectProps {
  value?: any;
  onChange?: (value: any) => void;
  multiple?:boolean;
  disabled?:boolean;
}


export interface DeptObject {
  id: number;
  parentId: number;
  name: string;
}

export interface TreeObject extends DefaultOptionType{
  value: number;
  title: string;
  children?: TreeObject[];
}


export const MenuTreeSelect:React.FC<MenuTreeSelectProps> = ({ value, onChange,multiple=false,disabled = false }) => {
  const [treeData, setTreeData] = useState<TreeObject[]>([])
  const menuTypeOptions = [
    { label: "目录", value: 0 },
    { label: "菜单", value: 1 },
    { label: "权限", value: 2 },
  ];

  // 递归转换函数
const transformItem = (item): TreeObject => {
  const children = item.children ? item.children.map((child) => transformItem(child)) : [];
  return {
    value: item.id,
    title: item.id +"-"+menuTypeOptions.find((i) => i.value === item.menuType)
    ?.label+"-"+item.title,
    children: children
  };
};

  useEffect(() => {
    (async() => {
      const result = await getMenuTree()
      const menuTree:TreeObject[] = result.data.map((item) => transformItem(item))
      setTreeData([{
        value: 0,
        title: "0-顶级"
      },...menuTree])
    })()
  },[])

  return (
    <TreeSelect
    disabled={disabled}
    showSearch
    style={{ width: '100%' }}
    value={value === 0 ? undefined:value}
    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    placeholder="默认顶级"
    allowClear
    multiple={multiple}
    treeDefaultExpandAll
    onChange={onChange}
    treeData={treeData}
  />
  );
};

export default MenuTreeSelect;