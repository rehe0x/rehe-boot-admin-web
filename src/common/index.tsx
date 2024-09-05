import dayjs from 'dayjs';
import init, { md5_hash } from "@/wasm/md5_wasm.js";

const formatDate = (d:any) => {
  return dayjs(d).format('YYYY/MM/DD HH:mm:ss');
};

export const calculateMD5 = async  (buffer) => {
  await init();
  const uint8Array = new Uint8Array(buffer);
  const hash = md5_hash(uint8Array);
  return hash;
}


export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Common = {formatDate}