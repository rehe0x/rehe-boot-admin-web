import React,{ useEffect, useState} from 'react';
import { TreeSelect } from 'antd';
import { getDeptList } from "@/pages/main/dept/service";
import type { DefaultOptionType } from 'antd/es/select';

interface DeptTreeSelectProps {
  value?: any;
  onChange?: (value: any) => void;
  multiple?:boolean;
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

interface CombinedObject {
  dept: DeptObject;
  tree: TreeObject;
}
const DeptTreeSelect:React.FC<DeptTreeSelectProps> = ({ value, onChange,multiple=false }) => {
  const [treeData, setTreeData] = useState<TreeObject[]>([])

  useEffect(() => {
    (async() => {
      const result = await getDeptList()
      const combinedMap: Map<number, CombinedObject> = new Map(result.data?.map((node: DeptObject) => [node.id, {
        dept: node,
        tree: {
          value: node.id,
          title: node.name,
        }
      }]));
      const deptTree: TreeObject[] = [];
     
      combinedMap.forEach((combinedObject) => {
        const { dept, tree } = combinedObject;
        if (dept.parentId === 0) {
          deptTree.push(tree);
        } else {
          const parent = combinedMap.get(dept.parentId)?.tree;
          if (parent) {
            (parent.children || (parent.children = [])).push(tree);
          }
        }
      })
      setTreeData(deptTree)
    })()
  },[])

  return (
    <TreeSelect
    showSearch
    style={{ width: '100%' }}
    value={value === 0 ? undefined:value}
    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    placeholder="部门"
    allowClear
    multiple={multiple}
    treeDefaultExpandAll
    onChange={onChange}
    treeData={treeData}
  />
  );
};

export default DeptTreeSelect;