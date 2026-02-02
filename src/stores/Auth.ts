import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  getCountryCodesQuery,
  loginByPhoneQuery,
  loginConfirmationQuery,
  loginUser
} from '@/api/auth'
import type { IAuth, IAuthByPhone, IAuthConfirmation, LoginResult } from '@/interfaces/Auth'
import { useError } from '@/stores/Errors'

export const useAuth = defineStore('authStore', () => {
  const token = ref<string | null>(localStorage.getItem('authToken') || null)
  // const role = ref<string>(localStorage.getItem('role') || ROLES.SLICER)
  const role = ref<null | string>(localStorage.getItem('role') || null)
  const errorStore = useError()
  const phone = ref('')
  const isEnableGoogle2fa = ref(false)
  const currentCountryCode = ref<number | null>(null)

  const countryCodes = ref([])

  const login = async ({
    login,
    password,
    google2fa_key
  }: IAuth): Promise<LoginResult | undefined> => {
    try {
      const { data } = await loginUser({ login, password, google2fa_key })
      const { access_token, is_enable_google2fa } = data ?? {}
      if (is_enable_google2fa) {
        isEnableGoogle2fa.value = true
        return { token: null, role: '' }
      }

      if (access_token && data.role[0]) {
        token.value = access_token
        localStorage.setItem('authToken', access_token)
        role.value = data.role[0]
        if (role.value) localStorage.setItem('role', role.value.toString())
        return { token: token.value, role: role.value }
      }
      errorStore.setErrors('Ошибка авторизации')
      return
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  const loginByPhone = async (data: IAuthByPhone) => {
    try {
      return await loginByPhoneQuery(data)
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  const setPhone = (value: string) => {
    phone.value = value
  }

  const getCountryCodes = async () => {
    try {
      const countries = []
      const { data } = await getCountryCodesQuery()
      const { data: newData, status } = data ?? {}
      if (status === 'Success' && newData) {
        Object.keys(newData).forEach((item) => {
          const { id, code, name, placeholder } = newData[item]
          countries.push({
            value: id,
            label: `${code} ${name}`,
            placeholder
          })
        })
        if (!countryCodes.value.length) {
          countryCodes.value = countries
        }
      }
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  const loginConfirmation = async (data: IAuthConfirmation) => {
    try {
      return await loginConfirmationQuery(data)
    } catch (error: any) {
      throw error?.response?.data?.message ?? error.message ?? ''
    }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    errorStore.setErrors('Вы вышли из системы', 'info')
  }

  return {
    login,
    logout,
    loginByPhone,
    loginConfirmation,
    getCountryCodes,
    countryCodes,
    role,
    token,
    setPhone,
    phone,
    currentCountryCode,
    isEnableGoogle2fa
  }
})
