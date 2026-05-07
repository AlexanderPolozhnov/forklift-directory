import { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import type { IncidentRequest, IncidentResponse } from '../../types';
import { formatDowntime } from '../../utils/downtimeFormatter';

interface IncidentModalProps {
  open: boolean;
  incident: IncidentResponse | null;
  onSubmit: (data: IncidentRequest) => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

interface FormValues {
  startedAt: Dayjs;
  resolvedAt: Dayjs | null;
  description: string;
}

export default function IncidentModal({
  open,
  incident,
  onSubmit,
  onCancel,
  confirmLoading,
}: IncidentModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [downtimePreview, setDowntimePreview] = useState<string>('');

  useEffect(() => {
    if (open) {
      if (incident) {
        form.setFieldsValue({
          startedAt: dayjs(incident.startedAt),
          resolvedAt: incident.resolvedAt ? dayjs(incident.resolvedAt) : null,
          description: incident.description ?? '',
        });
      } else {
        form.setFieldsValue({
          startedAt: dayjs(),
          resolvedAt: null,
          description: '',
        });
      }
      updateDowntimePreview();
    }
  }, [open, incident]);

  const updateDowntimePreview = () => {
    const values = form.getFieldsValue();
    if (values.startedAt) {
      const startedAt = values.startedAt.toISOString();
      const resolvedAt = values.resolvedAt ? values.resolvedAt.toISOString() : null;
      setDowntimePreview(formatDowntime(startedAt, resolvedAt));
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data: IncidentRequest = {
        startedAt: values.startedAt.toISOString(),
        resolvedAt: values.resolvedAt ? values.resolvedAt.toISOString() : null,
        description: values.description || null,
      };
      onSubmit(data);
    } catch {
      // validation failed — errors shown under fields
    }
  };

  return (
    <Modal
      open={open}
      title={incident ? 'Изменить инцидент' : 'Добавить инцидент'}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={confirmLoading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onValuesChange={updateDowntimePreview}>
        <Form.Item
          name="startedAt"
          label="Дата начала"
          rules={[{ required: true, message: 'Дата начала обязательна' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} format="DD.MM.YYYY HH:mm" />
        </Form.Item>
        <Form.Item name="resolvedAt" label="Дата окончания">
          <DatePicker showTime style={{ width: '100%' }} format="DD.MM.YYYY HH:mm" />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={3} />
        </Form.Item>
        {downtimePreview && (
          <Typography.Text type="secondary">
            Время простоя: <strong>{downtimePreview}</strong>
          </Typography.Text>
        )}
      </Form>
    </Modal>
  );
}
