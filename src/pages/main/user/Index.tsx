import React, { useState, useEffect } from 'react';
import { message,Layout, Space, Button, Dropdown, Table, Tag } from 'antd';
import { AlignLeftOutlined, BarChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Common } from '@/common';
import { Permission,Breadcrumb } from "@/components";
import { useTable,usePageTable } from '@/hooks/UseTable'

import { User,EditData } from "./types";
import Query from './Query'
import { queryUser,deleteUser } from "./service";
import EditModal from "./Edit";

const items:MenuProps['items'] = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: '0',
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App = () => {

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '性别',
      dataIndex: 'gender',
    },
    {
      title: '手机',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      render: (e) => {
        const statusMap = {
          1: { color: 'success', text: '正常' },
          0: { color: 'error', text: '停用' },
        };
        const { color, text } = statusMap[e] || { color: 'default', text: '未知状态' }
        return (<Tag color={color}>{text}</Tag>)
      }
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      render: (text) => Common.formatDate(text)
    },
    {
      title: '操作',
      key: 'action',
      width: "12%",
      render: (_, record) => (
        <Space size="middle">
          <Permission code={['user:update']}>
            <a onClick={() => handleEdit(record.id)}>编辑</a>
          </Permission>
          <Permission code={['user:delete']}>
            <a onClick={() => delUser(record.id)}>删除</a>
          </Permission>
        </Space>
      ),
    },
  ];

  const [tableProps, refresh, query] = usePageTable(queryUser)
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>();

  const handleEdit = (id?: number) => {
    setEditOpen(true);
    setEditData({ id });
  };

  const delUser =async (id: number) => {
    const result = await deleteUser(id)
    if(result.successful){
      message.success("删除成功")
      refresh()
    }
  };
  return (
    <Layout className='page-layout' >
      <Breadcrumb />
      <Layout.Content className='layout-content query-padding'>
        <Query query={query} />
      </Layout.Content>
      <Layout.Content className='layout-content' >
        <div className='layout-title'>
          <Space size="small">
            <Permission code={['user:create']}>
              <Button type="primary" onClick={() => handleEdit()}>创建</Button>
            </Permission>
            {/* <Button onClick={() => handleFormModal(1)}>编辑</Button> */}
          </Space>
          <Space size="middle">
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <AlignLeftOutlined />
              </a>
            </Dropdown>
            <Dropdown menu={{ items }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                <BarChartOutlined />
              </a>
            </Dropdown>
          </Space>
        </div>

      <Table columns={columns} {...tableProps} rowKey={record => record.id} />
      </Layout.Content>
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