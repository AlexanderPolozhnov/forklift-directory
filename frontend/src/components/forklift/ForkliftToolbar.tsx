import { Button, Space } from 'antd';

interface ForkliftToolbarProps {
  editMode: boolean;
  hasSelection: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  saveLoading?: boolean;
}

export default function ForkliftToolbar({
  editMode,
  hasSelection,
  onAdd,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  saveLoading,
}: ForkliftToolbarProps) {
  return (
    <Space wrap>
      <Button type="primary" onClick={onAdd} disabled={editMode}>
        Добавить
      </Button>
      <Button onClick={onEdit} disabled={!hasSelection || editMode}>
        Изменить
      </Button>
      <Button danger onClick={onDelete} disabled={!hasSelection || editMode}>
        Удалить
      </Button>
      <Button type="primary" onClick={onSave} disabled={!editMode} loading={saveLoading}>
        Сохранить
      </Button>
      <Button onClick={onCancel} disabled={!editMode}>
        Отмена
      </Button>
    </Space>
  );
}
