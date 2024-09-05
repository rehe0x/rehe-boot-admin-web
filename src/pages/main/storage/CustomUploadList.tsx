import React, { useState, useEffect, useRef } from "react";
import { Progress, Space } from "antd";
import {
  SyncOutlined,
  ExclamationOutlined
} from "@ant-design/icons";
import IndexedDB from "@/common/indexedDB";
import messageManager from "@/common/message_manager";
import { formatBytes } from "@/common";

import './CustomUploadList.css'

export interface CustomFileItem{
  name:string;
  size:string;
  status:string;
  progress:number;
  fileId:string;
}

interface CustomUploadListProps{
  fileList?:CustomFileItem[];
  onDelete:(fileId:string) => void;
  onStatus:(fileId:string,status:string) => void;
}

const storageDB = await IndexedDB.getInstance("DB1", "file");

const CustomUploadList: React.FC<CustomUploadListProps> = ({fileList = [],onDelete,onStatus}) => {
  return (
    <div className="custom-upload-list">
      {
        fileList?.map(item => (
        <div key={item.name} style={{display: 'flex', alignItems: 'center'}}>
          <div>
            {
              item.status === 'error' ? 
              <a style={{
                color:  item.status === 'error' ? 'var(--ant-color-error)' : ''
              }}>Error</a>
              : 
              <SyncOutlined style={{color:'var(--ant-color-primary)'}} spin={item.status === 'uploading'} />
            }
          </div>
          <div style={{flex: '1',marginLeft: '10px'}}>
            <div className="custom-upload-list-item">
              <div style={{flex: '1'}}>
                <a style={{overflowWrap: 'break-word',wordBreak:'break-all',
                  color:  item.status === 'error' ? 'var(--ant-color-error)' : ''
                }}>{item.name}</a>
                <span style={{ color: 'rgb(204, 204, 204)' }}>({formatBytes(item.size)})</span>
              </div>
              <Space>
                {(item.status === 'uploading' || item.status === 'pause') && 
                <a onClick={() => onStatus(item.fileId,item.status === 'uploading' ? 'pause' : 'uploading')}>
                  { item.status === 'uploading' ? '暂停' : '继续' }</a>  }

                  {item.status === 'error'  && 
                <a onClick={() => onStatus(item.fileId,'restart')}>
                  重试</a>  }

                <a onClick={() => onDelete(item.fileId)}>删除</a>
              </Space>
            </div>
            <div>
              <Progress style={{ display: 'flex' }} percent={item.progress} status="active" size={['100%', 3]} />
            </div>
          </div>
        </div>
        ))
      }
    </div>
  )
}

export default CustomUploadList