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
import Breadcrumb from "@/components/Breadcrumb";
import { useTable } from "@/hooks/UseTable";
import { Menu, EditData } from "./types";
import { getMenuTree, deleteMenu } from "./service";
import Query from "./Query";
import EditModal from "./Edit";

const App = () => {
  const columns: TableColumnsType<Menu> = [
    {
      title: "名称",
      dataIndex: "title",
      render: (_, record) => <a>{record.title}</a>
    },
    {
      title: "类型",
      dataIndex: "menuType",
      render: (_, record) => {
        const menuTypeMap = {
          2: { color: "error", text: "权限" },
          1: { color: "success", text: "菜单" },
          0: { color: "processing", text: "目录" },
        };
        const { color, text } = menuTypeMap[record.menuType];
        return <Tag color={color}>{text}</Tag>;
      },
    },

    {
      title: "路由",
      dataIndex: "routePath",
    },
    {
      title: "组件路径",
      dataIndex: "component",
    },
    {
      title: "权限",
      dataIndex: "permission",
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
          <a onClick={(event) => handleEdit(event, { id: record.id })}>
            <PlusOutlined />
          </a>
          <a
            onClick={(event) =>
              handleEdit(event, { id: record.id, update: true })
            }
          >
            编辑
          </a>
          <Popconfirm
            placement="left"
            title="确认删除?"
            description={<Typography.Text type="danger">同时会删除该菜单的子菜单！</Typography.Text>}
            onConfirm={() => delMenu(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const [tableProps, refresh, query, params] = useTable(getMenuTree,{platformId: 1});
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>({platformId: params.platformId});

  const handleEdit = (event?: React.MouseEvent, data?: EditData) => {
    event && event.stopPropagation();
    const { id, update = false } = data ?? {};
    setEditOpen(true);
    setEditData((prev) => ({ ...prev, id, update, platformId:params.platformId }));
  };

  const delMenu = async (id: number) => {
    const result = await deleteMenu(id);
    if (result.successful) {
      message.success("删除成功");
      refresh();
    }
  };

  const platformOptions = [
    { label: "系统一", value: 1 },
    { label: "系统二", value: 2 },
    { label: "系统三", value: 3 },
  ];

  const platformOnChange = ({ target: { value } }:RadioChangeEvent) => {
    query({platformId: value})
  }

  return (
    <Layout className="page-layout">
      <Breadcrumb />

      <Layout.Content className="layout-content">
        <Query query={query} />
      </Layout.Content>

      <Layout.Content className="layout-content">
        <div className="layout-title">
          <Space size="small">
          <Radio.Group
            options={platformOptions}
            onChange={platformOnChange}
            buttonStyle="solid"
            optionType="button"
            defaultValue={1}
          />
          </Space>
          <Space size="small">
            <Button type="primary" onClick={() => handleEdit()}>
              创建
            </Button>
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
