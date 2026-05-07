import {useState} from 'react';
import {App, Button, Empty, Space, Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import type {AxiosError} from 'axios';
import dayjs from 'dayjs';
import type {IncidentRequest, IncidentResponse} from '../../types';
import {useCreateIncident, useDeleteIncident, useIncidentList, useUpdateIncident} from '../../hooks/useIncident';
import {extractErrorMessage} from '../../utils/errorUtils';
import IncidentModal from './IncidentModal';
import ConfirmModal from '../common/ConfirmModal';
import LoadingSpinner from '../common/LoadingSpinner';

interface IncidentTableProps {
  forkliftId: number | null;
}

export default function IncidentTable({ forkliftId }: IncidentTableProps) {
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
      title: 'Дата начала',
      dataIndex: 'startedAt',
      render: (v: string) => dayjs(v).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Дата окончания',
      dataIndex: 'resolvedAt',
      render: (v: string | null) => v ? dayjs(v).format('DD.MM.YYYY HH:mm') : '—',
    },
    {
      title: 'Простой',
      dataIndex: 'downtimeFormatted',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      render: (v: string | null) => v ?? '—',
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: IncidentResponse) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Изменить</Button>
          <Button size="small" danger onClick={() => setDeleteTarget(record)}>Удалить</Button>
        </Space>
      ),
    },
  ];

  if (!forkliftId) {
    return <Empty description="Выберите погрузчик для просмотра инцидентов" />;
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Typography.Text type="danger">Ошибка загрузки инцидентов</Typography.Text>;

  return (
    <>
      <Space style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={handleAdd}>Добавить</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={incidents ?? []}
        pagination={false}
        size="small"
        locale={{ emptyText: <Empty description="Нет инцидентов" /> }}
      />
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
    </>
  );
}
