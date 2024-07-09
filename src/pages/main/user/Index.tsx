import React, { useState, useEffect } from 'react';
import { Layout, Space, Button, Dropdown, Table, Tag } from 'antd';
import { AlignLeftOutlined, BarChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Common } from '@/common';
import { Permission } from "@/components/Permission";
import Breadcrumb from "@/components/Breadcrumb";
import { useTable } from '@/hooks/UseTable'
import Query from '@/pages/main/user/Query'
import { UserService } from "./service";
import CreateModal from "@/pages/main/user/Create";

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
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => refresh()}>编辑</a>
          <a onClick={() => query({ cehis: '123123', sd: 'ff' })}>删除</a>
        </Space>
      ),
    },
  ];
  const [createOpen, setCreateOpen] = useState(false);
  const { tableProps, refresh, query } = useTable(UserService.getUserList)

  return (
    <Layout className='page-layout' >
      <Breadcrumb />
      <Layout.Content className='layout-content'>
        <Query query={query} />
      </Layout.Content>
      <Layout.Content className='layout-content' >
        <div className='layout-title'>
          <Space size="small">
            <Permission code={['user:add']}>
              <Button type="primary" onClick={() => setCreateOpen(true)}>创建</Button>
            </Permission>
            <Button onClick={() => { }}>编辑</Button>
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
      <CreateModal
        open={createOpen}
        setOpen={setCreateOpen}
      />
    </Layout>
  );
};
export default App;