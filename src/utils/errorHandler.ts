export function handleApiError(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    const anyError = error as any
    return (
      anyError.response?.data?.message ||
      anyError.response?.data?.error ||
      error.message ||
      'Произошла ошибка при авторизации'
    )
  }

  return 'Неизвестная ошибка'
}
