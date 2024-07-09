import React, { useState } from 'react';
import { Form, Input, Radio } from 'antd';
import {FormModal, FormModalProps} from '@/components/FormModal';
import DeptTreeSelect from '@/components/DeptTreeSelect';

const CreateModal: React.FC<FormModalProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        console.log('Success:', values);
      }, 2000);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <FormModal  title='创建用户' open={open} setOpen={setOpen} confirmLoading={confirmLoading} handleSubmit={handleSubmit} resetFields={form.resetFields}> 
      <Form
        form={form}
        name="form_in_modal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ modifier: 'public' }}
        preserve={false} // 清除已卸载的字段内容
        colon={false}
        labelWrap
      >
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请填写用户名' }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="password" label="密码" help="默认密码123123">
          <Input.Password allowClear />
        </Form.Item>
        <Form.Item name="nickname" label="昵称">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Radio.Group>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="phone" label="手机">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input allowClear />
        </Form.Item>
        <Form.Item name="deptId" label="部门">
          <DeptTreeSelect />
        </Form.Item>
        <Form.Item name="enabled" label=" ">
          <Radio.Group>
            <Radio value="1">启用</Radio>
            <Radio value="0">禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </FormModal>
  );
};

export default CreateModal;