import { defineStore } from 'pinia'
import { reactive } from 'vue'

let messageId = 0

export const useError = defineStore('errorStore', () => {
  const errorsValue = reactive({
    show: false,
    messages: [] as { id: number; msg: string; type: 'error' | 'success' | 'info' }[]
  })

  const setErrors = (err: unknown, type: 'error' | 'success' | 'info' = 'error') => {
    let msg: string
    if (typeof err === 'string') {
      msg = err || 'Произошла ошибка'
    } else if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      msg = axiosErr.response?.data?.message || 'Произошла ошибка'
    } else if (err instanceof Error) {
      msg = err.message
    } else {
      msg = 'Произошла ошибка'
    }
    errorsValue.messages.push({ id: messageId++, msg, type })
    errorsValue.show = true
  }

  const clearError = (id: number) => {
    const index = errorsValue.messages.findIndex((m) => m.id === id)
    if (index !== -1) {
      errorsValue.messages.splice(index, 1)
    }
    if (errorsValue.messages.length === 0) {
      errorsValue.show = false
    }
  }

  return {
    setErrors,
    clearError,
    errorsValue
  }
})
