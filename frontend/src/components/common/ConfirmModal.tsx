import { Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLoading,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{ danger: true, loading: confirmLoading }}
    >
      <p>{content}</p>
    </Modal>
  );
}
