import React, { useState } from 'react';
import { Button,  Form, Input,  Space  } from 'antd';

import { QueryForm } from "@/components/QueryForm";

import DeptTreeSelect from '@/components/DeptTreeSelect';

interface QueryProps{
  query: (formData: Record<string, any>) => void
}

const App:React.FC<QueryProps> = ({ query }) => {
  const [form] = Form.useForm();
  const onFinish = (values: Record<string, any>) => {
    query(values)
  };
  return (
    <Form  form={form}  onFinish={onFinish}>
      <QueryForm>
          <Form.Item name="keyword" label='关键字'>
            <Input placeholder="用户名/昵称/手机/ID" />
          </Form.Item>
          <Form.Item name="deptIds" label='部门'>
            <DeptTreeSelect multiple/>
          </Form.Item>
          <Space size="small">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button
             onClick={() => {
              form.resetFields();
            }}
            >
              重置
            </Button>
          </Space>
      </QueryForm>
    </Form>
  );
};
export default App;