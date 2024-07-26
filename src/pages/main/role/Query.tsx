import React, { useState } from 'react';
import { Button,  Form, Input,  Space  } from 'antd';

import { QueryForm } from "@/components/QueryForm";

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
            <Input placeholder="角色名/描述/ID" />
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