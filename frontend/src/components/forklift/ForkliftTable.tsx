import { Checkbox, Empty, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { ForkliftResponse } from '../../types';

interface ForkliftTableProps {
  data: ForkliftResponse[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (forklift: ForkliftResponse) => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function ForkliftTable({
  data,
  loading,
  selectedId,
  onSelect,
  total,
  page,
  pageSize,
  onPageChange,
}: ForkliftTableProps) {
  const columns: ColumnsType<ForkliftResponse> = [
    {
      title: 'Код',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'Марка',
      dataIndex: 'brand',
    },
    {
      title: 'Номер',
      dataIndex: 'number',
    },
    {
      title: 'Грузоподъёмность (т)',
      dataIndex: 'loadCapacity',
      render: (v: number) => v.toFixed(3),
    },
    {
      title: 'Активен',
      dataIndex: 'isActive',
      render: (v: boolean) => <Checkbox checked={v} disabled />,
    },
    {
      title: 'Изменён',
      dataIndex: 'modifiedAt',
      render: (v: string) => dayjs(v).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Кем изменён',
      dataIndex: 'modifiedBy',
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      size="small"
      rowClassName={(record) => record.id === selectedId ? 'ant-table-row-selected' : ''}
      onRow={(record) => ({
        onClick: () => onSelect(record),
        style: { cursor: 'pointer' },
      })}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => `Всего: ${t}`,
        onChange: onPageChange,
      }}
      locale={{ emptyText: <Empty description="Нет погрузчиков" /> }}
      scroll={{ x: true }}
    />
  );
}
