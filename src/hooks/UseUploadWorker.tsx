import React, { useEffect } from "react";
import { fileUploadStart } from "@/worker/upload";
import messageManager from "@/common/message_manager";

export const useStartUploadWorker = () => {
  let upload_worker_init = false;
  useEffect(() => {
    messageManager.subscribe<any>("upload_worker_init", (message) => {
     
      if(!upload_worker_init){
        upload_worker_init = true;
        workerInit()
      }
    });

    let worker;
    const workerInit = () => {
       // 初始化worker
      worker = new Worker(new URL("@/worker/index.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = ({ data }) => {
        if (data === "ready") {
          console.log('worker start');
          fileUploadStart(worker);
        } else {
          if (data && data.name === "task_upload") {
            messageManager.publish<any>("update_upload_list", data.data);
          }
        }
      };
      messageManager.subscribe<any>("upload_worker", (message) => {
        if (message.name === "upload") {
          worker.postMessage({
            name: "upload",
            data: message.data,
          });
        } else if (message.name === "upload_uploading") {
          fileUploadStart(worker, message.data);
        } else if (message.name === "upload_pause") {
          worker.postMessage({
            name: "upload_pause",
            data: message.data,
          });
        }
      });
    }
    return () => {
      worker.terminate()
      console.log('worker destroy');
    };
  }, []);
};
