import type { AxiosError } from 'axios';
export function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return 'Нет соединения с сервером';
  }
  const status = axiosError.response.status;
  if (status === 409) {
    return (
      axiosError.response.data?.message ??
      'Невозможно выполнить операцию: существуют связанные записи'
    );
  }
  if (status === 400) {
    return axiosError.response.data?.message ?? 'Ошибка сохранения. Проверьте введённые данные';
  }
  if (status === 401 || status === 403) {
    return 'Неверный логин или пароль';
  }
  if (status >= 500) {
    return 'Ошибка сервера. Попробуйте позже';
  }
  return 'Произошла непредвиденная ошибка';
}
