// stores/Errors.ts
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useError = defineStore('errorStore', () => {
  const errorsValue = reactive({
    show: false,
    messages: [] as { msg: string; type: 'error' | 'success' | 'default' }[]
  })

  const setErrors = (msg: string, type: 'error' | 'success' | 'default' = 'error') => {
    errorsValue.messages.push({ msg, type })
    errorsValue.show = true
  }

  const clearError = (index: number) => {
    errorsValue.messages.splice(index, 1)
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
