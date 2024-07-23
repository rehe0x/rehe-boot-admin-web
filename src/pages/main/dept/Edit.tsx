import React, { useState, useEffect } from "react";
import {
  message,
  Form,
  Input,
  InputNumber,
  Switch,
  Radio,
  RadioChangeEvent,
  Row,
  Col,
  Space,
  Flex,
} from "antd";
import CustomFormModal from "@/components/CustomFormModal";
import DeptTreeSelect from "@/components/DeptTreeSelect";
import { EditData } from "./types";
import { getDeptById, createDept, updateDept } from "./service";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: EditData;
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

  const isUpdate = data.id && data.update;
  const isCreate = data.id && !data.update;

  useEffect(() => {
    fetchDept();
  }, [data]);

  const fetchDept = async () => {
    if (isUpdate) {
      setLoading(true);
      const result = await getDeptById(data.id!);
      form.setFieldsValue(result.data);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
    isCreate && form.setFieldsValue({ parentId: data.id });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      let result: { successful: boolean };
      if (isUpdate) {
        result = await updateDept({ id: data.id, ...values });
      } else {
        result = await createDept(values);
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
    isCreate && form.setFieldsValue({ parentId: data.id });
    message.success("保存成功");
    refresh();
  };

  const initialValues = {
    enabled: 1,
    sort: 0,
  };
  return (
    <CustomFormModal
      loading={loading}
      title={isUpdate ? "编辑部门" : "创建部门"}
      open={open}
      setOpen={setOpen}
      confirmLoading={confirmLoading}
      handleSubmit={handleSubmit}
      resetFields={!isUpdate && !isCreate ? form.resetFields : undefined}
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
        <Form.Item name="parentId" label="上级">
          <DeptTreeSelect />
        </Form.Item>
        <Form.Item
          name="name"
          label="部门名称"
          rules={[{ required: true, type: "string", min: 2, max: 20 }]}
        >
          <Input allowClear disabled={false} />
        </Form.Item>

        <Form.Item label="排序">
          <Flex gap="middle">
            <Form.Item
              name="sort"
              rules={[{ required: true }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item name="enabled" label="启用" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>
          </Flex>
        </Form.Item>
      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
