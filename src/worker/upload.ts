import {
  createMultipartUpload,
  checkObjectPartList,
  uploadPart,
  completeMultipartUpload,
  checkMultipartUpload
} from "@/pages/main/storage/service";

import IndexedDB from "@/common/indexedDB";
import storage from "@/common/storage";
import { calculateMD5 } from "@/common/index";
import { readFileBuffer,splitFileToMap } from "@/common/file_util";
const storageDB = await IndexedDB.getInstance("DB1", "file");

export const  fileUploadStart = async (worker,fileData?) => {
  let fileList:any = []
  if(fileData){
    const file = fileData.file;
    // const file = await storageDB.get(fileData.fileId)
    if(file) {
      fileList.push(file)
    }
  } else {
    fileList = await storageDB.getAll();
  }
  console.log('fileList',fileList)

  for (const element of fileList) {
    const result  = await checkMultipartUpload({
      key: element.fileName,
      path:element.path,
      uploadId: element.uploadId,
    })
    if (result.successful && result.data) {
      worker.postMessage({
        name: 'upload',
        data: {
          file: element.file,
          path: element.path,
          uploadId: element.uploadId,
          id: element.id,
          jwt: storage.getStorage("token"),
          status: element.status
        }
      })
    } else {
      storageDB.delete(element.id);
    }
  }
}

const uploadStateMap = new Map(); // 存储每个文件的上传状态
export const pauseUpload = (fileId) => {
  const uploadState = uploadStateMap.get(fileId);
  uploadState.status = 'pause'
}

export const fileUpload =async (file, path, uploadId, fileId, status, jwt) => {
  const fileName = file.name;
  const fileType = file.type;
  const fileSzie = file.size;
  const partMap = splitFileToMap(file,1024 * 1024 * 60)
  const partNumberTotal = partMap.size
  const p = 100 / partNumberTotal

  // 查看上传情况
  const partDetailList = Array.from(partMap, ([key, value]) => ({ 
    partNumber: key,
    size:value.size
   }));

  const checkPartResult = await checkObjectPartList({
    key: fileName,
    path,
    uploadId: uploadId,
    detailList: partDetailList,
  },
  jwt);

  if (!checkPartResult.successful) {
    return;
  }


  if (!uploadStateMap.has(fileId)) {
    uploadStateMap.set(fileId, {
      status: status
    });
  } else {
    if(uploadStateMap.get(fileId).status != status){
      uploadStateMap.set(fileId, {
        status: status
      });
    }
  }


  let completePartList:any = [];

  for (const item of checkPartResult.data) {
    const part = partMap.get(item.partNumber);
    if (!part) {
      throw Error("分段错误");
    }

    let partMd5hex;
    if (item.completion === true) {
      if(!item.etag){
        throw Error("已上传分段etag不存在");
      }
      partMd5hex = item.etag
    } else {
      partMd5hex = await calculateMD5(await part.chunk.arrayBuffer())
    }

    completePartList.push({
      partNumber: item.partNumber,
      md5hex: partMd5hex,
      size: part.size,
    })
    if (item.completion === true) {
      continue
    }
    if(uploadStateMap.get(fileId).status === 'pause'){
      self.postMessage({
        name:'task_upload',
        data:{
          name: fileName,
          size: fileSzie,
          status: "pause",
          progress: Math.floor(p * (item.partNumber - 1)),
          fileId:fileId
        }
      });
      break
    }


    const uploadPartResult = await uploadPart({
      file: part.chunk,
      path,
      uploadId: uploadId,
      partNumber: item.partNumber,
      md5hex: partMd5hex,
      size: part.size,
    },jwt)

    if (uploadPartResult && uploadPartResult.successful) {
      self.postMessage({
        name:'task_upload',
        data:{
          name: fileName,
          size: fileSzie,
          status: "uploading",
          progress: Math.floor(p * item.partNumber),
          fileId:fileId
        }
      });
      
    } else {
      self.postMessage({
        name:'task_upload',
        data:{
          name: fileName,
          size: fileSzie,
          status: "error",
          progress: Math.floor(p * item.partNumber),
          fileId:fileId
        }
      });
      throw Error("分段上传失败");
    }
   
  }

  if(uploadStateMap.get(fileId).status === 'uploading'){
    const completeResult = await completeMultipartUpload({
      key: fileName,
      path,
      uploadId: uploadId,
      detailList: completePartList,
    },jwt);
  
  
    if(completeResult.successful){
      self.postMessage({
        name:'task_upload',
        data:{
          name: fileName,
          size: fileSzie,
          status: "done",
          progress: 100,
          fileId:fileId
        }
      });
    }
  }
}