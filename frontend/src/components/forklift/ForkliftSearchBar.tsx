import { Button, Input, Space } from 'antd';
import { useState } from 'react';

interface ForkliftSearchBarProps {
  onSearch: (value: string) => void;
}

export default function ForkliftSearchBar({ onSearch }: ForkliftSearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => onSearch(value);
  const handleReset = () => {
    setValue('');
    onSearch('');
  };

  return (
    <Space>
      <Input
        placeholder="Номер погрузчика"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 220 }}
      />
      <Button type="primary" onClick={handleSearch}>Искать</Button>
      <Button onClick={handleReset}>Сброс</Button>
    </Space>
  );
}
