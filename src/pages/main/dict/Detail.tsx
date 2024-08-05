import React, { useState, useEffect,useRef } from "react";
import {
  message,
  Layout,
  Space,
  Button,
  Dropdown,
  Table,
  Tag,
  Flex,
  Typography,
  Popconfirm
} from "antd";
import { AlignLeftOutlined, BarChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Common } from "@/common";
import { Permission,Breadcrumb } from "@/components";
import { useTable, usePageTable } from "@/hooks/UseTable";

import { Dict,DictDetail, DetailEditData } from "./types";
import { queryDict, queryDictDetail, deleteDict, deleteDictDetail } from "./service";
import DetailEditModal from "./DetailEdit";

const App:React.FC<{dictId?:number}> = ({dictId}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "字典标题",
      dataIndex: "label",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "字典值",
      dataIndex: "value",
    },
    {
      title: "排序",
      dataIndex: "sort",
    },

    {
      title: "操作",
      key: "action",
      width: "22%",
      render: (_, record) => (
        <Space size="middle">
          <Permission code={['dict_detail:update']}>
          <a onClick={(event) => handleEdit(record)}>编辑</a>
          </Permission>
          <Permission code={['dict_detail:delete']}>
          <Popconfirm
            placement="left"
            title="确认删除?"
            description={<Typography.Text type="danger">删除！</Typography.Text>}
            onConfirm={() => delDictDetail(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
          </Permission>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    query({dictId})
  },[dictId])

  const [tableProps, refresh, query] = useTable(queryDictDetail);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<DetailEditData>();

  const handleEdit = (data?: DetailEditData) => {
    setEditOpen(true);
    setEditData(data);
  };

  const delDictDetail = async (id: number) => {
    const result = await deleteDictDetail(id);
    if (result.successful) {
      message.success("删除成功");
      refresh();
    }
  };

  return (
    <>
    <Layout.Content className="layout-content" style={{width:'60%',marginLeft:'20px'}}>
      <div className="layout-title">
          <Typography.Title level={5} style={{margin: 0}}>字典明细列表</Typography.Title>
          <Permission code={['dict_detail:create']}>
          <Space size="middle">
            <Button type="primary" onClick={() => handleEdit({dictId})}>创建</Button>
          </Space>
          </Permission>
      </div>
      <Table
        columns={columns}
        {...tableProps}
        rowKey={(record) => record.id}
      />
  </Layout.Content>
  <DetailEditModal
        open={editOpen}
        setOpen={setEditOpen}
        data={editData}
        refresh={refresh}
      />
  </>
  );
};
export default App;
