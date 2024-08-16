import React, { useState, useEffect, useRef } from "react";
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
  Radio,
} from "antd";
import { Permission, Breadcrumb } from "@/components";
import {
  createMultipartUpload,
  checkObjectPartList,
  uploadPart,
  completeMultipartUpload,
  checkMultipartUpload
} from "./service";
import IndexedDB from "@/common/indexedDB";
import { calculateMD5 } from "@/common/index";
import { readFileBuffer,splitFileToMap } from "@/common/file_util";
import storage from "@/common/storage";

// const worker = new Worker(new URL('./upload_worker.ts', import.meta.url));
const worker = new Worker(new URL('./upload_worker.ts', import.meta.url), { type: 'module' });
worker.onmessage = (event) => {
  console.log('Result from worker:', event.data);
};

// worker.postMessage(10); // 发送数据到 worker
const token = storage.getStorage('token');

const storageDB = IndexedDB.getInstance("DB1", "file");

const Storage: React.FC<{}> = () => {


  
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const [selectedFile, setSelectedFile] = useState(null);

  storageDB.getAll().then((r) => {
    console.log(r)
    if(r && r.length > 0){
      r.forEach(element => {
        checkMultipartUpload({
          key:element.fileName,
          uploadId:element.uploadId
        }).then((r) => {
          if(r.successful){
            if(!r.data){
              storageDB.delete(element.id)
            } else {
              worker.postMessage({file:element.file,uploadId:element.uploadId,id:element.id,jwt:token}); // 发送数据到 worker

              // fileUpload(element.file, element.uploadId, element.id)
            }
           
          }
        })
      });
    }
   
  })


  const fileUpload =async (file, uploadId, fileId) => {
    const fileName = file.name;
    const fileType = file.type;
    const fileSzie = file.size;
    // let ffsdfsd = await storageDB.get(key1);
    // const file = ffsdfsd.file;
    const partMap = splitFileToMap(file,1024 * 1024 * 60)
    // 查看上传情况
    const partDetailList = Array.from(partMap, ([key, value]) => ({ 
      partNumber: key,
      size:value.size
     }));

    const checkPartResult = await checkObjectPartList({
      key: fileName,
      uploadId: uploadId,
      detailList: partDetailList,
    });

    if (!checkPartResult.successful) {
      return;
    }
    let completePartList:any = [];

    for (const item of checkPartResult.data) {
      const part = partMap.get(item.partNumber);
      if (!part) {
        throw Error("分段错误");
      }
      const partMd5hex = await calculateMD5(await readFileBuffer(part.chunk))

      completePartList.push({
        partNumber: item.partNumber,
        md5hex: partMd5hex,
        size: part.size,
      })

      if (item.completion === true) {
        console.log(item.etag,partMd5hex)
        if(item.etag !== partMd5hex){
          throw Error("已上传分段etag错误");
        }
        continue;
      }

      const uploadPartResult = await uploadPart({
        file: part.chunk,
        uploadId: uploadId,
        partNumber: item.partNumber,
        md5hex: partMd5hex,
        size: part.size,
      })
      if (uploadPartResult.successful) {
      
      } else {
        throw Error("分段上传失败");
      }
     
    }

    const completeResult = await completeMultipartUpload({
      key: fileName,
      uploadId: uploadId,
      detailList: completePartList,
    });


    if(completeResult.successful){
      await storageDB.delete(fileId)
    }
  }
  
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    const fileName = file.name;
    const fileType = file.type;
    const fileSzie = file.size;

    const result = await createMultipartUpload({
      key: fileName,
      contentType: fileType,
    });
    if (!result.successful) {
      return;
    }

    const fileId = await storageDB.add({
      uploadId: result.data,
      fileName:fileName,
      file: file,
    });

    worker.postMessage({file:file,uploadId:result.data,id:fileId,jwt:token}); // 发送数据到 worker

    // fileUpload(file, result.data,fileId)
   
  };

  return (
    <Layout className="page-layout">
      <Breadcrumb />

      {/* <Layout.Content className="layout-content query-padding">
        <Query query={query} />
      </Layout.Content> */}
      {/* <input type="file" onChange={handleFileChange} /> */}
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Layout.Content className="layout-content">
        <div className="layout-title">
          <Space size="small">
            <Button type="primary" onClick={() => handleButtonClick()}>
              上传
            </Button>
          </Space>
        </div>

        {/* <Table
          columns={columns}
          rowKey={(record) => record.id}
          expandable={{ expandRowByClick: true }}
          rowSelection={{ checkStrictly: true }}
          {...tableProps}
        /> */}
      </Layout.Content>
    </Layout>
  );
};

export default Storage;
