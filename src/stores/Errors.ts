import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useError = defineStore('errorStore', () => {
  const errorsValue = reactive({
    show: false,
    msg: '',
    type: 'error'
  })

  const setErrors = (msg: string, type = 'error') => {
    ;((errorsValue.show = true), (errorsValue.msg = msg), (errorsValue.type = type))
  }

  return {
    setErrors,
    errorsValue
  }
})
