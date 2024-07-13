import React, { useState ,useEffect} from 'react';
import { Layout,  Space, Button, Dropdown, Table,Tag} from 'antd';
import  { TableColumnsType, TableProps } from 'antd';
import {  AlignLeftOutlined, BarChartOutlined } from '@ant-design/icons';
import Breadcrumb from "@/components/Breadcrumb";
import { useTable } from '@/hooks/UseTable'
import { Menu,EditData } from "./types";
import Query from '@/pages/main/menu/Query'
import EditModal from './Edit'
import { getMenuTree } from "./service";


type TableRowSelection<T> = TableProps<T>['rowSelection'];





const App = () => {

  const columns: TableColumnsType<Menu> = [
    {
      title: '名称',
      dataIndex: 'title',
      width: '12%',
            render: (text) => <a>{text}</a>,
  
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
        {
        title: '操作',
        key: 'action',
        // fixed: 'right',
        width: '12%',
        render: (_, record) => (
          <Space size="middle">
            <a onClick={() => handleEdit(record.id)}>编辑</a>
            <a onClick={() => query({cehis:'123123',sd:'ff'})}>删除</a>
          </Space>
        ),
      },
  ];
  const [tableProps,refresh,query]= useTable(getMenuTree)
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>();
  const handleEdit = (id?: number) => {
    setEditOpen(true);
    setEditData({ id });
  };
  return (
    <Layout className='page-layout' >
      <Breadcrumb />
      
      <Layout.Content className='layout-content'>
        <Query query={query} />
      </Layout.Content>

      <Layout.Content className='layout-content' >
        <div className='layout-title'>
          <Space size="small">
            <Button type="primary" onClick={() => handleEdit()}>创建</Button>
            <Button onClick={() => { form.resetFields(); }}>删除</Button>
          </Space>

        </div>

        <Table columns={columns} rowKey={(record) => record.id} expandable={{expandRowByClick:true}} rowSelection={{  checkStrictly:true }} {...tableProps}/>
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