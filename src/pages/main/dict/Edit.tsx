import React, { useState, useEffect } from "react";
import { message, Form, Input, InputNumber, Radio, Flex, Select } from "antd";
import CustomFormModal from "@/components/CustomFormModal";
import { EditData } from "./types";
import { createDict, updateDict } from "./service";

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
  };
  const fetchUser = () => {
    if (isUpdate) {
      form.setFieldsValue(data);
    } else {
      form.resetFields()
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
        result = await updateDict({ id: data.id, ...values });
      } else {
        result = await createDict(values);
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
      title={isUpdate ? "编辑字典" : "创建字典"}
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
          name="name"
          label="字典名称"
          rules={[{ required: true, type: "string", min: 2, max: 20 }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          name="code"
          label="code"
          rules={[{ required: true, type: "string", min: 2, max: 20 }]}
        >
          <Input allowClear />
        </Form.Item>

      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
