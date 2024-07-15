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
import MenuTreeSelect from "./MenuTreeSelect";
import { EditData } from "./types";
import { getMenuById, createMenu, updateMenu } from "./service";

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

  const [menuTypeValue, setMenuTypeValue] = useState(0);
  const [routeDefault, setRouteDefault] = useState(false);

  const isUpdate = data && data.id && data.update;
  const isCreate = data && data.id && !data.update;

  useEffect(() => {
    fetchMenu();
  }, [data]);

  useEffect(() => {
    !isUpdate && !isCreate && open && form.resetFields();
  }, [menuTypeValue]);

  const fetchMenu = async () => {
    if (isUpdate) {
      setLoading(true);
      const result = await getMenuById(data.id!);
      form.setFieldsValue(result.data);
      setMenuTypeValue(result.data.menuType);
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
        result = await updateMenu({ id: data.id, ...values });
      } else {
        result = await createMenu(values);
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

  const menuTypeOnChange = ({ target: { value } }: RadioChangeEvent) => {
    setMenuTypeValue(value);
    setRouteDefault(false);
  };

  const routeDefaultSwitchChange = (checked: boolean) => {
    setRouteDefault(checked);
    !isUpdate && checked && form.resetFields(["routePath"]); // 清除 routePath 的错误提示
  };

  const menuTypeOptions = [
    { label: "目录", value: 0 },
    { label: "菜单", value: 1 },
    { label: "权限", value: 2 },
  ];

  const initialValues = {
    menuType: menuTypeValue,
    hidden: false,
    routeDefault: routeDefault,
    enabled: 1,
  };
  return (
    <CustomFormModal
      loading={loading}
      title={isUpdate ? "编辑菜单" : "创建菜单"}
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
        <Form.Item name="menuType" label="菜单类型">
          <Radio.Group
            disabled={!!isUpdate}
            options={menuTypeOptions}
            onChange={menuTypeOnChange}
            buttonStyle="solid"
            optionType="button"
          />
        </Form.Item>

        <Form.Item name="parentId" label="上级">
          <MenuTreeSelect disabled={!!isUpdate || !!isCreate} />
        </Form.Item>
        <Form.Item
          name="title"
          label={
            menuTypeOptions.find((item) => item.value === menuTypeValue)
              ?.label + "名称"
          }
          rules={[{ required: true, type: "string", min: 2, max: 20 }]}
        >
          <Input allowClear disabled={false} />
        </Form.Item>

        {menuTypeValue === 1 && (
          <Form.Item
            name="component"
            label="组件路径"
            rules={[{ required: true, type: "string", min: 2, max: 50 }]}
          >
            <Input allowClear placeholder='如 "/pages/main/user/Index"' />
          </Form.Item>
        )}
        {menuTypeValue !== 2 && (
          <Form.Item
            label="路由名称"
            help="如 系统管理=system 用户管理=user 完整路由=http:xxx/system/user"
          >
            <Flex gap="middle">
              <Form.Item
                name="routePath"
                rules={
                  routeDefault
                    ? []
                    : [
                        {
                          required: true,
                          type: "string",
                          min: 1,
                          max: 50,
                          message: "请输入路由名称",
                        },
                      ]
                }
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input placeholder="" disabled={routeDefault} />
              </Form.Item>
              {menuTypeValue === 1 && (
                <Form.Item
                  name="routeDefault"
                  label="默认路由"
                  style={{ marginBottom: 0 }}
                >
                  <Switch onClick={routeDefaultSwitchChange} />
                </Form.Item>
              )}
            </Flex>
          </Form.Item>
        )}

        {menuTypeValue !== 0 && (
          <Form.Item
            name="permission"
            label="权限标识"
            help="如用户管理=user 创建用户=user:create"
            rules={[{ required: true, type: "string", min: 2, max: 20 }]}
          >
            <Input allowClear />
          </Form.Item>
        )}
        <Form.Item name="hidden" label="隐藏">
          <Switch />
        </Form.Item>
      </Form>
    </CustomFormModal>
  );
};

export default EditModal;
