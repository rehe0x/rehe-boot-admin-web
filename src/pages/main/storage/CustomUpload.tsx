import React, { useState, useEffect, useRef } from "react";
import { Layout, Space, Button, Table } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { formatBytes } from "@/common";
import IndexedDB from "@/common/indexedDB";
import storage from "@/common/storage";
import { useUploadList } from "@/hooks/UseUploadList";

import {
  createMultipartUpload,
} from "./service";

import CustomUploadList, { CustomFileItem } from "./CustomUploadList";
import messageManager from "@/common/message_manager";

const storageDB = await IndexedDB.getInstance("DB1", "file");

const CustomUpload: React.FC<{paths:string}> = ({paths}) => {
  const [fileList, onStatus, onDelete] = useUploadList();

  const inputRef = useRef(null);
  const handleFileChange = async (event) => {
    // const path = paths.splice(1).map(item => item.name).join('/')
    const path = paths ? paths: '/'
    const file = event.target.files?.[0];
    const fileName = file.name;
    const fileType = file.type;
    const fileSzie = file.size;

    const result = await createMultipartUpload({
      key: fileName,
      path,
      contentType: fileType,
    });
    if (!result.successful) {
      return;
    }

    const fileId = await storageDB.add({
      uploadId: result.data,
      fileName: fileName,
      path,
      file: file,
      status: 'uploading'
    });

    messageManager.publish<any>("upload_worker", {
      name: 'upload',
      data:{
        file: file,
        path,
        uploadId: result.data,
        id: fileId,
        jwt: storage.getStorage("token"),
        status: 'uploading'
      }
    });
  };
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    
      <Space size="small" style={{marginBottom: '15px'}}>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => inputRef.current.click()}
        >
          上传
        </Button>
      </Space>
      <CustomUploadList fileList={fileList} onStatus={onStatus} onDelete={onDelete}/>
    </>
  );
};

export default CustomUpload;
