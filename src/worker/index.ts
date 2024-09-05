import { fileUpload,pauseUpload } from "./upload.ts";
self.postMessage('ready');
self.onmessage = ({ data }) => {
  if(data.name === 'upload'){
    fileUpload(data.data.file, data.data.uploadId, data.data.id, data.data.status ,{
      Authorization: "Bearer " + data.data.jwt,
    });
  } else if(data.name === 'upload_pause'){
    pauseUpload(data.data.fileId)
  }
};
