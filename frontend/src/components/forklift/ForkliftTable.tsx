import { useEffect, useMemo } from 'react';
import { Checkbox, Empty, Form, Input, InputNumber, Table } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { ForkliftRequest, ForkliftResponse } from '../../types';

interface ForkliftTableProps {
  data: ForkliftResponse[];
  loading: boolean;
  selectedId: number | null;
  editingId: number | 'new' | null;
  onSelect: (forklift: ForkliftResponse) => void;
  onEdit: (forklift: ForkliftResponse) => void;
  onDelete: (forklift: ForkliftResponse) => void;
  onSaveNew: (request: ForkliftRequest) => void;
  onSaveEdit: (id: number, request: ForkliftRequest) => void;
  onCancel: (hasChanges: boolean) => void;
  saveLoading?: boolean;
}

export default function ForkliftTable({
  data,
  loading,
  selectedId,
  editingId,
  onSelect,
  onEdit,
  onDelete,
  onSaveNew,
  onSaveEdit,
  onCancel,
  saveLoading,
}: ForkliftTableProps) {
  const [form] = Form.useForm<ForkliftRequest>();
  const isAdding = editingId === 'new';

  const tableData = useMemo(() => {
    if (!isAdding) return data;
    return [
      {
        id: -1,
        brand: '',
        number: '',
        loadCapacity: 0,
        isActive: true,
        modifiedAt: '',
        modifiedBy: '',
      },
      ...data,
    ];
  }, [data, isAdding]);

  useEffect(() => {
    if (editingId === 'new') {
      form.setFieldsValue({ brand: '', number: '', loadCapacity: 0, isActive: true });
      return;
    }
    const record = data.find((item) => item.id === editingId);
    if (record) {
      form.setFieldsValue({
        brand: record.brand,
        number: record.number,
        loadCapacity: record.loadCapacity,
        isActive: record.isActive,
      });
    }
  }, [data, editingId, form]);

  const buildRequest = async () => {
    const values = await form.validateFields();
    return {
      brand: values.brand,
      number: values.number,
      loadCapacity: Number(values.loadCapacity),
      isActive: values.isActive ?? true,
    };
  };

  const handleSave = async (record: ForkliftResponse) => {
    const request = await buildRequest();
    if (editingId === 'new') {
      onSaveNew(request);
      return;
    }
    onSaveEdit(record.id, request);
  };

  const renderEditable = (name: keyof ForkliftRequest, record: ForkliftResponse, numeric = false) => {
    const isEditing = editingId === record.id || (editingId === 'new' && record.id === -1);
    if (!isEditing) return record[name as keyof ForkliftResponse] as string | number;
    const rules = name === 'number'
      ? [
        { required: true, message: 'Введите номер' },
        { pattern: /^\S+$/, message: 'Номер не должен содержать пробелы' },
      ]
      : [{ required: true, message: 'Заполните поле' }];
    return (
      <Form.Item name={name} rules={rules} noStyle>
        {numeric ? (
          <InputNumber min={0.001} step={0.001} precision={3} className="table-edit-input" />
        ) : (
          <Input className="table-edit-input" />
        )}
      </Form.Item>
    );
  };

  const columns: ColumnsType<ForkliftResponse> = [
    {
      title: 'Код записи',
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (v: number) => v === -1 ? '' : v,
    },
    {
      title: 'Марка',
      dataIndex: 'brand',
      width: 100,
      render: (_: string, record) => renderEditable('brand', record),
    },
    {
      title: 'Номер',
      dataIndex: 'number',
      width: 100,
      render: (_: string, record) => renderEditable('number', record),
    },
    {
      title: <>Грузоподъём-<br />ность</>,
      dataIndex: 'loadCapacity',
      width: 90,
      align: 'center',
      render: (_: number, record) => renderEditable('loadCapacity', record, true),
    },
    {
      title: 'Активен',
      dataIndex: 'isActive',
      width: 65,
      align: 'center',
      render: (v: boolean, record) => {
        const isEditing = editingId === record.id || (editingId === 'new' && record.id === -1);
        if (isEditing) {
          return (
            <Form.Item name="isActive" valuePropName="checked" noStyle>
              <Checkbox />
            </Form.Item>
          );
        }
        return v ? <CheckOutlined className="active-checkmark" /> : null;
      },
    },
    {
      title: 'Время и Дата изменения',
      dataIndex: 'modifiedAt',
      width: 130,
      align: 'center',
      render: (v: string) => v ? dayjs(v).format('DD.MM.YYYY HH:mm') : '',
    },
    {
      title: 'Пользователь',
      dataIndex: 'modifiedBy',
      width: 110,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 70,
      align: 'center',
      render: (_: unknown, record) => {
        const isEditing = editingId === record.id || (editingId === 'new' && record.id === -1);
        if (isEditing) {
          return (
            <span className="table-actions">
              <CheckOutlined className="save-icon" onClick={(e) => { e.stopPropagation(); handleSave(record); }} />
              <CloseOutlined className="cancel-icon" onClick={(e) => { e.stopPropagation(); onCancel(form.isFieldsTouched()); }} />
            </span>
          );
        }
        return (
          <span className="table-actions">
            <EditOutlined className="table-action-icon" onClick={(e) => { e.stopPropagation(); onEdit(record); }} />
            <CloseOutlined className="table-action-icon" onClick={(e) => { e.stopPropagation(); onDelete(record); }} />
          </span>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        rowKey="id"
        className="pixel-table forklift-table"
        columns={columns}
        dataSource={tableData}
        loading={loading || saveLoading}
        size="small"
        rowClassName={(record) => record.id === selectedId ? 'selected-table-row' : ''}
        onRow={(record) => ({
          onClick: () => {
            if (record.id !== -1) onSelect(record);
          },
          style: { cursor: record.id === -1 ? 'default' : 'pointer' },
        })}
        pagination={false}
        locale={{ emptyText: <Empty description="Нет погрузчиков" /> }}
        scroll={{ x: 735, y: 335 }}
      />
    </Form>
  );
}
