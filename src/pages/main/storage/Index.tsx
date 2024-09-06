import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Space,
  Button,
  Table,
  Modal,
  Input,
  Popconfirm,
  Typography,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { Permission, Breadcrumb } from "@/components";
import { formatBytes } from "@/common";
import { useTable } from "@/hooks/UseTable";

import {
  queryStorage,
  createFolder,
  deleteFolder,
  renameFolder,
} from "./service";
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
      width: "12%",
      render: (text, record) => (
        <>{record.size ? <>{formatBytes(text)} </> : "--"}</>
      ),
    },
    {
      title: "Type",
      dataIndex: "mimeType",
      key: "mimeType",
      width: "12%",
      render: (text, record) => <>{record.mimeType ? <>{text} </> : "--"}</>,
    },
    {
      title: "Action",
      key: "action",
      width: "12%",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            icon={null}
            placement="left"
            title="重命名"
            description={
              <div style={{ paddingInline: "20px" }}>
                <Input
                  disabled
                  placeholder="文件夹名称"
                  value={record.name}
                  
                />
                <Input
                  placeholder="新名称"
                  onChange={(e) => setRename(e.target.value)}
                />
              </div>
            }
            onConfirm={() => handleRename(record.name, rename)}
            okButtonProps={{ loading: confirmRNLoading }}

            okText="确认"
            cancelText="取消"
          >
            <Button
              style={{ height: 0 }}
              type="link"
              icon={<EditOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
          <Popconfirm
            placement="left"
            title="确认删除?"
            description={
              <Typography.Text type="danger">
                同时会删除该文件夹下面的所有文件及文件夹！
              </Typography.Text>
            }
            onConfirm={() => handleDelete(record.name)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              style={{ height: 0 }}
              type="link"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const [reNameOpen, setReNameOpen] = useState(false);
  const [confirmRNLoading, setConfirmRNLoading] = useState(false);
  const [rename, setRename] = useState();


  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [folderName, setFolderName] = useState();

  const [currentPath, setCurrentPath] = useState([
    { name: "/", key: "/", folder: false },
  ]);

  const [tableProps, refresh, query, params] = useTable(queryStorage);

  useEffect(() => {
    let paths = "";
    currentPath.forEach((item) => {
      if (item.name !== "/") {
        paths += item.name + "/";
      }
    });
    paths !== "" && query({ path: paths });
  }, [currentPath]);

  const onRowClick = (record) => {
    if (record.folder) {
      setCurrentPath((prev) => [
        ...prev,
        { name: record.name, key: record.name, folder: false },
      ]);
    }
  };

  const navigateToPath = (index) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    index === 0 && query({ path: "" });
  };

  const handleDelete = async (key) => {
    const p = currentPath
      .splice(1)
      .map((item) => item.name)
      .join("/");
    const r = await deleteFolder({ path: p ? p + "/" + key : key });
    if (r.successful) {
      if (params && params.path) {
        const m = params.path
          .split("/")
          .filter((s) => s)
          .map((item) => ({ name: item, key: item, folder: false }));
        setCurrentPath((prev) => [...prev, ...m]);
      } else {
        setTimeout(() => {
          refresh();
        }, 200);
      }
    }
  };

  const handleRename = async (key,tkey) => {
    const p = currentPath
      .splice(1)
      .map((item) => item.name)
      .join("/");

      console.log(p ? p + "/" + key : key)
      console.log(p ? p + "/" + tkey : tkey)

    const r = await renameFolder({ sourceKey: p ? p + "/" + key : key, targetKey: p ? p + "/" + tkey : tkey });


    if (r.successful) {
      if (params && params.path) {
        const m = params.path
          .split("/")
          .filter((s) => s)
          .map((item) => ({ name: item, key: item, folder: false }));
        setCurrentPath((prev) => [...prev, ...m]);
      } else {
        setTimeout(() => {
          refresh();
        }, 200);
      }
    }
  };

  const handleOk = async () => {
    const p = currentPath
      .splice(1)
      .map((item) => item.name)
      .join("/");
    if (folderName && folderName !== "") {
      setConfirmLoading(true);
      const r = await createFolder({
        path: p ? p + "/" + folderName : folderName,
      });
      if (r.successful) {
        if (params && params.path) {
          const m = params.path
            .split("/")
            .filter((s) => s)
            .map((item) => ({ name: item, key: item, folder: false }));
          setCurrentPath((prev) => [...prev, ...m]);
        } else {
          refresh();
        }

        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
          // refresh()
        }, 500);
      }
    }
  };

  return (
    <Layout className="page-layout">
      <Breadcrumb />

      <Layout.Content className="layout-content">
        <CustomUpload paths={params && params.path} />
      </Layout.Content>

      <Layout.Content className="layout-content">
        <div className="layout-title">
          <Space size="small">
            {currentPath.map((node, index) => (
              <React.Fragment key={index}>
                <a key={index} onClick={() => navigateToPath(index)}>
                  {node.name}
                </a>
                {index < currentPath.length - 1 && node.name !== "/" && (
                  <span
                    className="ant-breadcrumb css-var-r2"
                    style={{ color: "var(--ant-breadcrumb-separator-color)" }}
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </Space>

          <Space size="small">
            <Button
              icon={<PlusOutlined />}
              type="link"
              block
              onClick={() => setOpen(true)}
            >
              新建文件夹
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          {...tableProps}
          rowKey={(record) => record.name}
        />
      </Layout.Content>

      <Modal
        title="新建文件夹"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <Input
          placeholder="文件夹名称"
          onChange={(e) => setFolderName(e.target.value)}
        />
      </Modal>
    </Layout>
  );
};

export default Storage;
