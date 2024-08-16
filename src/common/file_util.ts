export const readFileBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
      reject(reader.error);
    };

    reader.onload = (r) => {
      const fileBuffer = r.target?.result as ArrayBuffer;
      resolve(fileBuffer);
    };
  });
};

export const splitFileToMap = (file:File, chunkSize:number)
: Map<
 number,
 { offset: number; size: number; chunk: File }
>  => {
console.log(file.size/chunkSize)
 const totalChunks = Math.ceil(file.size / chunkSize);
 const partMap = new Map<number,{ offset: number; size: number; chunk: File }>();
 for (let i = 0; i < totalChunks; i++) {
   const offset = i * chunkSize;
   const end = Math.min(offset + chunkSize, file.size);
   const chunk = new File([file.slice(offset, end)], file.name, { type: file.type });
   partMap.set(i + 1,{
     offset:offset,
     size: chunk.size,
     chunk: chunk
   })
 }
 return partMap;
}