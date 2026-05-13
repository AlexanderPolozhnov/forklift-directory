import { useState } from 'react';
import type { AxiosError } from 'axios';
import { App, Button, Layout, Typography } from 'antd';
import ForkliftTable from '../components/forklift/ForkliftTable';
import ForkliftSearchBar from '../components/forklift/ForkliftSearchBar';
import IncidentTable from '../components/incident/IncidentTable';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  useForkliftList,
  useCreateForklift,
  useUpdateForklift,
  useDeleteForklift,
} from '../hooks/useForklift';
import { extractErrorMessage } from '../utils/errorUtils';
import type { ForkliftRequest, ForkliftResponse } from '../types';

const { Header, Sider, Content } = Layout;

const sidebarItems = [
  'Пользователи',
  'Уведомления и напоминания',
  'Настройки АИС ОГПА',
  'Справочник погрузчиков',
  'Резервное копирование и восстановление',
  'Справочники',
];

export default function ForkliftDirectoryPage() {
  const { message, modal } = App.useApp();

  const [searchNumber, setSearchNumber] = useState('');
  const [selectedForklift, setSelectedForklift] = useState<ForkliftResponse | null>(null);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ForkliftResponse | null>(null);

  const { data, isLoading } = useForkliftList(searchNumber);
  const createMutation = useCreateForklift();
  const updateMutation = useUpdateForklift();
  const deleteMutation = useDeleteForklift();

  const handleSelect = (forklift: ForkliftResponse) => {
    if (editingId !== null) return;
    setSelectedForklift(forklift);
  };

  const handleAdd = () => {
    setSelectedForklift(null);
    setEditingId('new');
  };

  const handleEdit = (forklift: ForkliftResponse) => {
    setSelectedForklift(forklift);
    setEditingId(forklift.id);
  };

  const handleCancel = (hasChanges: boolean) => {
    if (hasChanges) {
      modal.confirm({
        title: 'Отмена изменений',
        content: 'Не сохранять внесенные изменения? Вы уверены?',
        onOk: () => {
          setEditingId(null);
        },
      });
    } else {
      setEditingId(null);
    }
  };

  const handleSaveNew = (request: ForkliftRequest) => {
    createMutation.mutate(request, {
      onSuccess: (created) => {
        setSelectedForklift(created);
        setEditingId(null);
        message.success('Сохранено');
      },
      onError: (error: unknown) => {
        message.error(`Ошибка: ${extractErrorMessage(error)}`);
      },
    });
  };

  const handleSaveEdit = (id: number, request: ForkliftRequest) => {
    updateMutation.mutate(
      { id, data: request },
      {
        onSuccess: (updated) => {
          setSelectedForklift(updated);
          setEditingId(null);
          message.success('Сохранено');
        },
        onError: (error: unknown) => {
          message.error(`Ошибка: ${extractErrorMessage(error)}`);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        if (selectedForklift?.id === target.id) {
          setSelectedForklift(null);
        }
        message.success('Погрузчик успешно удалён');
      },
      onError: (error: unknown) => {
        setDeleteTarget(null);
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 409) {
          message.error(
            axiosError.response.data?.message ??
            'Удаление запрещено: имеются зарегистрированные простои'
          );
        } else {
          message.error(`Ошибка: ${extractErrorMessage(error)}`);
        }
      },
    });
  };

  const forklifts = data?.content ?? [];
  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <Button className="profile-button">Профиль</Button>
      </Header>

      <Layout className="app-body">
        <Sider width={120} className="app-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item}
              className={`sidebar-item ${item === 'Справочник погрузчиков' ? 'sidebar-item-active' : ''}`}
            >
              {item}
            </div>
          ))}
        </Sider>

        <Content className="app-content">
          <Typography.Title level={1} className="page-title">
            Справочник погрузчиков
          </Typography.Title>

          <ForkliftSearchBar onSearch={setSearchNumber} />

          <Button className="red-action-button add-forklift-button" onClick={handleAdd} disabled={editingId !== null}>
            Добавить
          </Button>

          <div className="tables-layout">
            <div className="forklift-panel">
              <ForkliftTable
                data={forklifts}
                loading={isLoading}
                selectedId={selectedForklift?.id ?? null}
                editingId={editingId}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onSaveNew={handleSaveNew}
                onSaveEdit={handleSaveEdit}
                onCancel={handleCancel}
                saveLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>

            <IncidentTable
              forkliftId={selectedForklift?.id ?? null}
              forkliftNumber={selectedForklift?.number ?? null}
            />
          </div>
        </Content>
      </Layout>

      <ConfirmModal
        open={!!deleteTarget}
        title="Удалить погрузчик"
        content="Удалить погрузчик? Вы уверены?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLoading={deleteMutation.isPending}
      />
    </Layout>
  );
}
