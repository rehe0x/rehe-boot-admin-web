import React, { useEffect, useState } from "react";
import { Button, Popover } from "antd";
import {
  DownOutlined,
  SunOutlined,
  MoonOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import CustomUploadList from "@/pages/main/storage/CustomUploadList";
import { useUploadList } from "@/hooks/UseUploadList";

export const WorkerTask: React.FC<{}> = () => {
  const [fileList, onStatus, onDelete] = useUploadList();
  return (
    <Popover
      placement="bottomRight"
      content={
        <div style={{ width: "500px" }}>
          <CustomUploadList fileList={fileList} onStatus={onStatus} onDelete={onDelete}/>
        </div>
      }
      title="WorkerTask"
      trigger="click"
      arrow={{ pointAtCenter: true }}
    >
      <a style={{ fontSize: "18px" }} onClick={(e) => e.preventDefault()}>
        <SyncOutlined spin={fileList.some(item => item.status.includes('uploading'))} />
      </a>
    </Popover>
  );
};
