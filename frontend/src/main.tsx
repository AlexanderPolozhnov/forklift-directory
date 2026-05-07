import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import App from './App';

dayjs.locale('ru');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider locale={ruRU}>
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
