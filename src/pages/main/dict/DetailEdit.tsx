import React, { useState, useEffect } from "react";
import { message, Form, Input, InputNumber, Radio, Flex, Select } from "antd";
import CustomFormModal from "@/components/CustomFormModal";
import { DetailEditData } from "./types";
import { createDictDetail, updateDictDetail } from "./service";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data?: DetailEditData;
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
  const isCretae = data && data.dictId;
  const initialValues = {
    sort: 0
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
      let result: { successful: boolean } = {successful:false};
      if (isUpdate) {
        result = await updateDictDetail({ id: data.id, ...values });
      } else if(isCretae){
        result = await createDictDetail({ dictId: data.dictId,...values});
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
      title={isUpdate ? "编辑字典明细" : "创建字典明细"}
      open={open}
      setOpen={setOpen}
      confirmLoading={confirmLoading}
      handleSubmit={handleSubmit}
      resetFields={!isUpdate ? form.resetFields : undefined}
    >
      <Form
        form={form}
        name="form_in_modal2"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        preserve={false} // 清除已卸载的字段内容
        colon={false}
        labelWrap
      >
        <Form.Item
          name="label"
          label="字典标题"
          rules={[{ required: true, type: "string", min: 1, max: 20 }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          name="value"
          label="字典值"
          rules={[{ required: true, type: "string", min: 1, max: 20 }]}
        >
          <Input allowClear />
        </Form.Item>
          <Form.Item
            name="sort"
             label="排序"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
