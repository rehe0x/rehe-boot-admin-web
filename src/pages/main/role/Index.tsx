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

import { Role, EditData } from "./types";
import Query from "./Query";
import { queryRole, getRoleById, deleteRole, bindRoleMenu } from "./service";
import EditModal from "./Edit";
import MenuTree from "./MenuTree";

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
      title: "角色名",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "级别",
      dataIndex: "level",
    },
    {
      title: "范围",
      dataIndex: "scope",
      render:(e:number) => {
        const scopeMap = {
          0: '全部',
          1: '本级',
          2: '自定义',
        };
        return scopeMap[e];
      }
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "创建日期",
      dataIndex: "createTime",
      render: (text) => Common.formatDate(text),
    },
    {
      title: "操作",
      key: "action",
      width: "12%",
      render: (_, record) => (
        <Space size="middle">
          <Permission code={['role:update']}>
          <a onClick={(event) => handleEdit(event,record.id)}>编辑</a>
          </Permission>
          <Permission code={['role:delete']}>
          <Popconfirm
            placement="left"
            title="确认删除?"
            description={<Typography.Text type="danger">删除！</Typography.Text>}
            onConfirm={() => delRole(record.id)}
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

  const [tableProps, refresh, query] = usePageTable(queryRole);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>();
  const [roleMenuIds, setRoleMenuIds] = useState<number[]>();
  const [menuCheckedStatus, setMenuCheckedStatus] = useState<boolean>(false);

  const [selectedRoleId, setSelectedRoleId] = useState<number>();
  const selectedMenuIds = useRef<number[]>();
  

  const handleEdit = (event?: React.MouseEvent,id?: number) => {
    event && event.stopPropagation();
    setEditOpen(true);
    setEditData({ id });
  };

  const delRole = async (id: number) => {
    const result = await deleteRole(id);
    if (result.successful) {
      message.success("删除成功");
      refresh();
    }
  };

  const handleBind =async () => {
    console.log(selectedRoleId,selectedMenuIds)
    if(selectedRoleId && selectedMenuIds.current){
      const result = await bindRoleMenu({id: selectedRoleId, menuIds: selectedMenuIds.current})
      if (result.successful) {
        message.success("保存成功");
        refresh();
      }
    }
  };

  const rowSelectionChange = (selectedRowKeys) => {
    setSelectedRoleId(selectedRowKeys[0]);
    handleRowSelect(selectedRowKeys[0])
  }

  const onRow = (record) => ({
    onClick: () => {
      const selectedKey = record.id;
      setSelectedRoleId(selectedKey);
      handleRowSelect(selectedKey)
    },
  });

  const handleRowSelect = async (id:number) => {
    const result = await getRoleById(id)
    if(result.successful) {
      setRoleMenuIds(result.data.menuIds)
    }
  }

  const selectMenuAll = async () => {
    setMenuCheckedStatus(prevState => !prevState)
  }

  return (
    <Layout className="page-layout">
      <Breadcrumb />
      <Layout.Content className="layout-content">
        <Query query={query} />
      </Layout.Content>
      <div style={{display:'flex'}}>
        <Layout.Content className="layout-content" style={{flex: 1}}>
          <div className="layout-title">
            <Space size="small">
              <Permission code={['role:create']}>
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
                selectedRowKeys:selectedRoleId ? [selectedRoleId] : [],
                type:'radio',
                onChange: rowSelectionChange
              }}
              onRow={onRow}
            columns={columns}
            {...tableProps}
            rowKey={(record) => record.id}
          />
        </Layout.Content>
        <Layout.Content className="layout-content" style={{width:'30%',marginLeft:'20px'}}>
          <div className="layout-title">
              <Typography.Title level={5} style={{margin: 0}}>菜单权限</Typography.Title>
              <Permission code={['role:bind_menu']}>
              <Space size="middle">
                <a onClick={() => selectMenuAll()}>全选</a>
                <Button type="primary" onClick={() => handleBind()}>保存</Button>
              </Space>
              </Permission>
          </div>
          <MenuTree onCheckChange={(value) => selectedMenuIds.current = value} menuIds={roleMenuIds} checkedStatus={menuCheckedStatus}/>
        </Layout.Content>
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
