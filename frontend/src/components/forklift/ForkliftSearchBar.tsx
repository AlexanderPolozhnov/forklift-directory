import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
    <div className="search-row">
      <span className="search-label">Номер погрузчика</span>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={handleSearch}
        className="search-input"
      />
      <Button className="red-action-button search-button" icon={<SearchOutlined />} onClick={handleSearch}>
        Искать
      </Button>
      <span className="reset-filter-button" onClick={handleReset}>
        <span className="reset-filter-cross">×</span>
        <span className="reset-filter-text">Сбросить фильтр</span>
      </span>
    </div>
  );
}
