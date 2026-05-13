import { useState } from 'react';
import { App, Button, Empty, Table, Typography } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';
import dayjs from 'dayjs';
import type { IncidentRequest, IncidentResponse } from '../../types';
import { useCreateIncident, useDeleteIncident, useIncidentList, useUpdateIncident } from '../../hooks/useIncident';
import { extractErrorMessage } from '../../utils/errorUtils';
import IncidentModal from './IncidentModal';
import ConfirmModal from '../common/ConfirmModal';
import LoadingSpinner from '../common/LoadingSpinner';

interface IncidentTableProps {
  forkliftId: number | null;
  forkliftNumber: string | null;
}

export default function IncidentTable({ forkliftId, forkliftNumber }: IncidentTableProps) {
  const { message } = App.useApp();
  const { data: incidents, isLoading, isError } = useIncidentList(forkliftId);
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const deleteMutation = useDeleteIncident();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<IncidentResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IncidentResponse | null>(null);

  const handleAdd = () => {
    setEditingIncident(null);
    setModalOpen(true);
  };

  const handleEdit = (incident: IncidentResponse) => {
    setEditingIncident(incident);
    setModalOpen(true);
  };

  const handleSubmit = (data: IncidentRequest) => {
    if (editingIncident) {
      updateMutation.mutate(
        { id: editingIncident.id, data },
        {
          onSuccess: () => {
            setModalOpen(false);
            message.success('Инцидент успешно обновлён');
          },
          onError: (error: unknown) => {
            message.error(extractErrorMessage(error));
          },
        }
      );
    } else if (forkliftId !== null) {
      createMutation.mutate(
        { forkliftId, data },
        {
          onSuccess: () => {
            setModalOpen(false);
            message.success('Инцидент успешно добавлен');
          },
          onError: (error: unknown) => {
            message.error(extractErrorMessage(error));
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        message.success('Инцидент успешно удалён');
      },
      onError: (error: unknown) => {
        setDeleteTarget(null);
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 409) {
          message.error(
            axiosError.response.data?.message ??
            'Невозможно удалить инцидент: существуют связанные записи'
          );
        } else {
          message.error(extractErrorMessage(error));
        }
      },
    });
  };

  const columns: ColumnsType<IncidentResponse> = [
    {
      title: 'Код записи',
      dataIndex: 'id',
      width: 60,
      align: 'center',
    },
    {
      title: 'Начало',
      dataIndex: 'startedAt',
      width: 95,
      align: 'center',
      className: 'incident-date-column',
      onCell: () => ({ className: 'incident-date-column' }),
      render: (v: string) => dayjs(v).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Окончание',
      dataIndex: 'resolvedAt',
      width: 95,
      align: 'center',
      className: 'incident-date-column',
      onCell: () => ({ className: 'incident-date-column' }),
      render: (v: string | null) => v ? dayjs(v).format('DD.MM.YYYY HH:mm') : '—',
    },
    {
      title: 'Время простоя',
      dataIndex: 'downtimeFormatted',
      width: 70,
      align: 'center',
    },
    {
      title: 'Причина',
      dataIndex: 'description',
      ellipsis: true,
      align: 'left',
      className: 'header-with-padding',
      onCell: () => ({ className: 'cell-with-padding' }),
      render: (v: string | null) => v ?? '—',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 55,
      align: 'center',
      render: (_: unknown, record: IncidentResponse) => (
        <span className="table-actions">
          <EditOutlined className="table-action-icon" onClick={() => handleEdit(record)} />
          <CloseOutlined className="table-action-icon" onClick={() => setDeleteTarget(record)} />
        </span>
      ),
    },
  ];

  if (!forkliftId) {
    return (
      <div className="incident-column">
        <div className="incident-panel incident-panel-empty">
          <Empty description="Выберите погрузчик для просмотра инцидентов" />
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="incident-column"><div className="incident-panel"><LoadingSpinner /></div></div>;
  if (isError) return <div className="incident-column"><div className="incident-panel"><Typography.Text type="danger">Ошибка загрузки инцидентов</Typography.Text></div></div>;

  return (
    <div className="incident-column">
      <div className="incident-panel-header">
        <span className="incident-panel-title">Простои по погрузчику</span>
        <span className="incident-panel-number">{forkliftNumber}</span>
      </div>
      <Button className="red-action-button incident-add-button" onClick={handleAdd}>Добавить</Button>
      <div className="incident-panel">
        <Table
          rowKey="id"
          className="pixel-table incident-table"
          columns={columns}
          dataSource={incidents ?? []}
          pagination={false}
          size="small"
          locale={{ emptyText: <Empty description="Нет инцидентов" /> }}
          scroll={{ x: 465, y: 335 }}
        />
      </div>
      <IncidentModal
        open={modalOpen}
        incident={editingIncident}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Удалить инцидент"
        content="Удалить информацию о простое? Вы уверены?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLoading={deleteMutation.isPending}
      />
    </div>
  );
}
