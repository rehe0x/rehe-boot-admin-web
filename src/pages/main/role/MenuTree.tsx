import React, { useState, useEffect,useRef } from "react";
import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import { getMenuTree } from "@/pages/main/menu/service";
const { DirectoryTree } = Tree;



const App: React.FC<{onCheckChange: (value:number[]) => void,menuIds?:number[],checkedStatus:boolean}> = ({onCheckChange,menuIds,checkedStatus}) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const menuAllIds = useRef<number[]>([]);

  useEffect(() => {
    setCheckedKeys(menuIds||[]);
  },[menuIds])


  useEffect(() => {
    setCheckedKeys(checkedStatus ? menuAllIds.current : [])
    onCheckChange(checkedStatus ? menuAllIds.current : [])
  },[checkedStatus])

  // 递归转换函数
  const transformItem = (item): TreeDataNode => {
    menuAllIds.current.push(item.id)
    const children = item.children
      ? item.children.map((child) => transformItem(child))
      : [];
    return {
      key: item.id,
      title: item.title,
      children: children,
    };
  };

  useEffect(() => {
    (async () => {
      const result1 = await getMenuTree({ platformId: 1 });
      const menuTree1: TreeDataNode[] = result1.data.map((item) =>
        transformItem(item)
      );

      const result2 = await getMenuTree({ platformId: 2 });
      const menuTree2: TreeDataNode[] = result2.data.map((item) =>
        transformItem(item)
      );

      const result3 = await getMenuTree({ platformId: 3 });
      const menuTree3: TreeDataNode[] = result3.data.map((item) =>
        transformItem(item)
      );

      setTreeData([
        {
          key: 'system1',
          title: "系统一",
          children: menuTree1,
          checkable: false
        },
        {
          key: 'system2',
          title: "系统二",
          children: menuTree2,
          checkable: false
        },
        {
          key: 'system3',
          title: "系统三",
          children: menuTree3,
          checkable: false
        },
      ]);
      setExpandedKeys(['system1','system2','system3']);
    })();
  }, []);

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (selectedKeys, info) => {
    setCheckedKeys(selectedKeys.checked);
    onCheckChange(selectedKeys.checked as number[])
  };

   // 处理节点展开和收起
   const onExpand:TreeProps["onExpand"] = (newExpandedKeys:any[],info) => {
    setExpandedKeys(newExpandedKeys);
  };

  return (
    <DirectoryTree
      icon={false}
      checkStrictly
      checkable
      blockNode
      // selectable={true}
      // defaultExpandedKeys={['system1','system2','system3']}
      // defaultSelectedKeys={["0-0-0", "0-0-1"]}
      // defaultCheckedKeys={["0-0-0", "0-0-1"]}
      checkedKeys={checkedKeys}
      expandedKeys={expandedKeys}
      onSelect={onSelect}
      onCheck={onCheck}
      onExpand={onExpand}
      treeData={treeData}
    />
  );
};

export default App;
