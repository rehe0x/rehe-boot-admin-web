import React, { useState, useEffect } from "react";
import messageManager from "@/common/message_manager";
import IndexedDB from "@/common/indexedDB";

export interface CustomFileItem {
  name: string;
  size: string;
  status: string;
  progress: number;
  fileId: string;
}

const storageDB = await IndexedDB.getInstance("DB1", "file");
export const useUploadList = (): [CustomFileItem[], (fileId: string, status: string) => Promise<void>, (fileId: string) => Promise<void>]  => {
  const [fileList, setFileList] = useState<CustomFileItem[]>([]);
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message && message.status === "done") {
        storageDB.delete(message.fileId);
      }
      setFileList((prevList) => {
        const fileIndex = prevList.findIndex(
          (file) => file.name === message.name
        );
        if (fileIndex !== -1) {
          // 如果文件已存在，更新该文件的字段
          const updatedList = [...prevList];
          updatedList[fileIndex] = {
            ...updatedList[fileIndex],
            progress: message.progress, // 更新进度字段
            status: message.status,
          };
          return updatedList;
        }
        // 如果文件不存在，直接添加到列表
        return [...prevList, message];
      });
    };
    messageManager.subscribe<string>("update_upload_list", handleMessage);
    messageManager.publish<any>("upload_worker_init", {});
    // 组件卸载时取消订阅
    return () => {
      messageManager.unsubscribe<string>("update_upload_list", handleMessage);
    };
  }, []);

  const onStatus = async (fileId: string, status: string) => {
    if (status === "uploading") {
      const r = await storageDB.get(fileId);
      r.status = "uploading";
      console.log("upload_uploading");
      storageDB.put(r);
      messageManager.publish<any>("upload_worker", {
        name: "upload_uploading",
        data: {
          fileId: fileId,
          file: r,
        },
      });
      console.log("upload_uploading");
    } else if (status === "pause") {
      messageManager.publish<any>("upload_worker", {
        name: "upload_pause",
        data: {
          fileId: fileId,
        },
      });
      const r = await storageDB.get(fileId);
      r.status = "pause";
      await storageDB.put(r);
      console.log("upload_pause");
    } else if (status === "restart") {
      const r = await storageDB.get(fileId);
      r.status = "uploading";
      console.log("restart_uploading 成功");
      messageManager.publish<any>("upload_worker", {
        name: "upload_uploading",
        data: {
          fileId: fileId,
          file: r,
        },
      });
      console.log("upload_uploading");
    }
  };

  const onDelete = async (fileId: string) => {
    await storageDB.delete(fileId);
    setFileList((prevList) => prevList.filter((f) => f.fileId !== fileId));
  };

  return [fileList, onStatus, onDelete];
};
