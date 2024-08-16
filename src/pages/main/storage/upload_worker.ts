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
// const storageDB = IndexedDB.getInstance("DB1", "file");

// worker.js
self.onmessage = (event) => {
  console.log(event.data)
 
  fileUpload(event.data.file,event.data.uploadId,event.data.id, {
    Authorization: 'Bearer '+event.data.jwt
  })
  // const result = event.data * 2; // 处理数据
  self.postMessage(event.data); // 返回处理结果
  
};


const fileUpload =async (file, uploadId, fileId, jwt) => {
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
  },
  jwt);

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
    },jwt)
    if (uploadPartResult.successful) {
    
    } else {
      throw Error("分段上传失败");
    }
   
  }

  const completeResult = await completeMultipartUpload({
    key: fileName,
    uploadId: uploadId,
    detailList: completePartList,
  },jwt);


  // if(completeResult.successful){
  //   await storageDB.delete(fileId)
  // }
}