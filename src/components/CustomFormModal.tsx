import React, { ReactNode } from "react";
import { Modal, Button } from "antd";

// export interface FormModalProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

interface CustomFormModalProps{
  open: boolean;
  setOpen: (open: boolean) => void;
  confirmLoading: boolean;
  handleSubmit: () => void;
  children: ReactNode;
  title: string;
  resetFields?: () => void | undefined;
  width?: string;
  loading?: boolean;
}

export const CustomFormModal: React.FC<CustomFormModalProps> = ({
  open,
  setOpen,
  width,
  loading,
  confirmLoading,
  handleSubmit,
  children,
  title,
  resetFields,
}) => {
  return (
    <Modal
      forceRender
      loading={loading}
      open={open}
      title={title}
      width={width}
      okButtonProps={{ autoFocus: true }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      footer={[
        <Button key="back" onClick={() => setOpen(false)}>
          取消
        </Button>,
        resetFields ? (
          <Button key="reset" onClick={() => resetFields()}>
            重置
          </Button>
        ) : null,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          保存
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default CustomFormModal;
