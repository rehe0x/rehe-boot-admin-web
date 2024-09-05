import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Space,
  Button,
  Table,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { Permission, Breadcrumb } from "@/components";
import { formatBytes } from "@/common";
import { useTable } from "@/hooks/UseTable";

import { queryStorage } from "./service";
import CustomUpload from "./CustomUpload";

const Storage: React.FC<{}> = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>
          {record.mimeType === "Folder" ? <strong>{text}</strong> : text}
        </a>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text, record) => (
        <>{record.size ? <>{ formatBytes(text) } </>: '--'}</>
      ),
    },
    {
      title: "Type",
      dataIndex: "mimeType",
      key: "mimeType",
      render: (text, record) => (
        <>{record.mimeType ? <>{ text } </>: '--'}</>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          style={{height: 0}}
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];


  const [currentPath, setCurrentPath] = useState([
    { name: "/", key: "1", folder: false },
  ]);

  const [tableProps, refresh, query, params] = useTable(queryStorage);

  useEffect(() => {
    let paths = ''
    currentPath.forEach((item) => {
      if(item.name !== '/'){
        paths += item.name+"/"
      }
    })
    paths !== '' && query({ path:paths })
  },[currentPath])

  const onRowClick = (record) => {
    if (record.folder) {
      setCurrentPath((prev) => [
        ...prev,
        { name: record.name, key: record.key, folder: false },
      ]);
    }
  };
  
  const navigateToPath = (index) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    index === 0 && query({ path:'' })
  };

 
  const handleDelete = (key) => {
    const updatedData = data.filter((item) => item.key !== key);
    setData(updatedData);
  };
  
  return (
    <Layout className="page-layout">
      <Breadcrumb />
   
      <Layout.Content className="layout-content">
        <CustomUpload />
      </Layout.Content>

      <Layout.Content className="layout-content">
        <div className="layout-title">
          <Space size="small">
            {currentPath.map((node, index) => (
              <React.Fragment key={index}>
                <a key={index} onClick={() => navigateToPath(index)}>{node.name}</a>
                {index < currentPath.length - 1 && node.name !=='/' && (
                  <span className="ant-breadcrumb css-var-r2" style={{ color: "var(--ant-breadcrumb-separator-color)" }}>/</span>
                )}
              </React.Fragment>
            ))}
          </Space>

          <Space size="small">
            <Button icon={<PlusOutlined />} type="link" block>
              新建文件夹
            </Button>
          </Space>
        </div>
        <Table columns={columns} {...tableProps} rowKey={record => record.name} />
      </Layout.Content>
    </Layout>
  );
};

export default Storage;
