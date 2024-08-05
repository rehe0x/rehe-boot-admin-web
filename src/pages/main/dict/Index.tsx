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

import { Dict,DictDetail, EditData } from "./types";
import { queryDict,  deleteDict } from "./service";
import EditModal from "./Edit";
import Detail from "./Detail";

const items: MenuProps["items"] = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: "0",
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const App = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "名称",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "code",
      dataIndex: "code",
    },

    {
      title: "操作",
      key: "action",
      width: "22%",
      render: (_, record) => (
        <Space size="middle">
          <Permission code={['dict:update']}>
          <a onClick={(event) => handleEdit(event,record)}>编辑</a>
          </Permission>
          <Permission code={['dict:delete']}>
          <Popconfirm
            placement="left"
            title="确认删除?"
            description={<Typography.Text type="danger">删除！</Typography.Text>}
            onConfirm={() => delDict(record.id)}
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

  const [tableProps, refresh, query] = usePageTable(queryDict);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>();
  const [selectedDictId, setSelectedDictId] = useState<number>();
  const [selectedDictName, setSelectedDictName] = useState<String>();

  useEffect(() => {
    if(tableProps.dataSource.length > 0) {
      setSelectedDictId(tableProps.dataSource[0].id)
      setSelectedDictName(tableProps.dataSource[0].code)
    }
  },[tableProps.dataSource])
  
  const handleEdit = (event?: React.MouseEvent,data?: EditData) => {
    event && event.stopPropagation();
    setEditOpen(true);
    setEditData(data);
  };

  const delDict = async (id: number) => {
    const result = await deleteDict(id);
    if (result.successful) {
      message.success("删除成功");
      refresh();
    }
  };

  const rowSelectionChange = (selectedKeys,selectedRows) => {
    setSelectedDictName(selectedRows[0].code)
    setSelectedDictId(selectedKeys[0]);
  }

  const onRow = (record) => ({
    onClick: () => {
      const selectedKey = record.id;
      setSelectedDictId(selectedKey);
      setSelectedDictName(record.code)
    },
  });

  return (
    <Layout className="page-layout">
      <Breadcrumb />
      <div style={{display:'flex'}}>
        <Layout.Content className="layout-content" style={{flex: 1}}>
          <div className="layout-title">
            <Space size="small">
              <Permission code={['dict:create']}>
                <Button type="primary" onClick={() => handleEdit()}>
                  创建
                </Button>
              </Permission>
            </Space>
            <Space size="middle">
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <AlignLeftOutlined />
                </a>
              </Dropdown>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <BarChartOutlined />
                </a>
              </Dropdown>
            </Space>
          </div>

          <Table
              rowSelection={{
                selectedRowKeys:selectedDictId ? [selectedDictId] : [],
                type:'radio',
                onChange: rowSelectionChange
              }}
              onRow={onRow}
            columns={columns}
            {...tableProps}
            rowKey={(record) => record.id}
          />
        </Layout.Content>
        <Detail dictId={selectedDictId} dictName={selectedDictName}/>
      </div>

      <EditModal
        open={editOpen}
        setOpen={setEditOpen}
        data={editData}
        refresh={refresh}
      />
    </Layout>
  );
};
export default App;
