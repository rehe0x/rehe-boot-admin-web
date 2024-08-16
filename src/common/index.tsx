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

export const Common = {formatDate}