import React, { useState, useEffect } from "react";
import { Popconfirm,message, Layout, Space, Button, Dropdown, Table, Tag,Typography } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import type { MenuProps ,DescriptionsProps} from "antd";
import type { ColumnsType } from 'antd/es/table';

import { Common } from "@/common";
import { Permission, Breadcrumb } from "@/components";
import { useTable, usePageTable } from "@/hooks/UseTable";

import { EditData,ScheduledTask } from "./types";
import Query from "./Query";
import { deleteScheduledTask, queryScheduledTask,stopScheduledTask,executeScheduledTask,reloadScheduledTask } from "./service";
import EditModal from "./Edit";


const App = () => {
  const columns: ColumnsType<ScheduledTask> = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "任务名称/ID",
      dataIndex: "username",
      render: (_, record) => {
        return <>
                <a>{record.taskName}</a>
                <br />
                <Typography.Text type="secondary">{record.taskId}</Typography.Text>
              </>;
      },
    },
    {
      title: "Bean",
      dataIndex: "beanName",
    },
    {
      title: "Method",
      dataIndex: "methodName",
    },
    // {
    //   title: "子任务",
    //   dataIndex: "subTask",
    // },
    {
      title: "任务方式",
      dataIndex: "taskMode",
      render: (e) => {
        const taskModeMap = {
          1: "cron",
          2: "时间间隔ms",
          3: "时间延迟ms"
        };
        return <Tag color="processing">{taskModeMap[e]}</Tag>;
      },
    },
    {
      title: "表达式",
      dataIndex: "expression",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (e: number) => {
        const statusMap = {
          1: { color: "success", text: "正常" },
          0: { color: "error", text: "暂停" },
        };
        const { color, text } = statusMap[e];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "创建日期",
      dataIndex: "createTime",
      width: "12%",
      render: (text) => Common.formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: "20%",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Permission code={['task:stop']}>
            <a onClick={() => stopTask(record.id,record.status)}>{record.status === 1 ? "暂停" : "启用"}</a>
          </Permission>
          <Permission code={['task:execute']}>
            <a onClick={() => executeTask(record.id)}>执行</a>
          </Permission>
          <Permission code={['task:update']}>
            <a onClick={() => handleEdit(record.id)}>编辑</a>
          </Permission>
          <Permission code={['task:delete']}>
            <Popconfirm
              placement="left"
              title="确认删除?"
              onConfirm={() => delTask(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <a onClick={(e) => e.stopPropagation()}>删除</a>
          </Popconfirm>
          </Permission>
          {/* <Permission code={['task:delete']}>
            <a onClick={() => delTask(record.id)}>日志</a>
          </Permission> */}
        </Space>
      ),
    },
  ];

  const [tableProps, refresh, query] = usePageTable(queryScheduledTask);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditData>();

  const handleEdit = (id?: number) => {
    setEditOpen(true);
    setEditData({ id });
  };

  const delTask =async (id: number) => {
    const result = await deleteScheduledTask(id)
    if(result.successful){
      message.success("删除成功")
      refresh()
    }
  };

  const stopTask =async (id: number,status:number) => {
    const result = await stopScheduledTask({id,status: status === 1 ? 0 : 1})
    if(result.successful){
      message.success("操作成功")
      refresh()
    }
  };

  const executeTask =async (id: number) => {
    const result = await executeScheduledTask(id)
    if(result.successful){
      message.success("执行成功")
      refresh()
    }
  };

  const reloadTask =async () => {
    const result = await reloadScheduledTask()
    if(result.successful){
      message.success("加载成功")
      refresh()
    }
  };

  return (
    <Layout className="page-layout">
      <Breadcrumb />
      <Layout.Content className="layout-content query-padding">
        <Query query={query} />
      </Layout.Content>
      <Layout.Content className="layout-content">
        <div className='layout-title'>
          <Space size="small">
            <Permission code={['task:create']}>
              <Button type="primary" onClick={() => handleEdit()}>创建任务</Button>
            </Permission>
          </Space>
          <Space size="small">
            <Permission code={['task:reload']}>
              <Button type="default" onClick={() => reloadTask()}>重新加载所有任务</Button>
            </Permission>
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
