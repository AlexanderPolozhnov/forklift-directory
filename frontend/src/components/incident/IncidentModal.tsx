import { useEffect } from 'react';
import { Button, DatePicker, Form, Input, Modal } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import type { IncidentRequest, IncidentResponse } from '../../types';

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
          resolvedAt: dayjs().add(3, 'hour'),
          description: '',
        });
      }
    }
  }, [open, incident]);

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
      className="incident-modal"
      onCancel={onCancel}
      centered
      width={480}
      footer={null}
      closable={false}
      destroyOnHidden
    >
      <div className="incident-modal-title">Проблемы с погрузчиком?  опишите</div>
      <div className="incident-modal-divider" />
      <Form form={form} layout="vertical">
        <div className="incident-date-row">
          <Form.Item
            name="startedAt"
            label="начало"
            rules={[{ required: true, message: 'Дата начала обязательна' }]}
          >
            <DatePicker showTime className="incident-date-picker" format="DD.MM.YYYY HH:mm" />
          </Form.Item>
          <Form.Item name="resolvedAt" label="окончание">
            <DatePicker showTime className="incident-date-picker" format="DD.MM.YYYY HH:mm" />
          </Form.Item>
        </div>
        <Form.Item name="description" label="описание инцидента">
          <Input.TextArea rows={7} className="incident-description" />
        </Form.Item>
        <div className="incident-modal-actions">
          <Button className="incident-save-button" loading={confirmLoading} onClick={handleOk}>
            Сохранить
          </Button>
          <Button className="incident-exit-button" onClick={onCancel}>
            Выход
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
