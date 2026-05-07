import { useState } from 'react';
import type { AxiosError } from 'axios';
import { App, Button, Checkbox, Divider, Form, Input, InputNumber, Layout, Space, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ForkliftTable from '../components/forklift/ForkliftTable';
import ForkliftToolbar from '../components/forklift/ForkliftToolbar';
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
import { useAuthStore } from '../store/authStore';
import type { ForkliftRequest, ForkliftResponse } from '../types';

const { Header, Content } = Layout;

interface EditForm {
  brand: string;
  number: string;
  loadCapacity: number;
  isActive: boolean;
}

type EditMode = 'none' | 'add' | 'edit';

export default function ForkliftDirectoryPage() {
  const navigate = useNavigate();
  const { fullName, clearAuth } = useAuthStore();
  const { message } = App.useApp();

  const [searchNumber, setSearchNumber] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedForklift, setSelectedForklift] = useState<ForkliftResponse | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [deleteTarget, setDeleteTarget] = useState<ForkliftResponse | null>(null);

  const [form] = Form.useForm<EditForm>();

  const { data, isLoading } = useForkliftList(searchNumber, page - 1, pageSize);
  const createMutation = useCreateForklift();
  const updateMutation = useUpdateForklift();
  const deleteMutation = useDeleteForklift();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleSelect = (forklift: ForkliftResponse) => {
    if (editMode !== 'none') return;
    setSelectedForklift(forklift);
  };

  const handleAdd = () => {
    setSelectedForklift(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setEditMode('add');
  };

  const handleEdit = () => {
    if (!selectedForklift) return;
    form.setFieldsValue({
      brand: selectedForklift.brand,
      number: selectedForklift.number,
      loadCapacity: selectedForklift.loadCapacity,
      isActive: selectedForklift.isActive,
    });
    setEditMode('edit');
  };

  const handleCancel = () => {
    form.resetFields();
    setEditMode('none');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const request: ForkliftRequest = {
        brand: values.brand,
        number: values.number,
        loadCapacity: values.loadCapacity,
        isActive: values.isActive ?? true,
      };
      if (editMode === 'add') {
        createMutation.mutate(request, {
          onSuccess: (created) => {
            setSelectedForklift(created);
            setEditMode('none');
            message.success('Погрузчик успешно добавлен');
          },
          onError: (error: unknown) => {
            message.error(extractErrorMessage(error));
          },
        });
      } else if (editMode === 'edit' && selectedForklift) {
        updateMutation.mutate(
          { id: selectedForklift.id, data: request },
          {
            onSuccess: (updated) => {
              setSelectedForklift(updated);
              setEditMode('none');
              message.success('Погрузчик успешно обновлён');
            },
            onError: (error: unknown) => {
              message.error(extractErrorMessage(error));
            },
          }
        );
      }
    } catch {
      // validation failed
    }
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
            'Невозможно удалить погрузчик: имеются зарегистрированные простои'
          );
        } else {
          message.error(extractErrorMessage(error));
        }
      },
    });
  };

  const forklifts = data?.content ?? [];
  const total = data?.totalElements ?? 0;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
          Справочник Погрузчики
        </Typography.Title>
        <Space>
          <Typography.Text style={{ color: 'white' }}>{fullName}</Typography.Text>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} type="text" style={{ color: 'white' }}>
            Выйти
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space wrap>
            <ForkliftSearchBar onSearch={(v) => { setSearchNumber(v); setPage(1); }} />
            <ForkliftToolbar
              editMode={editMode !== 'none'}
              hasSelection={!!selectedForklift}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={() => selectedForklift && setDeleteTarget(selectedForklift)}
              onSave={handleSave}
              onCancel={handleCancel}
              saveLoading={createMutation.isPending || updateMutation.isPending}
            />
          </Space>

          {editMode !== 'none' && (
            <Form form={form} layout="inline">
              <Form.Item name="brand" label="Марка" rules={[{ required: true, message: 'Введите марку' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="number" label="Номер" rules={[{ required: true, message: 'Введите номер' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="loadCapacity"
                label="Грузоподъёмность (т)"
                rules={[{ required: true, message: 'Введите грузоподъёмность' }]}
              >
                <InputNumber min={0.001} step={0.001} precision={3} style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="isActive" valuePropName="checked" label="Активен">
                <Checkbox />
              </Form.Item>
            </Form>
          )}

          <ForkliftTable
            data={forklifts}
            loading={isLoading}
            selectedId={selectedForklift?.id ?? null}
            onSelect={handleSelect}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
          />

          <Divider orientation="left">Простои по погрузчику</Divider>

          <IncidentTable forkliftId={selectedForklift?.id ?? null} />
        </Space>
      </Content>

      <ConfirmModal
        open={!!deleteTarget}
        title="Удалить погрузчик"
        content={`Вы уверены, что хотите удалить погрузчик "${deleteTarget?.brand} ${deleteTarget?.number}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLoading={deleteMutation.isPending}
      />
    </Layout>
  );
}
