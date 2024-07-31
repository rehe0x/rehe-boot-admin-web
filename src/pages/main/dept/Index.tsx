import React, { useState, useEffect} from "react";
import {
  Typography,
  Layout,
  Space,
  Button,
  Table,
  Tag,
  message,
  Popconfirm,
  TableColumnsType,
  RadioChangeEvent,
  Radio
} from "antd";
import {
  PlusOutlined,
} from "@ant-design/icons";
import { Permission,Breadcrumb } from "@/components";
import { useTable } from "@/hooks/UseTable";
import { Dept,EditData } from "./types";
import { getDeptTree,deleteDept } from "./service";
import Query from "./Query";
import EditModal from "./Edit";

const App = () => {
  const columns: TableColumnsType<Dept> = [
    {
      title: "名称",
      dataIndex: "name",
      render: (_, record) => <a>{record.name}</a>
    },
   
    {
      title: "排序",
      dataIndex: "sort",
    },
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "操作",
      key: "action",
      width: "12%",
      render: (_, record) => (
        <Space size="middle">
          <Permission code={['dept:create']}>
          <a onClick={(event) => handleEdit(event, { id: record.id })}>
            <PlusOutlined />
          </a>
          </Permission>
          <Permission code={['dept:update']}>
          <a
            onClick={(event) =>
              handleEdit(event, { id: record.id, update: true })
            }
          >
            编辑
          </a>
          </Permission>
          <Permission code={['dept:delete']}>
          <Popconfirm
            placement="left"
            title="确认删除?"
            description={<Typography.Text type="danger">同时会删除该部门的子部门！</Typography.Text>}
            onConfirm={() => delDept(record.id)}
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
  const [tableProps, refresh, query, params] = useTable(getDeptTree);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>({});
  const handleEdit = (event?: React.MouseEvent, data?: {id?:number, update?:boolean}) => {
    event && event.stopPropagation();
    const { id, update = false } = data ?? {};
    setEditOpen(true);
    setEditData((prev) => ({ ...prev, id, update}));
  };

  const delDept = async (id: number) => {
    const result = await deleteDept(id);
    if (result.successful) {
      message.success("删除成功");
      refresh();
    }
  };

  return (
    <Layout className="page-layout">
      <Breadcrumb />

      <Layout.Content className="layout-content query-padding">
        <Query query={query} />
      </Layout.Content>

      <Layout.Content className="layout-content">
        <div className="layout-title">
          <Space size="small">
            <Permission code={['dept:create']}>
              <Button type="primary" onClick={() => handleEdit()}>
                创建
              </Button>
            </Permission>
          </Space>
        </div>

        <Table
          columns={columns}
          rowKey={(record) => record.id}
          expandable={{ expandRowByClick: true }}
          rowSelection={{ checkStrictly: true }}
          {...tableProps}
        />
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
