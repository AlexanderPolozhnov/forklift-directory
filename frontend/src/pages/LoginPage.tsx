import { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { authApi } from '../api/forkliftApi';
import { useAuthStore } from '../store/authStore';
import { extractErrorMessage } from '../utils/errorUtils';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginForm>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authApi.login(values);
      setAuth(response.accessToken, response.fullName);
      navigate('/forklifts');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 401 || axiosError?.response?.status === 400) {
        setErrorMsg('Неверный логин или пароль');
      } else {
        setErrorMsg(extractErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <Typography.Title level={3} className="login-title">
          Вход в систему
        </Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ username: 'admin', password: 'admin123' }}
        >
          <Form.Item
            name="username"
            label="Логин"
            rules={[{ required: true, message: 'Введите логин' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password />
          </Form.Item>
          {errorMsg && (
            <Form.Item>
              <Alert message={errorMsg} type="error" showIcon />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="login-button">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}