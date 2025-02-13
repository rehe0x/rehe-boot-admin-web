import React, { useState, useEffect } from "react";
import { message,Form, Input, Radio } from "antd";
import CustomFormModal from "@/components/CustomFormModal";
import { EditData } from "./types";
import { getScheduledTaskById, createScheduledTask, updateScheduledTask } from "./service";

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
    taskMode: 1,
  };
  const fetchScheduledTask = async () => {
    if (isUpdate) {
      setLoading(true);
      const result = await getScheduledTaskById(data.id!);
      form.setFieldsValue(result.data);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    } else {
      form.resetFields()
    }
  };
  useEffect(() => {
    fetchScheduledTask();
  }, [data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      let result: { successful: boolean };
      if (isUpdate) {
        result = await updateScheduledTask({ id: data.id, ...values });
      } else {
        result = await createScheduledTask(values);
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
      // width="600px"
      loading={loading}
      title={isUpdate ? "编辑任务" : "创建任务"}
      open={open}
      setOpen={setOpen}
      confirmLoading={confirmLoading}
      handleSubmit={handleSubmit}
      resetFields={!isUpdate ? form.resetFields : undefined}
    >
      <Form
        form={form}
        name="form_in_modal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialValues}
        preserve={false} // 清除已卸载的字段内容
        colon={false}
        labelWrap
      >
        <Form.Item name="taskName" label="任务名称" rules={[{required:true,type: "string", min: 2, max: 20}]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="beanName" label="BeanName" rules={[{required:true,type: "string"}]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item name="methodName" label="MethodName" rules={[{required:true,type: "string"}]}>
          <Input allowClear />
        </Form.Item>
    
        <Form.Item name="taskMode" label="任务方式" rules={[{required:true}]}>
          <Radio.Group>
            <Radio value={1}>cron</Radio>
            <Radio value={2}>时间间隔ms</Radio>
            <Radio value={3}>时间延迟ms</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="expression" label="表达式" rules={[{required:true, type: "string"}]}>
          <Input allowClear />
        </Form.Item>

        <Form.Item name="argument" label="参数">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
