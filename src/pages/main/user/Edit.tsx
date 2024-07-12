import React, { useState, useEffect } from "react";
import { message,Form, Input,InputNumber, Radio } from "antd";
import CustomFormModal from "@/components/CustomFormModal";
import DeptTreeSelect from "@/components/DeptTreeSelect";
import { EditData } from "./types";
import { getUserById, createUser, updateUser } from "./service";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: EditData;
  refresh: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  refresh,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isUpdate = data && data.id;
  const initialValues = {
    gender: "男",
    enabled: 1,
  };
  const fetchUser = async () => {
    if (isUpdate) {
      setLoading(true);
      const result = await getUserById(data.id!);
      form.setFieldsValue(result.data);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      let result: { successful: boolean };
      if (isUpdate) {
        result = await updateUser({ id: data.id, ...values });
      } else {
        result = await createUser(values);
      }
      if (result.successful) {
        handleSuccess();
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleSuccess = () => {
    setConfirmLoading(false);
    !isUpdate && form.resetFields();
    message.success("保存成功");
    refresh();
  };

  return (
    <CustomFormModal
      loading={loading}
      title={isUpdate ? "编辑用户" : "创建用户"}
      open={open}
      setOpen={setOpen}
      confirmLoading={confirmLoading}
      handleSubmit={handleSubmit}
      resetFields={!isUpdate ? form.resetFields : undefined}
    >
      <Form
        form={form}
        name="form_in_modal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        preserve={false} // 清除已卸载的字段内容
        colon={false}
        labelWrap
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, type: "string", min: 2, max: 20 }]}
        >
          <Input allowClear disabled={false} />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          help="默认密码123123"
          rules={[{}]}
        >
          <Input.Password allowClear />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{required:true,type: "string", min: 2, max: 20}]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="gender" label="性别" rules={[{required:true}]}>
          <Radio.Group>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="phone" label="手机" rules={[{required:true},{pattern: /^[0-9]{11}$/, message:"请输入正确的手机号"}]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{required: true,type:"email"}]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="deptId" label="部门">
          <DeptTreeSelect />
        </Form.Item>
        <Form.Item name="enabled" label=" ">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
