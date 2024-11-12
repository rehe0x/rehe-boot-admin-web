import React, { useState, useEffect } from "react";
import { Descriptions,message, Layout, Space, Button, Dropdown, Table, Tag } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import type { MenuProps ,DescriptionsProps} from "antd";
import { Common } from "@/common";
import { Permission, Breadcrumb } from "@/components";
import { useTable, usePageTable } from "@/hooks/UseTable";

import Query from "./Query";
import { queryOperationLog } from "./service";

const App = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "类型",
      dataIndex: "logType",
      render: (_, record) => {
        const menuTypeMap = {
          info: { color: "success" },
          error: { color: "error" },
        };
        const { color } = menuTypeMap[record.logType];
        return <Tag color={color}>{record.logType}</Tag>;
      },
    },

    {
      title: "IP",
      dataIndex: "ip",
    },
    {
      title: "耗时",
      dataIndex: "time",
      render: (text) => <Tag color="processing">{text}ms</Tag>,
    },
    {
      title: "创建日期",
      dataIndex: "createTime",
      width: "12%",
      render: (text) => Common.formatDate(text),
    },
  ];

  const [tableProps, refresh, query] = usePageTable(queryOperationLog);

  return (
    <Layout className="page-layout">
      <Breadcrumb />
      <Layout.Content className="layout-content query-padding">
        <Query query={query} />
      </Layout.Content>
      <Layout.Content className="layout-content">
        <Table
          columns={columns}
          {...tableProps}
          rowKey={(record) => record.id}
          expandable={{
            expandRowByClick: true,
            expandIcon: ({ expanded, onExpand, record }) => (
              <RightOutlined
                style={{
                  transition: "transform 0.3s ease",
                  transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                  cursor: "pointer",
                  color: "var(--ant-color-text-description)"
                }}
                onClick={(e) => onExpand(record, e)}
              />
            ),
            expandedRowRender: (record) => {  
              const items: DescriptionsProps['items'] = [
                {
                  key: '1',
                  label: '请求方法',
                  children: record.method,
                },
                {
                  key: '2',
                  label: '请求参数',
                  children: record.params,
                },
                {
                  key: '3',
                  label: '浏览器',
                  children: record.header,
                },
                {
                  key: '4',
                  label: '错误信息',
                  children: record.detail,
                },
              ];
              return (
                <Descriptions column={1} items={items}
                />
              )
            }
          }}
        />
      </Layout.Content>
    </Layout>
  );
};
export default App;
