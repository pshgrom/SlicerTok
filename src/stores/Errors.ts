import { defineStore } from 'pinia'
import { reactive } from 'vue'

let messageId = 0

export const useError = defineStore('errorStore', () => {
  const errorsValue = reactive({
    show: false,
    messages: [] as { id: number; msg: string; type: 'error' | 'success' | 'info' }[]
  })

  const setErrors = (msg: string, type: 'error' | 'success' | 'info' = 'error') => {
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
