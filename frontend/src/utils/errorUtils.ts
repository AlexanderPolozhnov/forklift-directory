import type { AxiosError } from 'axios';
export function extractErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string | Record<string, string> }>;
  if (!axiosError.response) {
    return 'Нет соединения с сервером';
  }
  const status = axiosError.response.status;
  const data = axiosError.response.data;

  if (status === 400 && data?.message && typeof data.message === 'object') {
    return Object.values(data.message).join(', ');
  }

  if (status === 409 || status === 400) {
    return (
      (typeof data?.message === 'string' ? data.message : null) ??
      (status === 409 ? 'Конфликт данных: запись уже существует' : 'Ошибка сохранения. Проверьте введённые данные')
    );
  }
  if (status === 401 || status === 403) {
    return 'Сессия истекла или недостаточно прав';
  }
  if (status >= 500) {
    return 'Ошибка сервера. Попробуйте позже';
  }
  return 'Произошла непредвиденная ошибка';
}
