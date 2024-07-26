import React, { useState, useEffect } from "react";
import { message, Form, Input, InputNumber, Radio, Flex, Select } from "antd";
import CustomFormModal from "@/components/CustomFormModal";
import DeptTreeSelect from "@/components/DeptTreeSelect";
import { EditData } from "./types";
import { getRoleById, createRole, updateRole } from "./service";

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
  const [scope, setScope] = useState(0);
  const isUpdate = data && data.id;
  const initialValues = {
    level: 1,
    scope: 0,
  };
  const fetchUser = async () => {
    if (isUpdate) {
      setLoading(true);
      const result = await getRoleById(data.id!);
      form.setFieldsValue(result.data);
      setScope(result.data.scope)
      setTimeout(() => {
        setLoading(false);
      }, 400);
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
        result = await updateRole({ id: data.id, ...values });
      } else {
        result = await createRole(values);
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
      title={isUpdate ? "编辑角色" : "创建角色"}
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
          label="角色名"
          rules={[{ required: true, type: "string", min: 2, max: 20 }]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item label="级别">
          <Flex gap="middle" justify="space-between">
            <Form.Item
              name="level"
              rules={[{ required: true, message: "请输入级别" }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item name="scope" label="范围" style={{ marginBottom: 0 }}>
              <Select
                style={{ width: 120 }}
                onChange={(v) => setScope(v)}
                options={[
                  { value: 0, label: "全部" },
                  { value: 1, label: "本级" },
                  { value: 2, label: "自定义" },
                ]}
              />
            </Form.Item>
          </Flex>
        </Form.Item>
        {scope === 2 && (
          <Form.Item name="deptIds" label="部门">
            <DeptTreeSelect multiple />
          </Form.Item>
        )}

        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
