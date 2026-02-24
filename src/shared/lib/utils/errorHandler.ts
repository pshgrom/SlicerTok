import type { AxiosError } from 'axios'

export function handleApiError(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>
    const apiMessage = axiosError.response?.data?.message || axiosError.response?.data?.error
    return apiMessage || error.message || 'Произошла ошибка при авторизации'
  }

  return 'Неизвестная ошибка'
}
